var http = require('http'),
    express = require('express'),
    Busboy = require('busboy'),
    path = require('path'),
    fs = require('fs');

var app = express();

// Ensure uploads directory exists
var uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve the upload form
app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
})

// Handle file upload
app.post('/fileupload', function (req, res) {
    var busboy = Busboy({ headers: req.headers });
    
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        var saveTo = path.join(__dirname, 'uploads', filename);
        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', function () {
        res.writeHead(200, { 'Connection': 'close' });
        res.end("That's all folks!");
    });

    return req.pipe(busboy);
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

        res.send(imageFiles);
    });
});

// Port 3000
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
