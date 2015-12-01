var fs = require('fs-extra');
var mv = require('mv');
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
var targetDir = 'jibo-nlu-js';
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

fs.remove(cacheDir, function() {
    nugget(downloadUrl, opts, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        extract(path.join(cacheDir, target), {dir: cacheDir}, function (err) {
            if (err) {
                console.error(err);
                return;
            }

            fs.copySync(path.join(cacheDir, targetDir), path.join(cacheDir, 'jibo-parser'), {clobber: true});
            fs.copySync(path.join(cacheDir, 'jibo-parser'), path.join(__dirname, '..'), {clobber: true});
            fs.remove(cacheDir, function() {});
        });
    });
});

