let dropdown = $('#materias-dropdown');
let alumnos = $('#alumnos-dropdown');

dropdown.empty();
alumnos.empty();

dropdown.append('<option selected="true" disabled>Elige la materia</option>');
dropdown.prop('selectedIndex',0);
alumnos.append('<option selected="true" disabled>Elige a tus alumnos</option>');
//alumnos.prop('selectedIndex',0);

listaPopup=['alumno1','alumno2','alumno3'];

function updateDropdown(listaAsistentes){
    alumnos.empty();
    listaAsistentes.map(alumno => {
        alumnos.append(`
        <option id="select-${alumno}" value="${alumno}">${alumno}</option>
    `)
    })
}
const url='materias.json';

const materias = ["Materia 1", "Materia 1", "Materia 1", "Materia 1"];

/*for (alumno of otralista) {
    alumnos.append(`
        <option value=${alumno}>${alumno}</option>
    `)
}*/

/*$.getJSON(url, function(data){
    $.each(data, function(key, entry){
        dropdown.append($('<option></option>').attr('value', entry.abbreviation).text(entry.nombre));
    })
})*/

fetch('https://dma.mty.itesm.mx/DMA/API/Materia/ReadAllMaterias.php')
.then(result => result.json())
.then(results => {
    for (materia of results.materias) {
        dropdown.append(`
            <option value=${materia.clave}>${materia.nombre}</option>
        `)
    }
})
$(() => {
            
    
    //updateDropdown(listaPopup);
    
    
})
