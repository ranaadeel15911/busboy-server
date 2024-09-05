const express = require('express');
const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join('/tmp', 'uploads'); // In serverless functions, use the /tmp directory
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve the upload form
app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.end();
});

// Handle file upload
app.post('/fileupload', function (req, res) {
    const busboy = Busboy({ headers: req.headers });

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        const saveTo = path.join(uploadsDir, filename);
        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', function () {
        res.writeHead(200, { 'Connection': 'close' });
        res.end("That's all folks!");
    });

    req.pipe(busboy);
});

// Get all image names from the 'uploads' directory
app.get('/images', function (req, res) {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }

        // Filter only image files (optional, based on extensions)
        const imageFiles = files.filter(file => {
            return file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.gif');
        });

        res.json(imageFiles);
    });
});

// Export the app as a module for Vercel serverless
module.exports = app;
