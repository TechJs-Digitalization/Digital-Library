import { NextFunction, Request, Response } from "express";
import { authorController } from "../controllers/author.controller";
import BookController from "../controllers/book.controller";
import { bookCategoryController } from "../controllers/bookCategory.controller";

export async function verify(req: Request, response: Response, next: NextFunction) {
    const [title, synopsis] = forceStringType(req.fields.title, req.fields.synopsis);
    req.fields.title= forceStringType(req.fields.title);
    req.fields.title= forceStringType(req.fields.title);
    if (!title) return next(new Error('Title field cannot be null'));
    if (!synopsis) return (new Error('Synopsis field cannot be null'));

    //verify if the category exist
    const categoryIdNumber = Number(req.fields.categoryId);
    const foundCategory = await bookCategoryController.get(categoryIdNumber);
    if (!foundCategory) return next(new Error('Category not found'));

    //verify if the category exist
    const authorIdNumber = Number(req.fields.authorId);
    const foundAuthor = await authorController.get(authorIdNumber);
    if (!foundAuthor) return next(new Error('Author not found'));

    //verify if the available number is a cor
    const availableNumber = Number(req.fields.available);
    if (!Number.isInteger(availableNumber) || availableNumber < 0) return next(new Error('Invalid available number'));

    const bookAlreadyExist = await BookController.verifyIfExistByAuthor(title, authorIdNumber);
    if (bookAlreadyExist) return next(new Error('This book written by the concerned author already exists'));

    next();
}

function forceStringType(...tab: (string | string[])[]): string[] {
    return tab.map(el => (((typeof el) == 'string' || !el) ? el : el[0]) as string);
}