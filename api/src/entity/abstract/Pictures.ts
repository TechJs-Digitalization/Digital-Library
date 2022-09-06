import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class Picture{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    fileName: string;

    @Column('boolean')
    cover: boolean

    constructor(cover:boolean=false){
        this.cover= cover;
    }
}