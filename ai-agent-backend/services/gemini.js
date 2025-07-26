const fs = require('fs');
const path = require('path');
const { fromPath } = require('pdf2pic');
require('dotenv').config();

const { VertexAI } = require('@google-cloud/aiplatform').preview;


// Set up Vertex AI with your project + region
const PROJECT_ID = 'veripact-ai-agent'; 
const LOCATION = 'us-central1';

const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
const multimodalModel = vertexAI.getGenerativeModel({
  model: 'gemini-pro-vision',
});

async function convertPdfToPng(pdfPath) {
  const outputDir = path.resolve(__dirname, "../uploads");
  const outputBaseName = path.basename(pdfPath, '.pdf');

  const converter = fromPath(pdfPath, {
    density: 200,
    saveFilename: outputBaseName,
    savePath: outputDir,
    format: "png",
    width: 1024,
    height: 1024,
  });

  const convertedPages = [];
  const pageCount = 1; // You can adjust this if you want multiple pages

  for (let i = 1; i <= pageCount; i++) {
    const result = await converter(i);
    convertedPages.push(result.path);
  }

  return convertedPages;
}

async function analyzeDocuments(files) {
  const imageParts = [];

  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.mimetype === 'application/pdf' || ext === '.pdf') {
      const imagePaths = await convertPdfToPng(file.path);
      for (const imgPath of imagePaths) {
        const imageBuffer = fs.readFileSync(imgPath);
        imageParts.push({
          inlineData: {
            mimeType: 'image/png',
            data: imageBuffer.toString('base64'),
          },
        });
      }
    } else {
      const imageBuffer = fs.readFileSync(path.resolve(file.path));
      imageParts.push({
        inlineData: {
          mimeType: file.mimetype,
          data: imageBuffer.toString('base64'),
        },
      });
    }
  }

  const req = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text:
              "You're a forensic AI assistant. Extract the transaction ID (Zelle/invoice number), amount, and date from these documents. Respond with JSON: { transactionId, amount, date }.",
          },
          ...imageParts,
        ],
      },
    ],
  };

  try {
    const result = await multimodalModel.generateContent(req);
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    console.log('Gemini raw response:', result);
    console.log('Extracted text:', text);
    const parsed = JSON.parse(text);
    return parsed;
  } catch (err) {
    console.error('Gemini Vision error:', err.message);
    throw err;
  }
}

module.exports = {
  analyzeDocuments,
};
