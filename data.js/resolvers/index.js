import { rejects } from 'assert';
import {crearZona, actualizarZona, eliminarZona} from './mutations/Zona'
import {obtenerZonas, obtenerZona} from './queries/Zona'
//import Barrio
import {crearBarrio, eliminarBarrio} from './mutations/Barrio'
import {searchIdBarrio,obtenerBarrios,obtenerBarrio, totalBarrios,topBarrios} from './queries/Barrio'
//import persona
import {registroMasivoPersonas,enviarSMS,crearPersona,eliminarPersona,actualizarPersona} from './mutations/Persona'
import {validarCedula,obtenerPersonasCumple,obtenerPersonas,totalPersonas,
    obtenerPersona, obtenerPersonasSuperior, obtenerPersonasBarrio} from './queries/Persona'
import {crearUsuario, autenticarUsuario} from './mutations/Usuario'

//Usuarios

import {obtenerUsuario} from './queries/Usuario'

//import LugarVotacion

import {crearLugarVotacion} from './mutations/LugarVotacion'
export const resolvers = {
    Query : {
        obtenerZonas,
        obtenerZona,
        obtenerBarrios,
        obtenerBarrio,
        searchIdBarrio,
        totalBarrios,
        obtenerPersonas,
        totalPersonas,
        obtenerPersona,
        obtenerPersonasSuperior,
        obtenerPersonasCumple,
        validarCedula,
        obtenerUsuario,
        obtenerPersonasBarrio,
        topBarrios
    },
    Mutation : {
        actualizarPersona,
        crearZona,
        actualizarZona,
        eliminarZona,
        crearBarrio,
        eliminarBarrio,
        crearPersona,
        eliminarPersona,
        enviarSMS,
        registroMasivoPersonas,
        crearUsuario,
        autenticarUsuario,
        crearLugarVotacion
    }   
}