import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET 
});
//gives loacl path and from local path i will upload it on server
//after successful uploaded will remove it from loacl storage

const uploadOnCloudiary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload the file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

    // file haas been uploaded successfully
    console.log("Successfully uploaded on Cloudinary!!", response.url)
    fs.unlinkSync(localFilePath)
    return response
    }
    catch(error)
    {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export default uploadOnCloudiary;