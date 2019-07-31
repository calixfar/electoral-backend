import LugarVotacion from './../../models/LugarVotacion'

export const crearLugarVotacion = ( root, { input }) => {
    console.log(input)
    let potencial = input.censoMujeres + input.censoHombres
    console.log(potencial)
    const nuevoLugarVotacion = new LugarVotacion({
        nombre: input.nombre,
        censoMujeres: input.censoMujeres,
        censoHombres: input.censoHombres,
        potencial
    });
    nuevoLugarVotacion.id = nuevoLugarVotacion._id;
    return new Promise(( resolve, rejects ) => {
        nuevoLugarVotacion.save(( error ) => {
            if( error ) rejects( error )
            else resolve( nuevoLugarVotacion ) 
        })
    })
}