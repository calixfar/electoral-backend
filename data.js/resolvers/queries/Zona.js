import {Zona} from './../../models/Zona'
import { resolve } from 'url';
import { rejects } from 'assert';

export const obtenerZonas = (root,{input,limit,offset}) => {
    return Zona.find({}).limit(limit).skip(offset);
}

export const obtenerZona = (root, {id}) => {
    return new Promise((resolve, rejects) => {
        Zona.findById(id, (error, zona) => {
            if ( error ) rejects(error)
            else resolve(zona)
        })
    })
}