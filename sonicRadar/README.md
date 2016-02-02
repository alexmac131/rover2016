#I2C Rover Multi Board Controls

by Alex Mackinnon
 
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
##Subprojects

+ [Arduino I2C Code](https://github.com/alexmac131/rover2016/tree/master/arduinoCode)
+ [Browser Code](https://github.com/alexmac131/rover2016/tree/master/browserCode)
+ [Misc Notes](https://github.com/alexmac131/rover2016/tree/master/documentation)
+ [NodeJS Server](https://github.com/alexmac131/rover2016/tree/master/nodeJSServer)

---
