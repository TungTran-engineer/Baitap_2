import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Định nghĩa __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware phục vụ file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Route lấy danh sách tỉnh thành từ file JSON
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

// Route lấy biển số theo tỉnh thành
app.get('/plates/:city', (req, res) => {
    const city = req.params.city;
    console.log(`Requested city: ${city}`); // Debug: log requested city
    const filePath = path.join(__dirname, 'city/vehicle_plates.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err); // Debug: log file reading error
            return res.status(500).json({ error: 'Error reading data' });
        }
        const plates = JSON.parse(data);
        console.log('File data:', plates); // Debug: log data from JSON file

        const entry = plates.find(item => item.city === city);
        if (entry) {
            res.json({ plate_no: entry.plate_no });
        } else {
            res.json({ plate_no: 'Không tìm thấy' });
        }
    });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
