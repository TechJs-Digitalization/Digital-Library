import { NextFunction, Request, Response } from 'express';
import formidable, { Options } from 'formidable';

export function formidableMiddleware(options: Options){
    return (req: Request, res: Response, next: NextFunction) => {
        const form= formidable(options);
        form.parse(req, (err, fields, files)=>{
            if (err) throw err;
            req.fields= fields;
            req.files= files;

            next();
        })
    }
}

/* export function deleteFileOnError(err: Error, req: Request, res: Response, next: NextFunction){
    for(let prop in req.files){
        const t= ('length' in req.files[prop]) ? req.files[prop] : [req.files[prop]];
    }
} */