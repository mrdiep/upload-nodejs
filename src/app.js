var express = require('express')
var multer = require('multer');
var fs = require('fs');
var unzip = require('unzip');
var path = require('path');
var moment = require('moment');

var app = express()
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, req.params.folder + '|' + moment(new Date()).format('YYYY.MM.DD|HH.mm.ss') + '.zip')
    }
})

var upload = multer({
    storage: storage
})
function unzipMiddelware(req, res, next) {
    var extractToPath = path.join(__dirname, '../uploads-extracted/' + req.params.folder);
    if (req.file.mimetype === 'application/zip') {
        fs.createReadStream(req.file.path).pipe(unzip.Extract({
            path: extractToPath
        }));
        next();

        return;
    }

    res.json({
        message: 'The file type is not the zip'
    })
}

function renameFileMiddlware(req, res, next) {
    var filePath = path.join(__dirname, '../', req.file.path);
    fs.renameSync(filePath, filePath + '-' + req.params.folder);
    next();
}

app.post('/deploy/:folder', upload.single('zipfile'), unzipMiddelware, function (req, res, next) {
    res.json({
        message: "success"
    });
})
app.get('/', function (req, res, next) {
    res.sendFile(path.join(__filename, '../client.html'));
})
app.listen(3000, () => console.log('App listening on port 3000!'))