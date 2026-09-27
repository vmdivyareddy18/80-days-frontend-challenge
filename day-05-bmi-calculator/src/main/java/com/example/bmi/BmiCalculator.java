package com.example.bmi;

import java.util.Locale;

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

    private static Category determineCategory(double bmi) {
        if (bmi < 18.5) {
            return Category.UNDERWEIGHT;
        }
        if (bmi < 25) {
            return Category.NORMAL;
        }
        if (bmi < 30) {
            return Category.OVERWEIGHT;
        }
        return Category.OBESE;
    }

    private static BmiResult calculate(double height, double weight, Unit unit) {
        validateInput(unit, height, weight);
        double bmi = unit == Unit.METRIC
                ? calculateMetric(height, weight)
                : calculateImperial(height, 0, weight);
        return new BmiResult(bmi, determineCategory(bmi));
    }

    private static String formatResult(BmiResult result) {
        return String.format(Locale.ROOT, "BMI: %.1f%nCategory: %s%n", result.bmi(), result.category());
    }

    private static BmiResult parseArguments(String[] args) {
        if (args.length == 3 && args[0].equalsIgnoreCase("metric")) {
            return calculate(Double.parseDouble(args[1]), Double.parseDouble(args[2]), Unit.METRIC);
        }
        if (args.length == 4 && args[0].equalsIgnoreCase("imperial")) {
            return calculate(Double.parseDouble(args[1]) * 12 + Double.parseDouble(args[2]),
                    Double.parseDouble(args[3]), Unit.IMPERIAL);
        }
        throw new IllegalArgumentException("Usage: java com.example.bmi.BmiCalculator metric <height-cm> <weight-kg>
"
                + "       java com.example.bmi.BmiCalculator imperial <height-feet> <height-inches> <weight-lbs>");
    }

    public static void main(String[] args) {
        try {
            System.out.print(formatResult(parseArguments(args)));
        } catch (IllegalArgumentException exception) {
            System.err.println(exception.getMessage());
            System.exit(1);
        }
    }
}
