const express = require('express');
const multer = require('multer');
const path = require('path');
const geminiService = require('../services/gemini');
const { createHashFromText } = require('../utils/hash');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.array('documents'), async (req, res) => {
  try {
    const files = req.files;

    // Optional: validate file types / size
    const extractedData = await geminiService.analyzeDocuments(files);
    const uniqueHash = createHashFromText(extractedData.transactionId);

    res.json({
      success: true,
      data: extractedData,
      hash: uniqueHash,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'AI analysis failed' });
  }
});

module.exports = router;

