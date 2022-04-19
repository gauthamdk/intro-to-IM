let serial; // variable to hold an instance of the serialport library
let portName = "/dev/cu.usbmodem1412201"; // fill in your serial port name here

let velocity;
let gravity;
let position;
let acceleration;
let wind = 0;
let drag = 0.99;
let mass = 50;
let hDampening;
let onOff = 0;

function setup() {
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on("list", printList); // set a callback function for the serialport list event
  serial.on("connected", serverConnected); // callback for connecting to the server
  serial.on("open", portOpen); // callback for the port opening
  serial.on("data", serialEvent); // callback for when new data arrives
  serial.on("error", serialError); // callback for errors
  serial.on("close", portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port

  createCanvas(640, 360);
  noFill();
  position = createVector(width / 2, 0);
  velocity = createVector(0, 0);
  acceleration = createVector(0, 0);
  gravity = createVector(0, 0.5 * mass);
  wind = createVector(0, 0);
  hDampening = map(mass, 15, 80, 0.98, 0.96);
}

function draw() {
  background(255);

  applyForce(wind);
  applyForce(gravity);
  velocity.add(acceleration);
  velocity.mult(drag);
  position.add(velocity);
  acceleration.mult(0);
  ellipse(position.x, position.y, mass, mass);
  if (position.y > height - mass / 2) {
    velocity.y *= -0.9; // A little dampening when hitting the bottom

    //     // turning on/off led
    if (onOff) {
      onOff = 0;
    } else {
      onOff = 1;
    }
    position.y = height - mass / 2;
  }
}

function applyForce(force) {
  // Newton's 2nd law: F = M * A
  // or A = F / M
  let f = p5.Vector.div(force, mass);
  acceleration.add(f);
}

// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (let i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
  }
}

function keyPressed() {
  if (key == " ") {
    mass = random(15, 80);
    position.y = -mass;
    velocity.mult(0);
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
  if (inString != "") {
    if (inString > 8 && inString < 12) {
      wind.x = 0;
    } else if (inString >= 12) {
      wind.x = 1;
    } else if (inString >= 0 && inString < 12) {
      wind.x = -1;
    }
  }

  serial.write(onOff);
}

function serialError(err) {
  print("Something went wrong with the serial port. " + err);
}

function portClose() {
  print("The serial port closed.");
}
