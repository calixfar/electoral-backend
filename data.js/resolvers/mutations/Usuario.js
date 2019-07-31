import Usuario from './../../models/Usuario'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config({path: 'variables.env'})
import jwt from 'jsonwebtoken';

const crearToken = (usuarioLogin, secreto, expiresIn) => {
    const {usuario} = usuarioLogin;
    return jwt.sign({usuario},secreto,{expiresIn});
}

export const crearUsuario = async (root,{usuario,password, nombre, rol}) => {
    const existeUsuario = await Usuario.findOne({usuario})
    if(existeUsuario){
        throw new Error('El usuario ya existe')
    }
    const nuevoUsuario = await new Usuario({
        usuario,
        password,
        nombre,
        rol,
        active: false 
    }).save()
    return 'Creado correctamente';
}
export const autenticarUsuario = async (root, {usuario, password}) => {
    const nombreUsuario = await Usuario.findOne({usuario})
    if(!nombreUsuario){
        throw new Error('El usuario o la contraseña están incorrectos')
    }
    const passwordCorrecto = await bcrypt.compare(password, nombreUsuario.password)
    if(!passwordCorrecto){
        throw new Error( 'El usuario o la contraseña están incorrectos');
    }
    return {
        token: crearToken(nombreUsuario,
            process.env.SECRETO,'1hr')
    }
}