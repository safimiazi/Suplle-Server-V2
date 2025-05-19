  import fs from "fs";
  import path from "path";
  import { Request, Response, NextFunction } from "express";

  interface ImageUpdateOptions {
    model: any;
    imageField: string;
    folderPath: string;
  }

  export const handleImageUpdate = ({
    model,
    imageField,
    folderPath,
  }: ImageUpdateOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
      
        const document = await model.findById(id);
        if (!document) {
          throw new Error("Document not found");
        }

        if (!document.isActive) {
          throw new Error("Document is not active");
        }
        if (document.isDelete) {
          throw new Error("Document is deleted");
        }

        const newImage = req.body[imageField];
        const oldImage = document[imageField];

        // If there's a new image
        if (newImage) {
          const newImageName = path.basename(newImage);
          const newImagePath = path.join(
            __dirname,
            `../../../${folderPath}`,
            newImageName
          );

          // Check if old image exists and is different
          if (oldImage && oldImage !== newImage) {
            const oldImageName = path.basename(oldImage);
            const oldImagePath = path.join(
              __dirname,
              `../../../${folderPath}`,
              oldImageName
            );

            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath); // Delete old image
            }
          }

          // If image exists but was uploaded by mistake (not saved to DB), delete it
          if (!oldImage && fs.existsSync(newImagePath)) {
            // Allow the image to be saved now
            req.body[imageField] = newImage.replace(/\\/g, "/");
          }

          // If new file doesn't exist for some reason, null it to avoid broken refs
          if (!fs.existsSync(newImagePath)) {
            req.body[imageField] = null;
          }
        } else {
          // No new image provided — optionally clean up old image?
          req.body[imageField] = oldImage || null;
        }
    
        next();
      } catch (error) {
        next(error);
      }
    };
  };
