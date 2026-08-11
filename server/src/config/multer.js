import multer from "multer";
 
// Memory storage: the file lives only as req.file.buffer for the duration
// of the request. We stream that buffer straight into GridFS in the
// controller, so nothing ever touches the local (ephemeral) disk.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      //   "text/plain",
    ];
 
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("❌Only PDFs are allowed"));
      return;
    }
 
    cb(null, true);
  },
});