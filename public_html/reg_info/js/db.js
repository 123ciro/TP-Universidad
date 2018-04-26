/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var dataBase = null;
var recuperar;

//avisa en caso que el nevagador no soperte IndexedDB

if (!window.indexedDB) {
    window.alert("Su navegador no soporta una versión estable de indexedDB. Tal y como las características no serán validas");
}


//En esta Funcion le ponemos el nombre a la base de datos y a la tabla con sus respectivos datos.

function startDB() {
    dataBase = indexedDB.open('Registros', 1);
    dataBase.onupgradeneeded = function (e) {
        var active = dataBase.result;
        var object = active.createObjectStore("alumnos", {keyPath: 'id', autoIncrement: true});
        object.createIndex('id_alumno', 'id', {unique: true});
        object.createIndex('fecha_inscripcion', 'fecha_actual', {unique: false});

        object.createIndex('nombre_alumno', 'nombre', {unique: false});
        object.createIndex('cedula_alumno', 'cedula', {unique: true});
        object.createIndex('apellido_alumno', 'apellido', {unique: false});
        object.createIndex('fechanaci_alumno', 'fechanaci', {unique: false});
        object.createIndex('edad_alumno', 'edad', {unique: false});
        object.createIndex('correo_alumno', 'correo', {unique: false});
        object.createIndex('sexo_alumno', 'sexo', {unique: false});
        object.createIndex('tipoestudio_elumno', 'tipoestudio', {unique: false});
        object.createIndex('cel_alumno', 'cel', {unique: false});
    };

    dataBase.onsuccess = function (e) {
        //  alert('Base de Datos Activa');
        CargaDb();
    };
    dataBase.onerror = function (e) {
        // alert('Error loading database');
    };
}
//Funcion para Agregar datos 
function add() {


    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readwrite");
    var object = data.objectStore("alumnos");
    var request = object.put({
        cedula: document.querySelector("#cedula").value,
        nombre: document.querySelector("#nombre").value,
        apellido: document.querySelector("#apellido").value,
        fechanaci: document.querySelector("#fechanaci").value,
        edad: document.querySelector("#edad").value,
        correo: document.querySelector("#correo").value,
        sexo: document.querySelector("#sexo").value,
        tipoestudio: document.querySelector("#tipoestudio").value,
        cel: document.querySelector("#cel").value,
        fecha_actual: document.querySelector("#fecha_actual").value
    });
    request.onerror = function (e) {
        $('#cedula').focus();
    };
    data.oncomplete = function (e) {
        document.querySelector('#cedula').value = '';
        document.querySelector('#nombre').value = '';
        document.querySelector('#apellido').value = '';
        document.querySelector('#fechanaci').value = '';
        document.querySelector('#edad').value = '';
        document.querySelector('#correo').value = '';
        document.querySelector('#sexo').value = '';
        document.querySelector('#tipoestudio').value = '';
        document.querySelector('#cel').value = '';
        document.querySelector('#fecha_actual').value = '';
        $('#carga').fadeIn();
        $('#carga').fadeOut(3000);
        $('#cedula').focus();
        CargaDb();
        limpiarcampos();
    };
}
//Refresca la Base de Datos.
function CargaDb() {
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readonly");
    var object = data.objectStore("alumnos");
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();
    };
    data.oncomplete = function () {
        var outerHTML = '';
        for (var key in elements) {
            outerHTML += '\n\
                        <tr>\n\
                            <td class="centrado">' + elements[key].fecha_actual + '</td>\n\
                            <td class="centrado">' + elements[key].cedula + '</td>\n\
                            <td class="centrado">' + elements[key].nombre + '</td>\n\
                            <td class="centrado">' + elements[key].apellido + '</td>\n\
                            <td class="centrado">' + elements[key].tipoestudio + '</td>\n\
                            <td class="centrado">' + elements[key].cel + '</td> \n\
                            <td>\n\<button type="button" style="font-size:12px" onclick="recuperar(' + elements[key].id + ')" class="btn btn-info centrado">Edit</button>\n\
                            <td>\n\<button type="button" style="font-size:12px" onclick="deletedate(' + elements[key].id + ')" class="btn btn-danger centrado">Remove</button>\n\
                                                    </tr>';
        }
        elements = [];
        document.querySelector("#elementsList").innerHTML = outerHTML;
    };
}
//Recupera todos los datos y cargo en los input y select.
function recuperar(id) {
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readonly");
    var object = data.objectStore("alumnos");
    var index = object.index("id_alumno");
    var request = index.get(id);

    $("#cargas").show();
    $("#busquedaregistro").hide();


    request.onsuccess = function () {
        var result = request.result;
        if (result !== undefined) {

            document.querySelector('#id').value = result.id;
            document.querySelector('#cedula').value = result.cedula;
            document.querySelector('#nombre').value = result.nombre;
            document.querySelector('#apellido').value = result.apellido;
            document.querySelector('#fechanaci').value = result.fechanaci;
            document.querySelector('#edad').value = result.edad;
            document.querySelector('#correo').value = result.correo;
            document.querySelector('#sexo').value = result.sexo;
            document.querySelector('#tipoestudio').value = result.tipoestudio;
            document.querySelector('#cel').value = result.cel;

            $('#eliminar').attr("disabled", false);
            $('#registrar').attr("disabled", true);
            $('#editar').attr("disabled", false);
            $('#cedula').attr("disabled", true);
            $("#nombre").focus();

        }
    };
}


//Funcion que modifica los datos.
function modificar(cedula) {

    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readwrite");
    var objectStore = data.objectStore("alumnos");
    var index = objectStore.index('cedula_alumno');
    index.openCursor(cedula).onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            var updateData = cursor.value;
            updateData.cedula = document.querySelector("#cedula").value;
            updateData.nombre = document.querySelector("#nombre").value;
            updateData.apellido = document.querySelector("#apellido").value;
            updateData.fechanaci = document.querySelector("#fechanaci").value;
            updateData.sexo = document.querySelector("#sexo").value;
            updateData.edad = document.querySelector("#edad").value;
            updateData.tipoestudio = document.querySelector("#tipoestudio").value;
            updateData.correo = document.querySelector("#correo").value;
            updateData.cel = document.querySelector("#cel").value;
            var request = cursor.update(updateData);
            request.onsuccess = function () {
                $("#modifi").fadeIn();
                $("#modifi").fadeOut(3000);
                $('#registrar').attr("disabled", false);
                $('#cedula').attr("disabled", false);
                CargaDb();
                limpiarcampos();

            };
            request.onerror = function () {
                alert('Error' + '/n/n' + request.error.name + '\n\n' + request.error.message);
                CargaDb();
            };
        }
    }
    ;
}

//Funcion que elimina los datos de la Base de Datos.
function deletedate(id) {
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readwrite");
    var object = data.objectStore("alumnos");
    var request = object.delete(id);
    request.onsuccess = function () {
        swal("Datos Eliminados");
        $("#cedula").focus();
        CargaDb();
    };
}


//Esta Funcion una vez cargado la cedula si ya existe trae todos los datos,
//y si no existe no realiza nada.
function BusquedaciAdmi() {
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readonly");
    var object = data.objectStore("alumnos");
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();
    };
    data.oncomplete = function () {

        for (var key in elements) {

            var cedula = elements[key].cedula;

            if (cedula === $("#cedula").val()) {
                recuperar(elements[key].id);
            }
        }
        elements = [];
    };
}


//Esta funcion le envia un mensaje al Usuario diciendo que la cedula que el esta cargando ya existe en el Sistema.
function BusquedaCiUsuario() {
    var active = dataBase.result;
    var data = active.transaction(["alumnos"], "readonly");
    var object = data.objectStore("alumnos");
    var elements = [];
    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elements.push(result.value);
        result.continue();
    };
    data.oncomplete = function () {
        for (var key in elements) {
            var cedula = elements[key].cedula;
            if (cedula === $("#cedula").val()) {
                $("#cedula").focus();
                $('#errorcarga').fadeIn();
                $('#errorcarga').fadeOut(4000);
                console.log("cedula ya existe");
                $("#cedula").val("");
            }
        }
        elements = [];
    };
}
