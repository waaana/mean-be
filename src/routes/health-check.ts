import * as express from 'express';
import { NextFunction, Request, Response, Router } from "express";
const eventApi = require('../models/event');

class ApiRoute {
    public router: Router;

    constructor() {
        this.router = express.Router();

        this.router.get('/', this.getEmpty);
    }

    getEmpty(req: Request, res: Response, next: NextFunction) {
        res.send('Healtcheck - up');
    }

}

module.exports = new ApiRoute().router;
