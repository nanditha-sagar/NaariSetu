import { classifyBP } from "./bpLogic";

const testCases = [
    { s: 110, d: 70, expected: "Normal" },
    { s: 125, d: 75, expected: "Elevated" },
    { s: 135, d: 85, expected: "Stage 1" },
    { s: 145, d: 95, expected: "Stage 2" },
    { s: 185, d: 110, expected: "Crisis" },
    { s: 120, d: 125, expected: "Crisis" },
];

console.log("Running BP Classification Tests...");

testCases.forEach(({ s, d, expected }, i) => {
    const result = classifyBP(s, d);
    if (result.category === expected) {
        console.log(`✅ Test ${i + 1} passed: ${s}/${d} => ${expected}`);
    } else {
        console.error(`❌ Test ${i + 1} failed: ${s}/${d} => expected ${expected}, got ${result.category}`);
    }
});
