import {
    Entity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Person } from "./abstract/Person";
import { IsNotEmpty, Length } from 'class-validator';
import * as bcrypt from "bcrypt";
import { Subscription } from './Subscription';
import { NumTel } from './NumTel';
import { BookCheckout } from "./BookCheckout";

@Entity({ name: 'users' })
@Unique(["email"])
export class User extends Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    @Length(6, 100)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Subscription, (subscription: Subscription) => subscription.user, { cascade: true })
    subscriptions: Subscription[];

    @OneToMany(() => NumTel, (num: NumTel) => num.user, { cascade: true })
    numTel!: NumTel[];

    @OneToMany(() => BookCheckout, (checkout: BookCheckout) => checkout.user)
    checkouts: BookCheckout[];
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }


    constructor(firstName: string, lastName: string, BirthDate: Date, email: string, role: string) {
        super(firstName, lastName, BirthDate);
        this.email = email;
        this.role = role;
    }
}
//subscription tkn entité hafa