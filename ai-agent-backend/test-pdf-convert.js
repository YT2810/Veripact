const path = require("path");
const { fromPath } = require("pdf2pic");

async function convertPdfToPng(pdfPath) {
  const outputDir = path.resolve(__dirname, "./uploads");
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
  const pageCount = 1; // adjust if needed

  for (let i = 1; i <= pageCount; i++) {
    const result = await converter(i);
    convertedPages.push(result.path);
  }

  return convertedPages;
}

const runTest = async () => {
  const pdfPath = path.resolve(__dirname, "uploads/invoice_2.pdf"); // <-- Replace with your actual test file
  try {
    const pngPaths = await convertPdfToPng(pdfPath);
    console.log("Converted pages:", pngPaths);
  } catch (err) {
    console.error("Conversion failed:", err);
  }
};

runTest();
