var http = require('http'),
express = require('express'),
Busboy = require('busboy'),
path = require('path'),
fs = require('fs');

var app = express();

app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
})

app.post('/fileupload', function (req, res) {
    var busboy = Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

      var saveTo = path.join(__dirname, 'uploads', filename);
            file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });

    return req.pipe(busboy);
});
const PORT ="https://busboy-server-one.vercel.app/"
// port must be set to 3000 because incoming http requests are routed from port 80 to port 8080
app.listen(PORT, function () {
    console.log(`Node app is running on port 3000 ${PORT}`);
});