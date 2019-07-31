import mongoose from 'mongoose'
import {conectar} from './../db'
import bcrypt from 'bcrypt'
conectar()


const usuario = new mongoose.Schema({
    usuario: String,
    password: String,
    nombre: String,
    rol: String,
    active: Boolean
})
//hashear los passwords
usuario.pre('save', function (next) {
    //si el password no esta modificado
    if(!this.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10, (error, salt) => {
        if(error) next(error)
        
        bcrypt.hash(this.password, salt, (error,hash) => {
            if(error) next(error)
            this.password = hash;
            next(); 
        })
    })
})
const Usuario = mongoose.model('usuarios',usuario)

export default Usuario;