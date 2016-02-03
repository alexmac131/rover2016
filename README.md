#Rover Build - I2C - MultiBoard - Homemade Lidar

by Alex Mackinnon
 ![I2C Multiboards ](https://raw.githubusercontent.com/alexmac131/rover2016/master/images/multiBoardProtoType.JPG)

##About the project:##
I have been working with Arduino as a hobby for a few years now and wanted to something different and build something that starts to take the hardware and code to its very edge. 

This is basically version 3 with new physical hardware, new code and the introduction of I2C and multi-unit control boards. Intentionally mixing different classes of Arduino boards, raspberry pi 1 & 2, particle IO boards and others.

My [first project](https://github.com/alexmac131/NodeXBeeRover) I was at a hackathon and decided to code up a browser based control system that talked to a NodeJs AJAX service.  This in turn talked through nodeJS serial through a radio link to my rover's xbee transceiver and it in turn used Arduino code written in a mix of C, C++ and Java (Yes it seems odd, I think so too). 

The [second project](https://github.com/alexmac131/Ulysses-Explorer-) was again at a hackathon the following year and clearly I had bit off more than I could chew and made the mistake of traveling and having to do the social game at the same time.  Also mixing up serial baud rates between nodejs server and robot did not help.

In this *third* project it is my intent to create a platform where I have a basic drive set that accepts commands but also allows for addition of hardware modules in a near [Ros](http://wiki.ros.org/ROS/Introduction) programming format.  It is infact going to be ROS but I am pretty sure my first attempt at ROS will break a few rules.
___
##Subprojects

+ [Arduino I2C Code](https://github.com/alexmac131/rover2016/tree/master/arduinoCode)
+ [Browser Code](https://github.com/alexmac131/rover2016/tree/master/browserCode)
+ [Misc Notes](https://github.com/alexmac131/rover2016/tree/master/documentation)
+ [NodeJS Server](https://github.com/alexmac131/rover2016/tree/master/nodeJSServer)

---

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


