import * as mongoose from 'mongoose';
// import * as mocks from './mocks';
import * as dotenv from "dotenv";

import { ConnectionBase } from "mongoose";
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: ".env" });
} else if (process.env.NODE_ENV === "dev") {
    dotenv.config({ path: ".env-dev" });
} else {
    dotenv.config({ path: ".env-local" });
}
(<any>mongoose).Promise = global.Promise;

let mongoOptions: any = {
    keepAlive: true,
    reconnectTries: 5,
    // useMongoClient: true,
}
mongoose.connect(process.env.MONGO_URL, mongoOptions).then(function () {
    /* if (env == 'development') {
      mongoose.connection.db.dropDatabase().then(function() {
        mocks.generateAuthorAndPosts(3);
        mocks.generateAuthorAndPosts(3);
        mocks.generateAuthorAndPosts(3);
        mocks.generateAdmin()
      });
    } */
}, function (error) {
    console.error('failed to connect to MongoDB...', error);
});

export const mongooseConnection: ConnectionBase = mongoose.connection;