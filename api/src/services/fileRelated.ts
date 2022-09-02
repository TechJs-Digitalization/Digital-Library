import { extname } from "path";

/**
 * 
 * @param newName : the new file name
 * @param oldFileName : the old file name, from where we gonna take the file etension
 * @returns the new file name with the correct extension
 */
export function getNewFileName(newName: string, oldFileName:string):string{
    return newName + extname(oldFileName);
}