import { File } from "formidable";
import { rename } from "fs/promises";
import { extname, join, basename } from "path";

function rectifyFileName(fileName: string){
    fileName= fileName.replace(/ /g, '_').replace(/[àâã]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[îìî]/g, 'i')
    .replace(/[ôõ]/g, 'o')
    .replace(/[ùüû]/g, 'u')
    .replace(/ÿ/g, 'y')
    .replace(/\W/g, '_');
    return encodeURIComponent(fileName);
}

async function renamePic(files:File | File[], uploadDir: string, commonFileName:string, cover:boolean=false): Promise<string[]>{
    const fileNames:string[]= [];

    if(files){
        const picList= ('length' in files) ? files : [files];

        let cpt=0;

        const promises: Promise<void>[]= [];

        for(let pic of picList){
            const fileName= ((cover) ? rectifyFileName(commonFileName+'_cover') : rectifyFileName(commonFileName+'_'+cpt)) + extname(pic.filepath);

            fileNames.push(fileName);
            promises.push(rename(pic.filepath , join(uploadDir, fileName)));
    
        }

        await Promise.all(promises);

        return fileNames;
    }
    else throw new Error('No image file to upload');   
}

/**
 * 
 * @returns list of pictures name after upload
 */
async function renamePictures(files:File | File[], uploadDir: string, commonFileName:string){
    return renamePic(files, uploadDir, commonFileName, false);
}

/**
 * 
 * @returns list of pictures name after upload
 */
async function renameCover(files:File | File[], uploadDir: string, commonFileName:string){
    return renamePic(files, uploadDir, commonFileName, true);

}

function getBasenames(...files: File[]) : string[]{
    return files.map(f=> basename(f.filepath));
}

export {renamePictures, renameCover, getBasenames};