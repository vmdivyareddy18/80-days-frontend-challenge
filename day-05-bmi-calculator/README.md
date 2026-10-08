# ⚖️ Day 5 - BMI Calculator

A responsive BMI (Body Mass Index) Calculator built using HTML, CSS, and JavaScript as part of my **80 Days Coding Challenge**.

## Java command-line calculator

The Java implementation is dependency-free and can be compiled with the JDK.

```bash
rm -rf out && mkdir -p out
javac -d out src/main/java/com/example/bmi/BmiCalculator.java src/test/java/com/example/bmi/BmiCalculatorTest.java
java -cp out com.example.bmi.BmiCalculatorTest
java -cp out com.example.bmi.BmiCalculator metric 175 70
java -cp out com.example.bmi.BmiCalculator imperial 5 9 154
```

Run `java -cp out com.example.bmi.BmiCalculator --help` to display the available commands.

## 🚀 Features
- Metric & Imperial Unit Support
- BMI Calculation
- BMI Categories (Underweight, Normal, Overweight, Obese)
- Interactive BMI Gauge
- Responsive Design
- Input Validation
- Enter Key Support

## 🛠️ Tech Stack
- HTML
- CSS
- JavaScript
- Java

## 📚 What I Learned
- DOM Manipulation
- Event Listeners
- Functions
- Input Validation
- Conditional Statements (`if-else`)
- Dynamic UI Updates

## 🎯 Outcome
Built an interactive BMI Calculator with a clean UI and real-time BMI category tracking.

#80DaysCodingChallenge
