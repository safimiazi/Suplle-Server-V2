/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

interface IProcessImage {
    fieldName: string;
}

export const processImage = ({fieldName} : IProcessImage) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
        const body: any = {
            ...req.body,
            [fieldName]:
            files && files[fieldName] && files[fieldName].length > 0
                ? files[fieldName][0].path
                : null,
        };
    
        req.body = body;
    
        next();
        } catch (error) {
        const errorMessage =
            error instanceof Error
            ? error.message
            : "Something went wrong from the route.";
        res.status(400).json({ error: errorMessage });
        }
    };
}

