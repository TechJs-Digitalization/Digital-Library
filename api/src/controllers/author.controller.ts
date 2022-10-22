import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { Author } from "../entity/Author";
import { Book } from "../entity/Book";
import getErrorObject from "../services/errorInClassValidator";
import BookController from "./book.controller";

export class AuthorController {
    static repository = AppDataSource.getRepository(Author);

    static async getAll(req: Request, res: Response){
        const authors= await AuthorController.repository.find({
            relations: {nomDePlumes: true},
            select: {
                id: true, 
                firstName: true,
                lastName: true,
                nomDePlumes: {value: true}
            },
            order: {id:'ASC'}
        })
        res.status(200).json({
            err: false,
            data: authors
        })
    }

    static getInfo(showHidden: boolean= false){
        return async (req: Request, res: Response)=>{
            const {id} = req.params;
            try {
                const matchedAuthor= await AuthorController.repository.findOne({
                    relations: {nomDePlumes: true},
                    select: {
                        nomDePlumes: {value: true}
                    },
                    where:{ id: Number(id) } 
                })
        
                if(!matchedAuthor)
                    return res.status(404).json({err: true, msg: 'Author not found'})
    
                let resultat= {
                    ...matchedAuthor,
                    dispoBook: await BookController.repository.createQueryBuilder('book')
                        .where('book.authorId= :id', {id: Number(req.params.id)})
                        .andWhere('book.dispo= :dispo', {dispo: true})
                        .getCount(),
                    nonDispoBook: (showHidden) ? await BookController.repository.createQueryBuilder('book')
                        .where('book.authorId= :id', {id: Number(req.params.id)})
                        .andWhere('book.dispo= :dispo', {dispo: false})
                        .getCount() : undefined
                };
    
                res.status(200).json({err: false, data: resultat});
            
            } catch (error) {
                res.status(404).json({err: true, msg: 'Author not found'})
            }
        }
    }

    static getBookByAuthor(showHidden: boolean = false) {
        return async function (req: Request, res: Response) {
            try {
                const { page, perPage, sortBy, order } = req.query;
                const skip = (parseInt(page as string) - 1) * (parseInt(perPage as string));

                let findOptions = {
                    relations: { author: true, category: true },
                    select: {
                        id: true,
                        title: true,
                        coverPicture: true,
                        available: true,
                        createdAt: true
                    },
                    order: { [`${sortBy}`]: order },
                    where: {
                        author: { id: Number(req.params.id) }
                    },
                    take: parseInt(perPage as string),
                    skip: (skip < 0) ? 0 : skip
                } as FindManyOptions<Book>

                if (!showHidden)
                    findOptions.where = { ...(findOptions.where), dispo: true };

                const result = await BookController.repository.find(findOptions)

                res.json(result)
            } catch (error) {
                return res.status(404).json({ err: true, msg: 'Category not found' })
            }

        }
    }
    static async save(req: Request, res: Response, next: NextFunction) {
        const author= new Author(
            (req.fields.firstName) ? req.fields.firstName[0] : undefined,
            (req.fields.lastName) ? req.fields.lastName[0] : undefined,
            (req.files.cover && req.files.cover[0]) ? req.files.cover[0].newFilename : undefined,
            (req.fields.dateOfBirth) ? new Date(req.fields.dateOfBirth[0]) : undefined,
            (req.fields.dateOfDeath) ? new Date(req.fields.dateOfDeath[0]) : undefined,
            (req.fields.description) ? req.fields.description[0] : undefined,
            (req.fields.nomDePlumes) ? req.fields.nomDePlumes : undefined,
        )

        // const author= new Author(firstName, lastName, coverName, new Date(dateOfBirth), (dateOfDeath) ? new Date(dateOfDeath) : dateOfDeath as any, description, nomDePlumes)

        const error= await validate(author)
        if(error.length > 0){
            res.status(400).json({
                err: true, 
                data: null,
                msg: getErrorObject(error)
            })
            return next({})
        }

        try {
            await AuthorController.repository.save(author)
            res.status(201).json({ err: false, msg: 'Author successfully created' });
        } catch (error) {
            res.status(500).json({err: true, msg: 'Something broke'})
            next(error);
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const cpt = await AuthorController.repository.createQueryBuilder('author')
                .loadRelationCountAndMap('author.bookCount', 'author.books',)
                .where('author.id =:id', { id: parseInt(req.params.id) })
                .getOne() as any

            if (!cpt)
                return res.status(404).json({ err: true, msg: 'author not found' })

            try {
                const test = new Author()
                test.id = cpt!.id
                await AuthorController.repository.remove([test])
            } catch (error) {
                return res.status(500).json({ err: true, msg: error })
            }
            res.status(200).json({ err: false, msg: `Author deleted with ${(cpt!.bookCount > 1) ? cpt!.bookCount + ' books' : cpt!.bookCount + ' book'}` })

        } catch (error) {
            return res.status(404).json({ err: true, msg: 'Author not found' })
        }
    }
    
    static async verifyAuthorExist(id: number): Promise<boolean> {
        const author = await AuthorController.repository.preload({
            id: id
        });

        return (author != undefined);
    }

}