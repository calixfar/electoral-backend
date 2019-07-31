import {Zona} from '../../models/Zona'
import {Barrio} from '../../models/Barrio'

import mongoose from 'mongoose'
export const crearZona = (root, {input}) => {
    console.log(input)
    const nuevaZona =  new Zona({
        barrios: input.barrios,
        nombre: input.nombre,
    });
    nuevaZona.id = nuevaZona._id;
    return new Promise((resolve, rejects) => {
        nuevaZona.save(error => {
            if(error) rejects(error)
            else resolve(nuevaZona)
        })
    })
}
export const actualizarZona = (root, {input}) => {
return new Promise((resolve, rejects) => {
    Zona.findOneAndUpdate({_id: input.id}, input, {new: true} ,(error, zona) => {
        if(error) rejects(error)
        else resolve(zona)
    })
})
}
export const eliminarZona = async (root, {id}) => {
    console.log(id)
    let zona = await Zona.findById({_id: id});
    // console.log('ziba',zona)
    zona.barrios.map(async idBarrio => {
        let promise = await Barrio.findByIdAndDelete({_id: id})
        return promise;
    })
    // return new Promise((resolve, rejects) => {
    //     Zona.findOneAndDelete({_id : id}, (error) => {
    //         if (error) rejects(error)
    //         else resolve('Se elimino correctamente')
    //     })
    // })
};

