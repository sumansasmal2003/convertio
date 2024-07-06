const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Route to fetch video information
app.post('/api/fetchInfo', async (req, res) => {
    const { url } = req.body;

    try {
        if (!url) {
            return res.status(400).json({ error: 'Missing YouTube video URL' });
        }

        const info = await ytdl.getInfo(url);

        res.json({ videoInfo: { title: info.videoDetails.title, thumbnail: info.videoDetails.thumbnails[0].url } });

    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).json({ error: 'Failed to fetch video information' });
    }
});

// Route to fetch audio information
app.post('/api/fetchAudioInfo', async (req, res) => {
    const { url } = req.body;

    try {
        if (!url) {
            return res.status(400).json({ error: 'Missing YouTube video URL' });
        }

        const info = await ytdl.getInfo(url);

        res.json({ audioInfo: { title: info.videoDetails.title, thumbnail: info.videoDetails.thumbnails[0].url } });

    } catch (error) {
        console.error('Error fetching audio info:', error);
        res.status(500).json({ error: 'Failed to fetch audio information' });
    }
});


// Route to download video
app.post('/api/download', async (req, res) => {
    const { url, quality } = req.body;

    try {
        if (!url) {
            return res.status(400).json({ error: 'Missing video URL' });
        }

        const videoStream = ytdl(url, { quality: quality || 'highest' });

        // Set headers for file download
        res.setHeader('Content-Disposition', 'attachment; filename="downloaded-video.mp4"');
        res.setHeader('Content-Type', 'video/mp4');

        videoStream.pipe(res);

    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).json({ error: 'Failed to download video' });
    }
});


// Route to download audio
app.post('/api/downloadAudio', async (req, res) => {
    const { url, audioInfo } = req.body;

    try {
        if (!url || !audioInfo) {
            return res.status(400).json({ error: 'Missing video URL or audio information' });
        }

        const audioTitle = audioInfo.title.replace(/[^a-zA-Z0-9]/g, '_');
        const audioStream = ytdl(url, { filter: 'audioonly' });

        res.setHeader('Content-Disposition', `attachment; filename="${audioTitle}.mp3"`);
        res.setHeader('Content-Type', 'audio/mpeg');

        audioStream.pipe(res);

    } catch (error) {
        console.error('Error downloading audio:', error);
        res.status(500).json({ error: 'Failed to download audio' });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
