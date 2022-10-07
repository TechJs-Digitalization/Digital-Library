import { NextFunction, Request, Response } from 'express';
import formidable, { Options } from 'formidable';
import { deleteFile } from '../services/fileUpload';

export function formidableParse(options: Options) {
    return (req: Request, res: Response, next: NextFunction) => {
        const form = formidable(options);
        form.parse(req, (err, fields, files) => {
            if (err) throw err;
            req.fields= {};
            req.files= {};

            for(let prop in files)
                req.files[prop] = [files[prop]].flat();
            for( let prop in fields)
                if(Array.isArray(fields[prop])) req.fields[prop]= fields[prop][0];
                else req.fields[prop]= fields[prop].toString();

            next();
        })
    }
}

export async function deleteFileOnError(err: Error, req: Request, res: Response, next: NextFunction) {
    const filepathList= [];
    for (let prop in req.files) {
        filepathList.push(...req.files[prop].map(file=>file.filepath))    
    }
    try {
        await deleteFile(...filepathList);
    } catch (error) {
        if(error instanceof Error)
            console.log('Something bad happened while trying to delete files');
    }
}