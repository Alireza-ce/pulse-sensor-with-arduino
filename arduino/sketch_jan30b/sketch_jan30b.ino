#include <ESP8266WiFi.h>
#include <WebSocketClient.h>
#include <WebSocketsServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

boolean handshakeFailed = 0;
String data = "";
char path[] = "/";
const char *host = "192.168.43.123";
const int espport = 80;
String activeUsername;
WebSocketClient webSocketClient;
WiFiClient client;
String loginUrl = ":80/user/login/";
const char *ssid = "Ali";
const char *password = "Heli@2017";
int LED = 2;
int websockMillis = 50;

unsigned long startMillis; //some global variables available anywhere in the program
unsigned long currentMillis;
const unsigned long period = 1000 * 5; // refresh time

bool flagContent = 0;

ESP8266WebServer server(80);
WebSocketsServer webSocket = WebSocketsServer(88);
String webSite, JSONtxt;
boolean LEDonoff = true;

char webSiteCont[2000];

char webSiteCont1[] =
    R"=====(
<!DOCTYPE html>    
<html>    
<head>    
    <title>Login Form</title>    
    <link rel="stylesheet" type="text/css" href="css/style.css">    
</head>    
<style>
body  
{  
    margin: 0;  
    background-color:#38e000;  
    font-family: 'Arial';  
}  
.login
{  
  width: 282px;  
  overflow: hidden;  
  margin: auto;  
  margin: 20 0 0 0px;  
  padding: 60px;  
  background: #24623f;  
  border-radius: 15px ;          
}  
h2{  
    text-align: center;  
    color: #277582;  
    padding: 20px;  
}  
label{  
    color: #08ffd1;  
    font-size: 17px;  
}  
 
#Pass{  
    width: 300px;  
    height: 30px;  
    border: none;  
    border-radius: 3px;  
    padding-left: 8px;  
      
}  
#log{  
    width: 100px;  
    height: 30px;
    margin-left:200px;
    border: none;  
    border-radius: 17px;  
    color: black;
}  
</style>
<body>    
    <h2>ESP-8266 Login Page</h2><br>    
    <div class="login">    
    <div id="login" >      
     <label><b>User Name</b></label>    
        <input type="text" name="UserName" id="UserName">    
        <br><br>    
    <label><b>Password</b></label>    
        <input type="Password" name="Pass" id="Pass">    
        <br><br>    
        <button onclick="sendPass()" id="log" > Log in </button>
        <p id="message"></p>
    </div>     
</div>    
</body>    
<SCRIPT>
  InitWebSocket()
  function InitWebSocket()
  {
    websock = new WebSocket('ws://'+window.location.hostname+':88/');
    websock.onmessage=function(evt)
    {
       JSONobj = JSON.parse(evt.data);
       document.getElementById('message').innerHTML = JSONobj.Data;
    } 
  } // end of InıtWebSocket
   function sendPass(){
    var stringPass=document.getElementById("Pass").value;
    var stringUserName=document.getElementById("UserName").value;
    var Password = stringPass+'-'+stringUserName;  
     //alert(stringPass);
    websock.send(Password);
    } 
</SCRIPT>
</html>  
)=====";

void WebSite()
{
    server.send(200, "text/html", webSiteCont);
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t welength)
{
    String payloadString = (const char *)payload;
    Serial.print("payloadString= ");
    Serial.println(payloadString);

    if (type == WStype_TEXT) // receive text from cliet
    {
        byte separator = payloadString.indexOf('-');
        String password = payloadString.substring(0, separator);
        Serial.print("password=");
        Serial.println(password);
        String username = payloadString.substring(separator + 1);
        Serial.print("username=");
        Serial.println(username);
        Serial.println(" ");

        WiFiClient client;
        const int httpPort = 80;
        if (!client.connect(host, httpPort))
        {
            Serial.println("connection failed");
            return;
        }
        Serial.print("Requesting URL: ");
        Serial.println(loginUrl); //Post Data
        DynamicJsonDocument doc(2048);
        doc["email"] = String(username);
        doc["password"] = String(password);

        String body;
        serializeJson(doc, body);

        HTTPClient http;
        http.begin("http://192.168.43.123:80/user/login");
        http.addHeader("Content-Type", "application/json");
        auto httpCode = http.POST(body);
        Serial.println(httpCode); //Print HTTP return code
        String payload = http.getString();
        Serial.println(payload); //Print request response payload
        http.end();              //Close connection Serial.println();
        Serial.println("closing connection");
        StaticJsonDocument<200> response;
        deserializeJson(response, payload);
        const char *access = response["access"];
        Serial.println(access);
        if (access)
        {
            Serial.println("access true");
            activeUsername = String(username);
            flagContent = 1;
        }
        else
        {
            Serial.println("access false");
        }
        JSONtxt = "{\"Data\":\"user name or password is incorrect.\"}";
        webSocket.broadcastTXT(JSONtxt);
    }
}

void setup()
{
    Serial.begin(115200);
    size_t sizeStr = sizeof(webSiteCont1) / sizeof(webSiteCont1[0]);
    memcpy(webSiteCont, webSiteCont1, sizeStr);

    pinMode(LED, OUTPUT);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.println(".");
        delay(500);
    }
    WiFi.mode(WIFI_STA);
    Serial.println(" Start ESP ");
    Serial.println(WiFi.localIP());
    server.on("/", WebSite);
    server.begin();
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
}
unsigned int counter = 0;
void loop()
{

    webSocket.loop();
    server.handleClient();

    if (flagContent == 1)
    {
        Serial.println(" Start websocket with server and send data ");
        sendBpm();
    }

    delay(4000);
}

void sendBpm()
{
    WiFiClient client;
    const int httpPort = 80;
    if (!client.connect(host, httpPort))
    {
        Serial.println("connection failed");
        return;
    }
    DynamicJsonDocument doc(2048);
    doc["email"] = activeUsername;
    doc["bpm"] = "12";

    // send bpm if bigger than 40 and less than 200
    String body;
    serializeJson(doc, body);

    HTTPClient http;
    http.begin("http://192.168.43.123:80/device/storeBpm");
    http.addHeader("Content-Type", "application/json");
    auto httpCode = http.POST(body);
    Serial.println(httpCode); //Print HTTP return code
    String payload = http.getString();
    Serial.println(payload); //Print request response payload
    http.end();              //Close connection Serial.println();
}
