const express = require('express');
const { Translate } = require('@google-cloud/translate').v2;
const textToSpeech = require('@google-cloud/text-to-speech');
const router = express.Router();
const path = require('path');

// Initialize Google Cloud Clients
// Note: Requires google-credentials.json in the server directory
const keyFilename = path.join(__dirname, 'google-credentials.json');
const projectId = 'pralicash-ai'; // Placeholder, standard Google logic will use the keyfile

let translateClient;
let ttsClient;

try {
    translateClient = new Translate({ keyFilename, projectId });
    ttsClient = new textToSpeech.TextToSpeechClient({ keyFilename });
    console.log("Google Cloud Linguistic Clients initialized.");
} catch (error) {
    console.warn("Google Cloud Credentials missing or invalid. Linguistic APIs will fail.");
}

// 1. Translation Endpoint
router.post('/translate', async (req, res) => {
    const { text, targetLang } = req.body;
    if (!translateClient) return res.status(500).json({ error: 'Translation API not configured.' });

    try {
        let [translations] = await translateClient.translate(text, targetLang);
        res.json({ translatedText: Array.isArray(translations) ? translations[0] : translations });
    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// 2. Text-to-Speech Endpoint
router.post('/tts', async (req, res) => {
    const { text, lang } = req.body;
    if (!ttsClient) return res.status(500).json({ error: 'TTS API not configured.' });

    // Map simple languages to Google's complex voice names
    const voiceMap = {
        hi: { languageCode: 'hi-IN', name: 'hi-IN-Neural2-A' },
        te: { languageCode: 'te-IN', name: 'te-IN-Standard-B' },
        pa: { languageCode: 'pa-IN', name: 'pa-IN-Standard-A' },
        ta: { languageCode: 'ta-IN', name: 'ta-IN-Standard-B' },
        mr: { languageCode: 'mr-IN', name: 'mr-IN-Standard-A' },
        gu: { languageCode: 'gu-IN', name: 'gu-IN-Standard-A' },
        bn: { languageCode: 'bn-IN', name: 'bn-IN-Standard-A' },
        kn: { languageCode: 'kn-IN', name: 'kn-IN-Standard-A' },
        ml: { languageCode: 'ml-IN', name: 'ml-IN-Standard-A' },
    };

    const request = {
        input: { text: text },
        voice: voiceMap[lang] || { languageCode: 'en-IN', name: 'en-IN-Neural2-A' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await ttsClient.synthesizeSpeech(request);
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': response.audioContent.length
        });
        res.send(response.audioContent);
    } catch (error) {
        console.error("TTS Error:", error);
        res.status(500).json({ error: 'TTS failed' });
    }
});

module.exports = router;
