const http = require("http");

console.log("Running basic test...");

try {
  require("../app");
  console.log("✅ Test Passed");
  process.exit(0);
} catch (err) {
  console.log("❌ Test Failed");
  process.exit(1);
}