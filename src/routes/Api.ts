import * as express from 'express';
import { NextFunction, Request, Response, Router } from "express";
const eventApi = require('../models/event');

class ApiRoute {
    public router: Router;

    constructor() {
        this.router = express.Router();

        this.router.use('/event', this.addGreeting, eventApi)
        this.router.get('/', this.getEmpty);
        this.router.get('/:params', this.getParams);
    }

    addGreeting(req: Request, res: Response, next: NextFunction) {
        console.log('Hello Erni');
        // Continues to process the next route
        next();
        // Responds request with 200 & the json inside of it
        // res.json({message: 'Middleware responds'});
        // You can also set the response code.
        //res.status(404).json({message: 'we returned 404'});
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
