/*Copyright 2024*/
// Array para almacenar las sucursales
let sucursales = [];

// Función para mostrar el formulario de agregar/editar sucursal
function mostrarFormulario(index = null) {
    let titulo = index !== null ? 'Editar Sucursal' : 'Agregar Sucursal';
    let botonTexto = index !== null ? 'Guardar' : 'Agregar';

    let nombre = '';
    let calle = '';
    let numero = '';
    let colonia = '';
    let ciudad = '';
    let estado = '';
    let codigoPostal = '';
    let latitud = '';
    let longitud = '';
    let fotoSucursal = '';
    let urlPagina = '';
    let encargado = '';
    let horaApertura = '';
    let horaCierre = '';

    if (index !== null) {
        // Si es una edición, cargar los datos de la sucursal seleccionada
        let sucursal = sucursales[index];
        nombre = sucursal.nombre || '';
        calle = sucursal.calle || '';
        numero = sucursal.numero || '';
        colonia = sucursal.colonia || '';
        ciudad = sucursal.ciudad || '';
        estado = sucursal.estado || '';
        codigoPostal = sucursal.codigoPostal || '';
        latitud = sucursal.latitud || '';
        longitud = sucursal.longitud || '';
        fotoSucursal = sucursal.fotoSucursal || '';
        urlPagina = sucursal.urlPagina || '';
        encargado = sucursal.encargado || '';
        horaApertura = sucursal.horaApertura || '';
        horaCierre = sucursal.horaCierre || '';
    }

    Swal.fire({
        title: titulo,
        html: `
            <form id="formulario-sucursal-modal">
                <label for="nombre-modal">Nombre:</label><br>
                <input type="text" id="nombre-modal" class="swal2-input" placeholder="Nombre" value="${nombre}"><br>
                <label for="calle-modal">Calle:</label><br>
                <input type="text" id="calle-modal" class="swal2-input" placeholder="Calle" value="${calle}"><br>
                <label for="numero-modal">Número:</label><br>
                <input type="text" id="numero-modal" class="swal2-input" placeholder="Número" value="${numero}"><br>
                <label for="colonia-modal">Colonia:</label><br>
                <input type="text" id="colonia-modal" class="swal2-input" placeholder="Colonia" value="${colonia}"><br>
                <label for="ciudad-modal">Ciudad:</label><br>
                <input type="text" id="ciudad-modal" class="swal2-input" placeholder="Ciudad" value="${ciudad}"><br>
                <label for="estado-modal">Estado:</label><br>
                <input type="text" id="estado-modal" class="swal2-input" placeholder="Estado" value="${estado}"><br>
                <label for="codigo-postal-modal">Código Postal:</label><br>
                <input type="number" id="codigo-postal-modal" class="swal2-input" placeholder="Código Postal" value="${codigoPostal}"><br>
                <label for="latitud-modal">Latitud:</label><br>
                <input type="text" id="latitud-modal" class="swal2-input" placeholder="Latitud" value="${latitud}"><br>
                <label for="longitud-modal">Longitud:</label><br>
                <input type="text" id="longitud-modal" class="swal2-input" placeholder="Longitud" value="${longitud}"><br>
                <label for="foto-sucursal-modal">Foto Sucursal:</label><br>
                <input type="file" id="foto-sucursal-modal" class="swal2-input" accept="image/*"><br>
                <img id="foto-sucursal-preview" src="${fotoSucursal}" style="max-width: 100%; max-height: 200px; margin-top: 10px;"><br><br>
                <label for="url-pagina-modal">URL Página Web:</label><br>
                <input type="text" id="url-pagina-modal" class="swal2-input" placeholder="URL Página Web" value="${urlPagina}"><br>
                <label for="encargado-modal">Encargado:</label><br>
                <input type="text" id="encargado-modal" class="swal2-input" placeholder="Encargado" value="${encargado}"><br>
                <label for="hora-apertura-modal">Hora De Apertura:</label><br>
                <input type="time" id="hora-apertura-modal" class="swal2-input" placeholder="Hora De Apertura" value="${horaApertura}"><br>
                <label for="hora-cierre-modal">Hora De Cierre:</label><br>
                <input type="time" id="hora-cierre-modal" class="swal2-input" placeholder="Hora De Cierre" value="${horaCierre}"><br>
                
            </form>
        `,
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: botonTexto,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return new Promise((resolve) => {
                let nombreNuevo = document.getElementById('nombre-modal').value.trim();
                let calleNuevo = document.getElementById('calle-modal').value.trim();
                let numeroNuevo = document.getElementById('numero-modal').value.trim();
                let coloniaNuevo = document.getElementById('colonia-modal').value.trim();
                let ciudadNuevo = document.getElementById('ciudad-modal').value.trim();
                let estadoNuevo = document.getElementById('estado-modal').value.trim();
                let codigoPostalNuevo = document.getElementById('codigo-postal-modal').value.trim();
                let latitudNuevo = document.getElementById('latitud-modal').value.trim();
                let longitudNuevo = document.getElementById('longitud-modal').value.trim();
                let fotoSucursalNuevo = document.getElementById('foto-sucursal-modal').files[0]; // Obtener el archivo de la imagen
                let urlPaginaNuevo = document.getElementById('url-pagina-modal').value.trim();
                let encargadoNuevo = document.getElementById('encargado-modal').value.trim();
                let horaAperturaNuevo = document.getElementById('hora-apertura-modal').value.trim();
                let horaCierreNuevo = document.getElementById('hora-cierre-modal').value.trim();

                // Validar campos obligatorios
                if (!nombreNuevo || !calleNuevo || !numeroNuevo || !coloniaNuevo || !ciudadNuevo || !estadoNuevo || !codigoPostalNuevo || !latitudNuevo || !longitudNuevo || !encargadoNuevo || !horaAperturaNuevo || !horaCierreNuevo) {
                    Swal.showValidationMessage('Por favor, complete todos los campos.');
                    resolve(false);
                } else {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        let fotoSucursalURL = e.target.result;
                        resolve({
                            nombre: nombreNuevo,
                            calle: calleNuevo,
                            numero: numeroNuevo,
                            colonia: coloniaNuevo,
                            ciudad: ciudadNuevo,
                            estado: estadoNuevo,
                            codigoPostal: codigoPostalNuevo,
                            latitud: latitudNuevo,
                            longitud: longitudNuevo,
                            fotoSucursal: fotoSucursalURL,
                            urlPagina: urlPaginaNuevo,
                            encargado: encargadoNuevo,
                            horaApertura: horaAperturaNuevo,
                            horaCierre: horaCierreNuevo
                        });
                    };
                    if (fotoSucursalNuevo) {
                        reader.readAsDataURL(fotoSucursalNuevo);
                    } else {
                        resolve({
                            nombre: nombreNuevo,
                            calle: calleNuevo,
                            numero: numeroNuevo,
                            colonia: coloniaNuevo,
                            ciudad: ciudadNuevo,
                            estado: estadoNuevo,
                            codigoPostal: codigoPostalNuevo,
                            latitud: latitudNuevo,
                            longitud: longitudNuevo,
                            fotoSucursal: fotoSucursal,
                            urlPagina: urlPaginaNuevo,
                            encargado: encargadoNuevo,
                            horaApertura: horaAperturaNuevo,
                            horaCierre: horaCierreNuevo
                        });

                    }
                }
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (index !== null) {
                sucursales[index] = result.value;
                guardarSucursales(index); // Llamar con índice para editar
            } else {
                sucursales.push(result.value);
                guardarSucursales(); // Llamar sin índice para agregar
            }
            actualizarTablaSucursales(); // Actualizar la tabla de sucursales
        }
    });

    // Mostrar vista previa de la imagen seleccionada
    document.getElementById('foto-sucursal-modal').addEventListener('change', function () {
        let reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('foto-sucursal-preview').src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
    });
}


// Función para actualizar la tabla con las sucursales actuales
function actualizarTablaSucursales() {
    let tbody = document.getElementById('tbody-sucursales');
    tbody.innerHTML = ''; // Limpiar el tbody

    let registrosPorPagina = document.getElementById('registros-por-pagina').value;
    let busqueda = document.getElementById('busqueda-sucursal').value.toUpperCase();

    let sucursalesFiltradas = sucursales.filter(sucursal => {
        return Object.values(sucursal).some(value =>
            String(value).toUpperCase().includes(busqueda)
        );
    });

    let sucursalesMostradas = (registrosPorPagina === "all") ? sucursalesFiltradas : sucursalesFiltradas.slice(0, parseInt(registrosPorPagina));

    sucursalesMostradas.forEach((sucursal, index) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${sucursal.nombre}</td>
            <td>${sucursal.calle}</td>
            <td>${sucursal.numero}</td>
            <td>${sucursal.colonia}</td>
            <td>${sucursal.ciudad}</td>
            <td>${sucursal.estado}</td>
            <td>${sucursal.codigoPostal}</td>
            <td>${sucursal.latitud}</td>
            <td>${sucursal.longitud}</td>
            <td style="text-align: center; vertical-align: middle;"><img src="${sucursal.fotoSucursal}" style="max-width: 60px; max-height: 60px;"></td>
            <td>${sucursal.urlPagina}</td>
            <td>${sucursal.encargado}</td>
            <td>${sucursal.horaApertura}</td>
            <td>${sucursal.horaCierre}</td>
            <td>
                <button class="icon-button" onclick="mostrarFormulario(${index})">
                    <img src="../../recursos/media/editar.png" alt="Icono Editar" class="icon.acciones">
                </button>
                <button class="icon-button" onclick="eliminarSucursal(${index})">
                    <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon.acciones">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}



// Función para eliminar una sucursal
function eliminarSucursal(index) {
    Swal.fire({
        title: '¿Estás seguro de eliminar esta sucursal?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            sucursales.splice(index, 1);
            actualizarTablaSucursales();
            Swal.fire({
                title: '¡Eliminado!',
                text: 'La sucursal ha sido eliminada exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#805A3B',
              })
            guardarSucursalesSinMensaje();
        }
    });
}

// Función para guardar las sucursales sin mostrar mensaje
function guardarSucursalesSinMensaje() {
    localStorage.setItem('sucursales', JSON.stringify(sucursales));
}

// Función para guardar las sucursales (simulación de guardar en localStorage)
function guardarSucursales(index = null) {
    localStorage.setItem('sucursales', JSON.stringify(sucursales));
    

    if (index !== null) {
        Swal.fire({
            title: '¡Editado!',
            text: 'La sucursal fue editada exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
    } else {
        Swal.fire({
            title: '¡Guardado!',
            text: 'La sucursal se ha agregado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
    }
}

// Función para cargar las sucursales desde localStorage al cargar la página
window.onload = function () {
    fetch("../../modulos/modulo-catalago-sucursal/data-sucursal.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (jsondata) {
            sucursales = jsondata;
            actualizarTablaSucursales();
        })
        .catch(function (error) {
            console.error('Error al cargar las sucursales:', error);
        });
};

// Función para buscar sucursal por cualquier campo
function buscarSucursal() {
    let input = document.getElementById('busqueda-sucursal');
    let filter = input.value.toUpperCase();
    let tbody = document.getElementById('tbody-sucursales');
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

