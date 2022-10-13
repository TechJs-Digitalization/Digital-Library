import { validate } from "class-validator";
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
    static async save(req: Request, res: Response) {
        const {name}= req.body; 
        const newCategory= new BookCategory(
            (name) ? name.trim() : name
        );

        //validate if parameters are valid
        const errors= await validate(newCategory)
        if(errors.length>0){
            const msg= errors.reduce((m, singleError)=>{
                const breakedRules= [];
                for(let rule in singleError.constraints)
                    breakedRules.push(`${singleError.constraints[rule]}`)
                    return m + `${singleError.property}: ${breakedRules.join(', ')}. `;
            }, '');
            return res.status(400).json({err: true, msg: msg});
        }
        
        try {
            await BookCategoryController.repository.save(newCategory)
        } catch (err) {
            return res.status(401).send({ err: true, msg: 'the provided name is already used by another category' })
        }

        res.status(201).json({err: false, msg: 'Category successfully created'})
    }

    static async update(req: Request, res: Response){
        //get the id from the url
        const id: number = parseInt(req.params.id);
        //try to find category on database
        try {
            await BookCategoryController.repository.findOneOrFail({
                select: ['id'],
                where: {id: id}
        });
        } catch (error) {
            //if not found, send 404 erros response
            return res.status(404).json({err: true, msg:"category not found"});
        }

        let categoryUpdate: {[keys: string]: any}= {};
        categoryUpdate.name= req.body.name.trim();

        //validate the new values on model
        const errors = await validate(categoryUpdate);
        if (errors.length > 0){
            const msg= errors.reduce((m, singleError)=>{
                const breakedRules= [];
                for(let rule in singleError.constraints)
                    breakedRules.push(`${singleError.constraints[rule]}`)
                m+=`${singleError.property}: ${breakedRules.join(', ')}. `;
                return m;
            }, '');
            return res.status(400).json({err: true, msg: msg})

        }

        //try to save, if failsn that means name already in use
        try {
            await BookCategoryController.repository.update({id:id},categoryUpdate);
        } catch (e) {
            return res.status(401).json({err: true, msg: 'the provided name is already used by another category'});
        }

        res.status(200).json({err: false, msg: "Category updated"});
    }

    static async delete(req: Request, res: Response){
        const cpt= await BookCategoryController.repository.createQueryBuilder('category')
            .loadRelationCountAndMap('category.bookCount', 'category.books', )
            // .select('category.name')
            .addSelect('category.name')
            .where('category.id =:id', {id: parseInt(req.params.id)})
            .getOne() as any

        if(!cpt)
            return res.status(404).json({err: true, msg: 'Category not found'})
    
        try {
            const test= new BookCategory()
            test.id= cpt!.id
            await BookCategoryController.repository.remove([test])
        } catch (error) {
            return res.status(500).json({err: true, msg: error})
        }
        res.status(200).json({err: false, msg: `"${cpt!.name}" deleted with ${(cpt!.bookCount>1) ? cpt!.bookCount + ' books' : cpt!.bookCount + ' book'}`})
    }

    static async verifyCategoryExist(id: number): Promise<boolean> {
        const category = await BookCategoryController.repository.preload({
            id: id
        });

        return (category != undefined);
    }
}