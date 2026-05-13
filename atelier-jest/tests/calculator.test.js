const { add, sub, mul, div } = require("../src/calculator");

test("addition", () => {
  expect(add(2, 3)).toBe(6);
});

test("soustraction", () => {
  expect(sub(8, 2)).toBe(6);
});

test("multiplication", () => {
  expect(mul(4, 3)).toBe(12);
});

test("division", () => {
  expect(div(10, 2)).toBe(5);
});

test("division par zéro", () => {
  expect(() => div(10, 0)).toThrow();
});
