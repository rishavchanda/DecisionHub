import multer from 'multer';

const storagePath = "FILES_STORAGE/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storagePath, (error) => {
      if (error) console.error("Error in destination callback:", error);
    });
  },
  filename: function (req, file, cb) {
    cb(null, req.user + "-" + Date.now() + "-" + file.originalname, (error) => {
      if (error) console.error("Error in filename callback:", error);
    });
  },
});

const upload = multer({ storage: storage });
export const uploadMiddleware = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    next();
  }); 
};