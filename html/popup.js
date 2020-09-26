let dropdown = $('#materias-dropdown');

dropdown.empty();

dropdown.append('<option selected="true" disabled>Elige la materia</option>');
dropdown.prop('selectedIndex',0);

const url='materias.json';

const materias = ["Materia 1", "Materia 1", "Materia 1", "Materia 1"];

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
