#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <EEPROM.h>
#include <ArduinoJson.h>
ESP8266WebServer server(80);
const char *host = "192.168.43.123";
boolean isUserLoggedIn = false;
int bpmList[10];
int sensorPin = A0;
float sensorValue = 0; // Variable to store the value coming from the sensor
int count = 9;
String activeUsername;
unsigned long starttime = 1500;
int heartrate = 0;
boolean counted = false;

struct settings
{
  char ssid[30];
  char password[30];
} user_wifi = {};

void setup()
{
  Serial.begin(115200);
  Serial.println("welcome");
  EEPROM.begin(sizeof(struct settings));
  EEPROM.get(0, user_wifi);

  WiFi.mode(WIFI_STA);
  WiFi.begin(user_wifi.ssid, user_wifi.password);
  byte tries = 0;
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("wifi connected!!");
  }

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("try to connect wifi!!");
    delay(1000);
    if (tries++ > 10)
    {
      WiFi.mode(WIFI_AP);
      WiFi.softAP("Setup Portal", "");
      Serial.println("Access point started!!");
      break;
    }
  }
  server.on("/", handlePortal);
  server.on("/user-login", userLogin);
  server.on("/wifi-credential", handleWifi);
  server.begin();
}

void loop()
{

  Serial.println("Looop");
  if (isUserLoggedIn == true)
  {
    Serial.println("loop in user loggedIn");
    startSendBpm();
  }
  else
  {
    Serial.println("handle client");
    server.handleClient();
  }

  delay(1000);
}

void userLogin()
{
  Serial.println(server.arg("username").c_str());
  Serial.println(server.arg("password").c_str());

  WiFiClient client;
  const int httpPort = 80;
  if (!client.connect(host, httpPort))
  {
    Serial.println("connection failed");
    return;
  }

  DynamicJsonDocument doc(2048);
  doc["email"] = String(server.arg("username").c_str());
  doc["password"] = String(server.arg("password").c_str());

  String body;
  serializeJson(doc, body);

  HTTPClient http;
  http.begin("http://192.168.43.123:80/user/login");
  http.addHeader("Content-Type", "application/json");
  auto httpCode = http.POST(body);

  String payload = http.getString();

  http.end(); //Close connection Serial.println();

  StaticJsonDocument<200> response;
  deserializeJson(response, payload);
  const char *access = response["access"];
  if (access)
  {
    Serial.println("login successfully!!");
    activeUsername = server.arg("username").c_str();
    server.send(200, "text/html", "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title><style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1,p{text-align: center}</style> </head> <body><main class='form-signin'> <h1>User Login</h1> <br/> <p>Your settings have been saved successfully!<br />user logged in successfully.</p></main></body></html>");
    isUserLoggedIn = true;
  }
  else
  {
    Serial.println("login failed!!");
    server.send(200, "text/html", "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title><style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1,p,a{text-align: center}</style> </head> <body><main class='form-signin'> <h1>User Login</h1> <br/> <p>Your User name or password is incorrect.</p><a href='http://192.168.43.220'>Back to login page</a>  </main></body></html>");
    isUserLoggedIn = false;
  }
}

void handleWifi()
{
  server.send(200, "text/html", "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title><style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1,p{text-align: center}</style> </head> <body><main class='form-signin'> <h1>Wifi Setup</h1> <br/> <p>Your settings have been saved successfully!<br />Please restart the device.</p> <a href='http://192.168.43.220'>user login page</a></main></body></html>");

  strncpy(user_wifi.ssid, server.arg("ssid").c_str(), sizeof(user_wifi.ssid));
  strncpy(user_wifi.password, server.arg("password").c_str(), sizeof(user_wifi.password));
  user_wifi.ssid[server.arg("ssid").length()] = user_wifi.password[server.arg("password").length()] = '\0';
  EEPROM.put(0, user_wifi);
  EEPROM.commit();
  delay(1000);
  setWifi();
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("your wifi conected successfully");
    Serial.println(WiFi.localIP());
  }
  Serial.println(user_wifi.ssid);
  Serial.println(user_wifi.password);
}

void handlePortal()
{
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("wait for login!!");
    server.send(200, "text/html", "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title> <style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{cursor: pointer;border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1{text-align: center}</style> </head> <body><main class='form-signin'> <form action='/user-login' method='post'> <h1 class=''>user login</h1><br/><div class='form-floating'><label>Username</label><input type='text' class='form-control' name='username'> </div><div class='form-floating'><br/><label>Password</label><input type='password' class='form-control' name='password'></div><br/><br/><button type='submit'>Save</button><p style='text-align: right'></p></form></main> </body></html>");
  }
  else
  {
    Serial.println("wait for Wifi credentials!!");
    server.send(200, "text/html", "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title> <style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{cursor: pointer;border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1{text-align: center}</style> </head> <body><main class='form-signin'> <form action='/wifi-credential' method='post'> <h1 class=''>Wifi Setup</h1><br/><div class='form-floating'><label>SSID</label><input type='text' class='form-control' name='ssid'> </div><div class='form-floating'><br/><label>Password</label><input type='password' class='form-control' name='password'></div><br/><br/><button type='submit'>Save</button><p style='text-align: right'></p></form></main> </body></html>");
  }
}

void setWifi()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(user_wifi.ssid, user_wifi.password);
  byte tries = 0;
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("your wifi connected successfully");
  }

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("i try to connect");
    delay(1000);
    if (tries++ > 10)
    {
      WiFi.mode(WIFI_AP);
      WiFi.softAP("Setup Portal", "");
      break;
    }
  }
}

void startSendBpm()
{
  WiFiClient client;
  const int httpPort = 80;
  int temp = 0;
  Serial.println("calc bpm !!");
  while (temp < 10)
  {
    temp += 1;
    delay(1000);
    starttime = 900;

    while (starttime > 0) // Reading pulse sensor for 10 seconds
    {

      sensorValue = analogRead(sensorPin);

      if (sensorValue > 550 && counted == false) // Threshold value is 550 (~ 2.7V)

      {

        count++;

        counted = true;
      }
      else if (sensorValue < 550)
      {
        counted = false;
      }
      starttime = starttime - 1;
      delay(10);
    }

    delay(1000);
    heartrate = count * 6; // Multiply the count by 6 to get beats per minute
    bpmList[temp] = heartrate;
    Serial.println(heartrate);
    Serial.println(bpmList[temp]);
    count = 0;
  }
  // send http
  Serial.println(" send bpm ");

  char payloadBody[2048];
  sprintf(payloadBody, ":[%d,%d,%d,%d,%d,%d,%d,%d,%d,%d]}", bpmList[1], bpmList[2], bpmList[3], bpmList[4], bpmList[5], bpmList[6], bpmList[7], bpmList[8], bpmList[9], bpmList[10]);
  String body = String(""
                       "{\"email\":\"") +
                String(activeUsername) + String("\",\"bpm\"") + String(payloadBody);
  Serial.println(body);
  HTTPClient http;
  http.begin("http://192.168.43.123:80/device/storeBpm");
  http.addHeader("Content-Type", "application/json");
  auto httpCode = http.POST(body);
  String payload = http.getString();
  Serial.println(payload); //Print request response payload
  http.end();              //Close connection Serial.println();
  temp = 0;
  delay(1000);
  Serial.println("finish sending!!");
  isUserLoggedIn = true;
}
