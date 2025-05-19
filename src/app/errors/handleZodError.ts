import { ZodError } from "zod";
import { TErrorSource, TGenericErrorResponse } from "../interfaces/error";

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = error.issues.map((issue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation error",
    errorSource,
  };
};

export default handleZodError;