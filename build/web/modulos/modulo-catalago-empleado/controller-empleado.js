// Función para cargar los estados desde el backend

function cargarSucursales() {
    return fetch('http://localhost:8080/Zarape/api/empleado/getAllSucursalesActivas')
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => console.error('Error al cargar sucursales:', error));
}

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
    let titulo = index !== null ? 'Editar Empleado' : 'Agregar Empleado';
    let botonTexto = index !== null ? 'Guardar' : 'Agregar';

    let idEmpleado = '';
    let nombre = '';
    let apellidos = '';
    let telefono = '';
    let ciudad = '';
    let estado = '';
    let puesto = '';
    let usuario = '';
    let contrasenia = '';
    let sucursal = '';
    let activo = true;

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

    if (index !== null) {
        let empleado = empleados[index];
        idEmpleado = empleado.idEmpleado || '';
        nombre = empleado.persona.nombre || '';
        apellidos = empleado.persona.apellidos || '';
        telefono = empleado.persona.telefono || '';
        ciudad = empleado.ciudad ? empleado.ciudad.idCiudad || '' : '';
        estado = empleado.estado ? empleado.estado.idEstado || '' : '';
        usuario = empleado.usuario.nombre || '';
        contrasenia = empleado.usuario.contrasenia || '';
        sucursal = empleado.sucursal ? empleado.sucursal.idSucursal || '' : '';
        activo = empleado.activo || false;
    } else {
        contrasenia = generarContrasena();
    }

    Swal.fire({
        title: titulo,
        html: `
                <form id="formulario-empleado-modal">
                    <label for="empleado-nombre">Nombre:</label><br>
                    <input type="text" id="empleado-nombre" class="swal2-input" placeholder="Nombre" value="${nombre}"><br>
            
                    <label for="empleado-apellido">Apellidos:</label><br>
                    <input type="text" id="empleado-apellidos" class="swal2-input" placeholder="Apellidos" value="${apellidos}"><br>
           
                    <label for="empleado-telefono">Teléfono:</label><br>
                    <input type="text" id="empleado-telefono" class="swal2-input" placeholder="Telefono" value="${telefono}"><br>
                    
                    <label for="empleado-estado">Estado:</label><br><br>
                    <select id="empleado-estado" class="swal2-input">
                    <option value="">Selecciona un estado</option>
                    </select><br>
            
                    <label for="empleado-ciudad">Ciudad:</label><br>
                    <br><select id="empleado-ciudad" class="swal2-input">
                    <option value="">Selecciona una ciudad</option>
                    </select><br><br>
            
                       <label for="empleado-usuario">Usuario:</label><br>
                    <input type="text" id="empleado-usuario" class="swal2-input" placeholder="Usuario" value="${usuario}"><br>
            
                    <label for="empleado-contrasenia">Contrasenia:</label><br>
                    <input type="text" id="empleado-contrasenia" class="swal2-input" placeholder="Contrasenia" value="${contrasenia}" disabled><br>
                   
                    <label for="empleado-sucursal">Sucursal:</label><br><br>
                    <select id="empleado-sucursal" class="swal2-input">
                     <option value="">Selecciona una sucursal</option>
                     </select><br>
                   
                    
                    <label for="empleado-activo">Estatus:</label><br>
                    <input type="checkbox" id="empleado-activo" class="swal2-checkbox" ${activo ? 'checked' : ''}>
                    </form>
            `,
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: botonTexto,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return new Promise((resolve) => {
                let nombreE = document.getElementById('empleado-nombre').value.trim();
                let apellidoE = document.getElementById('empleado-apellidos').value.trim();
                let telefono = document.getElementById('empleado-telefono').value.trim();
                let ciudad = document.getElementById('empleado-ciudad').value;
                let estado = document.getElementById('empleado-estado').value;
                let usuarioE = document.getElementById('empleado-usuario').value.trim();
                let contraseniaE = document.getElementById('empleado-contrasenia').value.trim();
                let sucursal = document.getElementById('empleado-sucursal').value;
                let activoE = document.getElementById('empleado-activo').checked; // true/false



                // Validar campos obligatorios
                    if (!nombreE || !apellidoE || !telefono || !ciudad || !estado || !usuarioE || !sucursal) {
                        Swal.showValidationMessage('Completar los campos solicitados');
                        resolve(false);
                    } else {
                    resolve({
                        idEmpleado: idEmpleado || null,
                        persona: {nombre: nombreE, apellidos: apellidoE, telefono: telefono},
                        usuario: {nombre: usuarioE, contrasenia: contraseniaE}, // Usar usuarioE y contraseniaE
                        ciudad: {idCiudad: ciudad},
                        estado: {idEstado: estado},
                        activo: activoE,
                        sucursal: {idSucursal: sucursal}

                    });
                }
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const empleadoData = result.value; // Asegúrate de que result.value tenga datos válidos.

            let params = {
                datosEmpleado: JSON.stringify(empleadoData)
            };

            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams(params)
            };

            fetch(index !== null ? 'http://localhost:8080/Zarape/api/empleado/actualizarEmpleado' : 'http://localhost:8080/Zarape/api/empleado/insertarEmpleado', requestOptions)
                    .then(data => {
                        console.log(data);
                        if (index !== null) {
                            empleados.push(data);  // Si es una actualización, agregar los datos recibidos
                            Swal.fire('¡Empleado actualizado!', 'Los datos del empleado han sido actualizados.', 'success');
                        } else {
                            empleados.push(data);  // Si es una inserción, agregar el nuevo empleado
                            Swal.fire('¡Empleado agregado!', 'El nuevo empleado ha sido agregado.', 'success');
                        }
                        actualizarEmpleado();  // Actualizar la tabla de empleados con los nuevos datos
                    })
                    .catch(error => Swal.fire('Error', 'Hubo un problema al guardar el empleado.', 'error'));
        }
    });
    cargarEstados().then(estados => {
        const estadoSelect = document.getElementById('empleado-estado');
        estadoSelect.innerHTML = '<option value="">Selecciona un estado</option>';

        estados.forEach(estadoItem => {
            estadoSelect.innerHTML += `<option value="${estadoItem.idEstado}">${estadoItem.nombre}</option>`;
        });

        if (estado) {
            estadoSelect.value = estado;
            cargarCiudadesPorEstado(estado).then(ciudades => {
                const ciudadSelect = document.getElementById('empleado-ciudad');
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
            const ciudadSelect = document.getElementById('empleado-ciudad');
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

    cargarSucursales().then(sucursales => {
        const sucursalSelect = document.getElementById('empleado-sucursal');
        sucursalSelect.innerHTML = '<option value="">Selecciona una sucursal</option>';

        sucursales.forEach(sucursalItem => {
            sucursalSelect.innerHTML += `<option value="${sucursalItem.idSucursal}">${sucursalItem.nombre}</option>`;
        });
        if (sucursal) {
        sucursalSelect.value = sucursal; // Asignar el valor de la sucursal
    }
    }).catch(error => console.error('Error al cargar sucursales:', error));
}

// Función para cargar y actualizar la tabla de empleados
function actualizarEmpleado() {
    document.getElementById("busqueda-empleado").value = ""; // Limpia el campo de búsqueda
    let ruta = "http://localhost:8080/Zarape/api/empleado/getAllEmpleados"; // Ruta de la API
    fetch(ruta)
            .then(response => response.json())
            .then(data => {
                empleados = data;
                const tabla = document.getElementById('tabla-empleados').getElementsByTagName('tbody')[0];
                tabla.innerHTML = '';

                data.forEach((empleado, index) => {
                    let fila = tabla.insertRow();
                    fila.innerHTML = `
                <td>${empleado.idEmpleado}</td>
                <td>${empleado.persona.nombre}</td>
                <td>${empleado.persona.apellidos}</td>
                <td>${empleado.persona.telefono}</td>
                <td>${empleado.estado.nombre}</td>
                <td>${empleado.ciudad.nombre}</td>
                <td>${empleado.usuario.nombre}</td>
                <td>${"*".repeat(empleado.usuario.contrasenia.length)}</td>
                <td>${empleado.sucursal.nombre}</td>
                <td>${empleado.activo ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="icon-button" onclick="mostrarFormulario(${index})">
                        <img src="../../recursos/media/editar.png" alt="Icono Editar" class="icon-acciones">
                    </button>
                    <button class="icon-button" onclick="eliminarEmpleado(${index})">
                        <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon-acciones">
                    </button>
                </td>
            `;
                });
            })
            .catch(error => console.error('Error al cargar empleados:', error));
}



/// Función para eliminar un cliente
function eliminarEmpleado(index) {
    // Verificar si el cliente ya está inactivo
    const empleado = empleados[index];

    if (!empleado.activo) {
        // Si el cliente está inactivo, mostrar un mensaje
        Swal.fire({
            title: 'Este empleado ya está inactivo',
            text: 'No puedes inactivar un empleado inactivo.',
            icon: 'info',
            confirmButtonColor: '#805A3B',
            confirmButtonText: 'Aceptar'
        });
        return;  // Salir de la función si el cliente ya está inactivo
    }

    // Si el empleado está activo, proceder con la confirmación de eliminación
    Swal.fire({
        title: '¿Estás seguro de desactivar este empleado?',
        text: '¡El estatus cambiara a Inactivo!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const empleadoId = empleado.idEmpleado;

            // Crear el objeto con los parámetros para la solicitud
            const params = {idEmpleado: empleadoId};

            // Hacer la solicitud POST (simulando eliminación lógica)
            fetch('http://localhost:8080/Zarape/api/empleado/eliminarEmpleado', {
                method: 'POST', // Usamos POST ya que el backend espera esta solicitud
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(params)
            })
                    .then(response => {
                        if (response.ok) {
                            actualizarEmpleado();
                            Swal.fire('¡Eliminado!', 'El empleado ha sido inactivado exitosamente.', 'success');
                        } else {
                            Swal.fire('Error', 'Hubo un problema al inactivar el empleado.', 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Hubo un problema al inactivar el empleado.', 'error');
                    });
        }
    });
}


// Función para buscar clientes
function buscarEmpleado() {
    let query = document.getElementById('busqueda-empleado').value.toLowerCase();  // Obtener texto de búsqueda y convertirlo a minúsculas
    let tabla = document.getElementById('tabla-empleados').getElementsByTagName('tbody')[0];
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
window.onload = actualizarEmpleado;
