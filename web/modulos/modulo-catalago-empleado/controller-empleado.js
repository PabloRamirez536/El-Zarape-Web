    // Array para almacenar los empleados
    let empleados = [];
    let sucursales = [];

    function mostrarFormulario(index = null) {
        let titulo = index !== null ? 'Editar Empleado' : 'Agregar Empleado';
        let botonTexto = index !== null ? 'Guardar' : 'Agregar';
        let nombre = '';
        let apellidoPaterno = '';
        let apellidoMaterno = '';
        let puesto = '';
        let sucursal = '';
        if (index !== null) {
            // Si es una edición, cargar los datos del empleado seleccionado
            let empleado = empleados[index];
            nombre = empleado.nombre || '';
            apellidoPaterno = empleado.apellidoPaterno || '';
            apellidoMaterno = empleado.apellidoMaterno || '';
            puesto = empleado.puesto || '';
            sucursal = empleado.sucursal || '';
        }
        Swal.fire({
            title: titulo,
            html: `
                <form id="formulario-empleado-modal">
                    <label for="empleado-nombre">Nombre:</label><br>
                    <input type="text" id="empleado-nombre" class="swal2-input" placeholder="Nombre" value="${nombre}"><br>
                    <label for="empleado-apellido-paterno">Apellido Paterno:</label><br>
                    <input type="text" id="empleado-apellido-paterno" class="swal2-input" placeholder="Apellido Paterno" value="${apellidoPaterno}"><br>
            <label for="empleado-apellido-materno">Apellido Materno:</label><br>
                    <input type="text" id="empleado-apellido-materno" class="swal2-input" placeholder="Apellido Materno" value="${apellidoMaterno}"><br>
                    <label for="empleado-puesto">Puesto:</label><br>
                    <select id="empleado-puesto" class="swal2-input">
                        <option value="Cocinero" ${puesto === 'Cocinero' ? 'selected' : ''}>Cocinero</option>
                        <option value="Administrador" ${puesto === 'Administrador' ? 'selected' : ''}>Administrador</option>
                    </select><br>
                    <label>Sucursal Asignada:</label><br>
                    <select id="empleado-sucursal" class="swal2-input">
                        ${sucursales.map(sucursalItem => `<option value="${sucursalItem.nombre}" ${sucursalItem.nombre === sucursal ? 'selected' : ''}>${sucursalItem.nombre}</option>`).join('')}
                    </select><br>
                    </form>
            `,
            showCancelButton: true,
            confirmButtonColor: '#805A3B',
            cancelButtonColor: '#C60000',
            confirmButtonText: botonTexto,
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                return new Promise((resolve) => {
                    let nombreNuevo = document.getElementById('empleado-nombre').value.trim();
                    let apellidoPaternoNuevo = document.getElementById('empleado-apellido-paterno').value.trim();
                    let apellidoMaternoNuevo = document.getElementById('empleado-apellido-materno').value.trim();
                    let puestoNuevo = document.getElementById('empleado-puesto').value.trim();
                    let sucursalNuevo = document.getElementById('empleado-sucursal').value.trim();
                    // Validar campos obligatorios
                    if (!nombreNuevo || !apellidoPaternoNuevo || !apellidoMaternoNuevo || !puestoNuevo || !sucursalNuevo) {
                        Swal.showValidationMessage('Por favor, complete todos los campos.');
                        resolve(false);
                    } else {
                        resolve({
                            nombre: nombreNuevo,
                            apellidoPaterno: apellidoPaternoNuevo,
                            apellidoMaterno: apellidoMaternoNuevo,
                            puesto: puestoNuevo,
                            sucursal: sucursalNuevo
                        });
                    }
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (index !== null) {
                    empleados[index] = result.value;
                    guardarEmpleados(index); // Llamar con índice para editar
                } else {
                    empleados.push(result.value);
                    guardarEmpleados(); // Llamar sin índice para agregar
                }
                actualizarTablaEmpleados(); // Actualizar la tabla de empleados
            }
        });
    }

// Función para actualizar la tabla con los empleados actuales
function actualizarTablaEmpleados() {
    let tbody = document.getElementById('tbody-empleados');
    tbody.innerHTML = ''; // Limpiar el tbody

    let registrosPorPagina = document.getElementById('registros-por-pagina').value;
    let busqueda = document.getElementById('busqueda-empleado').value.toUpperCase();

    let empleadosFiltrados = empleados.filter(empleado => {
        return Object.values(empleado).some(value =>
            String(value).toUpperCase().includes(busqueda)
        );
    });

    let empleadosMostrados = (registrosPorPagina === "all") ? empleadosFiltrados : empleadosFiltrados.slice(0, parseInt(registrosPorPagina));

    empleadosMostrados.forEach((empleado, index) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${empleado.nombre}</td>
            <td>${empleado.apellidoPaterno}</td>
            <td>${empleado.apellidoMaterno}</td>
            <td>${empleado.puesto}</td>
            <td>${empleado.sucursal}</td>
            <td>
                <button class="icon-button" onclick="mostrarFormulario(${index})">
                    <img src="../../recursos/media/editar.png" alt="Icono Editar" class="icon-acciones">
                </button>
                <button class="icon-button" onclick="eliminarEmpleado(${index})">
                    <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon-acciones">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para eliminar un empleado
function eliminarEmpleado(index) {
    Swal.fire({
        title: '¿Estás seguro de eliminar el empleado?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            empleados.splice(index, 1);
            actualizarTablaEmpleados();
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El empleado ha sido eliminado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#805A3B',
            })
            guardarEmpleadosSinMensaje();
        }
    });
}

// Función para guardar los empleados sin mostrar mensaje
function guardarEmpleadosSinMensaje() {
    localStorage.setItem('empleados', JSON.stringify(empleados));
}

// Función para guardar los empleados (simulación de guardar en localStorage)
function guardarEmpleados(index = null) {
    localStorage.setItem('empleados', JSON.stringify(empleados));

    if (index !== null) {
        Swal.fire({
            title: '¡Editado!',
            text: 'El empleado fue editado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
    } else {
        Swal.fire({
            title: '¡Guardado!',
            text: 'El empleado se ha agregado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
}
}

// Función para cargar los empleados desde localStorage al cargar la página
window.onload = function () {
    fetch("../../modulos/modulo-catalago-sucursal/data-sucursal.json")
            .then(function (response) {
                return response.json();
            })
            .then(function (jsondata) {
                sucursales = jsondata;
            })
            .catch(function (error) {
                console.error('Error al cargar las sucursales:', error);
            });

    fetch("../../modulos/modulo-catalago-empleado/data-empleado.json")
            .then(function (response) {
                return response.json();
            })
            .then(function (jsondata) {
                empleados = jsondata;
                actualizarTablaEmpleados();
            })
            .catch(function (error) {
                console.error('Error al cargar los empleados:', error);
            });
};

// Función para buscar empleado por cualquier campo
function buscarEmpleado() {
    let input = document.getElementById('busqueda-empleado');
    let filter = input.value.toUpperCase();
    let tbody = document.getElementById('tbody-empleados');
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