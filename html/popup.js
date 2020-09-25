let dropdown = $('materias-dropdown');

dropdown.empty();

dropdown.append('<option selected="true" disabled>Elige la materia</option>');
dropdown.prop('selectedIndex',0);

const url='materias.json';

$.getJSON(url, function(data){
    $.each(data, function(key, entry){
        dropdown.append($('<option></option>').attr('value', entry.abbreviation).text(entry.nombre));
    })
})
