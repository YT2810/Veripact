require('dotenv').config();

const { PredictionServiceClient } = require('@google-cloud/aiplatform').v1;

const PROJECT_ID = 'veripact-ai-agent';
const LOCATION = 'us-central1';
const MODEL_NAME = 'gemini-pro';

async function main() {
  const client = new PredictionServiceClient();

  const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL_NAME}`;

  const request = {
    endpoint,
    instances: [{ prompt: 'Say hello in a funny way.' }],
    parameters: { temperature: 0.7 },
  };

  const [response] = await client.predict(request);
  console.log('Gemini says:\n', JSON.stringify(response.predictions[0], null, 2));
}

main().catch(console.error);
