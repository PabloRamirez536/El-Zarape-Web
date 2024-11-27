function mostrarFormulario(index = null) {
    let titulo = index !== null ? 'Editar Categoria' : 'Agregar Categoria';
    let botonTexto = index !== null ? 'Guardar' : 'Agregar';

    let descripcion = '';
    let tipo = 'A';  // Establecer "A" por defecto
    let activo = true;

    // Verificar si es una edición
    if (index !== null) {
        let categoria = categorias[index];
        descripcion = categoria.descripcion || '';
        tipo = categoria.tipo || 'A'; // Mantener "A" si no hay tipo
        activo = categoria.activo || false;
    }

    Swal.fire({
        title: titulo,
        html: `<form id="formulario-cliente-modal">
                <label for="producto-nombre">Descripcion:</label><br>
                <input type="text" id="categoria-descripcion" class="swal2-input upper" placeholder="Descripcion" value="${descripcion}"><br><br>
                <select id="categoria-tipo" class="swal2-input">
                    <option value="A" ${tipo === 'A' ? 'selected' : ''}>Alimentos</option>
                    <option value="B" ${tipo === 'B' ? 'selected' : ''}>Bebidas</option>
                </select><br><br>
                <label for="categoria-activo">Estatus:</label><br>
                <input type="checkbox" id="categoria-activo" class="swal2-checkbox" ${activo ? 'checked' : ''}>
            </form>`,
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: botonTexto,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            let descripcionNueva = document.getElementById('categoria-descripcion').value.trim().toUpperCase();
            let tipoNuevo = document.getElementById('categoria-tipo').value;
            let activoNuevo = document.getElementById('categoria-activo').checked;

            // Validar que los campos no estén vacíos y el tipo sea A o B
            if (!tipoNuevo || (tipoNuevo !== 'A' && tipoNuevo !== 'B') || !descripcionNueva) {
                Swal.showValidationMessage('Por favor, complete todos los campos y seleccione una categoría válida (A o B).');
                return false;
            }
            return {
                idCategoria: index !== null ? categorias[index].idCategoria : null,
                descripcion: descripcionNueva,
                tipo: tipoNuevo,
                activo: activoNuevo
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const categoriaData = result.value;

            let params = {
                datosCategoria: JSON.stringify(categoriaData)
            };

            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams(params)
            };

            // Determinar la URL dependiendo de si estamos editando o agregando una categoría
            fetch(index !== null ? 'http://localhost:8080/Zarape/api/categoria/updateCategoria' : 'http://localhost:8080/Zarape/api/categoria/insertCategoria', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (index !== null) {
                            // Actualizar la categoría existente
                            categorias[index] = data; // Asegúrate de que 'data' contenga la categoría actualizada
                            Swal.fire('¡Categoria actualizada!', 'Los datos de la categoria han sido actualizados.', 'success');
                        } else {
                            // Agregar la nueva categoría
                            categorias.push(data); // Agregar la nueva categoría a la lista
                            Swal.fire('¡Categoria agregada!', 'La nueva categoria ha sido agregada.', 'success');
                        }
                        actualizarTablaCategorias();
                    })
                    .catch(error => Swal.fire('Error', 'Hubo un problema al guardar la categoria.', 'error'));

            console.log("Datos enviados:", JSON.stringify(categoriaData));
        }
    });
}

function actualizarTablaCategorias() {
    let ruta = "http://localhost:8080/Zarape/api/categoria/getAllCategoria";
    fetch(ruta)
        .then(response => response.json())
        .then(data => {
            categorias = data; // Asignar los datos a la variable global
            const tabla = document.getElementById('tabla-categorias').getElementsByTagName('tbody')[0];
            tabla.innerHTML = '';
            // Recorrer los datos y agregar filas a la tabla
            data.forEach((categoria, index) => {
                // Convertir el tipo de categoría de "A"/"B" a "Alimento"/"Bebida"
                let tipoCategoria = categoria.tipo === 'A' ? 'Alimento' : (categoria.tipo === 'B' ? 'Bebida' : 'Desconocido');

                let fila = tabla.insertRow();
                fila.innerHTML = `
                    <td>${categoria.idCategoria}</td>
                    <td>${categoria.descripcion}</td>
                    <td>${tipoCategoria}</td>
                    <td>${categoria.activo ? 'Activo' : 'Inactivo'}</td>
                    <td>
                        <button class="icon-button" onclick="mostrarFormulario(${index})">
                            <img src="../../recursos/media/editar.png" alt="Icono Editar" class="icon-acciones">
                        </button>
                        <button class="icon-button" onclick="eliminarCategoria(${index})">
                            <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon-acciones">
                        </button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Error al cargar categorias:', error));
}

window.onload = function () {
    actualizarTablaCategorias(); // Asegúrate de cargar las bebidas al inicio
};

function eliminarCategoria(index) {
    // Verificar si el cliente ya está inactivo
    const categoria = categorias[index];

    if (!categoria.activo) {
        // Si el cliente está inactivo, mostrar un mensaje
        Swal.fire({
            title: 'Esta bebida ya está inactiva',
            text: 'No puedes inactivar una bebida inactiva.',
            icon: 'info',
            confirmButtonColor: '#805A3B',
            confirmButtonText: 'Aceptar'
        });
        return;  // Salir de la función si el cliente ya está inactivo
    }

    // Si el cliente está activo, proceder con la confirmación de eliminación
    Swal.fire({
        title: '¿Estás seguro de eliminar esta bebida?',
        text: 'El estatus cambiara a Inactivo!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const categoriaId = categoria.idCategoria;

            // Crear el objeto con los parámetros para la solicitud
            const params = {idCategoria: categoriaId};

            // Hacer la solicitud POST (simulando eliminación lógica)
            fetch('http://localhost:8080/Zarape/api/categoria/eliminarCategoria', {
                method: 'POST', // Usamos POST ya que el backend espera esta solicitud
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(params)  // Convertir los parámetros en el formato adecuado
            })
                    .then(response => {
                        if (response.ok) {
                            actualizarTablaCategorias(); // Actualizar la tabla de categoria
                            Swal.fire('¡Eliminado!', 'La bebida ha sido inavtivada exitosamente.', 'success');
                        } else {
                            Swal.fire('Error', 'Hubo un problema al inactivar la bebida.', 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Hubo un problema al inactivar la bebida.', 'error');
                    });
        }
    });
}
function buscarCategoria() {
    let query = document.getElementById('busqueda-categoria').value.toLowerCase();  // Obtener texto de búsqueda y convertirlo a minúsculas
    let tabla = document.getElementById('tabla-categorias').getElementsByTagName('tbody')[0];
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

