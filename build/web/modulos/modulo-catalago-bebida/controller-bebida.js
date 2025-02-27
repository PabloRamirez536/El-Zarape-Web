let bebidas = [];

function cargarCategoria() {
    return fetch('http://localhost:8080/Zarape/api/bebida/getAllCategoriaBebida')
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
    let imagen = "../../recursos/media/refresco.png";  // Ruta de la imagen
    let precio = '';
    let categoria = '';
    let activo = true;

    // Verificar si es una edición
    if (index !== null) {
        let bebida = bebidas[index];
        idProducto = bebida.idProducto || '';
        nombre = bebida.producto.nombre || '';
        descripcion = bebida.producto.descripcion || '';
        precio = bebida.producto.precio || '';
        activo = bebida.producto.activo || false;
        categoria = bebida.producto && bebida.producto.idCategoria ? bebida.producto.idCategoria : '';
        // Usar la imagen existente si está disponible
        imagen = bebida.producto.foto || imagen;
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
                <input type="number" id="producto-precio" class="swal2-input" placeholder="Precio" value="${precio}" min="0" max="99.99" step="0.01" required><br><br>
                <select id="producto-categoria" class="swal2-input" required>
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
                idProducto: index !== null ? bebidas[index].idProducto : null,
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
            const bebidaData = result.value;
            let params = {
                datosBebida: JSON.stringify(bebidaData)
            };
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams(params)
            };

            // Determinar la URL y enviar la solicitud
            fetch(index !== null ? 'http://localhost:8080/Zarape/api/bebida/updateBebida' : 'http://localhost:8080/Zarape/api/bebida/insertBebida', requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (index !== null) {
                            // Actualizar la bebida existente
                            bebidas[index] = data;
                            Swal.fire('¡Bebida actualizada!', 'Los datos de la bebida han sido actualizados.', 'success');
                        } else {
                            // Agregar la nueva bebida
                            bebidas.push(data);
                            Swal.fire('¡Bebida agregada!', 'La nueva bebida ha sido agregada.', 'success');
                        }
                        actualizarTablaBebidas();
                    })
                    .catch(error => Swal.fire('Error', 'Hubo un problema al guardar la bebida.', 'error'));
            console.log("Datos enviados:", JSON.stringify(bebidaData));
        }
    });

    // Cargar categorías disponibles
    cargarCategoria().then(categorias => {
        const bebidaSelect = document.getElementById('producto-categoria');
        bebidaSelect.innerHTML = '<option value="">Selecciona una categoria</option>'; // Agregar opción por defecto

        console.log("Categoría seleccionada (bebida):", categoria); // Depuración
        console.log("Categorías disponibles:", categorias); // Depuración

        categorias.forEach(categoriaItem => {
            // Comparar correctamente los valores
            const isSelected = parseInt(categoria) === parseInt(categoriaItem.idCategoria);
            bebidaSelect.innerHTML += `<option value="${categoriaItem.idCategoria}" ${isSelected ? 'selected' : ''}>
        ${categoriaItem.descripcion}
    </option>`;
        });
    }).catch(error => console.error('Error al cargar categorias:', error));

}

function actualizarTablaBebidas() {
    let ruta = "http://localhost:8080/Zarape/api/bebida/getAllBebida";
    fetch(ruta)
            .then(response => response.json())
            .then(data => {
                bebidas = data; // Asignar los datos a la variable global
                const tabla = document.getElementById('tabla-bebidas').getElementsByTagName('tbody')[0];
                tabla.innerHTML = '';
                // Recorrer los datos y agregar filas a la tabla
                data.forEach((bebida, index) => {
                    let fila = tabla.insertRow();
                    fila.innerHTML = `
                <td>${bebida.idBebida}</td>
                <td>${bebida.producto.nombre}</td>
                <td>${bebida.producto.descripcion}</td>
                <td>
                    <img src="${bebida.producto.foto}" alt="Foto de Producto" style="max-width: 60px; max-height: 60px;" />
                </td>
                <td>$${bebida.producto.precio.toFixed(2)}</td>
                <td>${bebida.categoria.descripcion}</td>
                <td>${bebida.producto.activo ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="icon-button" onclick="mostrarFormulario(${index})">
                        <img src="../../recursos/media/editar.png" alt="Icono Editar" class="icon-acciones">
                    </button>
                    <button class="icon-button" onclick="eliminarProductoBebida(${index})">
                        <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon-acciones">
                    </button>
                </td>
                `;
                });
            })
            .catch(error => console.error('Error al cargar productos:', error));
}

window.onload = function () {
    actualizarTablaBebidas(); // Asegúrate de cargar las bebidas al inicio
};
function eliminarProductoBebida(index) {
    // Verificar si la bebida ya está inactiva
    const productoBebida = bebidas[index];
    if (!productoBebida.producto.activo) {
        // Si la bebida ya está inactiva, mostrar un mensaje
        Swal.fire({
            title: 'Esta bebida ya está inactiva',
            text: 'No puedes inactivar una bebida inactiva.',
            icon: 'info',
            confirmButtonColor: '#805A3B',
            confirmButtonText: 'Aceptar'
        });
        return; // Salir de la función si la bebida ya está inactiva
    }

    // Si el cliente está activo, proceder con la confirmación de eliminación
    Swal.fire({
        title: '¿Estás seguro de desactivar esta bebida?',
        text: '¡El estatus cambiara a Inactivo!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const bebidaId = productoBebida.idProducto;
            // Crear el objeto con los parámetros para la solicitud
            const params = {idProducto: bebidaId};
            // Hacer la solicitud POST (simulando eliminación lógica)
            fetch('http://localhost:8080/Zarape/api/bebida/eliminarBebida', {
                method: 'POST', // Usamos POST ya que el backend espera esta solicitud
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(params)  // Convertir los parámetros en el formato adecuado
            })
                    .then(response => {
                        if (response.ok) {
                            bebidas[index].producto.activo = false; // Actualizar el estado de la bebida en la lista
                            actualizarTablaBebidas(); // Actualizar la tabla de bebidas
                            Swal.fire('¡Eliminado!', 'La bebida ha sido inactivada exitosamente.', 'success');
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
function buscarBebida() {
    let query = document.getElementById('busqueda-bebida').value.toLowerCase(); // Obtener texto de búsqueda y convertirlo a minúsculas
    let tabla = document.getElementById('tabla-bebidas').getElementsByTagName('tbody')[0];
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

