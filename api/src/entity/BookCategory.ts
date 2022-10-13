import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import {BeforeRemove, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { AppDataSource } from '../data-source';
import { Book } from './Book';

@Entity()
export class BookCategory{
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column({type: 'varchar', unique: true})
    
    @Matches(/^[a-zA-Z]+(?:(?: |'|-)[a-zA-Z]+)*$/g, {message: 'must be a word of characters in (a to z, A to Z) or a sequence of words separated by one space or one apostrophe or hyphen'})
    @Length(2,30)
    @IsNotEmpty()
    name: string;
    
    @OneToMany(()=>Book, (book: Book)=>book.category, {cascade:true})
    books: Book[];

    constructor(name?: string){
        this.name= (name)?name:'';
    }

    @BeforeRemove()
    async deleteCoverOfAllBook(){
        try {
            const coverPictures= await AppDataSource.getRepository(Book).find({
                relations: {'category': true},
                select: ['coverPicture'],
                where: {
                    category: {id: this.id}
                } 
            })
            console.log(coverPictures)
        } catch (error) {
            console.error('Error')
        }

    }
}