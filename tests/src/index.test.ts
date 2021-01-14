var context = require.context('/tests/src/', true, /.ts$/);
context.keys().forEach(context);
module.exports = context;
