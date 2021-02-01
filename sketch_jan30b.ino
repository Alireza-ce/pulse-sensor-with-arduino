#include <SoftwareSerial.h>

// Set these to run example. 
#define USE_ARDUINO_INTERRUPTS true    // Set-up low-level interrupts for most acurate BPM math.
#include <PulseSensorPlayground.h>  

#define RX 10 
#define TX 11
SoftwareSerial esp(RX,TX);
String ssid = "Ali";
String passwd = "Heli@2017";
String data;
String server = "192.168.43.123"; // Your local server IP or any other IP
String uri = "/device/storeBpm";

//  Variables pulse sensor
const int PulseWire = 0;       // PulseSensor PURPLE WIRE connected to ANALOG PIN 0
const int LED13 = 13;          // The on-board Arduino LED, close to PIN 13.
int Threshold = 550;           // Determine which Signal to "count as a beat" and which to ignore.
                               // Use the "Gettting Started Project" to fine-tune Threshold Value beyond default setting.
                               // Otherwise leave the default "550" value. 
                               
PulseSensorPlayground pulseSensor;

void setup() {
  esp.begin(115200);  // Serial connection for ESP8266 baud rate
  Serial.begin(9600); // Normal serial connection baud rate

  resetESP();
  connectWifi();

  pulseSensor.analogInput(PulseWire);   
  pulseSensor.blinkOnPulse(LED13);       //auto-magically blink Arduino's LED with heartbeat.
  pulseSensor.setThreshold(Threshold);   

  // Double-check the "pulseSensor" object was created and "began" seeing a signal. 
   if (pulseSensor.begin()) {
    Serial.println("We created a pulseSensor Object !");  //This prints one time at Arduino power-up,  or on Arduino reset.  
  }

  delay(5000);
}

void loop() {
   int myBPM = pulseSensor.getBeatsPerMinute();  // Calls function on our pulseSensor object that returns BPM as an "int".
                                               // "myBPM" hold this BPM value now. 

   if (pulseSensor.sawStartOfBeat()) {            // Constantly test to see if "a beat happened". 
      Serial.println("♥  A HeartBeat Happened ! "); // If test is "true", print a message "a heartbeat happened".
      Serial.print("BPM: ");                        // Print phrase "BPM: " 
      Serial.println(myBPM);                        // Print the value inside of myBPM. 
      httpPost(myBPM);
}
  delay(100);

}
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
void resetESP() {
  esp.println("AT+RST");
  delay(1000);
  if(esp.find("OK"))
    Serial.println("Module Reset");
    
}
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
void connectWifi() {
  Serial.println("Changing at+cwmode");
  String setup_cmd = "AT+CWMODE=3"; 
  esp.println(setup_cmd);
  delay(1000);

  Serial.println("Connecting to wifi");
  String connect_cmd = "AT+CWJAP=\""+ssid+"\",\""+passwd+"\"";
  esp.println(connect_cmd);
  delay(4000);
  if(esp.find("OK")) {
    Serial.println("Connected to wifi successfully!");
  }
  else {
    Serial.println("Cannot connect to wifi");
    connectWifi();
  }  
}


void httpPost(int data) {
  String data_str = String(data);
  int body_size = data_str.length() + 4;
//  esp.println("AT+CIPSTART=\"TCP\",\"" + server + "\",80");//start a TCP connection.
//  
  if( esp.find("OK")) {
    Serial.println("TCP connection already ready");
  }
  else {
    esp.println("AT+CIPSTART=\"TCP\",\"" + server + "\",80");//start a TCP connection.
    if( esp.find("OK")) {
      Serial.println("TCP connection ready for the first time");
    }
  }
  delay(1000);

  
  String postRequest =
         "POST " + uri + " HTTP/1.1\r\n" +
         "Host: " + server + "\r\n" +
         "Accept: *" + "/" + "*\r\n" +
         "Content-Length: " + body_size + "\r\n" +  
         "Content-Type: application/x-www-form-urlencoded\r\n" +
         "\r\n" +"bpm="+data_str;

  Serial.println(postRequest);
  String sendCmd = "AT+CIPSEND=";//determine the number of characters to be sent.
  
  esp.print(sendCmd);
  esp.println(postRequest.length());
  
  delay(500);
  
  if(esp.find(">")) {
    Serial.println("Sending..");
    esp.print(postRequest);
    
    if(esp.find("SEND OK")) {
      Serial.println("Packet sent");
      
      while (esp.available()) {
        String tmpResp = esp.readString();
        Serial.println("tmpresp"+tmpResp);
      }
      
      // close the connection
      esp.println("AT+CIPCLOSE");
    }
  }
}
