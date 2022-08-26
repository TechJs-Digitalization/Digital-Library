import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { Book } from './Book';

@Entity()
export class BookCategory{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar'})
    name!: string;

    @Column({type: 'text'})
    synopsis!: string;

    @OneToMany(()=>Book, (book: Book)=>book.category)
    books: Book[];
}