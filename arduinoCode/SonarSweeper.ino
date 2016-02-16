#include <Servo.h>
#include <Wire.h>
#include <Adafruit_MotorShield.h>

#define TRIGPIN 10   // yellow wire
#define ECHOPIN 11  // green wire
#define PINGPIN        7
#define SERVOPIN       9
#define I2C_ADDRESS_MOTOR 0x8
#define I2C_ADDRESS_ME 0x9
#define I2C_AdafruitMotorShield 0x60
#define serverPosAngle 30
#define serverPosCentre 90
#define minRange  20

bool frontBarrier = false;
bool sweepBarrier = false;
bool debug = true;

Adafruit_MotorShield ROVERMOTORS = Adafruit_MotorShield(I2C_AdafruitMotorShield);
Adafruit_DCMotor *frontLeftWheel = ROVERMOTORS.getMotor(1);
Adafruit_DCMotor *frontRightWheel = ROVERMOTORS.getMotor(2);
Adafruit_DCMotor *rearLeftWheel = ROVERMOTORS.getMotor(3);
Adafruit_DCMotor *rearRightWheel = ROVERMOTORS.getMotor(4);
Adafruit_DCMotor *motors[4] = { frontLeftWheel,  frontRightWheel, rearLeftWheel   , rearRightWheel    };

int baudSpeed = 9600;
Servo primarySweep;

void setup() {
  Serial.begin(baudSpeed);
  primarySweep.attach(SERVOPIN);
  pinMode(TRIGPIN, OUTPUT);
  pinMode(ECHOPIN, INPUT);
  Wire.begin(I2C_ADDRESS_ME); 
  calibrateServo();
}

void loop() {
  radarSweep();
}

void radarSweep () {  
  int count = 0;
  unsigned int RangeArray[30];
  bool currentSweepBarrier =  false;
  for(int pos = serverPosCentre - serverPosAngle ; pos <= (serverPosCentre + serverPosAngle); pos += 5) {                  
    primarySweep.write(pos);   
    delay(45);
    primarySweep.detach();
    RangeArray[count]  = pingArea (1);
    primarySweep.attach(SERVOPIN);
    if (RangeArray[count] == -1 ) {
        sweepBarrier = true;
        currentSweepBarrier = true;
    }
    if (debug) {
      Serial.println (" degree " + String(pos) + " count " + String (count) + " range " + String(RangeArray[count]));
    }
    count++; 
    primarySweep.detach();
    unsigned int bumperValue = pingArea(0); // front barrier clear detection
    primarySweep.attach(SERVOPIN);
    if (bumperValue > minRange  && sweepBarrier == false  && frontBarrier == true) {
      allClear();
      frontBarrier = false;
    }
    else if (bumperValue < minRange  && sweepBarrier == false  && frontBarrier == false) {
       frontBarrier = true;
    }
    else if (bumperValue < minRange  && sweepBarrier == true  && frontBarrier == false) {
      frontBarrier = true;
    }
    else {
      
    }
    delay(80);
  }     
  if (currentSweepBarrier == false &&  sweepBarrier == true ) {
    allClear();
    sweepBarrier = false;
    currentSweepBarrier = false;
  }
  primarySweep.write(serverPosCentre - serverPosAngle);
  delay(40);
  sendRadarData(RangeArray);
}

long microsecondsToCentimeters(long microseconds){
  return microseconds / 29 / 2;
}

void sendRadarData (unsigned int data[]) {
  Serial.println();
  Wire.beginTransmission(I2C_ADDRESS_MOTOR); 
  Wire.write("radar,");
  int steps = (((serverPosCentre  + serverPosAngle)  -   (serverPosCentre - serverPosAngle)) / 5) + 1 ;
  for (int c = 0; c < steps; c++) {
    Serial.println (data[c]);
    Wire.write(data[c]);
    if (c < steps) {
      Wire.write(",");
    }  
  }
  Wire.endTransmission();
}

void allStop (int range, String Whom) {
  if (debug) {
    Serial.println("all stop by " + Whom + " range is " + String(range) +  " minrange required is " + String(minRange));
  }
  for (int motor = 0; motor <= 3; motor++) {
    if (debug) {
      Serial.println ("motor " + String(motor) );
    }
    motors[motor]->run(RELEASE);  
  }
}

void wheelSingle () {
  Serial.println ("Single wheel test");
  frontLeftWheel->setSpeed(100);
  frontLeftWheel->run(BACKWARD);
  delay(1200);
  frontLeftWheel->run(RELEASE);
}

void calibrateServo () {
  Serial.println ("Delay to allow opening console");
  delay (2000);
  int checkSpots [3] = { 45, 90, 135};
  for (int check = 0; check < 3; check++) { 
    Serial.println ("Check " + String(check) + " angle of servo" + String(checkSpots [check]));
    primarySweep.write(checkSpots[check]); 
    delay (1000);
  }
}
  
unsigned  int pingArea(int pinger) {
  	long duration, distance;
    int lookFor,trigPin, echoPin;
  	String Whom;	
  
  	if (pinger == 1) {
  		trigPin = PINGPIN;
  		echoPin = PINGPIN;
  		lookFor = 10;
  		Whom = "radar";
  	}
  	else {
  		trigPin = TRIGPIN;
  		echoPin = ECHOPIN;
  		lookFor = 10;
  		Whom = "Front pinger";
  	}
  	//  clear eyes
  	pinMode(trigPin, OUTPUT);
  	digitalWrite(trigPin, LOW);
  	delayMicroseconds(20); 
  	// look with eyes
  	digitalWrite(trigPin, HIGH);
    delayMicroseconds(lookFor);
    digitalWrite(trigPin, LOW);
    
    // see the sonic reflection
    pinMode(echoPin, INPUT);  // listen
    duration = pulseIn(echoPin, HIGH);
    distance = microsecondsToCentimeters(duration);
    Serial.println("Sonar range for " + Whom + " " + distance);
    if (distance < minRange ) {
    	if (debug) { 
    	   Serial.println ("Front sonic distance is " + String(distance) + Whom);
    	}
      allStop(distance, Whom);
    	Wire.beginTransmission(I2C_ADDRESS_MOTOR); 
      	 Wire.write('S');        // send stop code
      Wire.endTransmission();  
  		return distance;
    }
    else  {
    	return distance;
    }   
  }

void  allClear () {
  Wire.beginTransmission(I2C_ADDRESS_MOTOR); 
  Wire.write('C');        // send clear code
  Wire.endTransmission();    
}
