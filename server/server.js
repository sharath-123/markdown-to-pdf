const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const markdownIt = require('markdown-it');

const app = express();
const md = new markdownIt();

app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));

app.post('/api/convert', async(req,res) =>{
    const {markdown} = req.body;
    const htmlContent = `<html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1, h2, h3 { color: #333; }
                code { background-color: #f4f4f4; padding: 2px 4px; }
                pre { background-color: #f4f4f4; padding: 10px; overflow: auto; }
            </style>
        </head>
        <body>
            ${md.render(markdown)}
        </body>
    </html>
    `;

    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, {waitUntil: 'networkidle0'});
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=markdown.pdf',
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error Generating PDF');
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});