var fs = require('fs-extra');
//var mv = require('mv');
var path = require('path');
var version = require('./package').version;
var nugget = require('nugget');
var homePath = require('home-path');
//var mkdir = require('mkdirp');
//var pathExists = require('path-exists');
var extract = require('extract-zip');

//var libs = path.resolve(__dirname, 'deps', process.platform, process.arch,'lib');

var downloadUrl = require('./download').url;
var platform = process.platform;
var arch = _getArch();

function _fileExists(filePath)
{
    try {
        return fs.statSync(filePath).isFile();
    }
    catch (err) {
        return false;
    }
}

function _getArch() {
    // see if there is an os-arch.json file in our parent directory with our platform defined
    if (platform === 'win32') {

        var osArchFile = '../../os-config.json';

        if (_fileExists(osArchFile)) {
            var contents = fs.readFileSync(osArchFile);
            var config = undefined;
            try {
                config = JSON.parse(contents);
                if (config && config.win32) {
                    console.log(osArchFile + " and win32 exists (using " + config.win32 + ")");
                    return config.win32;
                }
            }
            catch (err) {
                console.log(osArchFile + " is not JSON so using " + config.win32);
                return process.arch;
            }
        }
        else {
            console.log(osArchFile + " DOES NOT exist (using " + process.arch + ")");
            return process.arch;
        }
    } else if (platform === 'linux') {
        // Linux atom supports only 64 bits (as of 1.2.4)
        return 'x64';
    } else if (platform === 'darwin') {
        // darwin macos comes only in x64 flavor
        return 'x64';
    }

    console.log("Fall back to " + process.arch);
    return process.arch;
}

var target = 'jibo-nlu-js-v' + version + '-' + platform + '-' + arch + '.zip';
var targetDir = 'jibo-nlu-js';
downloadUrl += target;

var cacheDir = path.join(homePath(), '.jibo', 'tmp');

var opts = {
    target: target,
    dir: cacheDir,
    verbose: true,
    strictSSL: true,
    resume: true
};


fs.remove(cacheDir, function() {
    fs.mkdirsSync(cacheDir);
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
            fs.copySync(path.join(cacheDir, targetDir), __dirname, {clobber: true});
            fs.remove(cacheDir, function() {});
        });
    });
});

