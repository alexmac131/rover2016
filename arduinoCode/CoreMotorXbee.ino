#include <Wire.h>
#include <Adafruit_NeoPixel.h>
#include <Adafruit_MotorShield.h>

#define RGBPIN         6
#define NUMPIXELS      1
#define I2C_ADDRESS_ME 0x8
#define MOTORSHIELD  0x60

Adafruit_MotorShield ROVERMOTORS = Adafruit_MotorShield( );
Adafruit_DCMotor *frontLeftWheel = ROVERMOTORS.getMotor(1);
Adafruit_DCMotor *frontRightWheel = ROVERMOTORS.getMotor(2);
Adafruit_DCMotor *rearLeftWheel = ROVERMOTORS.getMotor(3);
Adafruit_DCMotor *rearRightWheel = ROVERMOTORS.getMotor(4);
Adafruit_DCMotor   *motors[4] = { frontLeftWheel,  frontRightWheel, rearLeftWheel   , rearRightWheel    };
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, RGBPIN, NEO_GRB + NEO_KHZ800);

int baudSpeed = 9600;
int enginePower = 100;
boolean overRide = false;
int runTimeBase = 500;
int messageLightDelay = 500;
int blinkColors = 3;
int blinkColorRate = 200;
boolean debug = true;
const int minRange = 30;
int WheelDirectionLeft[4] = {BACKWARD, FORWARD, FORWARD, BACKWARD};
int WheelDirectionRight [4] = {FORWARD, BACKWARD, FORWARD, BACKWARD};
int WheelDirectionFORWARD [4] = {FORWARD, FORWARD, FORWARD, FORWARD};
int WheelDirectionBACKWARD [4] = {BACKWARD, BACKWARD, BACKWARD, BACKWARD};
boolean i2cFlag = false;

void setup() {
  Serial.begin(baudSpeed);
  Serial.println ("_starting setup");
  Wire.begin(I2C_ADDRESS_ME); 
  pixels.begin();
  ROVERMOTORS.begin();
  Wire.onReceive(receiveI2C);
  blinkColor(0,0,255);
  Serial.println ("! Setup done ");
}

void loop() {
  checkForCommands();
}
void receiveI2C (int byteTotal) {
  if (byteTotal == 1) {
    char MotorMessage = Wire.read();
    if (MotorMessage == 'S') {
      i2cFlag = true;
      return;
    }
    else if (MotorMessage == 'C') {
      i2cFlag = false;
      Serial.println ("Clear drive command blocks received ");
      return;
    }
    else {
      Serial.println("I2C bite command error");
    }
  }
  else if (byteTotal > 1) {
    char chr;
    for (int i = 1; i <= byteTotal;i++) {
      chr = Wire.read();
      if (chr == 44) {
         Serial.print(","); 
      }
      else { 
        if (i <= 5) {
          Serial.print(chr);
        }
        else {
          Serial.print(int(chr));
        }
      }
    }
    Serial.println();
  }
  else {
  
  }
}

boolean checkForCommands () {
  pixelShow(0,0,255);
  String  commandString = ""; 
  boolean stringCommandComplete = false;
  while (Serial.available() && !i2cFlag) {
      char inChar = Serial.read();
      if((int)inChar == 13 || (int)inChar == 10) {
         stringCommandComplete = true;
         break;    
      }
      else {
          commandString +=  inChar;  
      }
  }
  if (i2cFlag == true && debug == true) {
    Serial.println ("I2C override stop");
    pixelShow(255,255,0);
    delay(2000);
  }
  Serial.flush();
  if (!stringCommandComplete && commandString.length() >= 0 ) {
    return false;
  }
  else {
    pixelShow(255,255,255);
    if (debug ) {
      Serial.println("command to run  is " + commandString);
    }
  }
  commandString.toLowerCase();
  int extraCommands = commandString.indexOf(":");  // if we have the : then we can test for command pairs
  if (extraCommands !=  -1) {  // index returned a non -1 which means there is an extra command set
     String commandType = commandString.substring(0, extraCommands);
     String commandValue = commandString.substring(extraCommands+1);
     if (commandType == "engine") {
       setEnginePower(commandValue.toInt());
       pixelShow(0,255,0);
       return true;
     }
     else if (commandType == "drivetime") {
       setDriveTime(commandValue.toInt());
       pixelShow(0,255,0);
       return true;
     }
     else if (commandType == "settings") {
       getSettings();
       pixelShow(0,255,0);
       return true;
     }
     else {
     }
     return false;
  }
  if (commandString == "left" && i2cFlag == false) {
    pixelShow(0,255,0);
    turn(WheelDirectionLeft, enginePower, runTimeBase);
    return true;      
  }
  else if (commandString == "right"  && i2cFlag == false) {
    pixelShow (0,255,0);
    turn (WheelDirectionRight,enginePower, runTimeBase);
    return true;      
  }
  else if (commandString == "back") {
    pixelShow(0,255,0);
    turn(WheelDirectionBACKWARD,enginePower, runTimeBase);
    return true;      
  } 
  else if (commandString == "forward"  && i2cFlag == false) {
    pixelShow(0,255,0); 
    turn(WheelDirectionFORWARD,enginePower, runTimeBase);
    return true;
  }
  else if (commandString == "testwheels" && debug == true) {
    pixelShow(0,255,0);
    testWheels();
    return true;
  }
  else {
    pixelShow(255,0,0);
    Serial.println (commandString + " Command error" );
    delay(messageLightDelay);
  }
}
void getSettings () {
   Serial.println("Engine Power "  + String(enginePower, DEC));
   Serial.println("Power Levels " + String(runTimeBase, DEC));
}
void setEnginePower(int newPower) {
  if (newPower > 254) {
    newPower = 255;
  }
  else if (newPower < 50) {
    newPower = 50;
  }
  else {
  }
  enginePower = newPower;
  Serial.print("Power levels "  + String(enginePower, DEC));
  for (int motor = 0; motor <= 3; motor++) {
    motors[motor]->setSpeed(newPower);
  }
}
void setDriveTime (int dtime) {
  if (dtime < 250) {
    dtime = 250;
  }
  runTimeBase = dtime;
  Serial.println("run time set to "  + String(runTimeBase,DEC));
}
void pixelShow (unsigned int red, unsigned int green, unsigned int blue) {
    pixels.setPixelColor(0, pixels.Color(red, green, blue));
    pixels.show(); 
    delay(blinkColorRate);
    pixels.setPixelColor(0, pixels.Color(0, 0, 0));
    pixels.show();
}
void turn (int wheelpattern[4], int power, int runTime) {
  for (int motor = 0; motor <= 3; motor++) {
    motors[motor]->setSpeed(power);
  }
  for (int motor = 0; motor <= 3; motor++) {
    motors[motor]->run(wheelpattern[motor]);
  }
  delay(runTime);
  allStop();
}
void allStop () {
  for (int motor = 0; motor <= 3; motor++) {
    Serial.println (motor);
    motors[motor]->run(RELEASE);  
  }
  //blinkColor(255,0,0);
  i2cFlag = false;
}
void blinkColor (int red, int green, int blue) {
  for(int i = 0; i <= blinkColors; i++) {
    pixelShow (red,green,blue);
    delay(blinkColorRate);
    pixelShow(0,0,0);
    delay(blinkColorRate);
  }
  pixelShow(0,0,0);
}
void wheelSingle (Adafruit_DCMotor*  motorTest,int power, int runTime, char directions) {
  motorTest->setSpeed(power);
  if (directions == 66) {
    motorTest->run(BACKWARD);
  }
  else if (directions == 70) {
    motorTest->run(FORWARD);
  }
  else {
    Serial.println("invalid direction command");
  }
  delay(runTime);
  motorTest->run(RELEASE);
}
void testWheels () {
  Serial.println("Wheel testing starting \nTests: all forward, backward, 1 to 4 each Backward and then forward.");
  Serial.println("Forward all");
  turn (WheelDirectionFORWARD, 40, 1000);
  Serial.println("backward all");
  turn (WheelDirectionBACKWARD, 40,1000);
  char directiontest [2] = {'B', 'F'};
  for (int b = 0; b <= 1; b++) {
    for (int i = 0; i <= 3; i++) {
      Serial.println (directiontest[b]);
      Serial.println(" test wheel");
      wheelSingle(motors[i], 50, 700, directiontest[b]);
    }
  } 
  Serial.println("Wheel testing complete \n");
}



