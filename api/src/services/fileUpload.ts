import { Request, Response } from "express";
import formidable, { File, Files } from "formidable";
import { rename } from "fs/promises";
import { join } from "path";
import { rectifyFileName } from "./fileRelated";

async function upload(files:Files, uploadDir: string, commonFileName:string, fileInputName:string): Promise<string[]>{
    const fileNames:string[]= [];
    const picList= (('length' in files[fileInputName]) ? files[fileInputName] : [files[fileInputName]]) as File[];

    console.log('1', picList[0].filepath);
    if(!picList){
        throw new Error('No File to upload');
    } 

    let cpt=0;

    const promises: Promise<void>[]= [];

    for(let pic of picList){
        console.log('ato');
        const fileName= (fileInputName=='cover') ? rectifyFileName(commonFileName+'_cover') : rectifyFileName(commonFileName+'_'+cpt);
        fileNames.push(fileName);
        promises.push(rename(pic.filepath , join(uploadDir, fileName)));
    }

    await Promise.all(promises);
    
    return fileNames;
}

/**
 * 
 * @returns list of pictures name after upload
 */
async function uploadPictures(files:Files, uploadDir: string, commonFileName:string){
    return upload(files, uploadDir, commonFileName, 'pictures');
}

/**
 * 
 * @returns list of pictures name after upload
 */
async function uploadCover(files:Files, uploadDir: string, commonFileName:string){
    return upload(files, uploadDir, commonFileName, 'cover');

}

export {uploadPictures, uploadCover};