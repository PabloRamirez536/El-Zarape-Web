/*Copyright 2024*/
// Array para almacenar las bebidas
let bebidas = [];

// Función para mostrar el formulario de agregar/editar bebida
function mostrarFormulario(index = null) {
    let titulo = index !== null ? 'Editar Bebida' : 'Agregar Bebida';
    let botonTexto = index !== null ? 'Guardar' : 'Agregar';

    let nombre = '';
    let descripcion = '';
    let foto = '';
    let precio = '';
    let categoria = '';

    if (index !== null) {
        // Si es una edición, cargar los datos de la bebida seleccionada
        let bebida = bebidas[index];
        nombre = bebida.nombre || '';
        descripcion = bebida.descripcion || '';
        foto = bebida.foto || '';
        precio = bebida.precio || '';
        categoria = bebida.categoria || '';
    }

    Swal.fire({
        title: titulo,
        html: `
            <form id="formulario-bebida-modal">
                <label for="bebida-nombre">Nombre:</label><br>
                <input type="text" id="bebida-nombre" class="swal2-input" placeholder="Nombre" value="${nombre}"><br>
                <label for="bebida-descripcion">Descripción:</label><br>
                <input type="text" id="bebida-descripcion" class="swal2-input" placeholder="Descripción" value="${descripcion}"><br>
                <label for="foto-bebida">Foto Bebida:</label><br>
                <input type="file" id="foto-bebida" class="swal2-input" accept="image/*"><br>
                <img id="foto-bebida-preview" src="${foto}" style="max-width: 100%; max-height: 200px; margin-top: 10px;"><br>
                <label for="bebida-precio">Precio:</label><br>
                <input type="number" id="bebida-precio" class="swal2-input" placeholder="Precio" value="${precio}"><br>
                <label for="bebida-categoria">Categoría:</label><br>
                <select id="bebida-categoria" class="swal2-input">
                    <option value="Jugos" ${categoria === 'Jugos' ? 'selected' : ''}>Jugos</option>
                    <option value="Refrescos" ${categoria === 'Refrescos' ? 'selected' : ''}>Refrescos</option>
                    <option value="Cervezas" ${categoria === 'Cervezas' ? 'selected' : ''}>Cervezas</option>
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
                let nombreNuevo = document.getElementById('bebida-nombre').value.trim();
                let descripcionNueva = document.getElementById('bebida-descripcion').value.trim();
                let fotoBebidaNueva = document.getElementById('foto-bebida').files[0]; // Obtener el archivo de la imagen
                let precioNuevo = document.getElementById('bebida-precio').value.trim();
                let categoriaNuevo = document.getElementById('bebida-categoria').value.trim();

                // Validar campos obligatorios
                if (!nombreNuevo || !descripcionNueva || !precioNuevo || !categoriaNuevo) {
                    Swal.showValidationMessage('Por favor, complete todos los campos.');
                    resolve(false);
                } else {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        let fotoBebidaURL = e.target.result;
                        resolve({
                            nombre: nombreNuevo,
                            descripcion: descripcionNueva,
                            foto: fotoBebidaURL,
                            precio: precioNuevo,
                            categoria: categoriaNuevo
                        });
                    };
                    if (fotoBebidaNueva) {
                        reader.readAsDataURL(fotoBebidaNueva);
                    } else {
                        resolve({
                            nombre: nombreNuevo,
                            descripcion: descripcionNueva,
                            foto: foto,
                            precio: precioNuevo,
                            categoria: categoriaNuevo
                        });

                    }
                }
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (index !== null) {
                bebidas[index] = result.value;
                guardarBebidas(index); // Llamar con índice para editar
            } else {
                bebidas.push(result.value);
                guardarBebidas(); // Llamar sin índice para agregar
            }
            actualizarTablaBebidas(); // Actualizar la tabla de bebidas
        }
    });

    // Mostrar vista previa de la imagen seleccionada
    document.getElementById('foto-bebida').addEventListener('change', function () {
        let reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('foto-bebida-preview').src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
    });
}

// Función para actualizar la tabla con las bebidas actuales
function actualizarTablaBebidas() {
    let tbody = document.getElementById('tbody-bebidas');
    tbody.innerHTML = ''; // Limpiar el tbody

    let registrosPorPagina = document.getElementById('registros-por-pagina').value;
    let busqueda = document.getElementById('busqueda-bebida').value.toUpperCase();

    let bebidasFiltradas = bebidas.filter(sucursal => {
        return Object.values(sucursal).some(value =>
            String(value).toUpperCase().includes(busqueda)
        );
    });

    let bebidasMostradas = (registrosPorPagina === "all") ? bebidasFiltradas : bebidasFiltradas.slice(0, parseInt(registrosPorPagina));

    bebidasMostradas.forEach((bebida, index) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${bebida.nombre}</td>
            <td>${bebida.descripcion}</td>
            <td style="text-align: center; vertical-align: middle;"><img src="${bebida.foto}" style="max-width: 60px; max-height: 60px;"></td>
            <td>$${bebida.precio}</td>
            <td>${bebida.categoria}</td>
            <td>
                <button class="icon-button" onclick="mostrarFormulario(${index})">
                    <img src="../../recursos/media/editar.png" alt="Icono Editar" class="icon.acciones">
                </button>
                <button class="icon-button" onclick="eliminarBebida(${index})">
                    <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon.acciones">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para eliminar una bebida
function eliminarBebida(index) {
    Swal.fire({
        title: '¿Estás seguro de eliminar esta bebida?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            bebidas.splice(index, 1);
            actualizarTablaBebidas();
            Swal.fire({
                title: '¡Eliminado!',
                text: 'La bebida ha sido eliminada exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#805A3B'
            });
            guardarBebidasSinMensaje();
        }
    });
}

// Función para guardar las bebidas sin mostrar mensaje
function guardarBebidasSinMensaje() {
    localStorage.setItem('bebidas', JSON.stringify(bebidas));
}

// Función para guardar las bebidas (simulación de guardar en localStorage)
function guardarBebidas(index = null) {
    localStorage.setItem('bebidas', JSON.stringify(bebidas));

    if (index !== null) {
        Swal.fire({
            title: '¡Editado!',
            text: 'La bebida fue editada exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
    } else {
        Swal.fire({
            title: '¡Guardado!',
            text: 'La bebida se ha agregado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
}
}

// Función para cargar las bebidas desde localStorage al cargar la página
window.onload = function () {
    fetch("../../modulos/modulo-catalago-bebida/data-bebida.json")
            .then(function (response) {
                return response.json();
            })
            .then(function (jsondata) {
                bebidas = jsondata;
                actualizarTablaBebidas();
            })
            .catch(function (error) {
                console.error('Error al cargar las bebidas:', error);
            });
};

// Función para buscar bebida por cualquier campo
function buscarBebida() {
    let input = document.getElementById('busqueda-bebida');
    let filter = input.value.toUpperCase();
    let tbody = document.getElementById('tbody-bebidas');
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
