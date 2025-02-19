const { returnPlus3, reverse, hello } = require("./codecov");

test("returns the given array reversed", function () {
  expect(reverse([1, 2, 3])).toEqual([3, 2, 1]);
});

test("returns + 3 of whatever you give it", function () {
  expect(returnPlus3(4)).toBe(7);
});

test("returns 'hello!' if given 5", function () {
  expect(hello(5)).toBe("hello!");
});

test("returns 'nope' if given anything other than 5", function () {
  expect(hello(4)).toBe("nope");
});
