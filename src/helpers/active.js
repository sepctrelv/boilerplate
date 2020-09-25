const fs = require('fs');
const config = require('../../config');
const path = require('path');
const globParent = require('glob-parent');

module.exports.register = function (Handlebars) {
  Handlebars.registerHelper("active", function(url, options) {
    let file;

    if(options.data.file) {
      file = options.data.file;
    } else {
      file = options.data.root.file;
    }

    let current = path.relative(globParent(config.html.pages), path.relative(file.cwd, file.path));

    if ((current != null ? current.indexOf(url) : void 0) === 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
};
