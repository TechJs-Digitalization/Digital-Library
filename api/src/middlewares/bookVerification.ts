import { NextFunction, Request, Response } from "express";
import { File } from "formidable";
import { basename, join } from "path";
import { AuthorController } from "../controllers/author.controller";
import BookController from "../controllers/book.controller";
import { BookCategoryController } from "../controllers/bookCategory.controller";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import { deleteFile } from "../services/fileUpload";

function coverIsInvalid(req: Request, res: Response, next: NextFunction){
    let invalid= false;
    if(!req.files.cover[0]){
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
    if(!req.fields.title.trim() || !req.fields.title.trim()){
        res.status(400).json({err: true, msg: 'Please provide a value to this "title" field'});
        next({});
        invalid= true;
    }
    return invalid;
}

function synopsisIsIvalid(req: Request, res: Response, next: NextFunction){
    let invalid= false;
    if(!req.fields.synopsis.trim() || !req.fields.synopsis.trim()){
        res.status(400).json({err: true, msg: 'Please provide a value to this "synopsis" field'});
        next({});
        invalid= true;
    }
    return invalid;
}

function availableIsInvalid(req: Request, res: Response, next: NextFunction){
    let invalid= false;
    if(!req.fields.available){
        //if it's in th field, verify if it's an integer
        const availableNumber = Number(req.fields.available);
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
    if(!req.fields.category || !Number.isInteger(Number(req.fields.category))){
        
        const categoryExist= await BookCategoryController.verifyCategoryExist(Number(req.fields.category));
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
    if(!req.fields.author || !Number.isInteger(Number(req.fields.category))){
        const authorExist= await AuthorController.verifyAuthorExist(Number(req.fields.author));
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
    //verify title
    if(titleIsInvalid(req, res, next)) return;
    
    //verify synopsis
    if(synopsisIsIvalid(req, res, next)) return;
    
    //verify available number
    if(availableIsInvalid(req, res, next)) return;

    if(req.fields.dispo){
        if(req.fields.dispo.toLowerCase()!='true' && req.fields.dispo.toLowerCase()!='false'){
            res.status(400).json('The "dispo" field should have true or false as value')
            return next({})
        }
    }
    else req.fields.dispo='false';

    //verify category
    if(await categoryIsInvalid(req, res, next)) return;

    //verify author
    if(await authorIsInvalid(req, res, next)) return;

    //verify if the title of the book is already taken by another saved book of the current author
    const bookAlreadyExist = await BookController.verifyIfExistByAuthor(req.fields.title, Number(req.fields.author));
    if (bookAlreadyExist){
        res.status(400).json({err: true, msg: 'A book with the provided title, written by the provided author already exist'})
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

export async function beforeUpdateOperation(req: Request, res: Response, next: NextFunction){
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

     //if title is in field object verify it
     if(req.fields.title){
        if(titleIsInvalid(req, res, next)) return;
    }
    
    //if synopsis is in field object verify it
    if(req.fields.synopsis){
        if(synopsisIsIvalid(req, res, next)) return;
    }

    if(req.fields.dispo && req.fields.dispo){
        if(req.fields.dispo!='true' && req.fields.dispo!='false'){
            res.status(400).json('The "dispo" field should have true or false as value')
            return next({})
        }
    }
    else req.fields.dispo='false';
    
    //if available is in field object verify it
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
            title: (req.fields.title) ? req.fields.title : bookInitial.title,
            author: {id: (req.fields.author) ? Number(req.fields.author) : bookInitial.author.id}
        };
    
        //verify if the title of the book is already taken by another saved book of the current author
        const bookAlreadyExist = await BookController.verifyIfExistByAuthor(updateBook.title, updateBook.author.id);
        if (bookAlreadyExist){
            res.status(400).json({err: true, msg: 'There is already a book with the same title written by the author'})
            return next({})
        }
    }

    if(req.files.cover){
        if(coverIsInvalid(req, res, next)) return; 
        try {
            await deleteFile(join(BookController.pictureDir, basename(bookInitial.coverPicture)))
        } catch (error) {
            res.status(500).json({err: true, msg: 'Internal server error'})
            return next({})
        }
    }   
    

    next();

}

export async function beforeDeleteOperation(req: Request, res: Response, next: NextFunction){
    const bookId= Number(req.params.id);
    if(Number.isNaN(bookId)){
        res.status(400).json({err: true, msg: 'ID invalid'});
        return next({})
    }
    else{
        const book= await BookController.repository.findOne({
            select: ['coverPicture'],
            where: {id: bookId}
        });
        if(book){
            try {
                await deleteFile(join(BookController.pictureDir, basename(book.coverPicture)))
                return next();
            } catch (error) {
                res.status(500).json({err: true, msg: 'Internal server error'})
                return next({})
            }
        }
        else{
            res.status(404).json({err: true, msg: 'Book with current ID not found'});
            return next({});
        }
    }
}