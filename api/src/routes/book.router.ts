import { Router, Request, Response } from "express";
import formidable from "formidable";
import { authorController } from "../controller/author.controller";
import { bookController } from "../controller/book.controller";
import { bookCategoryController } from "../controller/bookCategory.controller";
import { bookPictureController } from "../controller/BookPicture.controller";
import { BookPicture } from "../entity/BookPicture";
import { renameCover, renamePictures } from "../services/fileUpload";

const bookRouter: Router= Router();

bookRouter.get('/:id', async (req: Request, res: Response)=>{
    const id= Number(req.params.id);
    const book= await bookController.get(id);
    if(!book)
        return res.status(404).json({err: true, msg: 'Book not found'});
    else
        return res.status(200).json({err: false, data: book});
})

.get('/', async (req: Request, res: Response)=>{
    res.status(200).json({msg: 'miainga'})
})

.post('/', async (req: Request, res: Response)=>{
    const form= formidable({
        allowEmptyFiles: false,
        keepExtensions: true,
        multiples: true,
        maxFileSize: 20*1024*1024, //20MB 
        uploadDir: bookController.pictureDir,
        filter: function({name, originalFilename, mimetype}){
            return (mimetype) ? mimetype.includes('image') : false;
        }
    });

    form.parse(req, async(err: Error, fields, files)=>{
        if(err) throw err;
        try {     
            if(!files.cover) throw new Error('Please upload a cover picture');

            const synopsis= (((typeof fields.synopsis)=='string' || !fields.synopsis==undefined) ? fields.synopsis : fields.synopsis[0]) as string;
            if(!synopsis) throw new Error('Synopsis field cannot be null');
            
            const title= (((typeof fields.title)=='string' || !fields.title) ? fields.title : fields.title[0]) as string;
            if(!title) throw new Error('Title field cannot be null');

            //verify if the author exist
            const categoryIdNumber= Number(fields.categoryId);
            const foundCategory= await bookCategoryController.get(categoryIdNumber);
            if(!foundCategory) throw new Error('Invalid category ID'); 
            
            //verify if the category exist
            const authorIdNumber= Number(fields.authorId);
            const foundAuthor= await authorController.get(authorIdNumber);
            if(!foundAuthor) throw new Error('Invalid author ID'); 
            
            //verify if the available number is a correct one
            const availableNumber= Number(fields.available);
            if(!Number.isInteger(availableNumber) || availableNumber<0) throw new Error('Invalid available number');

            const bookAlreadyExist= await bookController.verifyIfExistByAuthor(title, authorIdNumber);
            if(bookAlreadyExist) throw new Error('This book written by the concerned author already exists')
            else{
                //nom des fichier couverture: titre_authorId_cover.ext
                //nom edes fichiers illustrations: titre_authorId_X.ext
                const commonFileName= title + '_' + fields.authorId;            
            
                const coverName= await renameCover(files.cover, bookController.pictureDir, commonFileName);
                const picsNames= await renamePictures(files.pictures, bookController.pictureDir, commonFileName); 
                
                await bookController.save(title, synopsis, foundAuthor, availableNumber, foundCategory, coverName[0], picsNames);
                res.status(201).json({err: false, msg: 'Book successfully created'});
            }
        } catch (err) {
            if(err instanceof Error)
                return res.status(400).json({err: true, msg: err.message})
        }
    })
})


export default bookRouter;