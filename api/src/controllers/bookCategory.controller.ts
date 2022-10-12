import { Request, Response } from "express";
import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import { BookCategory } from "../entity/BookCategory";
import BookController from "./book.controller";
export default class BookCategoryController {
    static repository= AppDataSource.getRepository(BookCategory);

    /**
     * 
     * @description Get all info of a book category using the ID stored in "req.body.bookCategoryId"
     */
    static getInfo(showHidden: boolean= false){
        return async (req: Request, res: Response)=>{
            const {id} = req.params;
            const matchedCategory= await BookCategoryController.repository.findOne({
                select: {
                    id: true, name: true
                },
                where:{ id: Number(id) } 
            })
    
            if(!matchedCategory)
                return res.status(404).json({err: true, msg: 'Category not found'})

            let resultat: {
                id: number, 
                name: string,
                dispoBook: number,
                nonDispoBook?: number
            }

            resultat= {
                id: matchedCategory.id, 
                name: matchedCategory.name,
                dispoBook: await BookController.repository.createQueryBuilder('book')
                    .where('book.categoryId= :id', {id: Number(req.params.id)})
                    .andWhere('book.dispo= :dispo', {dispo: true})
                    .getCount(),
                nonDispoBook: (showHidden) ? await BookController.repository.createQueryBuilder('book')
                    .where('book.categoryId= :id', {id: Number(req.params.id)})
                    .andWhere('book.dispo= :dispo', {dispo: false})
                    .getCount() : undefined
            };

            res.status(200).json({err: false, data: resultat});
        }
    }

    static getBookInCategory(showHidden: boolean= false){
        return async function(req: Request, res: Response){
            const { page, perPage, sortBy, order } = req.query;

            let findOptions= {
                relations: {author: true, category: true},
                select: {
                    id: true,
                    title: true,
                    coverPicture: true,
                    available: true,
                    createdAt: true,
                    author: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                order:{[`${sortBy}`] : order},
                where: {
                    category: {id: Number(req.params.id)}
                },
                take: parseInt(perPage as string),
                skip: (parseInt(page as string) -1) * (parseInt(perPage as string))
            } as FindManyOptions<Book>

            if(!showHidden)
                findOptions.where= {...(findOptions.where), dispo: true};
            
            const result= await BookController.repository.find(findOptions)

            res.json(result)
        }
    }

    /**
     * 
     * @description name in "req.body.bookCategoryName" and books in "req.body.bookList"
     */
    static async create(req: Request, res: Response) {
        try {
            await BookCategoryController.repository.save({
                name: req.body.bookCategoryName,
                books: (req.body.bookList) ? req.body.bookList : []
            })
        } catch (err) {
            res.status(500).send({ err: true, msg: err })
        }
    }

    static async verifyCategoryExist(id: number): Promise<boolean> {
        const category = await BookCategoryController.repository.preload({
            id: id
        });

        return (category != undefined);
    }
}