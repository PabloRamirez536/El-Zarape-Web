// Función para mostrar el formulario de login con SweetAlert
function mostrarFormularioLogin() {
    Swal.fire({
        title: 'Iniciar sesión',
        html: `
            <label for="username">Usuario:</label><br>
            <input type="text" id="username" class="swal2-input" placeholder="Nombre de usuario" required><br>
            <label for="password">Contraseña:</label><br>
            <input type="password" id="password" class="swal2-input" placeholder="Contraseña" required>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Iniciar sesión',
        preConfirm: () => {
            // Obtener los valores del formulario
            let username = document.getElementById('username').value;
            let password = document.getElementById('password').value;
            if (!username || !password) {
                Swal.showValidationMessage('Por favor, ingrese ambos campos');
                return false;
            }
            // Llamar a la función de validación
            return validateLogin(username, password);
        }
    });
}

// Función para editar la información del cliente
function editarInformacionCliente(idCliente) {
    obtenerClientePorId(idCliente)
        .then(cliente => {
            if (cliente) {
                console.log('Datos del cliente obtenidos:', cliente); // Asegúrate de que llegan datos
                mostrarFormulario(cliente);
            } else {
                console.error('Cliente no encontrado');
                Swal.fire('Error', 'Cliente no encontrado', 'error');
            }
        })
        .catch(error => {
            console.error('Error al intentar editar el cliente:', error);
            Swal.fire('Error', 'Error al obtener la información del cliente', 'error');
        });
}

// Función para validar el login a través de la API
function validateLogin(username, password) {
    // Validar que los campos no estén vacíos
    if (!username || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos vacíos',
            text: 'Por favor, ingresa tu nombre de usuario y contraseña.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Configura la solicitud HTTP para la API de login
    fetch('http://localhost:8080/Zarape/api/usuario/loginCliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `nombre=${encodeURIComponent(username)}&contrasenia=${encodeURIComponent(password)}`
    })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Bienvenido',
                        text: 'Inicio de sesión exitoso.',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        localStorage.setItem('usuarioAutenticado', 'true');
                        localStorage.setItem('idCliente', data.idCliente); // Guardar el ID del cliente
                        // Actualizar el menú del usuario
                        actualizarMenuUsuario({idCliente: data.idCliente});
                        window.location.href = 'index.html'; // Redirigir a la página principal
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'Credenciales incorrectas.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
            .catch(error => {
                console.error('Error al verificar las credenciales:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el servidor',
                    text: 'Hubo un problema al conectarse al servidor. Intenta nuevamente más tarde.',
                    confirmButtonText: 'Aceptar'
                });
            });
}


// Verificar si el usuario está autenticado
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('usuarioAutenticado') === 'true') {
        activarBotones(); // Muestra los botones del menú si el usuario está autenticado
        const idCliente = localStorage.getItem('idCliente');
        // Puedes cargar más datos del cliente si es necesario
        actualizarMenuUsuario({ idCliente: idCliente }); // Actualiza el menú
    } else {
        cerrarSesion(); // Oculta botones y muestra opciones de login
    }
});
// Función para activar los botones en el menú
function activarBotones() {
    const menuItems = document.querySelectorAll('.nav-item');
    menuItems.forEach(item => {
        item.style.display = 'block';  // Activar los elementos de menú
    });
}


function obtenerClientePorId(idCliente) {
    return fetch(`http://localhost:8080/Zarape/api/cliente/getClientePorId?idCliente=${idCliente}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del cliente');
            }
            // Convierte la respuesta a JSON y retorna el resultado
            return response.json();
        })
        .catch(error => {
            console.error('Error al obtener el cliente:', error);
            Swal.fire('Error', 'No se pudo cargar la información del cliente.', 'error');
            throw error;
        });
}




function actualizarMenuUsuario(cliente) {
    const menuUsuario = document.getElementById('menu-usuario');
    menuUsuario.innerHTML = `
        <li><a class="dropdown-item" href="#" onclick="editarInformacionCliente(${cliente.idCliente});">Editar Información</a></li>
        <li><a class="dropdown-item" href="#" onclick="desactivarCuenta(${cliente.idCliente});">Desactivar Cuenta</a></li>
        <li><a class="dropdown-item" href="index.html" onclick="cerrarSesion();">Cerrar Sesión</a></li>
    `;
}


function desactivarCuenta(idCliente) {
    Swal.fire({
        title: '¿Estás seguro de desactivar tu cuenta?',
        text: 'Esto desactivará tu cuenta. Podrás reactivarla contactando al soporte.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('http://localhost:8080/Zarape/api/cliente/eliminarCliente', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({idCliente})
            })
                    .then(response => {
                        if (response.ok) {
                            Swal.fire('Cuenta desactivada', 'Tu cuenta ha sido desactivada exitosamente.', 'success');
                            cerrarSesion(); // Cierra la sesión después de desactivar la cuenta
                        } else {
                            Swal.fire('Error', 'No se pudo desactivar la cuenta.', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error al desactivar la cuenta:', error);
                        Swal.fire('Error', 'Hubo un problema al desactivar la cuenta.', 'error');
                    });
        }
    });
}

function cerrarSesion() {
    localStorage.removeItem('usuarioAutenticado');
    Swal.fire({
        icon: 'info',
        title: 'Sesión cerrada',
        text: 'Has cerrado tu sesión.',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        const menuUsuario = document.getElementById('menu-usuario');
        menuUsuario.innerHTML = `
            <li><a class="dropdown-item" href="#" onclick="mostrarFormularioLogin();">Iniciar Sesión</a></li>
            <li><a class="dropdown-item" href="#" onclick="mostrarFormulario();">Crear Cuenta</a></li>
        `;
        const menuItems = document.querySelectorAll('.nav-item');
        menuItems.forEach(item => {
            item.style.display = 'none'; // Desactivar los elementos del menú
        });
    });
}


// Función para cargar los estados desde el backend
function cargarEstados() {
    return fetch('http://localhost:8080/Zarape/api/estado/getAllEstados')
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => console.error('Error al cargar estados:', error));
}

// Función para cargar las ciudades de un estado específico
function cargarCiudadesPorEstado(idEstado) {
    return fetch(`http://localhost:8080/Zarape/api/ciudad/getCiudadesPorEstado?idEstado=${idEstado}`)
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => console.error('Error al cargar ciudades:', error));
}
function mostrarFormulario(cliente = null) {
    let titulo = cliente !== null ? 'Editar Cliente' : 'Agregar Cliente';
    let botonTexto = cliente !== null ? 'Guardar' : 'Agregar';

    // Variables inicializadas con datos del cliente o valores por defecto
    let idCliente = cliente?.idCliente || '';
    let nombre = cliente?.persona?.nombre || '';
    let apellidos = cliente?.persona?.apellidos || '';
    let telefono = cliente?.persona?.telefono || '';
    let usuario = cliente?.usuario?.nombre || '';
    let contrasenia = cliente?.usuario?.contrasenia || generarContrasena();
    let ciudad = cliente?.ciudad?.idCiudad || '';
    let estado = cliente?.estado?.idEstado || '';
    let activo = cliente?.activo || true;

    // Generador de contraseña
    function generarContrasena() {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const longitud = 12;
        let contrasena = "";
        for (let i = 0; i < longitud; i++) {
            const posicion = Math.floor(Math.random() * caracteres.length);
            contrasena += caracteres.charAt(posicion);
        }
        return contrasena;
    }

    // Mostrar el formulario usando SweetAlert2
    Swal.fire({
        title: titulo,
        html: `
            <form id="formulario-cliente-modal">
                <label for="cliente-nombre">Nombre:</label><br>
                <input type="text" id="cliente-nombre" class="swal2-input" placeholder="Nombre" value="${nombre}"><br>
                <label for="cliente-apellidos">Apellidos:</label><br>
                <input type="text" id="cliente-apellidos" class="swal2-input" placeholder="Apellidos" value="${apellidos}"><br>
                <label for="cliente-telefono">Teléfono:</label><br>
                <input type="text" id="cliente-telefono" class="swal2-input" placeholder="Teléfono" value="${telefono}"><br>
                <label for="cliente-usuario">Usuario:</label><br>
                <input type="text" id="cliente-usuario" class="swal2-input" placeholder="Usuario" value="${usuario}"><br>
                <label for="cliente-contrasenia">Contraseña:</label><br>
                <input type="text" id="cliente-contrasenia" class="swal2-input" placeholder="Contraseña" value="${contrasenia}" disabled><br>
                <label for="cliente-estado">Estado:</label><br><br>
                <select id="cliente-estado" class="swal2-input">
                    <option value="">Selecciona un estado</option>
                </select><br>
                <label for="cliente-ciudad">Ciudad:</label><br><br>
                <select id="cliente-ciudad" class="swal2-input">
                    <option value="">Selecciona una ciudad</option>
                </select><br><br>
                <label for="cliente-activo">Estatus:</label><br>
                <input type="checkbox" id="cliente-activo" class="swal2-checkbox" ${activo ? 'checked' : ''}>
            </form>
        `,
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: botonTexto,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nombreNuevo = document.getElementById('cliente-nombre').value.trim();
            const apellidosNuevo = document.getElementById('cliente-apellidos').value.trim();
            const telefonoNuevo = document.getElementById('cliente-telefono').value.trim();
            const usuarioNuevo = document.getElementById('cliente-usuario').value.trim();
            const estadoNueva = document.getElementById('cliente-estado').value;
            const ciudadNueva = document.getElementById('cliente-ciudad').value;
            const activoNuevo = document.getElementById('cliente-activo').checked;

            if (!nombreNuevo || !apellidosNuevo || !telefonoNuevo || !usuarioNuevo || !estadoNueva || !ciudadNueva) {
                Swal.showValidationMessage('Por favor, complete todos los campos.');
                return false;
            }

            return {
                idCliente: idCliente || null,
                persona: { nombre: nombreNuevo, apellidos: apellidosNuevo, telefono: telefonoNuevo },
                usuario: { nombre: usuarioNuevo, contrasenia: contrasenia },
                ciudad: { idCiudad: ciudadNueva },
                estado: { idEstado: estadoNueva },
                activo: activoNuevo
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const clienteData = result.value;

            const params = {
                datosCliente: JSON.stringify(clienteData)
            };

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(params)
            };

            const url = cliente !== null
                ? 'http://localhost:8080/Zarape/api/cliente/actualizarCliente'
                : 'http://localhost:8080/Zarape/api/cliente/insertarCliente';

            fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
                    Swal.fire(
                        cliente !== null ? '¡Cliente actualizado!' : '¡Cliente agregado!',
                        cliente !== null ? 'Los datos del cliente han sido actualizados.' : 'El nuevo cliente ha sido agregado.',
                        'success'
                    );
                })
                .catch(error => Swal.fire('Error', 'Hubo un problema al guardar el cliente.', 'error'));
        }
    });

    cargarEstados()
        .then(estados => {
            const estadoSelect = document.getElementById('cliente-estado');
            estadoSelect.innerHTML = '<option value="">Selecciona un estado</option>';

            estados.forEach(estadoItem => {
                estadoSelect.innerHTML += `<option value="${estadoItem.idEstado}">${estadoItem.nombre}</option>`;
            });

            if (estado) {
                estadoSelect.value = estado;
                cargarCiudadesPorEstado(estado).then(ciudades => {
                    const ciudadSelect = document.getElementById('cliente-ciudad');
                    ciudadSelect.innerHTML = '<option value="">Selecciona una ciudad</option>';
                    ciudades.forEach(ciudadItem => {
                        ciudadSelect.innerHTML += `<option value="${ciudadItem.idCiudad}">${ciudadItem.nombre}</option>`;
                    });

                    if (ciudad) {
                        ciudadSelect.value = ciudad;
                    }
                }).catch(error => console.error('Error al cargar ciudades:', error));
            }

            estadoSelect.addEventListener('change', () => {
                const estadoId = estadoSelect.value;
                const ciudadSelect = document.getElementById('cliente-ciudad');
                ciudadSelect.innerHTML = '<option value="">Selecciona una ciudad</option>';

                if (estadoId) {
                    cargarCiudadesPorEstado(estadoId).then(ciudades => {
                        ciudades.forEach(ciudadItem => {
                            ciudadSelect.innerHTML += `<option value="${ciudadItem.idCiudad}">${ciudadItem.nombre}</option>`;
                        });
                    }).catch(error => console.error('Error al cargar ciudades:', error));
                }
            });
        })
        .catch(error => console.error('Error al cargar estados:', error));
}

