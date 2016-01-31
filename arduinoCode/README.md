#I2C Rover Multi Board Controls 
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


## Things to note ##

## Example code comparison ##


##Specifications##



##Requirements##
* Adafrut MotorShield v2.4
https://www.adafruit.com/products/1438
* Nomad Rover Frame
https://www.servocity.com/html/nomad_4wd_off-road_chassis.html#.VqvZkDYrKRs
* XBee radio link 
Xbee Radio Link Buyers Guide. 
https://www.sparkfun.com/pages/xbee_guide
* Wifi Network Shield or Wifi Dongle
* MDF Board and other bits

##Resources##
Xbee Radio Link Buyers Guide. 
https://www.sparkfun.com/pages/xbee_guide

___

##Sonar Sweep##
<table>
	<tr>
		<td><img src="https://raw.githubusercontent.com/alexmac131/rover2016/master/images/Pinger.JPG"></td>
		<td><img src="https://raw.githubusercontent.com/alexmac131/rover2016/master/images/sonarRendered.png"></td>
	</tr>
	<tr>	
		<td colspan="2"><img src="https://raw.githubusercontent.com/alexmac131/NodeXBeeRover/master/images/nodeRoverControls.jpg"></td>
		
		
	</tr>
</table>
##Goals##
To sweep in a defined arc in front of the rover with a ultra sonic range sensor.  The data is kept in the control board until a sweep is complete, transmitted externally to other systems. Given options such as miniumn range sending control messages to the motor control system and set control flags.  The flags will set a stop message and if the stop condition clears also transmit a clear message.
###PARTS###
* Ping Sonic Pinger
* Sonic Pinger
* Arduino (Leonardo in this case)
* breadboard power strip (Broken off a breadboard)



---
##Motor XBee Control##
<table>
	<tr>
		<td><img src="https://raw.githubusercontent.com/alexmac131/rover2016/master/images/MotorStack.JPG"></td>
		<td><img src="https://raw.githubusercontent.com/alexmac131/rover2016/master/images/motorControllers.jpg"></td>
	</tr>
</table>

###GOALS###


###PARTS###


