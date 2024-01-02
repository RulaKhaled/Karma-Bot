const { subtract, add, multiply, divide } = require("./codecov-all-tests");

test("subtract", () => {
  expect(subtract(2, 1)).toBe(1);
});

test("add", () => {
  expect(add(2, 1)).toBe(3);
});

test("multiply", () => {
  expect(multiply(2, 1)).toBe(2);
});
