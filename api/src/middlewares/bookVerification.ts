import { NextFunction, Request, Response } from "express";
import { File } from "formidable";
import { basename, join } from "path";
import { AuthorController } from "../controllers/author.controller";
import BookController from "../controllers/book.controller";
import { BookCategoryController } from "../controllers/bookCategory.controller";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import { deleteFile } from "../services/fileUpload";

function verifyFieldIsNull(reqField: string[] | File[]) : boolean{
    return !reqField[0];
}

function coverIsInvalid(req: Request, res: Response, next: NextFunction){
    let invalid= false;
    if(verifyFieldIsNull(req.files.cover)){
        res.status(400).json({err: true, msg: 'Please provide one file to this "cover" field'});
        next({});
        invalid= true;
    }else if(req.files.cover.length>1){
        res.status(400).json({err: true, msg: 'You can only provide one file to this "cover" field'});
        next({});
        invalid= true;
    }
    return invalid;
}

function titleIsInvalid(req: Request, res: Response, next: NextFunction){
    let invalid= false;
    if(verifyFieldIsNull(req.fields.title)){
        res.status(400).json({err: true, msg: 'Please provide a value to this "title" field'});
        next({});
        invalid= true;
    }
    return invalid;
}

function synopsisIsIvalid(req: Request, res: Response, next: NextFunction){
    let invalid= false;
    if(verifyFieldIsNull(req.fields.synopsis)){
        res.status(400).json({err: true, msg: 'Please provide a value to this "synopsis" field'});
        next({});
        invalid= true;
    }
    return invalid;
}

function availableIsInvalid(req: Request, res: Response, next: NextFunction){
    let invalid= false;
    if(!verifyFieldIsNull(req.fields.available)){
        //if it's in th field, verify if it's an integer
        const availableNumber = Number(req.fields.available[0]);
        if (!Number.isInteger(availableNumber) || availableNumber < 0){
            res.status(400).json({err: true, msg: 'Invalid available number'});
            next({});
            invalid= true;
        }
    }
    else{
        res.status(400).json({err: true, msg: 'Invalid available number'});
        next({});
        invalid= true;
    }

    return invalid;
}

async function categoryIsInvalid(req: Request, res: Response, next: NextFunction){
    let invalid= false;
    if(!verifyFieldIsNull(req.fields.category) && Number.isInteger(Number(req.fields.category[0]))){
        
        const categoryExist= await BookCategoryController.verifyCategoryExist(Number(req.fields.category[0]));
        if(!categoryExist){
            res.status(404).json({err: true, msg: 'The precised category not found'})
            next({})
            invalid= true;
        }
    }
    else{
        res.status(404).json({err: true, msg: 'The precised category not found'})
        next({});
        invalid= true;
    }

    return invalid;
}

async function authorIsInvalid(req: Request, res: Response, next: NextFunction){
    let invalid= false;
    if(!verifyFieldIsNull(req.fields.author) && Number.isInteger(Number(req.fields.category[0]))){
        const authorExist= await AuthorController.verifyAuthorExist(Number(req.fields.author[0]));
        if(!authorExist){
            res.status(404).json({err: true, msg: 'The precised author not found'});
            next({});
            invalid= true;
        }
    }
    else{
        res.status(404).json({err: true, msg: 'The precised author not found'});
        next({});
        invalid= true;
    }

    return invalid;
}

export async function verify(req: Request, res: Response, next: NextFunction) {
    //verify if title is in field object
    if(req.fields.title){
        if(titleIsInvalid(req, res, next)) return;
    }
    else{
        res.status(400).json({err: true, msg: 'Please provide a "title" field'});
        return next({});
    }
    
    //verify if synopsis isn't in field object or is null
    if(req.fields.synopsis){
        if(synopsisIsIvalid(req, res, next)) return;
    }
    else{
        res.status(400).json({err: true, msg: 'Please provide a "synopsis" field with his value'})
        return next({})
    }
    
    //verify if available isn't in field object or is null
    if(req.fields.available){
        if(availableIsInvalid(req, res, next)) return;
    }
    else{
        res.status(400).json({err: true, msg: 'Please provide a "available" field with his positive integer value'})
        return next({})
    }

    //verify if the category exist
    if(req.fields.category){
        if(await categoryIsInvalid(req, res, next)) return;
    }
    else {
        res.status(400).json({err: true, msg: 'Please provide a "category" field with a positive integer value'});
        return next({})
    }

    //verify if the author exist
    if(req.fields.author){
        if(await authorIsInvalid(req, res, next)) return;
    }
    else{
        res.status(400).json({err: true, msg: 'Please provide a "author" field with a positive integer value'})
        return next({})
    }

    //verify if the title of the book is already taken by another saved book of the current author
    const bookAlreadyExist = await BookController.verifyIfExistByAuthor(req.fields.title[0], Number(req.fields.author[0]));
    if (bookAlreadyExist){
        res.status(400).json({err: true, msg: 'A book with the provided title, written by the provided author already exists'})
        return next({})
    }

    if(req.files.cover){
        if(coverIsInvalid(req, res, next)) return; 
    }
    else{
        res.status(400).json({err: true, msg: 'Please provide a "cover" files field with a value'})
        return next({});
    }
    
    next();
}

export async function updateVerification(req: Request, res: Response, next: NextFunction){
    const bookId= Number(req.params.id);
    if(Number.isNaN(bookId)){
        res.status(400).json({err: true, msg: 'ID invalid'})
        return next({})
    }

    const bookRepos= AppDataSource.getRepository(Book)
    const bookInitial= await bookRepos.findOne({
        relations: {author: true},
        select: {id:false, available: false, synopsis: false, author: {id: true}},
        where: {id: bookId}
    })
    
    if(!bookInitial){
        res.status(404).json({err: true, msg: 'Book with the current ID not found'})
        return next({})
    }

     //verify if title is in field object
     if(req.fields.title){
        if(titleIsInvalid(req, res, next)) return;
    }
    
    //verify if synopsis isn't in field object or is null
    if(req.fields.synopsis){
        if(synopsisIsIvalid(req, res, next)) return;
    }
    
    //verify if available isn't in field object or is null
    if(req.fields.available){
        if(availableIsInvalid(req, res, next)) return;
    }

    //verify if the category exist
    if(req.fields.category){
        if(await categoryIsInvalid(req, res, next)) return;
    }

    //verify if the author exist
    if(req.fields.author){
        if(await authorIsInvalid(req, res, next)) return;
    }

    if(req.files.cover){
        if(coverIsInvalid(req, res, next)) return; 
    }    
    
    //if there's update on title or author verify if a book with the same title written by the author already exist
    if(req.fields.title || req.fields.author ){
        let updateBook= {
            title: (req.fields.title) ? req.fields.title[0] : bookInitial.title,
            author: {id: (req.fields.author) ? Number(req.fields.author[0]) : bookInitial.author.id}
        };
    
        //verify if the title of the book is already taken by another saved book of the current author
        const bookAlreadyExist = await BookController.verifyIfExistByAuthor(updateBook.title, updateBook.author.id);
        if (bookAlreadyExist){
            res.status(400).json({err: true, msg: 'There is already a book with the same title written by the author'})
            return next({})
        }
    }
    
    try {
        console.log(bookInitial.coverPicture);
        
        await deleteFile(join(BookController.pictureDir, basename(bookInitial.coverPicture)))
    } catch (error) {
        res.status(500).json({err: true, msg: error})
        return next({})
    }

    next();

}