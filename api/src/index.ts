import express from 'express'
import * as bodyParser from "body-parser"
import cors from 'cors'
import Indexroutes from "./routes/IndexRoutes"
import { AppDataSource } from "./data-source"

const port = process.env.PORT || 5000;

AppDataSource
    .initialize()
    .then(async () => {

        // create express app
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(cors());
        app.use('/', Indexroutes);


        // start express server
        app.listen(port, () => console.log(`Express server has started on port ${port}`))
    })
    .catch(error => console.log(error))

