import { sanitizeText } from '../src/lib/utils/sanitizer';

const testCases = [
    { input: "nmsmnmsdnsd", expected: "" },
    { input: "iwdiwijwdi jiwif", expected: "" },
    { input: "gan mskm skknds ks", expected: "" },
    { input: "aif it gan mskm skknds ks", expected: "aif it" },
    { input: "nmsmnmsdnsd nsnknsd", expected: "" },
    { input: "Hello World", expected: "Hello World" },
    { input: "John Doe (nmsmnmsdnsd)", expected: "John Doe ()" },
    { input: "Software Engineer skknds ks", expected: "Software Engineer" },
    { input: "Age < 30", expected: "Age < 30" }, // Ensure we don't over-sanitize
    { input: "<b>Bold</b> Text", expected: "Bold Text" },
];

console.log("Running Sanity Tests...");
let failed = 0;
testCases.forEach((tc, i) => {
    const result = sanitizeText(tc.input);
    if (result === tc.expected) {
        console.log(`✅ Test ${i + 1} passed`);
    } else {
        console.log(`❌ Test ${i + 1} failed: Expected "${tc.expected}", got "${result}"`);
        failed++;
    }
});

if (failed === 0) {
    console.log("\nAll tests passed! 🎉");
} else {
    console.log(`\n${failed} tests failed.`);
    process.exit(1);
}
