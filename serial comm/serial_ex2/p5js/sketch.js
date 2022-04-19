let serial; // variable to hold an instance of the serialport library
let portName = "/dev/cu.usbmodem141401"; // fill in your serial port name here
let brightness = 0;

function setup() {
  createCanvas(640, 480);
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on("list", printList); // set a callback function for the serialport list event
  serial.on("connected", serverConnected); // callback for connecting to the server
  serial.on("open", portOpen); // callback for the port opening
  serial.on("data", serialEvent); // callback for when new data arrives
  serial.on("error", serialError); // callback for errors
  serial.on("close", portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
}

function draw() {
  background(220);
}

// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (let i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
  }
}

function serverConnected() {
  print("connected to server.");
}

function portOpen() {
  print("the serial port opened.");
}

function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  let inString = serial.readLine();
  print(inString)
 
  brightness = mouseX;
  let mapped = map(brightness, 0, 640, 0, 255);

  serial.write(mapped);
}

function serialError(err) {
  print("Something went wrong with the serial port. " + err);
}

function portClose() {
  print("The serial port closed.");
}