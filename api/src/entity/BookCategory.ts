import { IsNotEmpty, Length, Matches } from 'class-validator';
import { basename, join } from 'path';
import {BeforeRemove, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { bookCoverDir } from '../config/pathFiles';
import { AppDataSource } from '../data-source';
import { deleteFile } from '../services/fileUpload';
import { Book } from './Book';

@Entity()
export class BookCategory{
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column({type: 'varchar', unique: true})
    
    @Matches(/^[a-zA-Z]+(?:(?: |'|-)[a-zA-Z]+)*$/, {message: 'must be a word of characters in (a to z, A to Z) or a sequence of words separated by one space or one apostrophe or hyphen'})
    @Length(2,30)
    @IsNotEmpty()
    name: string;

    @Column({nullable: true})
    test: boolean
    
    @OneToMany(()=>Book, (book: Book)=>book.category)
    books: Book[];

    constructor(name?: string){
        this.name= (name)?name:'';
    }

    
    
    @BeforeRemove()
    async deleteCoverOfAllBook(){
        try {
            // const bookRepos= AppDataSource.getRepository(Book)
            const coverPictures= await AppDataSource.getRepository(Book).find({
                relations: {'category': true},
                select: ['coverPicture'],
                where: {
                    category: {id: this.id}
                } 
            })
            try {
                await deleteFile(
                    ...coverPictures.map(file => join(bookCoverDir, basename(file.coverPicture)))
                )
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error('Error')
        }
    }
}