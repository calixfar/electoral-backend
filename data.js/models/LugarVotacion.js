import { conectar } from './../db'
import mongoose from 'mongoose'
conectar()

const schemaLugarVotacion = new mongoose.Schema({
    nombre: String,
    censoMujeres: Number,
    censoHombres: Number,
    potencial: Number,
    mesas: Array
})

const LugarVotacion = new mongoose.model('lugarVotacion', schemaLugarVotacion)

export default LugarVotacion;