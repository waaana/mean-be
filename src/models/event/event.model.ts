import * as mongoose from "mongoose";
import { Response, Request, NextFunction } from "express";


export type EventModel = mongoose.Document & {
    group: string;
    description: string;
    modified?: Date;
};

const EventSchema = new mongoose.Schema({
    group: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

EventSchema.index({ date: 1, group: 1 }, { unique: true });

// In case of errors remove this from function parameters
EventSchema.pre("save", function (this: EventModel, next: NextFunction) {
    this.modified = new Date();
    next();
});

EventSchema.post("save", function (error: any, doc: any, next: NextFunction) {
    if (error.code === 11000) {
        next('Event already present, please change your data');
    } else {
        next(error);
    }
});

const Event = mongoose.model("Event", EventSchema);
export default Event;