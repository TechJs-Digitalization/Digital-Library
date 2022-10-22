import { NextFunction, Request, Response } from "express";

//for book: [''createdAt', 'title']
export default function normalizeQuery(sortAccept: string[]){
    return function(req: Request, res: Response, next: NextFunction){
        let { page, perPage, sortBy, order } = req.query;
    
        if(!page || parseInt(page as string)<1) req.query.page= '1';
        if(!perPage || parseInt(perPage as string)<1) req.query.perPage= '10';
        if(!sortBy) req.query.sortBy = sortAccept[0];

        if(
            Number.isNaN(parseInt(req.query.page as string)) || Number.isNaN(parseInt(req.query.perPage as string))
            || !sortAccept.includes(req.query.sortBy as string)
        )
            return res.status(400).json({err: true, msg: 'Invalid query request'});

        if(order!='ASC' && order!='DESC'){
            //keys ending with 'At': createdAt, updatedAt,....
            if(/\wAt$/.test(req.query.sortBy as string))
                req.query.order= 'DESC'
            else 
                req.query.order= 'ASC'
        }

        next();
    }
}