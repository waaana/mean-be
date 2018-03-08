console.log("ENVIRONMENT IS: ", process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = require('./webpack.prod')({ env: 'production' });
    break;
  case 'test':
  case 'testing':
    module.exports = require('./webpack.test')({ env: 'test' });
    break;
  case 'local':
  case 'dev':
  case 'development':
  default:
    module.exports = require('./webpack.dev');
}