import {conectar} from './../db'
import mongoose from 'mongoose'

conectar()
const zonaSchema = new mongoose.Schema({
    barrios: Array,
    nombre: String,
})

const Zona = mongoose.model('zonas', zonaSchema)
export {Zona}