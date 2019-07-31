import mongoose from 'mongoose'
import {conectar} from './../db'
conectar()


const personaSchema = new mongoose.Schema({
    cedula: String,
    nombre: String,
    apellido: String,
    fechaCumple: Date,
    estadoCivil: String,
    ocupacion: String,
    perfil: String,
    celular: String,
    direccion: String,
    correo: String,
    tipo: String,
    edad: Number,
    zona: mongoose.Types.ObjectId,
    barrio: mongoose.Types.ObjectId,
    lugarVotacion: String,
    mesaVotacion: Number,
    metaVotos: Number,
    estadoContacto: String,
    fidelizado: Boolean,
    tipoVoto: String,
    mensajeCumple: {type: Boolean, default: false},
    dinero: String,
    genero: String,
    superior: Object,
    macros: Array,
    lideres: Array,
    multip: Array,
    votantes: Array,
    totalPersonas: Number,
    totalFidelizados: Number,
    totalGeneral: {
        totalPersonas: {type: Number, default: 0},
        totalFidelizados:{type: Number, default: 0} ,
        totalGeneralLideres: {
            totalPersonas: {type: Number, default: 0},
            totalFidelizados: {type: Number, default: 0}
        } ,
        totalGeneralMacros: {
            totalPersonas: {type: Number, default: 0},
            totalFidelizados: {type: Number, default: 0}
        } ,
        totalGeneralMultip: {
            totalPersonas: {type: Number, default: 0},
            totalFidelizados: {type: Number, default: 0}
        } ,
        totalGeneralVotantes: {
            totalPersonas: {type: Number, default: 0},
            totalFidelizados: {type: Number, default: 0}
        }  
    }
});

const Persona = mongoose.model('personsas', personaSchema)
export default Persona;