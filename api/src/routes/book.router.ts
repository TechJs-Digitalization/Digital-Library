import { Router, Request, Response } from "express";
import formidable from "formidable";
import { authorController } from "../controller/Author.controller";
import { bookController } from "../controller/book.controller";
import { bookCategoryController } from "../controller/bookCategory.controller";
import { BookCategory } from "../entity/BookCategory";
import { BookPicture } from "../entity/BookPicture";
import { uploadCover, uploadPictures } from "../services/fileUpload";

const bookRouter: Router= Router();

bookRouter.get('/:id', async (req: Request, res: Response)=>{
    const id= Number(req.query.id);
    const book= await bookController.get(id);
    if(!book)
        return res.status(500).json({err: true, msg: 'Book not found'});
    else
        return res.status(200).json({err: false, data: book});
})

.get('/', async (req: Request, res: Response)=>{
    res.status(200).json({msg: 'miainga'})
})

.post('/', async (req: Request, res: Response)=>{
    const form= formidable({
        multiples: true,
        maxFileSize: 20*1024*1024, //20MB 
        uploadDir: bookController.pictureDir,
        allowEmptyFiles: false,
        filter: function({name, originalFilename, mimetype}){
            console.log(name , originalFilename, mimetype)
            return (mimetype) ? mimetype.includes('image') : false;
        }
    });

    form.parse(req, async(err: Error, fields, files)=>{
        if(err) throw err;
        try {        
            const { authorId, available, categoryId}= fields;
            const title= (((typeof fields.title)=='string') ? fields.title : fields.title[0]) as string;
            const synopsis= (((typeof fields.synopsis)=='string') ? fields.synopsis : fields.synopsis[0]) as string;
            
            //verify if the author exist
            const categoryIdNumber= Number(categoryId);
            const foundCategory= await bookCategoryController.get(categoryIdNumber);
            if(!foundCategory) throw new Error('Invalid category ID'); 
            
            //verify if the category exist
            const authorIdNumber= Number(authorId);
            const foundAuthor= await authorController.get(authorIdNumber);
            if(!foundAuthor) throw new Error('Invalid author ID'); 
            
            //verify if the available number is a correct one
            const availableNumber= Number(available);
            if(!Number.isInteger(availableNumber) || availableNumber<0) throw new Error('Invalid available number');
        
            const coverName= await uploadCover(files, bookController.pictureDir, title);
            const picsNames= await uploadPictures(files, bookController.pictureDir, title);

            // console.log(coverName)

            const pics= picsNames.map((pic)=> new BookPicture(pic));    
            
            await bookController.save(title, synopsis, foundAuthor, availableNumber, foundCategory, coverName[0], pics);
        } catch (err) {
            if(err instanceof Error)
                return res.status(400).json({err: true, msg: err.message})
        }
        res.status(201).json({err: false, msg: 'Book successfully created'});
    })
})


export default bookRouter;