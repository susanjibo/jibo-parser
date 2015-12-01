var mv = require('mv');
var fs = require('fs');
var path = require('path');
var version = require('./package').version;
var nugget = require('nugget');
var homePath = require('home-path');
var mkdir = require('mkdirp');
var pathExists = require('path-exists');
var extract = require('extract-zip');

var libs = path.resolve(__dirname, 'deps', process.platform, 'lib');

var downloadUrl = 'http://repository.jibo.com/sdk/jibo-nlu-js/';
var target = 'jibo-nlu-js-v' + version + '-' + process.platform + '.zip';
downloadUrl += target;

var cacheDir = path.join(homePath(), '.jibo', 'tmp');
var exists = pathExists.sync(cacheDir);
if(!exists) {
    mkdir.sync(cacheDir);
}

var opts = {
    target: target,
    dir: cacheDir,
    verbose: true,
    strictSSL: true,
    resume: true
};

console.log(downloadUrl);

nugget(downloadUrl, opts, function(err) {
    if(err) {
        console.error(err);
        return;
    }
    extract(path.join(cacheDir, target), {dir: cacheDir}, function (err) {
        if(err) {
            console.error(err);
            return;
        }
        mv(path.join(cacheDir, targetDir), path.join(cacheDir, 'jibo-parser'), {mkdirp: true}, function(err) {
            if(err) {
                console.log(err);
                return;
            }
            mv(path.join(cacheDir, 'jibo-parser'), path.join(__dirname, '..'), {mkdirp: true}, function(err) {
                if(err) {
                    console.log(err);
                }
            });
        });

    });
});