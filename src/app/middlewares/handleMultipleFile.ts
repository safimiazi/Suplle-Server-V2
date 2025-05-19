import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

interface handleMultipleFileOptions {
  model: any;
  fileField: string; // This should be the array field like "Files"
  folderPath: string;
}

export const handleMultipleFile = ({
  model,
  fileField,
  folderPath,
}: handleMultipleFileOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const document = await model.findById(id);

      if (!document) throw new Error("Document not found");
      if (!document.isActive) throw new Error("Document is not active");
      if (document.isDelete) throw new Error("Document is deleted");

      const newFiles: string[] = req.body[fileField] || [];
      const oldFiles: string[] = document[fileField] || [];

      const normalizedNewFiles = Array.isArray(newFiles)
        ? newFiles.map((img) => img.replace(/\\/g, "/"))
        : [];

      // Delete Files from old list that are no longer in new list
      for (const oldFile of oldFiles) {
        if (!normalizedNewFiles.includes(oldFile)) {
          const oldFileName = path.basename(oldFile);
          const oldFilePath = path.join(
            __dirname,
            `../../../${folderPath}`,
            oldFileName
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }

      // Validate new Files exist, else remove invalid ones
      const validatedFiles = normalizedNewFiles.filter((filePath) => {
        const FileName = path.basename(filePath);
        const fullPath = path.join(
          __dirname,
          `../../../${folderPath}`,
          FileName
        );
        return fs.existsSync(fullPath);
      });

      req.body[fileField] = validatedFiles;

      next();
    } catch (error) {
      next(error);
    }
  };
};
