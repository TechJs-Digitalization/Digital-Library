import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { Book } from './Book';

@Entity()
export class BookCategory{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', unique: true})
    name!: string;

    @OneToMany(()=>Book, (book: Book)=>book.category, {cascade:['remove']})
    books: Book[];
}