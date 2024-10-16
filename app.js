import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/city', (req, res) => {
    const filePath = path.join(__dirname, 'vehicle_plates.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading data' });
        }
        const city = JSON.parse(data).map(entry => entry.city);
        res.json(city);
    });
});


app.get('/plates/:city', (req, res) => {
    const city = req.params.city;
    console.log(`Requested city: ${city}`);
    const filePath = path.join(__dirname, 'city/vehicle_plates.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading data' });
        }
        const plates = JSON.parse(data);
        console.log('File data:', plates);

        const entry = plates.find(item => item.city === city);
        if (entry) {
            res.json({ plate_no: entry.plate_no });
        } else {
            res.json({ plate_no: 'Không tìm thấy' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
