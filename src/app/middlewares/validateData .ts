import { AnyZodObject } from "zod";

export const validateData = async <T>(schema: AnyZodObject, data: unknown): Promise<T> => {
  return schema.parseAsync(data) as Promise<T>; 
};