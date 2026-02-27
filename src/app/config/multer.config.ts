/* eslint-disable no-useless-escape */
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUplad } from "./cloudinary.config";


const storage = new CloudinaryStorage({
    cloudinary :cloudinaryUplad,
    params:async (req,file)=>{
        const originalName = file.originalname;
        const extension =originalName
        .split(".")
        .pop()
        ?.toLocaleLowerCase();

        const fileNameWithoutExtention = originalName
        .split(".")
        .slice(0,-1)
        .join(".")
        .toLowerCase()
        .replace(/\s+/g ,"-")
        .replace(/[^a-z0-9\-]/g,"");

        const uniqeName = 
        Math.random().toString(36).substring(2)+
        "-"+
        Date.now()+
        "-"+
        fileNameWithoutExtention;

        const folder =extension ==="pdf"?"pdfs":"images";

        return {
            folder:`trm-healthcare/${folder}`,
            public_id:uniqeName,
            resource_type:"auto"
        }
    }
})
export const multerUpload =storage