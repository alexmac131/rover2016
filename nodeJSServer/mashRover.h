#ifndef mashRover_h
#define mashRover_h
#include "Arduino.h"
#endif

#define I2C_ADDRESS_SONAR 0x9
#define I2C_ADDRESS_ME 0x8
#define INTERUPTPIN 19

int baudSpeed = 9600;
int enginePower = 100;
boolean overRide = false;
int runTimeBase = 300;
int messageLightDelay = 500;
int blinkColors = 1;
int blinkColorRate = 200;
boolean debug = false;
const int minRange = 30;

volatile int state = LOW;

int WheelDirectionLeft[4] = {BACKWARD, FORWARD, FORWARD, BACKWARD};
int WheelDirectionRight [4] = {FORWARD, BACKWARD, FORWARD, BACKWARD};
int WheelDirectionFORWARD [4] = {FORWARD, FORWARD, FORWARD, FORWARD};
int WheelDirectionBACKWARD [4] = {BACKWARD, BACKWARD, BACKWARD, BACKWARD};