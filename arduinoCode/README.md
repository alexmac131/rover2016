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
+Attempting to send I2C to a middle device cause a lock up. Which means instead of sending a command to one board and then another nested I2C command. 
+Mutlipul Pingers with the servo on cause a power brownout. So ideally you should release attach servo as it sweeps and takes range readings.


## Things to note ##

## Example code comparison ##


##Specifications##



