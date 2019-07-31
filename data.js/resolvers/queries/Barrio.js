import Barrio from './../../models/Barrio'
import Persona from './../../models/Persona'
import { resolve } from 'dns';
import { rejects } from 'assert';
import { Mongoose } from 'mongoose';

export  const searchIdBarrio = (root,{nombre}) => {
    console.log(nombre)
    return new Promise((resolve,rejects) => {
        Barrio.findOne({nombre}, (error, barrio) => {
            if(error) rejects(error)
            else resolve(barrio)
        })
    })
}
export const obtenerBarrios = (root, {id,input,limit,offset}) => {
    const zona = (input && Object.keys(input).length > 0) ?input.zona : {$type : 7}
    return Barrio.find({zona}).limit(limit).skip(offset)
}

export const obtenerBarrio = (root, {id}) => {
    return new Promise((resolve,rejects) => {
        Barrio.findById(id, (error, barrio) => {
            if(error) rejects(error)
            else resolve(barrio)
        })
    })
}
export const topBarrios = async (root, {zona}) => {
    //traer todos los barrios que pertenezcan a la zona
    let barrios = await Barrio.find({zona})
    let promisePerson = barrios.map( async barrio => {
        let promise = await Persona.countDocuments({fidelizado: true, barrio: barrio.id})
        return promise;
    })
    let persons = await Promise.all(promisePerson)
    let res = persons.map((person, i) => (
        {
            id: barrios[i].id, 
            nombre: barrios[i].nombre,
            votosFide: person 
        }
    ))
    return(res.sort(function (a, b) {return (b.votosFide - a.votosFide)}))
   

}

export const totalBarrios = (root, {input}) => {
    const zona = (input && Object.keys(input).length > 0) ?input.zona : {$type : 7}
    return new Promise((resolve,rejects) => {
        Barrio.countDocuments({zona}, (error, count) => {
            if(error) rejects(error)
            else resolve(count)
        })
        
    })
}