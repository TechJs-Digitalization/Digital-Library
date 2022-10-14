import { NextFunction, Request, Response } from "express";
import { FindManyOptions, Not } from "typeorm";
import BookCategoryController from "../controllers/bookCategory.controller";
import { BookCategory } from "../entity/BookCategory";

export async function verify(req: Request, res: Response, next: NextFunction){
    const {id}= req.params;

    let findOptions: FindManyOptions<BookCategory>= {
        select: ['name'],
        where: {
            name: req.body.name,
        }
    }

    if(id!=undefined && Number(id)>0)
        findOptions.where= {...findOptions.where, id: Not(Number(id))};
    else
        return res.status(400).json({err: true, msg: 'invalid category ID'})


    const category= await BookCategoryController.repository.find(findOptions)
    
    if(category.length>0)
        return res.status(401).json({err: true, msg: 'this name is already used by another category'})
    
    next();
}