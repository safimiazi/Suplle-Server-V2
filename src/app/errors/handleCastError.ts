import { CastError } from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interfaces/error";

const handleCastError = (err: CastError): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  return {
    statusCode: 400,
    message: "Invalid value for " + err.path,
    errorSource,
  };
};
export default handleCastError;