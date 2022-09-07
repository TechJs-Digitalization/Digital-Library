import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class Picture{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    fileName: string;
}