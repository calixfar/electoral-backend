import Persona from './../../models/Persona'
import { rejects } from 'assert';
import { resolve } from 'url';
import mongoose from 'mongoose'
import twilio from 'twilio'

const barrios = () => Barrio.find({}).exec()
const validarCedula = (cedula) => Persona.find({cedula}).exec()
export const registroMasivoPersonas  = async (root, input) => {
    console.log(input)
    const promises = input.input.datos.map(async (person, i) => {
        const res = await validarCedula(person.cedula)
        return res;
    }) 
    const results = await Promise.all(promises)
    console.log('object' ,results)
    const errors = input.input.datos.map((person, i) => {
        if(results[i].length === 0) {
            console.log('entro con: ' +person.cedula)
            personaNueva(person)
        }
        else {
            console.log('entro al error')
            return person
        }
    })
    console.log('errorrs', errors)
    return errors
} 
export const registroFromExcel = async (root, input)  =>{
    let arrayError = []
    let register = async () => {
        input.input.datos.map(async person => {
            let resultFindCedula = await validarCedula(person.cedula)
            if(resultFindCedula.length === 0) {
                let persona = personaNueva(person)
                console.log('repuessta persona',persona)
            }
            else {
                console.log('retorno')
                // console.log('error')
                 arrayError.push(person)
                 console.log(arrayError)
            }
            resultFindCedula= ''
        })
        console.log('error',arrayError) 
    }
    register()
}
export const  enviarSMS = (root, {input}) => {
    let accountSid = 'AC05f4e20a2fd1c613909e39e37066316d'; // Your Account SID from www.twilio.com/console
    let authToken = 'b8d6f66481f92501ad2f2c41ed47fa7f';
    var client = new twilio(accountSid, authToken);
    //let to= `+57${input.celular}`
    //console.log(to)
    client.messages.create({
        body: `${input.nombre}, el equipo de trabajo de Firme por Aguachica te desea muchas felicidades y bendiciones en tu cumpleaño número ${input.edad}, gracias por hacer parte de este proyecto.`,
        to:`+57${input.to}`,  // Text this number
        from: '+18166056578' // From a valid Twilio number
    })
    .then((message) => {
        console.log(message.sid)
        Persona.findByIdAndUpdate({_id: mongoose.Types.ObjectId(input.id)}, {mensajeCumple: true}, () => {
            (error) => {
                if(error) console.log(error)
                else('enviado y actualizado')
            }
        })
    });

}

let calcularEdad = (cumple) => {
    if(cumple){
        let birthday = new Date(cumple)
        let actual = new Date();
        let day = actual.getDate(), mes = actual.getMonth()
        let descuento = false, edad = actual.getFullYear() - birthday.getFullYear();
        let edadSinDes = edad;
        if(mes <= birthday.getMonth()){
            edad-=1;
            if(mes === (birthday.getMonth()) && birthday.getDate()+1 <= day){
                edad+=1
            }
        }
        return(edad)
    }
}
const personaNueva = (input) => {
                 const nuevaPersona = new Persona({
                    cedula: input.cedula,
                    nombre: input.nombre,
                    apellido: input.apellido,
                    fechaCumple: input.fechaCumple,
                    estadoCivil: input.estadoCivil,
                    ocupacion: input.ocupacion,
                    expectativaOcupacion: input.expectativaOcupacion,
                    celular: input.celular,
                    direccion: input.direccion,
                    correo: input.correo,
                    edad: calcularEdad(input.fechaCumple),
                    tipo: input.tipo,
                    zona: input.zona,
                    barrio: input.barrio ? input.barrio : null, 
                    lugarVotacion: input.lugarVotacion, 
                    mesaVotacion: input.mesaVotacion, 
                    metaVotos: input.metaVotos, 
                    estadoContacto: input.estadoContacto,
                    genero: input.genero,
                    dinero: input.dinero,
                    fidelizado: input.fidelizado, 
                    tipoVoto: input.tipoVoto,
                    superior: input.superior,
                    perfil: input.perfil,
                    macros: input.macros,
                    lideres: input.lideres ,
                    multip: input.mulip,
                    votantes: input.votantes,
                    totalGeneral: input.totalGeneral
                })
                nuevaPersona.id = nuevaPersona._id
                // nuevaPersona.totalGeneral= {
                //     totalGeneralLideres: {
                //         totalPersonas: 0,
                //         totalFidelizados: 0
                //     } ,
                //     totalGeneralMacros: {
                //         totalPersonas: 0,
                //         totalFidelizados: 0
                //     } ,
                //     totalGeneralMultip: {
                //         totalPersonas: 0,
                //         totalFidelizados: 0
                //     } ,
                //     totalGeneralVotantes: {
                //         totalPersonas: 0,
                //         totalFidelizados: 0
                //     }  
                // }
                nuevaPersona.save((error) => error ? error : nuevaPersona)
                return nuevaPersona
}

export const crearPersona = (root,{input}) => {
    crearPersona_ActualiarTotalGeneral(input) 
}
// Saber a que grupo de los generales pertenece
//Recibe dos parametros 1. el tipo y 2. Para que clase de campo estará dirigido
const tipoGrupo = (tipo, general) => {
    if(general){
        return tipo === 'lider' ? 'totalGeneralLideres' : 
               tipo === 'macro' ? 'totalGeneralMacros' :
               tipo === 'multiplicador' ? 'totalGeneralMultip' : 'totalGeneralVotantes';
    }
    else {
        return tipo === 'lider' ? 'lideres' : 
               tipo === 'macro' ? 'macros' :
               tipo === 'multiplicador' ? 'multip' : 'votantes';
    }
    
}
//const tipoGrupoTotales = (tipo) => 
    
// Saber si una persona esta fidelizada o no 
const fidelizado = (valor) => valor ? 1 : 0;
//metodo general para ejecutar crear personay actualizar totales directos y generales
const crearPersona_ActualiarTotalGeneral = async (input) => {
    let nuevaPersona = personaNueva(input);
    console.log('nueva Persona',nuevaPersona)
    //validar si la persona tiene un superior
    if(Object.keys(nuevaPersona.superior).length > 0){
        const {tipo} = nuevaPersona;
        const idSuperior = nuevaPersona.superior.id
        // cambios totales directos
        let fidelizados = fidelizado(nuevaPersona.fidelizado)
        let queryCampo = {}, queryInc={}, queryInc2={};
        const tipoGrupoGeneral = tipoGrupo(nuevaPersona.tipo, true)
        queryCampo[tipoGrupo(tipo, false)] = {'id': nuevaPersona._id};
        queryInc['totalPersonas'] = 1;
        queryInc['totalFidelizados'] = fidelizados;
        queryInc[`totalGeneral.${tipoGrupoGeneral}.totalFidelizados`] = fidelizados
        queryInc[`totalGeneral.${tipoGrupoGeneral}.totalPersonas`] = 1
        queryInc['totalGeneral.totalPersonas'] = 1
        queryInc['totalGeneral.totalFidelizados'] = fidelizados
        queryInc2['totalGeneral.totalPersonas'] = 1
        queryInc2['totalGeneral.totalFidelizados'] = fidelizados
        queryInc2[`totalGeneral.${tipoGrupoGeneral}.totalFidelizados`] = fidelizados
        queryInc2[`totalGeneral.${tipoGrupoGeneral}.totalPersonas`] = 1
        Persona.findByIdAndUpdate(
                {_id: idSuperior}, 
                {$push: queryCampo, 
                $inc: queryInc }, 
                (error) => {
                    if(error) return(error)
                });
        //Cambios totales generales
        let superiorDirecto = await findSuperior(mongoose.Types.ObjectId(idSuperior))
        //console.log('superiorDirecto',superiorDirecto)
        let superior = '', validarSuperior = true, cont = 0, antSuperior = true;
        let nextSuperior = true; 
        do{
            if(cont === 0 && superiorDirecto.superior){
                superior = await findSuperior(mongoose.Types.ObjectId(superiorDirecto.superior.id));
                antSuperior = superior
                Persona.findByIdAndUpdate({_id : superior.id}, 
                    {
                        $inc: queryInc2
                    }, (error) => error ? error : true)
                cont++;   
                    //nextSuperior = superior.superior ? true : false;
                    //console.log('ant dentro del cont', antSuperior)
                //}
            }else {
                if(antSuperior){
                    //console.log('ant', antSuperior)
                    validarSuperior = antSuperior.superior ? true : false
                    if(validarSuperior){
                        superior = await findSuperior(mongoose.Types.ObjectId(antSuperior.superior.id));
                        //console.log('supercon', superior)
                            Persona.findByIdAndUpdate({_id : superior.id}, 
                                {
                                    $inc: queryInc2
                                }, (error) => error ? error : true)
                            cont++
                            antSuperior = superior;
                    }
                }
            }
            

        }while(validarSuperior)
    }
}
const findSuperior = (id) => Persona.findById({'_id' : id}).exec()
const mainFindSuperior = async (id) => {
    const person = await findSuperior(id)
    Persona.updateMany({'superior.id' : id}, {$unset: {superior:''}}, {multi: true}, (error) => {
        if(error) return(error)
    })
    Persona.findByIdAndDelete({_id: mongoose.Types.ObjectId(id)}, (error) => {
        if(error) return(error)
    })
    if(Object.keys(person.superior).length > 0){
        let fidelizado = person.fidelizado ? -1 : 0
        let queryCampo = {}
        let tipo = person.tipo === 'lider' ? 'lideres' : 
                   person.tipo === 'macro' ? 'macros' :
                   person.tipo === 'multiplicador' ? 'multip' : 'votantes';
        queryCampo[tipo] = {'id' : id};
        Persona.findByIdAndUpdate(
            {'_id': mongoose.Types.ObjectId(person.superior.id)},
            {$inc: {'totalFidelizados': fidelizado, 'totalPersonas' : -1},
             $pull: queryCampo },
            (error) => {if(error) return error}
        )
    }
}

export const eliminarPersona = (root,{id}) => {
    mainFindSuperior(id)
}

export const actualizarPersona = (root, {input}) => {
    return new Promise((resolve, rejects) => {
        Persona.findByIdAndUpdate({_id: input.id}, {
            cedula: input.cedula,
            nombre: input.nombre,
            apellido: input.apellido,
            fechaCumple: input.fechaCumple,
            estadoCivil: input.estadoCivil,
            ocupacion: input.ocupacion,
            perfil: input.perfil,
            celular: input.celular,
            direccion: input.direccion,
            correo: input.correo,
            edad: calcularEdad(input.fechaCumple),
            zona: input.zona,
            barrio: input.barrio ? input.barrio : null, 
            lugarVotacion: input.lugarVotacion, 
            mesaVotacion: input.mesaVotacion, 
            metaVotos: input.metaVotos, 
            estadoContacto: input.estadoContacto,
            genero: input.genero,
            dinero: input.dinero,
            fidelizado: input.fidelizado, 
        }, {new: true}, (error, persona) => {
            if(error) rejects(error)
            else resolve(persona)
        })
    })
}
