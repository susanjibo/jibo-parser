var fs = require('fs-extra');
var path = require('path');
var version = require('./package').version;
var nugget = require('nugget');
var homePath = require('home-path');
var extract = require('extract-zip');

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

    if (platform === 'win32') {
        // Windows needs special love as Atom is 32-bit only (as of 1.2.4) but electron can be 64-bit
        // see if there is an os-arch.json file in our parent directory with our platform defined
        var osArchFile = '../../os-arch.json';
        if (_fileExists(osArchFile)) {
            var contents = fs.readFileSync(osArchFile);
            var config = undefined;
            try {
                config = JSON.parse(contents);
                if (config && config.win32) {
                  // console.log(osArchFile + " and win32 exists (using " + config.win32 + ")");
                    return config.win32;
                }
            }
            catch (err) {
                //console.log(osArchFile + " is not JSON so using " + config.win32);
                return process.arch;
            }
        }
        else {
            //console.log(osArchFile + " DOES NOT exist (using " + process.arch + ")");
            return process.arch;
        }
    } else if (platform === 'linux') {
        // Linux atom supports only 64 bits (as of 1.2.4)
        return 'x64';
    } else if (platform === 'darwin') {
        // darwin macos comes only in x64 flavor
        return 'x64';
    }

    //console.log("Fall back to " + process.arch);
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

