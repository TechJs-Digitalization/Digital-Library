import express from 'express'
import cors from 'cors'
import { AppDataSource } from "./data-source"

AppDataSource.initialize().then(async () => {
    const app = express();
    const port= process.env.PORT || 5000;

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(cors());

    app.listen(port, ()=>{
        console.log(`sever launched on port ${port}`);
    })
}).catch(error => console.log(error))