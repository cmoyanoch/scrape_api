import express from 'express';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import axios from 'axios';

const app = express();
const PORT = 3000;

// Activar modo "stealth"
puppeteer.use(StealthPlugin());

app.use(express.json());

app.post('/scrape', async (req, res) => {
    const { url, index } = req.body;

    if (!url || typeof index !== 'number') {
        return res.status(400).json({ error: 'Se requiere una URL y un índice numérico' });
    }

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
        );

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

        const imageUrls = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'));
            return images.map(img => img.src);
        });

        await browser.close();

        if (!imageUrls.length) {
            return res.status(404).json({ error: 'No se encontraron imágenes.' });
        }

        if (index < 0 || index >= imageUrls.length) {
            return res.status(400).json({ error: `Índice fuera de rango. Total disponibles: ${imageUrls.length}` });
        }

        const selectedUrl = imageUrls[index];

        // Descarga la imagen como binario
        const response = await axios.get(selectedUrl, { responseType: 'arraybuffer' });

        const contentType = response.headers['content-type'] || 'image/jpeg';
        res.set('Content-Type', contentType);
        res.send(response.data); // envía binario

    } catch (error) {
        return res.status(500).json({ error: 'Error al hacer scraping', detail: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
