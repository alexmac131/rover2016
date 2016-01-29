#I2C Rover Multi Board Controls

by Tra

This code is used to upload or download codeplugs into a TYT-MD380 DMR
radio.  Some parts of this can be adapted for the CS700 and CS750,
but that work has yet to be done.

##License:##

The majority of this software is licensed in exchange for two liters
of India Pale Ale, to be delivered at a neighborly bar, preferably
without a a god-damned squary-stary-box.

##Specifications:##

* The MD380 uses a custom variant of DFU that isn't quite compatible
  with the spec.  Their code seems to be forked from an STMicro
  example for the STM32 chip.

* Universal Serial Bus Device Class Specification for Device
  Firmware Upgrade, version 1.1:
  http://www.usb.org/developers/devclass_docs/DFU_1.1.pdf


##Requirements:##

* NodeJS
  https://nodejs.org/en/

* Adafrut MotorShield v2.4
https://www.adafruit.com/products/1438

* Nomad Rover Frame
https://www.servocity.com/html/nomad_4wd_off-road_chassis.html#.VqvZkDYrKRs



