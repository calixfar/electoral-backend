import Barrio from './../../models/Barrio'
import { resolve } from 'dns';
import { rejects } from 'assert';
import mongoose, { mongo } from 'mongoose';
import { Zona } from '../../models/Zona';
import Persona from '../../models/Persona';

export const crearBarrio = (root, {input}) => {
    if(!input.id){
        const nuevoBarrio = new Barrio({
            nombre: input.nombre,
            cantidadVotantes: input.cantidadVotantes,
            metaVotos: input.metaVotos,
            zona: input.zona,
            estado : input.estado
        })
        nuevoBarrio.id = nuevoBarrio._id;
        return new Promise((resolve, rejects) => {
            const update = {'id': nuevoBarrio._id};
            Zona.updateOne({_id: input.zona}, {$push: {barrios: update}}, (error) => {
                if(error) rejects(error)
                else 'removido'
            })
            nuevoBarrio.save((error) => {
                if( error ) rejects(error)
                else resolve(nuevoBarrio)
            })
        })
    }
    else {
        return new Promise((resolve, rejects) => {
            Barrio.findByIdAndUpdate({_id: input.id}, input, {new: true}, (error, barrio) => {
                if(error) rejects(error)
                else resolve(barrio)
            })
        })
    }
};

export const eliminarBarrio = async (root, {input}) => {
    let persons = await Persona.find({barrio: input.barrio})
    let promises = persons.map( async (person) => {
        return Persona.findByIdAndUpdate({_id: mongoose.Types.ObjectId(person.id)}, {$unset: {'barrio': ''}})
    })
    Promise.all(promises)
    //Persona.updateMany({barrio: mongoose.Types.ObjectId(input.barrio)},{$unset: {barrio: ''}}, {multi: true})
    return new Promise((resolve, rejects) => {
        const update = {'id': input.barrio}
        console.log('update',update)
        Zona.update({_id: input.zona},{$pull: {barrios: {'id' : mongoose.Types.ObjectId(input.barrio)}}}, (error) => {
            if(error) rejects(error)
        })
        Barrio.findByIdAndDelete({_id: input.barrio}, (error) => {
            if(error) rejects(error)
            else resolve('Se elemino correctamente')
        })
    })
}
