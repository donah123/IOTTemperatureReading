#  IoT Hub demo using a ds18x20 temperature sensor

### How to use this code
* [Install a recent version of Raspbian Jessie](https://www.raspberrypi.org/downloads/raspbian/)
        
* Update node by running:
        
        $ update-nodejs-and-nodered

* Download the code with git

        $ git clone https://github.com/whelmed/iothub_rpi.git
        $ cd iothub_rpi
* Install the dependencies

        $ npm install

* Edit the creds.js with your device credentials

    * You can generate a new device in the Azure portal under the device blade of your IoT app
* Edit the pins you're using in the pins.js file
* Enable 1-wire
  * sudo raspi-config
  * Select Interfacing Options
  * Navigate to and select SSH
  * Choose Yes
  * Select Ok
 
* Reboot the device

        $ sudo reboot

* Load the 1-wire kernel modules

        $ sudo modprobe w1-gpio
        $ sudo modprobe w1-therm
        
* Run the code
        
        $ nodejs app.js
    
