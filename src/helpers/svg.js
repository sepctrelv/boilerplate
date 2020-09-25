const fs = require('fs');
const config = require('../../config');
const path = require('path');

module.exports.register = function (Handlebars) {
  Handlebars.registerHelper("svg", function(svg, options) {
    let filepath = path.join(config.svgs.build, `${svg}.svg`);
    let result = fs.readFileSync(filepath, 'utf8');
    return new Handlebars.SafeString(result);
  });
};
