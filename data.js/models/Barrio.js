import {conectar} from './../db'
import mongoose, { mongo } from 'mongoose'

conectar()

const barrioSchema = new mongoose.Schema({
    nombre: String,
    cantidadVotantes : Number,
    metaVotos: Number,
    zona : mongoose.Types.ObjectId,
    estado : String
});

const Barrio = mongoose.model('barrios', barrioSchema);
export default Barrio;