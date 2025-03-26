const { hello_2, goodbye_ } = require('./codecov');

describe('codecov.js functions', () => {
  // Tests for hello_2 function
  test('hello_2 returns "hello!" when input is 5', () => {
    expect(hello_2(5)).toBe("hello");
  });

  test('hello_2 returns "nope" when input is not 5', () => {
    expect(hello_2(4)).toBe("nope");
    expect(hello_2(6)).toBe("nope");
    expect(hello_2(0)).toBe("nope");
  });

  // Tests for goodbye_ function
  test('goodbye_ returns "hello!" when input is 9', () => {
    expect(goodbye_(9)).toBe("hello!");
  });

  test('goodbye_ returns "nope" when input is not 9', () => {
    expect(goodbye_(8)).toBe("nope");
    expect(goodbye_(10)).toBe("nope");
    expect(goodbye_(0)).toBe("nope");
  });
});
