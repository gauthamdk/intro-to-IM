void setup() {
  Serial.begin(9600);
  while (Serial.available() <= 0) {
    Serial.println("0"); // send a starting message
    delay(300);              // wait 1/3 second
  }
}

void loop() {
  while (Serial.available() > 0) {
    // read the incoming byte:
   int inByte = Serial.read();
    int sensorValue = analogRead(A0);
    Serial.println(sensorValue);
  }
}
