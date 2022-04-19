int ledPin = 5;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  while (Serial.available() <= 0) {
    Serial.println("0"); // send a starting message
    delay(300);              // wait 1/3 second
  }
}

void loop() {
  while (Serial.available() > 0) {
    // read the incoming byte:
   int inByte = Serial.read();
    analogWrite(ledPin, inByte);
    Serial.println("0");
  }
}
