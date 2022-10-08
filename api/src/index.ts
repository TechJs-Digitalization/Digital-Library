import express from 'express';
import cors from 'cors';
import { AppDataSource } from "./data-source";
import router from './routes/router';
import { join } from 'path';
import * as  dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
dotenv.config();

AppDataSource.initialize().then(async () => {
    const app = express();
    const port= process.env.PORT || 5000;

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(cors());

    app.use(cookieParser());

    app.use('/public', express.static(join(__dirname, '..','public')));

    app.use(router);

    app.listen(port, ()=>{
        console.log(`sever launched on port ${port}`);
    })
}).catch(error => console.log(error))
