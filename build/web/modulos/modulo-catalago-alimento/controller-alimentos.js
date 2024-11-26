/*Copyright 2024*/
// Array para almacenar los alimentos
let alimentos = [];

// Función para mostrar el formulario de agregar/editar bebida
function mostrarFormulario(index = null) {
    let titulo = index !== null ? 'Editar Alimento' : 'Agregar Alimento';
    let botonTexto = index !== null ? 'Guardar' : 'Agregar';

    let nombre = '';
    let descripcion = '';
    let foto = '';
    let precio = '';
    let categoria = '';

    if (index !== null) {
        // Si es una edición, cargar los datos del alimento seleccionado
        let alimento = alimentos[index];
        nombre = alimento.nombre || '';
        descripcion = alimento.descripcion || '';
        foto = alimento.foto || '';
        precio = alimento.precio || '';
        categoria = alimento.categoria || '';
    }

    Swal.fire({
        title: titulo,
        html: `
            <form id="formulario-alimento-modal">
                <label for="alimento-nombre">Nombre:</label><br>
                <input type="text" id="alimento-nombre" class="swal2-input" placeholder="Nombre" value="${nombre}"><br>
                <label for="alimento-descripcion">Descripción:</label><br>
                <input type="text" id="alimento-descripcion" class="swal2-input" placeholder="Descripción" value="${descripcion}"><br>
                <label for="foto-alimento">Foto Alimento:</label><br>
                <input type="file" id="foto-alimento" class="swal2-input" accept="image/*"><br>
                <img id="foto-alimento-preview" src="${foto}" style="max-width: 100%; max-height: 200px; margin-top: 10px;"><br>
                <label for="alimento-precio">Precio:</label><br>
                <input type="number" id="alimento-precio" class="swal2-input" placeholder="Precio" value="${precio}"><br>
                <label for="alimento-categoria">Categoría:</label><br>
                <select id="alimento-categoria" class="swal2-input">
                    <option value="Platillos Principales" ${categoria === 'Platillos Principales' ? 'selected' : ''}>Platillos Principales</option>
                    <option value="Ensaladas" ${categoria === 'Ensaladas' ? 'selected' : ''}>Ensaladas</option>
                    <option value="Postres" ${categoria === 'Postres' ? 'selected' : ''}>Postres</option>
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
                let nombreNuevo = document.getElementById('alimento-nombre').value.trim();
                let descripcionNueva = document.getElementById('alimento-descripcion').value.trim();
                let fotoAlimentoNueva = document.getElementById('foto-alimento').files[0]; // Obtener el archivo de la imagen
                let precioNuevo = document.getElementById('alimento-precio').value.trim();
                let categoriaNuevo = document.getElementById('alimento-categoria').value.trim();

                // Validar campos obligatorios
                if (!nombreNuevo || !descripcionNueva || !precioNuevo || !categoriaNuevo) {
                    Swal.showValidationMessage('Por favor, complete todos los campos.');
                    resolve(false);
                } else {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        let fotoAlimentoURL = e.target.result;
                        resolve({
                            nombre: nombreNuevo,
                            descripcion: descripcionNueva,
                            foto: fotoAlimentoURL,
                            precio: precioNuevo,
                            categoria: categoriaNuevo
                        });
                    };
                    if (fotoAlimentoNueva) {
                        reader.readAsDataURL(fotoAlimentoNueva);
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
                alimentos[index] = result.value;
                guardarAlimentos(index); // Llamar con índice para editar
            } else {
                alimentos.push(result.value);
                guardarAlimentos(); // Llamar sin índice para agregar
            }
            actualizarTablaAlimentos(); // Actualizar la tabla de alimentos
        }
    });

    // Mostrar vista previa de la imagen seleccionada
    document.getElementById('foto-alimento').addEventListener('change', function () {
        let reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('foto-alimento-preview').src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
    });
}

// Función para actualizar la tabla con los alimentos actuales
function actualizarTablaAlimentos() {

    let tbody = document.getElementById('tbody-alimentos');
    tbody.innerHTML = ''; // Limpiar el tbody

    let registrosPorPagina = document.getElementById('registros-por-pagina').value;
    let busqueda = document.getElementById('busqueda-alimento').value.toUpperCase();

    let alimentosFiltrados = alimentos.filter(sucursal => {
        return Object.values(sucursal).some(value =>
            String(value).toUpperCase().includes(busqueda)
        );
    });

    let alimentosMostrados = (registrosPorPagina === "all") ? alimentosFiltrados : alimentosFiltrados.slice(0, parseInt(registrosPorPagina));


    alimentosMostrados.forEach((alimento, index) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${alimento.nombre}</td>
            <td>${alimento.descripcion}</td>
            <td style="text-align: center; vertical-align: middle;"><img src="${alimento.foto}" style="max-width: 60px; max-height: 60px;"></td>
            <td>$${alimento.precio}</td>
            <td>${alimento.categoria}</td>
            <td>
                <button class="icon-button" onclick="mostrarFormulario(${index})">
                    <img src="../../recursos/media/editar.png" alt="Icono Editar" class="icon.acciones">
                </button>
                <button class="icon-button" onclick="eliminarAlimento(${index})">
                    <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon.acciones">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para eliminar un alimento
function eliminarAlimento(index) {
    Swal.fire({
        title: '¿Estás seguro de eliminar este alimento?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            alimentos.splice(index, 1);
            actualizarTablaAlimentos();
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El alimento ha sido eliminado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#805A3B'
            });
            guardarAlimentosSinMensaje();
        }
    });
}

// Función para guardar los alimentos sin mostrar mensaje
function guardarAlimentosSinMensaje() {
    localStorage.setItem('alimentos', JSON.stringify(alimentos));
}

// Función para guardar los alimentos (simulación de guardar en localStorage)
function guardarAlimentos(index = null) {
    localStorage.setItem('alimentos', JSON.stringify(alimentos));

    if (index !== null) {
        Swal.fire({
            title: '¡Editado!',
            text: 'El alimento fue editado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
    } else {
        Swal.fire({
            title: '¡Guardado!',
            text: 'El alimento se ha agregado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
    }
}


// Función para cargar los alimentos desde localStorage al cargar la página
window.onload = function () {
    fetch("../../modulos/modulo-catalago-alimento/data-alimento.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (jsondata) {
            alimentos = jsondata;
            actualizarTablaAlimentos();
        })
        .catch(function (error) {
            console.error('Error al cargar los alimentos:', error);
        });
};

// Función para buscar alimento por cualquier campo
function buscarAlimento() {
    let input = document.getElementById('busqueda-alimento');
    let filter = input.value.toUpperCase();
    let tbody = document.getElementById('tbody-alimentos');
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