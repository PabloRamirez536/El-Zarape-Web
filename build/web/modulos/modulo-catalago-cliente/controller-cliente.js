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

function mostrarFormulario(index = null) {
    let titulo = index !== null ? 'Editar Cliente' : 'Agregar Cliente';
    let botonTexto = index !== null ? 'Guardar' : 'Agregar';

    let idCliente = '';
    let nombre = '';
    let apellidos = '';
    let telefono = '';
    let usuario = '';
    let contrasenia = '';
    let ciudad = '';
    let estado = '';
    let activo = true;

    function generarContrasena() {
        let caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&/()=?¡*+'";
        let longitud = 12;
        let contrasena = "";

        for (let i = 0; i < longitud; i++) {
            let posicion = Math.floor(Math.random() * caracteres.length);
            contrasena += caracteres.charAt(posicion);
        }

        return contrasena;
    }

    if (index !== null) {
        let cliente = clientes[index];
        idCliente = cliente.idCliente || '';
        nombre = cliente.persona.nombre || '';
        apellidos = cliente.persona.apellidos || '';
        telefono = cliente.persona.telefono || '';
        usuario = cliente.usuario.nombre || '';
        //contrasenia = cliente.usuario.contrasenia || '';
        contrasenia = "*".repeat(12) || '';
        ciudad = cliente.ciudad ? cliente.ciudad.idCiudad || '' : '';
        estado = cliente.estado ? cliente.estado.idEstado || '' : '';
        activo = cliente.activo || false;
    } else {
        contrasenia = generarContrasena();
    }

    Swal.fire({
        title: titulo,
        html: `
            <form id="formulario-cliente-modal">
                <label for="cliente-nombre">Nombre:</label><br>
                <input type="text" id="cliente-nombre" class="swal2-input" placeholder="Nombre" value="${nombre}" pattern="[a-zA-Z\s]{1,45}" maxlength="45" required><br>
                <label for="cliente-apellidos">Apellidos:</label><br>
                <input type="text" id="cliente-apellidos" class="swal2-input" placeholder="Apellidos" value="${apellidos}" pattern="[a-zA-Z\s]{1,45}" maxlength="45" required><br>
                <label for="cliente-telefono">Teléfono:</label><br>
                <input type="text" id="cliente-telefono" class="swal2-input" placeholder="Teléfono" value="${telefono}"  pattern="[0-9]{10}" maxlength="10" required><br>
                <label for="cliente-usuario">Usuario:</label><br>
                <input type="text" id="cliente-usuario" class="swal2-input" placeholder="Usuario" value="${usuario}" pattern="[a-zA-Z0-9]{1,45}" maxlength="45" required><br>
                <label for="cliente-contrasenia">Contraseña:</label><br>
                <div>
                        <input 
                            type="text" 
                            id="cliente-contrasenia" 
                            class="swal2-input" 
                            placeholder="Contraseña" 
                            value="${contrasenia}" 
                            disabled 
                            style="flex: 1; margin: 0;" 
                        >
                        <button 
                            type="button" 
                            id="btn-generar-contrasenia" 
                            class="swal2-confirm" 
                            style="background-color: #805A3B; color: #fff; padding: 0.5rem 1rem; height: auto; font-size: 0.9rem;"
                        >
                            Generar Contraseña
                        </button>
                    </div>
        

                <label for="cliente-estado">Estado:</label><br><br>
                <select id="cliente-estado" class="swal2-input">
                    <option value="">Selecciona un estado</option>
                </select><br>
                <label for="cliente-ciudad">Ciudad:</label><br><br>
                <select id="cliente-ciudad" class="swal2-input">
                    <option value="">Selecciona una ciudad</option>
                </select><br><br>
                <label for="cliente-activo">Estatus:</label><br>
                <input type="checkbox" id="cliente-activo" class="swal2-checkbox" ${activo ? 'checked' : ''} ${index === null ? 'disabled' : ''}>
            </form>
        `,
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: botonTexto,
        cancelButtonText: 'Cancelar',
        didOpen: () => { //Se activa el código al iniciar el Swal.fire
            const btnGenerarContrasenia = document.getElementById('btn-generar-contrasenia');
            const inputContrasenia = document.getElementById('cliente-contrasenia');

            btnGenerarContrasenia.addEventListener('click', () => {
                const nuevaContrasenia = generarContrasena();
                inputContrasenia.value = nuevaContrasenia;
            });
        },
        preConfirm: () => {
            return new Promise((resolve) => {
                let nombreNuevo = document.getElementById('cliente-nombre').value.trim();
                let apellidosNuevo = document.getElementById('cliente-apellidos').value.trim();
                let telefonoNuevo = document.getElementById('cliente-telefono').value.trim();
                let usuarioNuevo = document.getElementById('cliente-usuario').value.trim();
                let contraseniaNueva = document.getElementById('cliente-contrasenia').value.trim();
                let estadoNueva = document.getElementById('cliente-estado').value;
                let ciudadNueva = document.getElementById('cliente-ciudad').value;
                let activoNuevo = document.getElementById('cliente-activo').checked;


                // Validaciones
                if (!nombreNuevo || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,45}$/.test(nombreNuevo)) {
                    Swal.showValidationMessage('El nombre es obligatorio y debe contener solo letras (máximo 45 caracteres).');
                    resolve(false);
                    return;
                }

                if (!apellidosNuevo || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,45}$/.test(apellidosNuevo)) {
                    Swal.showValidationMessage('Los apellidos son obligatorios y deben contener solo letras (máximo 45 caracteres).');
                    resolve(false);
                    return;
                }

                if (!telefonoNuevo || !/^[0-9]{10}$/.test(telefonoNuevo)) {
                    Swal.showValidationMessage('El teléfono es obligatorio y debe contener exactamente 10 dígitos.');
                    resolve(false);
                    return;
                }

                if (!usuarioNuevo || !/^[a-zA-Z0-9]{1,45}$/.test(usuarioNuevo)) {
                    Swal.showValidationMessage('El usuario es obligatorio, debe tener máximo 45 caracteres y no debe contener espacios.');
                    resolve(false);
                    return;
                }

                if (!estadoNueva) {
                    Swal.showValidationMessage('Por favor, seleccione un estado.');
                    resolve(false);
                    return;
                }

                if (!ciudadNueva) {
                    Swal.showValidationMessage('Por favor, seleccione una ciudad.');
                    resolve(false);
                    return;
                }

                if (contraseniaNueva === "************") {
                    Swal.showValidationMessage('Debes generar una nueva contraseña antes de continuar.');
                    resolve(false);
                    return;
                }


                resolve({
                    idCliente: idCliente || null,
                    persona: {nombre: nombreNuevo, apellidos: apellidosNuevo, telefono: telefonoNuevo},
                    usuario: {nombre: usuarioNuevo, contrasenia: contraseniaNueva},
                    ciudad: {idCiudad: ciudadNueva},
                    estado: {idEstado: estadoNueva},
                    activo: activoNuevo
                });
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const clienteData = result.value;
            const token = localStorage.getItem('token');

            if (!token) { 
                Swal.fire({
                    title: '¡Acceso denegado!',
                    text: 'Debes iniciar sesión para realizar esta acción.',
                    icon: 'warning',
                    timer: 5000, 
                    showConfirmButton: false, 
                    timerProgressBar: true 
                }).then(() => {
                    window.location.href = '../../gestion/gestion-login/view-login.html'; // Redirige a la página de inicio de sesión
                });
                return; 
            }

            let params = {
                datosCliente: JSON.stringify(clienteData),
                token: token
            };

            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams(params)
            };

            fetch(index !== null ? 'http://localhost:8080/Zarape/api/cliente/actualizarCliente' : 'http://localhost:8080/Zarape/api/cliente/insertarCliente', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (index !== null) {
                            clientes.push(data, );
                            Swal.fire('¡Cliente actualizado!', 'Los datos del cliente han sido actualizados.', 'success');
                        } else {
                            clientes.push(data);
                            Swal.fire('¡Cliente agregado!', 'El nuevo cliente ha sido agregado.', 'success');
                        }
                        cargarTablaClientes();
                    })
                    .catch(error => Swal.fire('Error', 'Hubo un problema al guardar el cliente.', 'error'));
        }
    });
    cargarEstados().then(estados => {
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

        estadoSelect.addEventListener('change', function () {
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
    }).catch(error => console.error('Error al cargar estados:', error));
}

// Función para cargar y actualizar la tabla de clientes
function cargarTablaClientes() {
    document.getElementById("busqueda-cliente").value = "";
    const token = localStorage.getItem('token');
    if (!token) { // Validar si el token no existe
        Swal.fire({
            title: '¡Acceso denegado!',
            text: 'Debes iniciar sesión para realizar esta acción.',
            icon: 'warning',
            timer: 5000, // Duración de 5 segundos
            showConfirmButton: false, // Oculta el botón de confirmación
            timerProgressBar: true // Muestra la barra de progreso
        }).then(() => {
            window.location.href = '../../gestion/gestion-login/view-login.html'; // Redirige a la página de inicio de sesión
        });
        return; // Detener la ejecución
    }
    let ruta = "http://localhost:8080/Zarape/api/cliente/getAllClientes?token=" + token;
    fetch(ruta)
            .then(response => response.json())
            .then(data => {
                clientes = data;
                const tabla = document.getElementById('tabla-clientes').getElementsByTagName('tbody')[0];
                tabla.innerHTML = '';

                data.forEach((cliente, index) => {
                    let fila = tabla.insertRow();
                    fila.innerHTML = `
                    <td>${cliente.idCliente}</td>
                    <td>${cliente.persona.nombre}</td>
                    <td>${cliente.persona.apellidos}</td>
                    <td>${cliente.persona.telefono}</td>
                    <td>${cliente.usuario.nombre}</td>
                    <td>${"*".repeat(12)}</td>
                    <td>${cliente.estado.nombre}</td>
                    <td>${cliente.ciudad.nombre}</td>
                    <td>${cliente.activo ? 'Activo' : 'Inactivo'}</td>
                    <td>
                        <button class="icon-button" onclick="mostrarFormulario(${index})">
                            <img src="../../recursos/media/editar.png" alt="Icono Editar" class="icon-acciones">
                        </button>
                        <button class="icon-button" onclick="eliminarCliente(${index})">
                            <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon-acciones">
                        </button>
                    </td>
                `;
                });
            })
            .catch(error => console.error('Error al cargar clientes:', error));
}

/// Función para eliminar un cliente
function eliminarCliente(index) {
    // Verificar si el cliente ya está inactivo
    const cliente = clientes[index];

    if (!cliente.activo) {
        // Si el cliente está inactivo, mostrar un mensaje
        Swal.fire({
            title: 'Este cliente ya está inactivo',
            text: 'No puedes inactivar un cliente inactivo.',
            icon: 'info',
            confirmButtonColor: '#805A3B',
            confirmButtonText: 'Aceptar'
        });
        return;  // Salir de la función si el cliente ya está inactivo
    }

    // Si el cliente está activo, proceder con la confirmación de eliminación
    Swal.fire({
        title: '¿Estás seguro de desactivar este cliente?',
        text: '¡El estatus cambiara a Inactivo!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const clienteId = cliente.idCliente;
            const token = localStorage.getItem('token');

            if (!token) { // Validar si el token no existe
                Swal.fire({
                    title: '¡Acceso denegado!',
                    text: 'Debes iniciar sesión para realizar esta acción.',
                    icon: 'warning',
                    timer: 5000, // Duración de 5 segundos
                    showConfirmButton: false, // Oculta el botón de confirmación
                    timerProgressBar: true // Muestra la barra de progreso
                }).then(() => {
                    window.location.href = '../../gestion/gestion-login/view-login.html'; // Redirige a la página de inicio de sesión
                });
                return; // Detener la ejecución
            }

            // Crear el objeto con los parámetros para la solicitud
            const params = {idCliente: clienteId, token: token};

            // Hacer la solicitud POST (simulando eliminación lógica)
            fetch('http://localhost:8080/Zarape/api/cliente/eliminarCliente', {
                method: 'POST', // Usamos POST ya que el backend espera esta solicitud
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(params)  // Convertir los parámetros en el formato adecuado
            })
                    .then(response => {
                        if (response.ok) {
                            cargarTablaClientes(); // Actualizar la tabla de clientes
                            Swal.fire('¡Eliminado!', 'El cliente ha sido inactivado exitosamente.', 'success');
                        } else {
                            Swal.fire('Error', 'Hubo un problema al inactivar el cliente.', 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Hubo un problema al inactivar el cliente.', 'error');
                    });
        }
    });
}

// Función para buscar clientes
function buscarCliente() {
    let query = document.getElementById('busqueda-cliente').value.toLowerCase();  // Obtener texto de búsqueda y convertirlo a minúsculas
    let tabla = document.getElementById('tabla-clientes').getElementsByTagName('tbody')[0];
    let filas = tabla.getElementsByTagName('tr');  // Obtener todas las filas de la tabla

    // Iterar sobre las filas de la tabla y mostrar solo las que coinciden con la búsqueda
    for (let i = 0; i < filas.length; i++) {
        let fila = filas[i];
        let columnas = fila.getElementsByTagName('td');  // Obtener las columnas de la fila
        let match = false;

        // Comprobar si alguna de las columnas contiene el texto de búsqueda
        for (let j = 0; j < columnas.length; j++) {
            let textoColumna = columnas[j].textContent || columnas[j].innerText;
            if (textoColumna.toLowerCase().indexOf(query) > -1) {
                match = true;  // Si hay coincidencia, mostrar la fila
                break;
            }
        }

        // Mostrar u ocultar la fila según si coincide con la búsqueda
        if (match) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    }
}


// Inicialización
window.onload = cargarTablaClientes;
