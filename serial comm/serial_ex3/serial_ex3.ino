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

   int pmValue = analogRead(A0);
   int wind = map(pmValue, 0, 1023, 0, 20);
   
   digitalWrite(ledPin, inByte);
   Serial.println(wind);
  }
}
