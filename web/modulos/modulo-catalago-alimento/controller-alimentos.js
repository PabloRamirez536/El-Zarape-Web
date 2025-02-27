let alimentos = [];

window.onload = function () {
    actualizarTablaAlimentos();
};

function cargarCategoria() {
    return fetch('http://localhost:8080/Zarape/api/alimento/getAllCategoriaAlimento')
            .then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => console.error('Error al cargar categorias:', error));
}

function mostrarFormulario(index = null) {
    let titulo = index !== null ? 'Editar Producto' : 'Agregar Producto';
    let botonTexto = index !== null ? 'Guardar' : 'Agregar';
    let idProducto = '';
    let nombre = '';
    let descripcion = '';
    let imagen = "../../recursos/media/alimentos.jpg";  // Ruta de la imagen
    let precio = '';
    let categoria = '';
    let activo = true;

    // Verificar si es una edición
    if (index !== null) {
        let alimento = alimentos[index];
        idProducto = alimento.idProducto || '';
        nombre = alimento.producto.nombre || '';
        descripcion = alimento.producto.descripcion || '';
        precio = alimento.producto.precio || '';
        activo = alimento.producto.activo || false;
        categoria = alimento.producto && alimento.producto.idCategoria ? alimento.producto.idCategoria : '';
        // Usar la imagen existente si está disponible
        imagen = alimento.producto.foto || imagen;
    }

    // Mostrar el formulario con Swal
    Swal.fire({
        title: titulo,
        html: `<form id="formulario-cliente-modal">
                <label for="producto-nombre">Nombre:</label><br>
                <input type="text" id="producto-nombre" class="swal2-input" placeholder="Nombre" value="${nombre}" maxlength="45" pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ0123456789\s.;]{1,45}"required><br>
                <label for="producto-descripcion">Descripción:</label><br>
                <input type="text" id="producto-descripcion" class="swal2-input" placeholder="Descripción" value="${descripcion}" maxlength="45" pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ0123456789\s.;]{1,45}" required><br>
                <label for="producto-foto">Foto Producto:</label><br>
                <input type="file" id="producto-foto" class="swal2-input" accept=".jpg, .png" required><br>
                <img id="producto-preview" src="${imagen}" style="max-width: 100%; max-height: 200px; margin-top: 10px;"><br>
                <label for="producto-precio">Precio:</label><br>
                <input type="number" id="producto-precio" class="swal2-input" placeholder="Precio" value="${precio}" min="0" max="99.99" step="0.01" required><br>
                <label for="producto-categoria">Categoría:</label><br><br>
                <select id="producto-categoria" class="swal2-input">
                    <option value="">Selecciona una categoria</option>
                </select><br><br>
                <label for="producto-activo">Estatus:</label><br>
                <input type="checkbox" id="producto-activo" class="swal2-checkbox" ${activo ? 'checked' : ''} ${index === null ? 'disabled' : ''}>
            </form>`,
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: botonTexto,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            let nombreNuevo = document.getElementById('producto-nombre').value.trim();
            let descripcionNueva = document.getElementById('producto-descripcion').value.trim();
            let precioNuevo = document.getElementById('producto-precio').value.trim();
            let activoNuevo = document.getElementById('producto-activo').checked;
            let categoriaSeleccionada = document.getElementById('producto-categoria').value;

             // Validar el nombre
            if (!nombreNuevo || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0123456789\s.;]{1,45}$/.test(nombreNuevo)) {
                Swal.showValidationMessage('El nombre es obligatorio, debe contener solo letras y números (máximo 45 caracteres)');
                return false;
            }

            // Validar la descripción
            if (!descripcionNueva || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0123456789\s.;]{1,45}$/.test(descripcionNueva)) {
                Swal.showValidationMessage('La descripción debe contener solo letras, números y tener un máximo de 45 caracteres.');
                return false;
            }

            // Validar imagen seleccionada
            let fotoInput = document.getElementById('producto-foto');
            if (fotoInput.files.length === 0 || !/(\.jpg|\.png)$/i.test(fotoInput.files[0].name)) {
                Swal.showValidationMessage('Por favor, seleccione una imagen válida (.jpg, .png).');
                return false;
            }
            // Validar precio
            if (!precioNuevo || !/^\d+(\.\d{1,2})?$/.test(precioNuevo) || parseFloat(precioNuevo) < 0 || parseFloat(precioNuevo) > 99.99) {
                Swal.showValidationMessage('El precio debe ser un número entre 0 y 99.99, con hasta dos decimales.');
                return false;
            }

            // Validar categoría seleccionada
            if (!categoriaSeleccionada) {
                Swal.showValidationMessage('Por favor, seleccione una categoría.');
                return false;
            }

            return Promise.resolve({
                idProducto: index !== null ? alimentos[index].idProducto : null,
                producto: {
                    nombre: nombreNuevo,
                    descripcion: descripcionNueva,
                    foto: imagen, // Usar la imagen predeterminada
                    precio: parseFloat(precioNuevo),
                    activo: activoNuevo
                },
                categoria: {
                    idCategoria: parseInt(categoriaSeleccionada) // Enviar la categoría seleccionada
                }
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const alimentoData = result.value;
            let params = {
                datosAlimento: JSON.stringify(alimentoData)
            };
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams(params)
            };

            // Determinar la URL y enviar la solicitud
            fetch(index !== null ? 'http://localhost:8080/Zarape/api/alimento/updateAlimento' : 'http://localhost:8080/Zarape/api/alimento/insertAlimento', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (index !== null) {
                            // Actualizar el alimento existente
                            alimentos[index] = data;
                            Swal.fire('¡Alimento actualizado!', 'Los datos del alimento han sido actualizados.', 'success');
                        } else {
                            // Agregar el nuevo alimento
                            alimentos.push(data);
                            Swal.fire('¡Alimento agregado!', 'El nuevo alimento ha sido agregado.', 'success');
                        }
                        actualizarTablaAlimentos();
                    })
                    .catch(error => Swal.fire('Error', 'Hubo un problema al guardar el alimento.', 'error'));
            console.log("Datos enviados:", JSON.stringify(alimentoData));
        }
    });

    // Cargar categorías disponibles
    cargarCategoria().then(categorias => {
        const alimentoSelect = document.getElementById('producto-categoria');
        alimentoSelect.innerHTML = '<option value="">Selecciona una categoria</option>'; // Agregar opción por defecto

        console.log("Categoría seleccionada (alimento):", categoria); // Depuración
        console.log("Categorías disponibles:", categorias); // Depuración

        categorias.forEach(categoriaItem => {
            // Comparar correctamente los valores
            const isSelected = parseInt(categoria) === parseInt(categoriaItem.idCategoria);
            alimentoSelect.innerHTML += `<option value="${categoriaItem.idCategoria}" ${isSelected ? 'selected' : ''}>
        ${categoriaItem.descripcion}
    </option>`;
        });
    }).catch(error => console.error('Error al cargar categorias:', error));
}


// Actualizar la tabla de alimentos
function actualizarTablaAlimentos() {
    let ruta = "http://localhost:8080/Zarape/api/alimento/getAllAlimento";
    fetch(ruta)
        .then(response => response.json())
        .then(data => {
            alimentos = data; // Asignar los datos a la variable global
            const tabla = document.getElementById('tabla-alimentos').getElementsByTagName('tbody')[0];
            tabla.innerHTML = ''; // Limpiar la tabla antes de llenarla

            // Recorrer los datos y agregar filas a la tabla
            data.forEach((alimento, index) => {
                let fila = tabla.insertRow();
                fila.innerHTML = `
                    <td>${alimento.idAlimento}</td>
                    <td>${alimento.producto.nombre}</td>
                    <td>${alimento.producto.descripcion}</td>
                    <td>${alimento.categoria ? alimento.categoria.descripcion : 'Sin categoría'}</td> 
                    <td>
                        <img src="${alimento.producto.foto}" alt="Foto de Producto" style="max-width: 60px; max-height: 60px;" />
                    </td>
                    <td>$${alimento.producto.precio.toFixed(2)}</td>
                    <td>${alimento.producto.activo ? 'Activo' : 'Inactivo'}</td>
                    <td>
                        <button class="icon-button" onclick="mostrarFormulario(${index})">
                            <img src="../../recursos/media/editar.png" alt="Icono Editar" class="icon-acciones">
                        </button>
                        <button class="icon-button" onclick="eliminarAlimento(${index})">
                            <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon-acciones">
                        </button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Error al cargar productos:', error));
}


function eliminarAlimento(index) {
    // Obtener el producto
    const productoAlimento = alimentos[index];

    // Verificar si el producto ya está inactivo
    if (!productoAlimento.producto.activo) {
        Swal.fire({
            title: 'Este producto ya está inactivo',
            text: 'No puedes inactivar un producto que ya está inactivo.',
            icon: 'info',
            confirmButtonColor: '#805A3B',
            confirmButtonText: 'Aceptar'
        });
        return;  // Salir de la función si el producto ya está inactivo
    }

    // Confirmación de eliminación
    Swal.fire({
        title: '¿Estás seguro de desactivar este producto?',
        text: '¡El estatus cambiará a Inactivo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const alimentoId = productoAlimento.idProducto;

            // Crear los parámetros para la solicitud
            const params = {idProducto: alimentoId};

            // Hacer la solicitud POST para eliminar (marcar como inactivo)
            fetch('http://localhost:8080/Zarape/api/alimento/eliminarAlimento', {
                method: 'POST', // Usamos POST ya que el backend espera esta solicitud
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(params)  // Convertir los parámetros en el formato adecuado
            })
                    .then(response => {
                        if (response.ok) {
                            // Actualizar la tabla de productos (volver a cargarla)
                            actualizarTablaAlimentos();  // Recargar la tabla con los productos actualizados
                            Swal.fire('¡Eliminado!', 'El producto ha sido inactivado correctamente.', 'success');
                        } else {
                            Swal.fire('Error', 'Hubo un problema al inactivar el producto.', 'error');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error', 'Hubo un problema al inactivar el producto.', 'error');
                    });
        }
    });
}

function buscarAlimento() {
    let query = document.getElementById('busqueda-alimento').value.toLowerCase();  // Obtener texto de búsqueda y convertirlo a minúsculas
    let tabla = document.getElementById('tabla-alimentos').getElementsByTagName('tbody')[0];
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


