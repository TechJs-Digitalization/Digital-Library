import { NextFunction, Request, Response } from "express";
import { AuthorController } from "../controllers/author.controller";
import BookController from "../controllers/book.controller";
import { BookCategoryController } from "../controllers/bookCategory.controller";

export async function verify(req: Request, res: Response, next: NextFunction) {
    if(!('title' in req.fields) || !req.fields.title[0]){
        res.status(400).json({err: true, msg: 'Title field cannot be null'})
        return next(new Error())

    }

    if(!('synopsis' in req.fields) || !req.fields.synopsis[0]){
        res.status(400).json({err: true, msg: 'Synopsis field cannot be null'})
        return next(new Error());
    }
    //verify if the category exist
    if(('category' in req.fields) && req.fields.category[0] && Number.isInteger(Number(req.fields.category[0]))){
        const categoryExist= await BookCategoryController.verifyCategoryExist(Number(req.fields.category[0]));
        if(!categoryExist){
            res.status(404).json({err: true, msg: 'The precised category not found'})
            return next(new Error())
        };
    }
    else {
        res.status(404).json({err: true, msg: 'The precised category not found'});
        return next(new Error())
    }

    //verify if the author exist
    if(('author' in req.fields) && req.fields.author[0] && Number.isInteger(Number(req.fields.category[0]))){
        const authorExist= await AuthorController.verifyAuthorExist(Number(req.fields.author[0]));
        if(!authorExist){
            res.status(404).json({err: true, msg: 'The precised author not found'})
            return next(new Error())
        }
    }
    else{
        res.status(404).json({err: true, msg: 'The precised author not found'})
        return next(new Error())
    }

    //verify if the available number is a cor
    if(!('available' in req.fields) || !req.fields.available[0]){
        res.status(404).json({err: true, msg: 'Available filed null'})
        return next(new Error())
    }
    const availableNumber = Number(req.fields.available[0]);
    if (!Number.isInteger(availableNumber) || availableNumber < 0){
        res.status(404).json({err: true, msg: 'Invalid available number'})
        return next(new Error())
    }

    const bookAlreadyExist = await BookController.verifyIfExistByAuthor(req.fields.title[0], Number(req.fields.author[0]));
    if (bookAlreadyExist){
        res.status(404).json({err: true, msg: 'This book written by the concerned author already exists'})
        return next(new Error())
    }

    next();
}

// export async function updateVerification(req: request, res: Response, next: NextFunction){

// }