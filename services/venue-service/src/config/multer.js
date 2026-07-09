
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({

      destination(req,file,cb){
        cb(null,"uploads/venues");
      },

      filename(req,file,cb){
        const unique = Date.now() + crypto.randomUUID();

        cb(
             null,
             unique +
             path.extname(file.originalname)
        );
      }
})


 module.exports = multer({
     
    storage,

    limits : {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter(req,file,cb){
         if(

            file.mimetype==="image/jpeg" ||

            file.mimetype==="image/png"

        ){

            cb(null,true);

        } else {
             cb(

                new Error("Only JPG and PNG allowed")

            );
        }
    }
 })

 