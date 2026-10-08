package com.example.bmi;

public final class BmiCalculatorTest {
    private BmiCalculatorTest() {
    }

    public static void main(String[] args) {
        testMetricCalculation();
        testImperialCalculation();
        testCategoryBoundaries();
        testInvalidInputs();
        System.out.println("4 test groups passed");
    }

    private static void testMetricCalculation() {
        BmiCalculator.BmiResult result = BmiCalculator.calculate(175, 70, BmiCalculator.Unit.METRIC);
        assertEquals(22.9, result.bmi(), 0.05);
        assertEquals(BmiCalculator.Category.NORMAL, result.category());
    }

    private static void testImperialCalculation() {
        BmiCalculator.BmiResult result = BmiCalculator.calculate(69, 154, BmiCalculator.Unit.IMPERIAL);
        assertEquals(22.74, result.bmi(), 0.005);
        assertEquals(BmiCalculator.Category.NORMAL, result.category());
    }

    private static void testCategoryBoundaries() {
        assertEquals(BmiCalculator.Category.UNDERWEIGHT,
                BmiCalculator.calculate(175, 50, BmiCalculator.Unit.METRIC).category());
        assertEquals(BmiCalculator.Category.NORMAL,
                BmiCalculator.calculate(175, 70, BmiCalculator.Unit.METRIC).category());
        assertEquals(BmiCalculator.Category.OVERWEIGHT,
                BmiCalculator.calculate(175, 80, BmiCalculator.Unit.METRIC).category());
        assertEquals(BmiCalculator.Category.OBESE,
                BmiCalculator.calculate(175, 100, BmiCalculator.Unit.METRIC).category());
    }

    private static void testInvalidInputs() {
        expectInvalid(() -> BmiCalculator.calculate(0, 70, BmiCalculator.Unit.METRIC));
        expectInvalid(() -> BmiCalculator.calculate(175, 0, BmiCalculator.Unit.METRIC));
        expectInvalid(() -> BmiCalculator.calculate(0, 154, BmiCalculator.Unit.IMPERIAL));
    }

    private static void expectInvalid(Runnable action) {
        try {
            action.run();
            throw new AssertionError("Expected IllegalArgumentException");
        } catch (IllegalArgumentException expected) {
            // Expected.
        }
    }

    private static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new AssertionError("Expected " + expected + " but was " + actual);
        }
    }

    private static void assertEquals(double expected, double actual, double tolerance) {
        if (Math.abs(expected - actual) > tolerance) {
            throw new AssertionError("Expected " + expected + " but was " + actual);
        }
    }
}
