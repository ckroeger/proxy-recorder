// index.test.js

const {
  replacePlaceholders,
  replaceQueryParamsOnPlaceholder,
} = require("../functions.cjs"); // Importiere die Funktion aus der index.js Datei

/*
import {
  replacePlaceholders,
  replaceQueryParamsOnPlaceholder,
} from "../functions";
 */
describe("replacePlaceholders", () => {
  test("should replace placeholders with corresponding values", () => {
    const template = "Hello, __name__!";
    const values = { name: "World" };
    const result = replacePlaceholders(template, values);
    expect(result).toBe("Hello, World!");
  });

  test("should return the same string if no placeholders are present", () => {
    const template = "Hello, World!";
    const values = { name: "World" };
    const result = replacePlaceholders(template, values);
    expect(result).toBe("Hello, World!");
  });

  test("should not replace placeholders if no matching values are provided", () => {
    const template = "Hello, __name__!";
    const values = {};
    const result = replacePlaceholders(template, values);
    expect(result).toBe("Hello, __name__!");
  });

  test("should replace multiple placeholders with corresponding values", () => {
    const template = "Hello, __name__! Today is __day__.";
    const values = { name: "Alice", day: "Monday" };
    const result = replacePlaceholders(template, values);
    expect(result).toBe("Hello, Alice! Today is Monday.");
  });

  test("should replace multiple placeholders with corresponding values and unused", () => {
    const template =
      "http://localhost:8080/https/__s__.tile.openstreetmap.org/__z__/__x__/__y__.png?s=a&z=19&x=276698&y=169444";
    const values = {
      s: "a",
      z: 19,
      x: 276698,
      y: 169444,
      unused: "unused",
    };
    const result = replacePlaceholders(template, values);
    expect(result).toBe(
      "http://localhost:8080/https/a.tile.openstreetmap.org/19/276698/169444.png?s=a&z=19&x=276698&y=169444"
    );
  });
});

describe("replaceQueryParamsOnPlaceholder", () => {
  test("should replace query params on placeholder", () => {
    const url = "https://__s__.tile.openstreetmap.org/__z__/__x__/__y__.png";
    const queryParams = [
      { key: "s", value: "a" },
      { key: "z", value: "19" },
      { key: "x", value: "276697" },
      { key: "y", value: "169444" },
    ];
    const result = replaceQueryParamsOnPlaceholder(url, queryParams);
    expect(result).toBe(
      "https://a.tile.openstreetmap.org/19/276697/169444.png"
    );
  });
});
