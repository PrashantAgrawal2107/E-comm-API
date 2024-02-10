
// 1. Import multer.
import multer from 'multer';

// 2. Configure storage with filename and location.
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads/');
    },
    filename:(req, file, cb)=>{
        // cb(null, new Date().toISOString() + file.originalname);
        const updatedFile = Date.now() + file.originalname
        // cb(null, new Date().toISOString() + file.originalname);
        cb(null,updatedFile);
    },
    // limits: {
    //     fileSize: 1000000,
    //   }
});

export const upload = multer({
    storage: storage,
});
