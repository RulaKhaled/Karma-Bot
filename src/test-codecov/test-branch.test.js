const { reverse, randomTest, returnPlus3, hello } = require("./test-branch");

test("returns the given array reversed", function () {
  expect(reverse([1, 2, 3])).toEqual([3, 2, 1]);
});

test("returns + 3 of whatever you give it", function () {
  expect(returnPlus3(4)).toBe(7);
});

test("random test", function () {
  expect(randomTest()).toBe("hello");
});

test("returns 9 when given 6", () => {
  expect(returnPlus3(6)).toBe(9);
});

// test("returns 'hello!' if given 5", function () {
//   expect(hello(5)).toBe("hello!");
// });

// test("returns 'nope' if given anything other than 5", function () {
//   expect(hello(4)).toBe("nope");
// });

test("returns 'nope'", function () {
  expect(hello(9)).toBe("nope");
});
