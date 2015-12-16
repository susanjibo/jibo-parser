var nlu = module.require('../build/Release/jsjibonlu');
var path = require('path');
var dataDirectory = path.join(__dirname, 'deps', 'data');
nlu.set_data_dir(dataDirectory);
module.exports = nlu;