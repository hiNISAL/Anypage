const fs = require('fs');

module.exports.deleteFolder = function deleteFolder(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports.streamSync = (file, path) => {
  const reader = fs.createReadStream(file);
  const writer = fs.createWriteStream(path);

  return new Promise((resolve, reject) => {
    reader.pipe(writer)
    .on('close', function() {
      resolve();
    })
    .on('error', reject);
  })
}
