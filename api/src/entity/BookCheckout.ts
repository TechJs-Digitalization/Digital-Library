import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./Book";
import { User } from "./User";

@Entity()
export class BookCheckout{
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({type: 'date'})
    startingDate: Date;

    @ManyToOne(()=>User, (user: User)=>user.checkouts, {cascade:['remove']})
    user: User;

    @ManyToMany(()=>Book)
    @JoinTable()
    books: Book[];
}