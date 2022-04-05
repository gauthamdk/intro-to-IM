int lampPin = 11;
int pressurePin = 2;
int alarmPin = 12;
int buzzerPin = 6;
int switchPin = 8;
int timer;

bool alarm = false;
bool blinking = false;
bool activate = false;
int prevSwitch;

int prevPressureValue;

void setup() {
  // put your setup code here, to run once:
  pinMode(lampPin, OUTPUT);
  pinMode(alarmPin, OUTPUT);
  pinMode(pressurePin, INPUT);
  pinMode(switchPin, INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  int pmValue = analogRead(A0);
  int mappedValue = map(pmValue, 0, 1023, -10, 255);959
  int brightness = constrain(mappedValue, 0, 255);

  analogWrite(lampPin, brightness);

  // checking if alarm system is turned on
  int switchValue = digitalRead(switchPin);
  if (prevSwitch == 0 && switchValue == 1){
    activate = !activate;
    digitalWrite(alarmPin, HIGH);
  }

  prevSwitch = switchValue;

  // checking if an intruder is stepping on the pressure plate
  int pressureValue = digitalRead(pressurePin);

  if (pressureValue == 1 && alarm == 0 && activate == 1) {
    //trigger alarm
    alarm = true;
    timer = millis();
  }

  if (alarm) {
    //trigger light and sound
    if (millis() > timer) {
      blinking = !blinking;
      timer = millis() + 500;
    }

    if (blinking) {
      digitalWrite(alarmPin, 255);
      tone(buzzerPin, 400, 500 * 0.2);
    }
    else {
      digitalWrite(alarmPin, 0);
    }
  }
}
