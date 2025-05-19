/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from "multer";
import fs from "fs";
import path from "path";

interface getMulterProps {
  upload_file_destination_path: any;
  regex: any;
  images: any;
}

export const getMuler = ({
  upload_file_destination_path,
  regex,
  images,
}: getMulterProps) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(upload_file_destination_path)) {
        fs.mkdirSync(upload_file_destination_path, { recursive: true });
      }
      cb(null, upload_file_destination_path);
    },
    filename: function (req, file, cb) {
      const extention = path.extname(file?.originalname);
      const file_name =
        file?.originalname
          .replace(extention, "")
          .toLowerCase()
          .replace(/[^a-z0-9]/gi, "-") // replace everything not a-z, A-Z, 0-9 with "-"
          .replace(/-+/g, "-") // collapse multiple dashes
          .replace(/^-|-$/g, "") // remove leading/trailing dashes

          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, file_name + extention);
    },
  });

  // File filter function (old version just for images)
  // const fileFilter = (
  //   regex: any,
  //   images: any,
  //   file: Express.Multer.File,
  //   cb: any
  // ) => {
  //   const mimeRegex = /^image\/(jpg|jpeg|png|gif)$/;

  //   const extName = regex.test(path.extname(file?.originalname).toLowerCase());
  //   const mimeType = mimeRegex.test(file?.mimetype);
  //   if (mimeType && extName) {
  //     return cb(null, true); // Accept the file
  //   } else {
  //     return cb(

  //       new Error(`You can only upload images of type: ${images}.`),
  //       false
  //     ); // Reject the file
  //   }
  // };

  // File filter function (new version for all types like image or video file)
  const fileFilter = (
    regex: RegExp,
    images: string,
    file: Express.Multer.File,
    cb: any
  ) => {
    const extName = regex.test(path.extname(file.originalname).toLowerCase());
    const acceptedMimeTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      // Videos
      "video/mp4",
      "video/mpeg",
      "video/webm",
      "video/ogg",
      "video/quicktime", // .mov
    ];

    const mimeType = acceptedMimeTypes.includes(file.mimetype.toLowerCase());

    if (mimeType && extName) {
      return cb(null, true); // Accept file
    } else {
      return cb(new Error(`Only files of type: ${images} are allowed.`), false);
    }
  };

  return multer({
    storage: storage,
    // limits: {
    //   fileSize: 10000000 * 3,
    // },
    fileFilter: (req, file, cb) => fileFilter(regex, images, file, cb),
  });
};
