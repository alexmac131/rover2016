#include <Wire.h>
#include <Adafruit_MotorShield.h>
#include <EEPROM.h>
#define I2C_ADDRESS_LIDARPROCESSOR 0x9
#define I2C_ADDRESS_LASER 0x62 // Sign adafruit may use the same address space dont use on the shield of addafruit
#define I2C_LIDAR_MOTORSHIELD  0x61
#define I2C_AdafruitMotorShield 0x60


#define    RegisterMeasure     0x00          // Register to write to initiate ranging.
#define    MeasureValue        0x04          // Value to initiate ranging.
#define    RegisterHighLowB    0x8f          // Register to get both High and Low bytes in 1 call.


Adafruit_MotorShield LIDARMOTORS = Adafruit_MotorShield(I2C_ADDRESS_LIDARPROCESSOR);
Adafruit_DCMotor *verticalMotor = ROVERMOTORS.getMotor(1);
Adafruit_DCMotor *horizonalMotor = ROVERMOTORS.getMotor(2);


// the back spin on the lidar range 
int horizonCalibrate[] = {30, 29, 28, 27, 26 , 25, 26, 27, 28, 29, 30};
int verticalCalibrate[] = {27,26,25,26,27};
int baudSpeed = 9600;
int boardI2C;
 
void setup () {
  boardI2C = EEPROM.read(1);
  if (boardI2C != I2C_ADDRESS_LIDARPROCESSOR ) {
  	EEPROM.write (I2C_ADDRESS_LIDARPROCESSOR);
  }
  
  Wire.begin(I2C_ADDRESS_LIDARPROCESSOR); // join i2c bus
  Serial.begin(baudSpeed); // start serial communication at 9600bps
  Serial.println("startup done");
  mirrorMotors (verticalMotor, 100 );
  mirrorMotors (horizonalMotor, 30 );
}

void loop () {

}


void calibrateSpin () {
	float range = 0;
	// so I spin horizonal but also move up and down so in a grid up and down 
	range = getRangeTimeOfFlight(I2C_ADDRESS_LASER);

}

float getRangeTimeOfFlight (address) {
  float rangeReading; 
  Wire.beginTransmission((int)I2C_ADDRESS_LASER); // transmit to LIDAR-Lite
  Wire.write((int)RegisterMeasure); // sets register pointer to  (0x00)  
  Wire.write((int)MeasureValue); // sets register pointer to  (0x00)  
  Wire.endTransmission(); // stop transmitting

  delay(20); // Wait 20ms for transmit

  Wire.beginTransmission((int)I2C_ADDRESS_LASER); // transmit to LIDAR-Lite
  Wire.write((int)RegisterHighLowB); // sets register pointer to (0x8f)
  Wire.endTransmission(); // stop transmitting

  delay(20); // Wait 20ms for transmit

  Wire.requestFrom((int)I2C_ADDRESS_LASER, 2); // request 2 bytes from LIDAR-Lite
  if(2 <= Wire.available()) // if two bytes were received
  {
    rangeReading = Wire.read(); // receive high byte (overwrites previous reading)
    rangeReading = reading << 8; // shift high byte to be high 8 bits
    rangeReading |= Wire.read(); // receive low byte as lower 8 bits
    Serial.println(rangeReading); // print the reading
  }
  return rangeReading;
} 


void mirrorMotors (Adafruit_DCMotor*  motorSingle,int power) {
	// set each in turn, the remain constant so no need to set a timeout for the motors just tell the motors to run
  motorSingle->setSpeed(power);
  motorSingle->run(FORWARD);
}