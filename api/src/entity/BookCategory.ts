import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { CategoryNameIsUnique } from '../services/customValidation';
import { Book } from './Book';

@Entity()
export class BookCategory{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', unique: true})

    @Matches(/^[a-zA-Z]+(?:(?:\s|'|-)[a-zA-Z]+)*$/g, {message: 'must be a word or a sequence of words separated by one space or one apostrophe or hyphen'})
    @CategoryNameIsUnique()
    @Length(2,30)
    @IsNotEmpty()
    name: string;

    @OneToMany(()=>Book, (book: Book)=>book.category, {cascade:['remove']})
    books: Book[];

    constructor(name: string){
        this.name= name;
    }
}