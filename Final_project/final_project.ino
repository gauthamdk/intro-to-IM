#include <SparkFun_ADXL345.h>         // SparkFun ADXL345 Library
// This is the library for the TB6612 that contains the class Motor and all the
// functions
#include <SparkFun_TB6612.h>

// Pins for all inputs, keep in mind the PWM defines must be on PWM pins
// the default pins listed are the ones used on the Redbot (ROB-12097) with
// the exception of STBY which the Redbot controls with a physical switch
#define AIN1 2
#define BIN1 7
#define AIN2 4
#define BIN2 8
#define PWMA 5
#define PWMB 6
#define STBY 9


// these constants are used to allow you to make your motor configuration
// line up with function names like forward.  Value can be 1 or -1
const int offsetA = 1;
const int offsetB = 1;

// Initializing motors.  The library will allow you to initialize as many
// motors as you have memory for.  If you are using functions like forward
// that take 2 motors as arguements you can either write new functions or
// call the function more than once.
Motor motor1 = Motor(AIN1, AIN2, PWMA, offsetA, STBY);
Motor motor2 = Motor(BIN1, BIN2, PWMB, offsetB, STBY);

int leftMotor = 0;
int rightMotor = 0;

/*********** COMMUNICATION SELECTION ***********/
ADXL345 adxl = ADXL345();             // USE FOR I2C COMMUNICATION

/******************** SETUP ********************/
/*          Configure ADXL345 Settings         */
void setup() {

  Serial.begin(9600);                 // Start the serial terminal

  // start the handshake
  while (Serial.available() <= 0) {
    Serial.println("0,0,0"); // send a starting message
    delay(300);            // wait 1/3 second
  }

  pinMode(2, OUTPUT);

  adxl.powerOn();                     // Power on the ADXL345

  adxl.setRangeSetting(16);           // Give the range settings
  // Accepted values are 2g, 4g, 8g or 16g
  // Higher Values = Wider Measurement Range
  // Lower Values = Greater Sensitivity

  adxl.setSpiBit(0);                  // Configure the device to be in 4 wire SPI mode when set to '0' or 3 wire SPI mode when set to 1
  // Default: Set to 1
  // SPI pins on the ATMega328: 11, 12 and 13 as reference in SPI Library

  adxl.setActivityXYZ(1, 0, 0);       // Set to activate movement detection in the axes "adxl.setActivityXYZ(X, Y, Z);" (1 == ON, 0 == OFF)
  adxl.setActivityThreshold(75);      // 62.5mg per increment   // Set activity   // Inactivity thresholds (0-255)

  adxl.setInactivityXYZ(1, 0, 0);     // Set to detect inactivity in all the axes "adxl.setInactivityXYZ(X, Y, Z);" (1 == ON, 0 == OFF)
  adxl.setInactivityThreshold(75);    // 62.5mg per increment   // Set inactivity // Inactivity thresholds (0-255)
  adxl.setTimeInactivity(10);         // How many seconds of no activity is inactive?
}

/****************** MAIN CODE ******************/
/*     Accelerometer Readings and Interrupt    */
void loop() {

  // write to the motots to control vibrations
  motor1.drive(leftMotor);
  motor2.drive(rightMotor);

  while (Serial.available()) {
    // read the values for the motors
    leftMotor = Serial.parseInt();
    rightMotor = Serial.parseInt();
    if (Serial.read() == '\n') {
      // Accelerometer Readings
      int x, y, z;
      adxl.readAccel(&x, &y, &z);         // Read the accelerometer values and store them in variables declared above x,y,z


      // Output Results to Serial
      // send over the gyroscope values
      Serial.print(x);
      Serial.print(", ");
      Serial.print(y);
      Serial.print(", ");
      Serial.println(z);
    }
  }
}
