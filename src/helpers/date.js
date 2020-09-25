const date = require('helper-dateformat');

module.exports.register = function (Handlebars) {
  Handlebars.registerHelper("date", date);
};
