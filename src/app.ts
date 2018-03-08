import * as express from 'express';
// import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as logger from "morgan";
import * as path from 'path';
import * as mongo from 'connect-mongo';
import * as mongoose from 'mongoose';

import { Request, Response, Application } from 'express';
import { SessionOptions } from 'express-session';

const env: string = process.env.NODE_ENV || 'local';
const secret: string = process.env.cookieSecret || 'dmc_secret';

const cookieParser = require('cookie-parser');

var request = require('request-promise');

var favicon = require('serve-favicon');

var api = require('./routes/api');
var health = require('./routes/health-check');

const isProduction = env === 'production';
const isLocal = env === 'local';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.enableLogging();
    this.setupParsing();
    this.setupCookies(isProduction);
    this.enableStaticFiles();
    this.mountRoutes();
  }

  private enableLogging(): void {
    this.app.use(logger('dev'));
  }

  private setupParsing(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private setupCookies(inProdMode: boolean): void {
    this.app.use(cookieParser(process.env.cookieSecret));
    // ADd more cookie handling from page 309
  }

  private enableStaticFiles(): void {
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  private mountRoutes(): void {
    this.app.use('/health', health);
    this.app.use('/api', api);
    this.app.use(function (req: Request, res: Response) {
      var error: Error = new Error('Not Found');
      res.status(404).json({
        status: 404,
        message: error.message,
        name: error.name
      });
    });
  }
}

export default new App().app;