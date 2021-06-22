require('colors');

const { guardarDB, leerDB } = require('./db/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareaBorrar, confirmar, mostrarListadoChecklist } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

console.clear();

const main = async () =>{

    let opt = '';
    const tareas = new Tareas();

    const tareaDB = leerDB();
    if ( tareaDB ){
        // Establecer las Tareas
        tareas.cargarTareasArr( tareaDB );
        
        
    }

    do {
        opt = await inquirerMenu();
        switch (opt) {
            case '1':
                // crear opcion
                const desc = await leerInput('descripcion:');
                tareas.crearTarea( desc );
            break;
            case '2':// listar tareas
                tareas.listadoCompleto();
            break;
            case '3':// listar tareas completadas
                tareas.listarTareasCompletadas(true);
            break;
            case '4':// listar tareas pendientes
                tareas.listarTareasCompletadas(false);
            break;
            case '5':// completado o pendiente
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
            break;
            case '6':// borrar tarea
                const id = await listadoTareaBorrar(tareas.listadoArr);
                if (id !== '0'){
                    const ok = await confirmar(`estás seguro?`.red);
                    if ( ok ){
                        tareas.borrarTarea(id);
                        console.log('tarea borrada')
                    }
                }
            break;
        
        }

        guardarDB(tareas.listadoArr);

        if(opt !== '0')await pausa();

    } while(opt !== '0');

    

    //pausa();
}

main();