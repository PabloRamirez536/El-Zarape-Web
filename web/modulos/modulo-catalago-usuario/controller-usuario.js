/*Copyright 2024*/
// Array para almacenar los usuarios
let usuarios = [];

// Función para generar una contraseña aleatoria
function generarContrasena() {
    let caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let longitud = 12;
    let contrasena = "";

    for (let i = 0; i < longitud; i++) {
        let posicion = Math.floor(Math.random() * caracteres.length);
        contrasena += caracteres.charAt(posicion);
    }

    return contrasena;
}

// Función para mostrar el formulario de agregar/editar usuario
function mostrarFormulario(index = null) {
    let titulo = index !== null ? 'Editar Usuario' : 'Agregar Usuario';
    let botonTexto = index !== null ? 'Guardar' : 'Agregar';
    let nombre = '';
    let contrasena = '';

    if (index !== null) {
        // Si es una edición, cargar los datos del usuario seleccionado
        let usuario = usuarios[index];
        nombre = usuario.nombre || '';
        contrasena = usuario.contrasena || '';
    } else {
        // Generar una contraseña aleatoria para nuevos usuarios
        contrasena = generarContrasena();
    }

    Swal.fire({
        title: titulo,
        html: `
            <form id="formularioUsuariosModal">
                <label for="usuario-nombre">Nombre:</label><br>
                <input type="text" id="usuario-nombre" class="swal2-input" placeholder="Nombre" value="${nombre}"><br><br>
                <label for="usuario-contrasena">Contraseña:</label><br>
                <input type="text" id="usuario-contrasena" class="swal2-input" placeholder="Contraseña" value="${contrasena}"><br>
            </form>
        `,
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: botonTexto,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return new Promise((resolve) => {
                let nombreNuevo = document.getElementById('usuario-nombre').value.trim();
                let contrasenaNueva = document.getElementById('usuario-contrasena').value.trim();

                // Validar campos obligatorios y longitud exacta de la contraseña
                if (!nombreNuevo || !contrasenaNueva || contrasenaNueva.length !== 12) {
                    Swal.showValidationMessage('Por favor, complete todos los campos y asegúrese de que la contraseña tenga exactamente 12 caracteres.');
                    resolve(false);
                } else {
                    resolve({
                        nombre: nombreNuevo,
                        contrasena: contrasenaNueva
                    });
                }
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (index !== null) {
                usuarios[index] = result.value;
                guardarUsuarios(index); // Llamar para guardar los cambios
            } else {
                usuarios.push(result.value);
                guardarUsuarios(); // Llamar para guardar el nuevo usuario
            }
            actualizarTablaUsuarios(); // Actualizar la tabla de usuarios
        }
    });
}

// Función para actualizar la tabla con los usuarios actuales
function actualizarTablaUsuarios() {
    let tbody = document.getElementById('tbody-usuarios');
    tbody.innerHTML = ''; // Limpiar el tbody

    let registrosPorPagina = document.getElementById('registros-por-pagina').value;
    let busqueda = document.getElementById('busqueda-usuario').value.toUpperCase();

    let usuariosFiltrados = usuarios.filter(usuario => {
        return Object.values(usuario).some(value =>
            String(value).toUpperCase().includes(busqueda)
        );
    });

    let usuariosMostrados = (registrosPorPagina === "all") ? usuariosFiltrados : usuariosFiltrados.slice(0, parseInt(registrosPorPagina));

    usuariosMostrados.forEach((usuario, index) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${"*".repeat(usuario.contrasena.length)}</td>
            <td>
                <button class="icon-button" onclick="mostrarFormulario(${index})">
                    <img src="../../recursos/media/editar.png" alt="Icono Editar" class="icon-acciones">
                </button>
                <button class="icon-button" onclick="eliminarUsuario(${index})">
                    <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon-acciones">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para eliminar un usuario
function eliminarUsuario(index) {
    Swal.fire({
        title: '¿Estás seguro de eliminar este usuario?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            usuarios.splice(index, 1);
            actualizarTablaUsuarios();
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El usuario ha sido eliminado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#805A3B',
              })
            guardarUsuariosSinMensaje();
        }
    });
}

// Función para guardar los usuarios (simulación de guardar en localStorage)
function guardarUsuarios(index = null) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    if (index !== null) {
        Swal.fire({
            title: '¡Editado!',
            text: 'El usuario fue editado exitosamente',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
    } else {
        Swal.fire({
            title: '¡Guardado!',
            text: 'El usuario se ha agregado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
    }
}

function guardarUsuariosSinMensaje() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}


// Función para cargar los usuarios desde localStorage al cargar la página
window.onload = function () {

    fetch("../../modulos/modulo-catalago-usuario/data-usuario.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (jsondata) {
            usuarios = jsondata;
            actualizarTablaUsuarios();
        })
        .catch(function (error) {
            console.error('Error al cargar los usuarios:', error);
        });
};

// Función para buscar usuario por cualquier campo
function buscarUsuario() {
    let input = document.getElementById('busqueda-usuario');
    let filter = input.value.toUpperCase();
    let tbody = document.getElementById('tbody-usuarios');
    let tr = tbody.getElementsByTagName('tr');

    for (let i = 0; i < tr.length; i++) {
        let mostrarFila = false;

        // Recorrer cada celda de la fila
        for (let j = 0; j < tr[i].cells.length - 1; j++) {
            let td = tr[i].cells[j];
            if (td) {
                let textValue = td.textContent || td.innerText;
                if (textValue.toUpperCase().indexOf(filter) > -1) {
                    mostrarFila = true;
                    break;
                }
            }
        }
        if (mostrarFila) {
            tr[i].style.display = '';
        } else {
            tr[i].style.display = 'none';
        }
    }
}