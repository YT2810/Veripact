const { VertexAI } = require('@google-cloud/aiplatform').preview;

if (VertexAI) {
  console.log("✅ VertexAI (preview) is available");
} else {
  console.log("❌ VertexAI not found in preview namespace");
}
