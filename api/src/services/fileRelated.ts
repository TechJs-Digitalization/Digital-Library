import { extname } from "path";

/**
 * 
 * @param newName : the new file name
 * @param oldFileName : the old file name, from where we gonna take the file etension
 * @returns the new file name with the correct extension
 */
function replaceFileName(newName: string, oldFileName:string):string{
    return rectifyFileName(newName) + extname(oldFileName);
}

function rectifyFileName(fileName: string){
    return fileName.replace(/ /g, '_').replace(/[àâã]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[îìî]/g, 'i')
    .replace(/[ôõ]/g, 'o')
    .replace(/[ùüû]/g, 'u')
    .replace(/ÿ/g, 'y')
    .replace(/['\[\]|#+-\\&\-"\(\)\@=$¤£%*,;:/!^§]/g, '_');
}

export {replaceFileName};