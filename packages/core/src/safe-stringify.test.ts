import { test, expect } from "vitest";
import { stringifyWithError } from "./safe-stringify";


test("stringifyWithError(): An error object is passed", () => {
    class TestError extends Error {
        private value: string;
        public constructor(message: string){
            super(message);
            this.value = message;
        }
    }

    let result = stringifyWithError(new TestError("test message"));
    expect(typeof result).toBe("string");

    let parsedValue = JSON.parse(result);
    expect("stack" in parsedValue).toBeTruthy();
    expect("message" in parsedValue).toBeTruthy();
    expect("value" in parsedValue).toBeTruthy();


    result = stringifyWithError(new Error("test message"));
    expect(typeof result).toBe("string");

    parsedValue = JSON.parse(result);
    expect("stack" in parsedValue).toBeTruthy();
    expect("message" in parsedValue).toBeTruthy();
})

test("stringifyWithError(): Unique object is passed", () => {
    const result = stringifyWithError({value1: 1, value2: "value2"});
    expect(typeof result).toBe("string");

    const parsedValue = JSON.parse(result);
    expect("value1" in parsedValue).toBeTruthy();
    expect("value2" in parsedValue).toBeTruthy();

    expect(parsedValue.value1).toBe(1);
    expect(parsedValue.value2).toBe("value2");
});