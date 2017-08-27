var fs = require('fs');

exports.formatFileStubName = function (image) {
  var name = image.name.toLowerCase();
  var stub = name.replace(/\s+/g, '-');
  image.fileStub = stub;
  return image;
};

exports.renderFile = function (image, file, rootPath, cb) {
  var path = file.path;
  var fileStub = image.fileStub;
  var galleryPath = rootPath + '/img/gallery';
  var mediumPath = galleryPath + '/medium';
  var thumbNailPath = galleryPath + '/medium';
  fs.readFile(path, function(err, fileData) {
    if(err) return cb(err);
    fw.writeFile(mediumPath + '/' + fileStub + '.jpg', fileData, function(err) {
      if(err) return cb(err);
      cb(null);
    })
  })
};


