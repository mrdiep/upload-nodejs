var request = require('request');
var fs = require('fs');

var zipFolder = require('zip-folder');
var path = require('path');
zipFolder(path.join(__dirname, '../test-folder'), path.join(__dirname, '../test-folder/deploy.zip'), function(err) {
    if(err) {
        console.log('oh no!', err);
    } else {
        request({
            method: 'POST',
            uri: 'http://localhost:3000/deploy/front-end',
            formData: {
                zipfile: fs.createReadStream(path.join(__dirname, '../test-folder/deploy.zip'))
            }
        });
    }
});
