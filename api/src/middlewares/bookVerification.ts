import { NextFunction, Request, Response } from "express";
import { AuthorController } from "../controllers/author.controller";
import BookController from "../controllers/book.controller";
import { BookCategoryController } from "../controllers/bookCategory.controller";

export async function verify(req: Request, response: Response, next: NextFunction) {
    if(!('title' in req.fields) || !req.fields.title[0])
        return next(new Error('Title field cannot be null'))

    if(!('synopsis' in req.fields) || !req.fields.synopsis[0])
        return next(new Error('Synopsis field cannot be null'));
    //verify if the category exist
    if(('category' in req.fields) && req.fields.category[0] && Number.isInteger(Number(req.fields.category[0]))){
        const categoryExist= await BookCategoryController.verifyCategoryExist(Number(req.fields.category[0]));
        if(!categoryExist) return next(new Error('The indicated category doesn\'t exist'));
    }
    else return next(new Error('The indicated category doesn\'t exist'));

    //verify if the category exist
    if(('author' in req.fields) && req.fields.author[0] && Number.isInteger(Number(req.fields.category[0]))){
        const authorExist= await AuthorController.verifyAuthorExist(Number(req.fields.author[0]));
        if(!authorExist) return next(new Error('The indicated author doesn\'t exist'));
    }
    else return next(new Error('The indicated author doesn\'t exist'));

    //verify if the available number is a cor
    if(!('available' in req.fields) || !req.fields.available[0])
        return next(new Error('Available filed null'));
    const availableNumber = Number(req.fields.available[0]);
    if (!Number.isInteger(availableNumber) || availableNumber < 0) return next(new Error('Invalid available number'));

    const bookAlreadyExist = await BookController.verifyIfExistByAuthor(req.fields.title[0], Number(req.fields.author[0]));
    if (bookAlreadyExist) return next(new Error('This book written by the concerned author already exists'));

    next();
}