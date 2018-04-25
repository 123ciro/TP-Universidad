/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    $('#editar').attr("disabled", true);
    $('#eliminar').attr("disabled", true);
    $('#errorcarga').css('display', 'none');
    $('#carga').css('display', 'none');
    $('#edit').css('display', 'none');
    $('#fecha').css('display', 'none');
    $('#cedula').focus();
    $('#nombre').css('text-transform', 'capitalize');
    $('#apellido').css('text-transform', 'capitalize');
    $('#busquedaregistro').css('display', 'none');
    $('#modifi').css('display', 'none');
    $("#esconder").click(function () {
        $("#cargas").hide();
        $("#busquedaregistro").show();
    });


//FUNCION DE SOLO LETRAS



    //para que aparezca la fecha actual
    $(document).ready(function () {
        $("#fecha_actual").datepicker({
            dateFormat: 'dd - MM - yy '
        }).datepicker("setDate", new Date());
    });

//Filtrado de Datos.
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#elementsList tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

});

//Da formato al Nnumero de Cedula.
function format(input)
{
    var num = input.value.replace(/\./g, '');
    if (!isNaN(num)) {
        num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
        num = num.split('').reverse().join('').replace(/^[\.]/, '');
        input.value = num;
    } else {
        swal('Solo se permiten numeros');
        input.value = input.value.replace(/[^\d\.]*/g, '');
    }
}
function ValidNum() {
    if (event.keyCode < 48 || event.keyCode > 57) {
        event.returnValue = false;
    }
}
//FUNCION PARA VALIDAR LOS CAMPOS CON EL FRAMEMWORK.
(function validarcampos1() {

    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('#cedula').focus();
                    form.classList.add('was-validated');
                } else {
                    event.preventDefault();
                    event.stopPropagation();
                    add();
                    form.classList.remove('was-validated');
                    if (document.getElementById("registrar").hasAttribute("disabled")) {
                        modificar($("#cedula").val());
                    }
                }
            }, false);
        });
    }, false);
})();

//Limpia los campos una vez realizado alguna carga, modificacion o eliminacion.
function limpiarcampos() {
    $("#cedula").val("");
    $("#nombre").val("");
    $("#apellido").val("");
    $("#fechanaci").val("");
    $("#edad").val("");
    $("#sexo").val("");
    $("#correo").val("");
    $("#tipoestudio").val("");
    $("#cel").val("");
    $("#cedula").focus();
}
// Cuando se quita el cursos del input cedula, verifica si existe o no.
$(document).ready(function () {
    $("#cedula").focusout(function () {
        BusquedaCiUsuario();
    });
});



function carga() {
    location.href = "../index.html";

}

