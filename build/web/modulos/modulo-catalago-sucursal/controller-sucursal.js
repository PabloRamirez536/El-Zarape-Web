// Función para cargar los estados desde el backend
function cargarEstados() {
    return fetch(`http://localhost:8080/Zarape/api/estado/getAllEstados`)
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => console.error('Error al cargar ciudades:', error));
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

function descomponerDireccion(direccionCompleta) {
    const partes = direccionCompleta.split(',');
    const calleCompleta = partes[0]?.trim() || '';
    const numCalle = calleCompleta.split(' ').pop(); // Extrae el último elemento como número
    const calle = calleCompleta.slice(0, calleCompleta.lastIndexOf(' ')).trim(); // Todo menos el número
    const colonia = partes.length > 1 ? partes.slice(1).join(',').trim() : ''; // Junta el resto como colonia

    console.log({calle, numCalle, colonia}); // Verifica los valores descompuestos

    return {calle, numCalle, colonia};
}

function mostrarFormulario(index = null) {
    let titulo = index !== null ? 'Editar Sucursal' : 'Agregar Sucursal';
    let botonTexto = index !== null ? 'Guardar' : 'Agregar';

    let idSucursal = '';
    let nombre = '';
    let latitud = '';
    let longitud = '';
    let foto = "../../recursos/media/sucursal.jpg"; // Ruta predeterminada de la foto
    let urlWeb = '';
    let horarios = '';
    let calle = '';
    let numCalle = '';
    let colonia = '';
    let ciudadNombre = '';
    let estadoNombre = '';
    let activo = true;

    // Verificar si es una edición
    if (index !== null) {
        let sucursal = sucursales[index];

        // Asignar valores
        idSucursal = sucursal.idSucursal || '';
        nombre = sucursal.nombre || '';
        latitud = sucursal.latitud || '';
        longitud = sucursal.longitud || '';
        foto = sucursal.foto || foto; // Predeterminado si no hay foto
        urlWeb = sucursal.urlWeb || '';
        horarios = sucursal.horarios || '';

        // Descomponer dirección
        const direccionDescompuesta = descomponerDireccion(sucursal.direccion);
        calle = direccionDescompuesta.calle || '';
        numCalle = direccionDescompuesta.numCalle || '';
        colonia = direccionDescompuesta.colonia || '';

        // Otros valores
        ciudadNombre = sucursal.ciudadNombre?.idCiudad || '';
        estadoNombre = sucursal.estadoNombre?.idEstado || '';
        activo = sucursal.activo || false;
    }

    Swal.fire({
        title: titulo,
        html: `<form id="formulario-sucursal-modal">
        <label for="sucursal-nombre">Nombre:</label><br>
        <input type="text" id="sucursal-nombre" class="swal2-input" value="${nombre}" 
        maxlength="65" required pattern="[a-zA-Z0-9\\s]+"><br>
        <label for="sucursal-latitud">Latitud:</label><br>
        <input type="text" id="sucursal-latitud" class="swal2-input" value="${latitud}" maxlength="9" required 
        pattern="^(-?([1-8]?\\d(\\.\\d+)?|90(\\.0+)?))$"><br>
        <label for="sucursal-longitud">Longitud:</label><br>
        <input type="text" id="sucursal-longitud" class="swal2-input" value="${longitud}" maxlength="10" 
        required pattern="^(-?([1-1]?\\d{1,2}(\\.\\d+)?|180(\\.0+)?))$"><br>
        <label for="sucursal-foto">Foto:</label><br>
        <input type="file" id="sucursal-foto" class="swal2-input" accept=".jpg, .png" required><br>
        <img id="sucursal-preview" src="${foto}" style="max-width: 100%; max-height: 150px; margin-top: 10px;"><br>
        <label for="sucursal-url-web">URL Página Web:</label><br>
        <input type="text" id="sucursal-url-web" class="swal2-input" value="${urlWeb}" maxlength="65" 
        pattern="https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" required><br>
        <label for="sucursal-horarios">Horarios:</label><br>
        <input type="text" id="sucursal-horarios" class="swal2-input" value="${horarios}" maxlength="13" 
        pattern="^([01]?[0-9]|2[0-3]):([0-5]?[0-9])\\s?a\\s?([01]?[0-9]|2[0-3]):([0-5]?[0-9])$" required><br>
        <label for="sucursal-calle">Calle:</label><br>
        <input type="text" id="sucursal-calle" class="swal2-input" value="${calle}" maxlength="65" 
        pattern="^[a-zA-Z0-9\\s,.-#]+$" required><br>
        <label for="sucursal-num-calle">Número Calle:</label><br>
        <input type="text" id="sucursal-num-calle" class="swal2-input" value="${numCalle}" maxlength="65" 
        pattern="^[a-zA-Z0-9\\-]+$" required><br>
        <label for="sucursal-colonia">Colonia:</label><br>
        <input type="text" id="sucursal-colonia" class="swal2-input" value="${colonia}" maxlength="65" 
        pattern="^[a-zA-Z0-9\\s.,'-]+$" required><br>
        <label for="sucursal-estado">Estado:</label><br>
        <select id="sucursal-estado" class="swal2-input">
            <option value="">Selecciona un estado</option>
        </select><br>
        <label for="sucursal-ciudad">Ciudad:</label><br>
        <select id="sucursal-ciudad" class="swal2-input">
            <option value="">Selecciona una ciudad</option>
        </select><br>
        <label for="sucursal-estatus">Estatus:</label><br>
        <input type="checkbox" id="sucursal-activo" class="swal2-checkbox" ${activo ? 'checked' : ''} ${index
                === null ? 'disabled' : ''}>
    </form>`,
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: botonTexto,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            let nombreNuevo = document.getElementById('sucursal-nombre').value.trim();
            let latitudNueva = document.getElementById('sucursal-latitud').value.trim();
            let longitudNueva = document.getElementById('sucursal-longitud').value.trim();
            let urlWebNueva = document.getElementById('sucursal-url-web').value.trim();
            let horariosNuevos = document.getElementById('sucursal-horarios').value.trim();
            let calleNueva = document.getElementById('sucursal-calle').value.trim();
            let numCalleNuevo = document.getElementById('sucursal-num-calle').value.trim();
            let coloniaNueva = document.getElementById('sucursal-colonia').value.trim();
            let ciudadNueva = document.getElementById('sucursal-ciudad').value;
            let estadoNuevo = document.getElementById('sucursal-estado').value;
            let activoNuevo = document.getElementById('sucursal-activo').checked;

//            // Validar que los campos no estén vacíos
//            if (!nombreNuevo || !latitudNueva || !longitudNueva || !urlWebNueva || !horariosNuevos || !calleNueva || !numCalleNuevo || !coloniaNueva || !ciudadNueva || !estadoNuevo) {
//                Swal.showValidationMessage('Por favor, complete todos los campos.');
//                return false;
//            }

            // Validaciones
            if (!nombreNuevo || !/^[a-zA-Z0-9\s]{1,65}$/.test(nombreNuevo)) {
                Swal.showValidationMessage('El nombre es obligatorio y debe contener solo letras, números y espacios (máximo 65 caracteres).');
                return false;
            }

            if (!latitudNueva || !/^(-?([1-8]?\d(\.\d+)?|90(\.0+)?))$/.test(latitudNueva)) {
                Swal.showValidationMessage('La latitud es obligatoria y debe estar en un rango válido (-90.0 a 90.0).');
                return false;
            }

            if (!longitudNueva || !/^(-?([1-1]?\d{1,2}(\.\d+)?|180(\.0+)?))$/.test(longitudNueva)) {
                Swal.showValidationMessage('La longitud es obligatoria y debe estar en un rango válido (-180.0 a 180.0).');
                return false;
            }

            if (!urlWebNueva || !/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(urlWebNueva)) {
                Swal.showValidationMessage('El URL de la página web es obligatorio y debe tener un formato válido (ejemplo: https://example.com).');
                return false;
            }

            if (!horariosNuevos || !/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])\s?a\s?([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(horariosNuevos)) {
                Swal.showValidationMessage('El horario es obligatorio y debe estar en el formato HH:MM a HH:MM.');
                return false;
            }

            if (!calleNueva || !/^[a-zA-Z0-9\s,.\-#]{1,65}$/.test(calleNueva)) {
                Swal.showValidationMessage('La calle es obligatoria y debe tener un formato válido (máximo 65 caracteres).');
                return false;
            }


            if (!numCalleNuevo || !/^[a-zA-Z0-9\-]{1,65}$/.test(numCalleNuevo)) {
                Swal.showValidationMessage('El número de calle es obligatorio y debe tener un formato válido (máximo 65 caracteres).');
                return false;
            }

            if (!coloniaNueva || !/^[a-zA-Z0-9\s.,'-]{1,65}$/.test(coloniaNueva)) {
                Swal.showValidationMessage('La colonia es obligatoria y debe tener un formato válido (máximo 65 caracteres).');
                return false;
            }

            if (!estadoNuevo) {
                Swal.showValidationMessage('Por favor, seleccione un estado.');
                return false;
            }

            if (!ciudadNueva) {
                Swal.showValidationMessage('Por favor, seleccione una ciudad.');
                return false;
            }

            if (document.getElementById('sucursal-foto').files[0]) {
                const file = document.getElementById('sucursal-foto').files[0];
                const allowedExtensions = ['image/jpeg', 'image/png'];
                if (!allowedExtensions.includes(file.type)) {
                    Swal.showValidationMessage('El archivo de foto debe ser de tipo .jpg o .png.');
                    return false;
                }
            }

            return Promise.resolve({
                idSucursal: index !== null ? idSucursal : null, // Usar el ID para la actualización
                nombre: nombreNuevo,
                latitud: latitudNueva,
                longitud: longitudNueva,
                foto: foto, // Usar la foto existente o predeterminada
                urlWeb: urlWebNueva,
                horarios: horariosNuevos,
                calle: calleNueva,
                numCalle: numCalleNuevo,
                colonia: coloniaNueva,
                ciudadNombre: {idCiudad: ciudadNueva},
                estadoNombre: {idEstado: estadoNuevo},
                activo: activoNuevo
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const sucursalData = result.value;
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
                    window.location.href = '../../gestion/gestion-login/view-login.html';
                });
                return;
            }

            let params = {
                datosSucursal: JSON.stringify(sucursalData),
                token: token
            };
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams(params)
            };

            // Determinar la URL y enviar la solicitud
            fetch(index !== null ? 'http://localhost:8080/Zarape/api/sucursal/updateSucursal' : 'http://localhost:8080/Zarape/api/sucursal/insertSucursal', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data); // Agregar un log aquí para verificar lo que devuelve el servidor
                        if (index !== null) {
                            // Actualizar la sucursal existente
                            sucursales[index] = data;
                            Swal.fire('¡Sucursal actualizada!', 'Los datos de la sucursal han sido actualizados.', 'success');
                        } else {
                            // Agregar la nueva sucursal
                            sucursales.push(data);
                            Swal.fire('¡Sucursal agregada!', 'La nueva sucursal ha sido agregada.', 'success');
                        }
                        cargarTablaSucursales();
                    })
                    .catch(error => Swal.fire('Error', 'Hubo un problema al guardar la sucursal.', 'error'));
            console.log("Datos enviados:", JSON.stringify(sucursalData));
        }
    });

    // Cargar estados y ciudades
    cargarEstados().then(estados => {
        const estadoSelect = document.getElementById('sucursal-estado');
        estadoSelect.innerHTML = '<option value="">Selecciona un estado</option>';

        estados.forEach(estadoItem => {
            estadoSelect.innerHTML += `<option value="${estadoItem.idEstado}">${estadoItem.nombre}</option>`;
        });

        if (estadoNombre) {
            estadoSelect.value = estadoNombre;
            cargarCiudadesPorEstado(estadoNombre).then(ciudades => {
                const ciudadSelect = document.getElementById('sucursal-ciudad');
                ciudadSelect.innerHTML = '<option value="">Selecciona una ciudad</option>';
                ciudades.forEach(ciudadItem => {
                    ciudadSelect.innerHTML += `<option value="${ciudadItem.idCiudad}">${ciudadItem.nombre}</option>`;
                });

                if (ciudadNombre) {
                    ciudadSelect.value = ciudadNombre;
                }
            }).catch(error => console.error('Error al cargar ciudades:', error));
        }

        estadoSelect.addEventListener('change', function () {
            const estadoId = estadoSelect.value;
            const ciudadSelect = document.getElementById('sucursal-ciudad');
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

// Función para cargar y actualizar la tabla de sucursales
function cargarTablaSucursales() {
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
            window.location.href = '../../gestion/gestion-login/view-login.html';
        });
        return;
    }
    let ruta = "http://localhost:8080/Zarape/api/sucursal/getAllSucursales?token=" + token;
    fetch(ruta)
            .then(response => response.json())
            .then(data => {
                sucursales = data;
                const tabla = document.getElementById('tabla-sucursales').getElementsByTagName('tbody')[0];
                tabla.innerHTML = '';

                data.forEach((sucursal, index) => {
                    let fila = tabla.insertRow();
                    fila.innerHTML = `
                    <td>${sucursal.idSucursal}</td>
                    <td>${sucursal.nombre}</td>
                    <td>${sucursal.latitud}</td>
                    <td>${sucursal.longitud}</td>
                    <td>
                        <img src="../../recursos/media/sucursal.jpg" alt="Foto de Producto" style="max-width: 60px; max-height: 60px;" />
                    </td>
                    <td>${sucursal.urlWeb}</td>
                    <td>${sucursal.horarios}</td>
                    <td>${sucursal.direccion}</td>
                    <td>${sucursal.ciudadNombre.nombre}</td>
                    <td>${sucursal.estadoNombre.nombre}</td>
                    <td>${sucursal.activo ? 'Activo' : 'Inactivo'}</td>
                    <td>
                        <button class="icon-button" onclick="mostrarFormulario(${index})">
                            <img src="../../recursos/media/editar.png" alt="Icono Editar" class="icon-acciones">
                        </button>
                        <button class="icon-button" onclick="eliminarSucursal(${index})">
                            <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon-acciones">
                        </button>
                    </td>
                `;
                });
            })
            .catch(error => console.error('Error al cargar sucursales:', error));
}

window.onload = function () {
    cargarTablaSucursales();
};

/// Función para eliminar una sucursal
function eliminarSucursal(index) {

    // Obtener el producto
    const sucursalesIn = sucursales[index];
    // Verificar si el producto ya está inactivo
    if (!sucursalesIn.activo) {
        Swal.fire({
            title: 'Esta sucursal ya está inactiva',
            text: 'No puedes inactivar una sucursal que ya está inactiva.',
            icon: 'info',
            confirmButtonColor: '#805A3B',
            confirmButtonText: 'Aceptar'
        });
        return;  // Salir de la función si el producto ya está inactivo
    }

    Swal.fire({
        title: '¿Estás seguro de desactivar esta sucursal?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const SucursalId = sucursales[index].idSucursal;
            const token = localStorage.getItem('token');
            
            if(!token){
                Swal.fire({
                    title: '¡Acceso denegado!',
                    text: 'Debes iniciar sesión para realizar esta acción.',
                    icon: 'warning',
                    timer: 5000,
                    showConfirmButton: false,
                    timerProgressBar: true
                }).then(() => {
                    window.location.href = '../../gestion/gestion-login/view-login.html';
                });
                return;
            }
            
            const params = {idSucursal: SucursalId, token:token};

            fetch('http://localhost:8080/Zarape/api/sucursal/deleteSucursal', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams(params)
            })
                    .then(response => {
                        if (response.status !== 200) {
                            throw new Error('Error al eliminar la sucursal');
                        }
                        return response.json();
                    })
                    .then(data => {

                        if (data.result === "Sucursal eliminada correctamente") {
                            sucursales[index].estatus = "Inactivo";
                            cargarTablaSucursales();
                            Swal.fire('¡Eliminado!', 'El sucursal ha sido inactivada exitosamente.', 'success');
                        } else {
                            Swal.fire('Error', 'Respuesta inesperada: ' + data.result, 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('Error', error.message || 'Hubo un problema al eliminar la sucursal.', 'error');
                    });
        }
    });
}

function buscarSucursal() {
    let query = document.getElementById('busqueda-sucursal').value.toLowerCase(); // Obtener texto de búsqueda y convertirlo a minúsculas
    let tabla = document.getElementById('tabla-sucursales').getElementsByTagName('tbody')[0];
    let filas = tabla.getElementsByTagName('tr'); // Obtener todas las filas de la tabla

    // Iterar sobre las filas de la tabla y mostrar solo las que coinciden con la búsqueda
    for (let i = 0; i < filas.length; i++) {
        let fila = filas[i];
        let columnas = fila.getElementsByTagName('td'); // Obtener las columnas de la fila
        let match = false;

        // Comprobar si alguna de las columnas contiene el texto de búsqueda
        for (let j = 0; j < columnas.length; j++) {
            let textoColumna = columnas[j].textContent || columnas[j].innerText;
            if (textoColumna.toLowerCase().indexOf(query) > -1) {
                match = true; // Si hay coincidencia, mostrar la fila
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

// Función para guardar los clientes (simulación)
function guardarSucursales() {
    console.log('Sucursales guardadas:', sucursales);
    // Aquí puedes agregar la lógica para guardar en el servidor.
}

// Inicialización
window.onload = cargarTablaSucursales();
