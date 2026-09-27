package com.example.bmi;

public final class BmiCalculator {
    private static final double MIN_METRIC_HEIGHT_CENTIMETERS = 50;
    private static final double MAX_METRIC_HEIGHT_CENTIMETERS = 280;
    private static final double MIN_IMPERIAL_HEIGHT_INCHES = 20;
    private static final double MAX_IMPERIAL_HEIGHT_INCHES = 111;
    private static final double MIN_WEIGHT = 10;
    private static final double MAX_WEIGHT = 500;
    private static final double METERS_PER_CENTIMETER = 0.01;
    private static final double POUNDS_PER_KILOGRAM = 2.20462262185;
    private static final double INCHES_PER_FOOT = 12;
    private static final double CENTIMETERS_PER_INCH = 2.54;

    private enum Unit {
        METRIC,
        IMPERIAL
    }

    private enum Category {
        UNDERWEIGHT,
        NORMAL,
        OVERWEIGHT,
        OBESE
    }

    private record BmiResult(double bmi, Category category) {
    }

    private static double calculateMetric(double heightCentimeters, double weightKilograms) {
        double heightMeters = heightCentimeters * METERS_PER_CENTIMETER;
        return weightKilograms / (heightMeters * heightMeters);
    }

    private static double calculateImperial(double heightFeet, double heightInches, double weightPounds) {
        double heightInchesTotal = heightFeet * INCHES_PER_FOOT + heightInches;
        double heightMeters = heightInchesTotal * CENTIMETERS_PER_INCH / 100;
        double weightKilograms = weightPounds / POUNDS_PER_KILOGRAM;
        return weightKilograms / (heightMeters * heightMeters);
    }

    private static void validateInput(Unit unit, double height, double weight) {
        if (!Double.isFinite(height) || !Double.isFinite(weight) || weight <= 0) {
            throw new IllegalArgumentException("Height and weight must be valid numbers.");
        }
    }
}
