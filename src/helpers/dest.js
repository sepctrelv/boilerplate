const fs = require('fs');
const config = require('../../config');
const path = require('path');
const globParent = require('glob-parent');

module.exports.register = function (Handlebars) {
  Handlebars.registerHelper("dest", function(context, options) {
    let file;

    if(options.data.file) {
      file = options.data.file;
    } else {
      file = options.data.root.file;
    }

    let relative = path.relative(path.relative(file.cwd, path.dirname(file.path)), globParent(config.html.pages));
    return new Handlebars.SafeString(path.join(relative, context));
  });
};
