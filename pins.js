// Pins for the Raspberry Pi are numbered strangely
// Here's a link to help https://pinout.xyz/pinout/1_wire
// For the ds18x20 using a Raspberry Pi 3 B you'll use pin 7 
// which is also BMP4 on the above link
module.exports = {
    greenLed    : "GPIO18",
    redLed      : "GPIO21",
}