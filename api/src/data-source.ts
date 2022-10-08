import "reflect-metadata"
import { DataSource } from "typeorm"

import * as dotenv from 'dotenv'
dotenv.config();

import { User } from "./entity/User"
import { Author } from "./entity/Author"
import { NumTel } from "./entity/NumTel"
import { Book } from "./entity/Book"
import { BookCategory } from "./entity/BookCategory"
import { Subscription } from './entity/Subscription'
import { BookCheckout } from "./entity/BookCheckout";
import { NomDePlume } from "./entity/NomDePlume";
import { SubscriptionType } from "./entity/SubscriptionType";

export const AppDataSource = new DataSource({
    name: "default",
    type: "postgres",
    host: "localhost",
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PSWRD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Author, NumTel, Book, BookCategory, BookCheckout, Subscription, NomDePlume, SubscriptionType],
    migrationsTableName: "migrations",
    migrations: ["dist/migration/**/*.js"],
    subscribers: [],
})
