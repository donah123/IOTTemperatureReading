/*  This is a modified version of one of Microsoft's demos
    https://github.com/Azure-Samples/iot-hub-node-ping
*/
'use strict';

var Protocol    = require('azure-iot-device-mqtt').Mqtt,
    Client      = require('azure-iot-device').Client,
    Message     = require('azure-iot-device').Message,
    creds       = require('./creds.js'),
    client      = null,
    events      = require('events'),
    emitter     = null,
    board       = require('./board.js'),
    alertTemp   = 70;
    
    

function main() {

    // Create the connection string
    var con = Object.keys(creds).reduce(function(prev, curr, i) {
        if (prev) {
            prev += ';';
        }
        return prev + curr + '=' + creds[curr];
    }, '');

    // Set up an event emitter that the board can use
    emitter = new events.EventEmitter();
    // The on change event to run
    emitter.on("temperature:change", temperatureChanged);

    // This will run the code to fire up the board for our project.
    // The board will use the emitter to signal changes 
    // For this project the changes will be related to temperature.
    var project = board(emitter);

    // open a connection to the device
    client = Client.fromConnectionString(con, Protocol);
    client.open(connect);
}

// The function to run when the IoT Hub client connects
function connect(err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
        return;
    } 

    // Set up generic client listenters
    client.on('error', function (err) {
        console.error(err.message);
    });

    client.on('disconnect', function () {
        client.removeAllListeners();
    });   

    // Listen for IoT Hub sending direct methods
    client.onDeviceMethod('disableAlert', disableAlert);
}

// The function to run when the temperature changes.
function temperatureChanged(obj, greenLed, redLed) {
    var message = new Message(JSON.stringify({
        deviceId:       creds.DeviceId, 
        temperature:    obj.temperature,
        timestamp:      new Date(),
    }));

    // Send the message
    client.sendEvent(message, function() {
         greenLed.on();
         setTimeout(function() {
             greenLed.off();
         },500);
    });

    // Edge processing to see if the temperature is higher than we want
    if (obj.temperature >= alertTemp) {
        redLed.on();
    }
}

// Trigger the event that will disable the red LED
// https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-node-node-direct-methods
function disableAlert(request, response) {
    emitter.emit('disableAlert');
    response.send(200, 'An event was triggered to disable the alert', function(err) {
         if(err) {
             console.error(err.toString());
         } 
     });
}

main();
