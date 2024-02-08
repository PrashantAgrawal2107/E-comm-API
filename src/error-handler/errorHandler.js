import {errorLogger} from "../middlewares/logger.middleware.js";

export const errorHandlerMiddleware = (err) => {

          const error_to_log = `TimeStamp: ${new Date().toString()} error msg: ${err}`;
          errorLogger.error(error_to_log);
          
  };