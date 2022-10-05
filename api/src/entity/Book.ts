import { Check, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BookCategory } from "./BookCategory";
import { Author } from "./Author";
import { BookCheckout } from "./BookCheckout";

@Entity()
@Check(`"available">=0`)
export class Book{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar')
    title!: string;

    @Column()
    available!: number;

    @Column({type: 'text'})
    synopsis!: string;

    @Column('varchar')
    coverPic!: string;

    @ManyToOne(()=>BookCategory, (category: BookCategory)=>category.books)
    category!: BookCategory;

    @ManyToOne(()=>Author, (author: Author)=>author.books)
    author!: Author;

    @ManyToMany(()=>BookCheckout)
    bookChekouts: BookCheckout[];
}