import Usuario from './../../models/Usuario'

export  const obtenerUsuario = (root, args, {usuarioActual}) => {
    if(!usuarioActual){
        return null;
    }
    const usuario = Usuario.findOne({usuario: usuarioActual.usuario})
    return usuario;
}