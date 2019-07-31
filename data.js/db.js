import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({path: 'variables.env'})

mongoose.Promise = global.Promise

export function conectar(){
    //mongoose.connect('mongodb+srv://user-1:MO.ngodb161@cluster0-dgiyl.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})
    mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})
    mongoose.set('setFindAndModify', false);
}

