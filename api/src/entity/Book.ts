import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BookCategory } from "./BookCategory";
import { Author } from "./Author";

@Entity()
@Check(`"available">=0`)
export class Book{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar'})
    title!: string;

    @Column()
    available!: number;

    @ManyToOne(()=>BookCategory, (category: BookCategory)=>category.books)
    category!: BookCategory;

    @ManyToOne(()=>Author, (author: Author)=>author.books)
    author: Author;

    constructor(title: string, available:number=0){
        this.title= title;
        this.available= available;
    }
}