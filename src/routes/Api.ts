import * as express from 'express';
import { NextFunction, Request, Response, Router } from "express";
const eventApi = require('../models/event');

class ApiRoute {
    public router: Router;

    constructor() {
        this.router = express.Router();

        this.router.use('/event', eventApi)
        this.router.get('/', this.getEmpty);
        this.router.get('/:params', this.getParams);
    }

    getEmpty(req: Request, res: Response, next: NextFunction) {
        res.send('API is working');
    }

    getParams(req: Request, res: Response, next: NextFunction) {
        var params = req.params;
        var query = req.query;
        Object.assign(params, query);
        res.json(params);
    }

}

module.exports = new ApiRoute().router;
