import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
// import {User} from './User'

@Entity()
export class NumTel{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 15
    })
    num!: string;

    // @ManyToOne(()=>User, (user: User)=>user.numTel)
    // user: User;
}