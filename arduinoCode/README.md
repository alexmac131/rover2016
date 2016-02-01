#I2C and Code
by Alex Mackinnon

###License:###
The majority of this software is licensed in exchange for two liters
of India Pale Ale, to be delivered at a neighborly bar.


##Arduino I2C between Arduino Mega, Arduino Leonardo,Adafruit motor shield:##
I have been working with Arduino as a hobby for a few years now and wanted to something different and build something that starts to take the hardware and code to its very edge.  Here we will document the process of the various boards communicating with the vehicle motor controls.

* Arduino Mega I2C address 0x8
* Arduino Leonardo address 0x9
* Adafruit MotorShield default address 0x60(1)


## Issues found ##
1. Attempting to send I2C to a middle device cause a lock up. Which means instead of sending a command to one board and then another nested I2C command. 
2. Mutlipul Pingers with the servo on cause a power brownout. So ideally you should release attach servo as it sweeps and takes range readings.


## Things to note ##
I could likely include this code in seperate file as it is used as the basis for all motor commmands in all boards present and future board extensions.
```
#include <Adafruit_MotorShield.h>
.
.
.
``` 
*SonarSweeper CodeBase* 
```
	#define I2C_ADDRESS_MOTOR 0x8
	#define I2C_ADDRESS_ME 0x9
``` 
*CoreMotorXbee CodeBase* 
```
	#define I2C_ADDRESS_MOTOR 0x9
	#define I2C_ADDRESS_ME 0x8

#define I2C_AdafruitMotorShield 0x60
.
.
.
Adafruit_MotorShield ROVERMOTORS = Adafruit_MotorShield(I2C_AdafruitMotorShield);
Adafruit_DCMotor *frontLeftWheel = ROVERMOTORS.getMotor(1);
Adafruit_DCMotor *frontRightWheel = ROVERMOTORS.getMotor(2);
Adafruit_DCMotor *rearLeftWheel = ROVERMOTORS.getMotor(3);
Adafruit_DCMotor *rearRightWheel = ROVERMOTORS.getMotor(4);
Adafruit_DCMotor *motors[4] = { frontLeftWheel,  frontRightWheel, rearLeftWheel   , rearRightWheel    };
```

## Example code comparison ##
The core difference here is how the motors are controlled by the CoreMotorXbee sketch.  The key difference is the use of pointers and arrays that diverge from the examples on line in very signifigant manner.


##Specifications##

___
##Subprojects## 

+ [Arduino I2C Code](https://github.com/alexmac131/rover2016/tree/master/arduinoCode)
+ [Browser Code](https://github.com/alexmac131/rover2016/tree/master/browserCode)
+ [Misc Notes](https://github.com/alexmac131/rover2016/tree/master/documentation)
+ [NodeJS Server](https://github.com/alexmac131/rover2016/tree/master/nodeJSServer)

---


