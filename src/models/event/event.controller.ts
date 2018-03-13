import { default as EventModel } from "./event.model";
import { respondSuccess, handleError, allowedEventFields } from "../../utils";
import { IEventSchema, IFindOption } from "../../interfaces";
import { Response, Request, NextFunction } from "express";
const EventController: any = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventData } = req.body;
            const findOptions: IFindOption = {
                group: eventData.group
            };
            const oldEvent = await EventModel.findOne(findOptions);
            if (!oldEvent) {
                const newEvent = new EventModel(eventData);
                if (await EventModel.create(newEvent)) {
                    const event = await EventModel.findOne(findOptions, allowedEventFields);
                    return respondSuccess(res, [])(event);
                }
                throw "Problem with creating event";
            } 
            throw "Event already created";
        } catch (err) {
            return handleError(res)(err);
        }
    },

    get: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findOptions: IFindOption = {
                _id: req.params.id
            };
            const event = await EventModel.findOne(findOptions, allowedEventFields);
            if (event) {
                return respondSuccess(res, [])(event);
            }
            throw "Unable to find event";
        } catch (err) {
            return handleError(res)(err);
        }
    },

    queryPaginated: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const eventResponse = await EventController.queryDataPaginated(req.body);
            return respondSuccess(res, [])(eventResponse);
        } catch (err) {
            return handleError(res)(err);
        }
    },

    update: async function (req: Request, res: Response, next: NextFunction) {
        try {
            const { eventData } = req.body;
            const findOptions: IFindOption = {
                group: eventData.group
            }
            if (await EventModel.findOne(findOptions)) {
                if (await EventModel.findOneAndUpdate(findOptions, eventData, { upsert: true })) {
                    const event = await EventModel.findOne(findOptions, allowedEventFields);
                    return respondSuccess(res, [])(event);
                }
                throw "Problem with updating event";
            }
            throw "Event not found";
        } catch (err) {
            return handleError(res)(err);
        }
    },

    delete: async function (req: Request, res: Response, next: NextFunction) {
        try {
            const { paginated, eventData} = req.body;
            let group = eventData.group;
            const findOptions: IFindOption = {
                group
            };
            if (await EventModel.findOne(findOptions)) {
                if (!await EventModel.findOneAndRemove(findOptions)) {
                    const eventResponse = await EventController.queryDataPaginated(paginated);
                    return respondSuccess(res, [])(eventResponse);
                }
                throw "Problem with deleting event";
            }
            throw "You are not allowed to delete this entry";
        } catch (err) {
            return handleError(res)(err);
        }
    },

    queryDataPaginated: async (filterInfo: any, reqUser: string, isAdmin: boolean) => {
        try {
            let { filter, pageSize, pageIndex, sort, queryIndex } = filterInfo;
            if (!filter) {
                filter = {};
            }
            pageSize = pageSize | 10;
            pageIndex = pageIndex | 0;
            sort = sort | <any>{ way: '', field: 'date' };
            const mongoFilter: any = {};
            let counter = 10;
            for (const property in filter) {
                const propValue = filter[property];
                if (counter-- < 0) {
                    throw "Too many properties";
                } else if (propValue === undefined) {
                    continue;
                } else if (typeof (propValue) === "number") {
                    mongoFilter[property] = propValue;
                } else if (typeof (propValue) === "string") {
                    mongoFilter[property] = `/.*${propValue}*/i`;
                }
            };
            const list = await EventModel.find(mongoFilter, allowedEventFields)
                .skip(pageSize * pageIndex)
                .limit(pageSize)
                .sort(sort.way + sort.field)
                .exec();
            const length = await EventModel.count(mongoFilter);
            return {
                list,
                length,
                queryIndex
            };
        } catch (err) {
            throw err;
        }
    }

};

module.exports = EventController;