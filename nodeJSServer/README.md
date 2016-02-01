#I2C Rover Multi Board Controls

by Alex Mackinnon
 ![I2C Multiboards ](https://raw.githubusercontent.com/alexmac131/rover2016/master/images/multiBoardProtoType.JPG)

##About the project:##
I have been working with Arduino as a hobby for a few years now and wanted to something different and build something that starts to take the hardware and code to its very edge. 

This is basically version 3 with new physical hardware, new code and the introduction of I2C and multi-unit control boards. Intentionally mixing different classes of Arduino boards, raspberry pi 1 & 2, particle IO boards and others.

##License:##

The majority of this software is licensed in exchange for two liters
of India Pale Ale, to be delivered at a neighborly bar.

##Specifications##
+ Create a vehicle 
+ Allow the vehicle to act autonomously when required.
+ Create a means to communicate between boards.
+ Allow quick adding of modules to the vehicle
+ Allow remove driving of the vehicle via any device that uses web browser
+ Build more advanced sensors 
+ Allow for mission planning and complete on board autonomous navigation



##Requirements##
* NodeJS
  https://nodejs.org/en/
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



___
## Subprojects ## 

+ [Arduino I2C Code](https://github.com/alexmac131/rover2016/tree/master/arduinoCode)
+ [Browser Code](https://github.com/alexmac131/rover2016/tree/master/browserCode)
+ [Misc Notes](https://github.com/alexmac131/rover2016/tree/master/documentation)
+ [NodeJS Server](https://github.com/alexmac131/rover2016/tree/master/nodeJSServer)

---



