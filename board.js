var five = require("johnny-five");
var Raspi = require("raspi-io");
var BME280 = require('node-adafruit-bme280');

function fetchTemperature(callback){
BME280.probe(function(temperature,pressure,humidity)
{
    callback({
        temperature:temperature,
        pressure:pressure,
        humidity:humidity
    })
})
}

module.exports = function (eventEmitter) {
    var board = new five.Board({
        io: new Raspi()
    });
    var pins = require("./pins.js")

    board.on("ready", function () {
        var green = new five.Led(pins.greenLed);
        var red = new five.Led(pins.redLed);
        var prev = 0;

        // Check the sensor every second.
        setInterval(function () {
            fetchTemperature(function (obj) {
                if (prev === obj.temperature) { // If the temp has changed...
                    return;
                }
                prev = obj.temperature;
                // Fire off a change notification
                eventEmitter.emit("temperature:change", obj, green, red);
            });
        }, 1000);

        // Listen to any event named disableAlert
        // If we get an event, disable the red LED
        eventEmitter.on('disableAlert', function () {
            red.off();
        });

        // Make sure to turn off the LEDS
        this.on("exit", function () {
            green.off();
            red.off();
        });
    });
};


