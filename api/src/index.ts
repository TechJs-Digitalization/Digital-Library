import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import {Subscription, SUBSCRIPTION_TYPE} from './entity/Subscription'
import { NumTel } from "./entity/NumTel"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const numbers= [new NumTel('+261341234567'), new NumTel('+261331234567')];
    const user = new User('Bema', 'RANDRIA', new Date(2018, 11, 24), 'tes@test.com');
    user.numTel= numbers;
    user.subscriptions= [new Subscription(SUBSCRIPTION_TYPE.test1)];
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
