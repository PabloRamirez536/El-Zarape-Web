/*Copyright 2024*/
// Array para almacenar los combos
let combos = [];
// Ejemplo de alimentos y bebidas disponibles con precios
let alimentosDisponibles = [];
let bebidasDisponibles = [];

// Arreglos para almacenar alimentos y bebidas seleccionados
let alimentosSeleccionados = [];
let bebidasSeleccionadas = [];

// Función para mostrar el formulario de agregar/editar combo
function mostrarFormulario(index = null) {
    let titulo = index !== null ? 'Editar Combo' : 'Agregar Combo';
    let botonTexto = index !== null ? 'Guardar' : 'Agregar';

    let nombre = '';
    let precio = '';
    let descripcion = '';
    let fotoCombo = ''; // Variable para almacenar la URL de la imagen del combo

    if (index !== null) {
        // Si es una edición, cargar los datos del combo seleccionado
        let combo = combos[index];
        nombre = combo.nombre || '';
        precio = combo.precio || '';
        descripcion = combo.descripcion || '';
        fotoCombo = combo.fotoCombo || ''; // Obtener la URL de la imagen del combo si existe
        alimentosSeleccionados = combo.alimentos || [];
        bebidasSeleccionadas = combo.bebidas || [];
    } else {
        // Reiniciar alimentos y bebidas seleccionados para nuevo combo
        alimentosSeleccionados = [];
        bebidasSeleccionadas = [];
    }

    Swal.fire({
        title: titulo,
        html: `
            <form id="formulario-combo-modal">
                <label for="combo-nombre">Nombre:</label><br>
                <input type="text" id="combo-nombre" class="swal2-input" placeholder="Nombre" value="${nombre}" required><br>
                <label for="combo-descripcion">Descripción:</label><br>
                <textarea id="combo-descripcion" class="swal2-textarea" placeholder="Descripción del Combo">${descripcion}</textarea><br>
                <label for="foto-combo-modal">Foto Combo:</label><br>
                <input type="file" id="foto-combo-modal" accept="image/*"><br>
                <img id="foto-combo-preview" src="${fotoCombo}" style="max-width: 200px; max-height: 200px;"><br><br>
                
                <div id="combo-detalle">
                    <label>Alimento:</label>
                    <select id="combo-alimento" class="swal2-input">
                        ${alimentosDisponibles.map(alimento => `<option value="${alimento.nombre}" data-precio="${alimento.precio}">${alimento.nombre}</option>`).join('')}
                    </select>
                    <input type="number" id="alimento-cantidad" placeholder="Cantidad de Alimento" class="swal2-input"><br><br>
                    <button type="button" onclick="agregarAlimento()" class="swal2-input">Agregar Alimento</button><br><br>
                    
                    <label>Bebida:</label>
                    <select id="combo-bebida" class="swal2-input">
                        ${bebidasDisponibles.map(bebida => `<option value="${bebida.nombre}" data-precio="${bebida.precio}">${bebida.nombre}</option>`).join('')}
                    </select>
                    <input type="number" id="bebida-cantidad" placeholder="Cantidad de Bebida" class="swal2-input"><br><br>
                    <button type="button" onclick="agregarBebida()" class="swal2-input">Agregar Bebida</button><br><br>
                    
                    <h4>Detalle:</h4>
                    <table class="detalle-tabla">
                        <thead>
                            <tr>
                                <th>Cantidad</th>
                                <th>Nombre</th>
                                <th>Precio U.</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="detalle-tabla">
                            ${renderDetalleTabla(alimentosSeleccionados, bebidasSeleccionadas)}
                        </tbody>
                    </table>
                    <p>Total: $<span id="total-precio">${calcularTotalPrecio(alimentosSeleccionados, bebidasSeleccionadas).toFixed(2)}</span></p>
                </div>
                <label for="combo-precio">Precio Combo:</label><br>
                <input type="number" id="combo-precio" class="swal2-input" value="${precio}" required placeholder="Precio del Combo"><br>
            </form>
        `,
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: botonTexto,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return new Promise((resolve) => {
                let nombreNuevo = document.getElementById('combo-nombre').value.trim();
                let precioNuevo = document.getElementById('combo-precio').value.trim();
                let descripcionNuevo = document.getElementById('combo-descripcion').value.trim();
                let fotoComboNuevo = document.getElementById('foto-combo-modal').files[0]; // Obtener el archivo de la imagen

                // Validar campos obligatorios
                if (!nombreNuevo || !precioNuevo || !descripcionNuevo) {
                    Swal.showValidationMessage('Por favor, completa todos los campos obligatorios.');
                    resolve(false);
                } else if (alimentosSeleccionados.length === 0 && bebidasSeleccionadas.length === 0) {
                    Swal.showValidationMessage('Por favor, selecciona al menos un alimento o bebida.');
                    resolve(false);
                }else {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        let fotoComboURL = e.target.result;
                        resolve({
                            nombre: nombreNuevo,
                            precio: precioNuevo,
                            descripcion: descripcionNuevo,
                            fotoCombo: fotoComboURL,
                            bebidas: bebidasSeleccionadas,
                            alimentos: alimentosSeleccionados
                        });
                    };
                    if (fotoComboNuevo) {
                        reader.readAsDataURL(fotoComboNuevo);
                    } else {
                        resolve({
                            nombre: nombreNuevo,
                            precio: precioNuevo,
                            descripcion: descripcionNuevo,
                            fotoCombo: fotoCombo,
                            bebidas: bebidasSeleccionadas,
                            alimentos: alimentosSeleccionados
                        });
                    }
                }
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (index !== null) {
                // Editar combo existente
                combos[index] = result.value;
                guardarCombos(index); // Llamar sin índice, ya que el array combos ya está actualizado
            } else {
                // Agregar nuevo combo
                combos.push(result.value);
                guardarCombos(); // Llamar sin índice para agregar
            }
            actualizarTablaCombos(); // Actualizar la tabla de combos
        }
    });

    // Mostrar vista previa de la imagen seleccionada
    document.getElementById('foto-combo-modal').addEventListener('change', function () {
        let reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('foto-combo-preview').src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
    });
}



// Función para agregar un alimento al detalle del combo
function agregarAlimento() {
    let alimentoSelect = document.getElementById('combo-alimento');
    let alimento = alimentoSelect.value;
    let cantidad = parseInt(document.getElementById('alimento-cantidad').value);
    let precioUnitario = parseFloat(alimentoSelect.selectedOptions[0].getAttribute('data-precio'));

    if (!alimento || isNaN(cantidad) || cantidad <= 0) {
        Swal.showValidationMessage('Por favor, ingresa un alimento y una cantidad válida.');
        resolve(false);
    }

    let precioTotal = precioUnitario * cantidad;

    alimentosSeleccionados.push({
        nombre: alimento,
        cantidad: cantidad,
        precioUnitario: precioUnitario,
        precioTotal: precioTotal
    });

    actualizarDetalleYTotal();
}

// Función para agregar una bebida al detalle del combo
function agregarBebida() {
    let bebidaSelect = document.getElementById('combo-bebida');
    let bebida = bebidaSelect.value;
    let cantidad = parseInt(document.getElementById('bebida-cantidad').value);
    let precioUnitario = parseFloat(bebidaSelect.selectedOptions[0].getAttribute('data-precio'));

    if (!bebida || isNaN(cantidad) || cantidad <= 0) {
        Swal.showValidationMessage('Por favor, ingresa una bebida y una cantidad válida.');
        resolve(false);

    }

    let precioTotal = precioUnitario * cantidad;

    bebidasSeleccionadas.push({
        nombre: bebida,
        cantidad: cantidad,
        precioUnitario: precioUnitario,
        precioTotal: precioTotal
    });

    actualizarDetalleYTotal();
}

// Función para renderizar la tabla de detalles
function renderDetalleTabla(alimentos, bebidas) {
    let detalleHtml = '';

    alimentos.forEach((alimento, index) => {
        detalleHtml += `
            <tr>
                <td>${alimento.cantidad}</td>
                <td>${alimento.nombre}</td>
                <td>$${alimento.precioUnitario.toFixed(2)}</td>
                <td>$${alimento.precioTotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-link eliminar-btn" onclick="eliminarAlimento(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    bebidas.forEach((bebida, index) => {
        detalleHtml += `
            <tr>
                <td>${bebida.cantidad}</td>
                <td>${bebida.nombre}</td>
                <td>$${bebida.precioUnitario.toFixed(2)}</td>
                <td>$${bebida.precioTotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-link eliminar-btn" onclick="eliminarBebida(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    return detalleHtml;
}

// Función para calcular el precio total del combo
function calcularTotalPrecio(alimentos, bebidas) {
    let totalPrecio = 0;

    alimentos.forEach(alimento => {
        totalPrecio += alimento.precioTotal;
    });

    bebidas.forEach(bebida => {
        totalPrecio += bebida.precioTotal;
    });

    return totalPrecio;
}

// Función para eliminar un alimento del detalle del combo
function eliminarAlimento(index) {
    alimentosSeleccionados.splice(index, 1);
    actualizarDetalleYTotal();
}

// Función para eliminar una bebida del detalle del combo
function eliminarBebida(index) {
    bebidasSeleccionadas.splice(index, 1);
    actualizarDetalleYTotal();
}

// Función para actualizar la tabla de detalles y el precio total
function actualizarDetalleYTotal() {
    document.getElementById('detalle-tabla').innerHTML = renderDetalleTabla(alimentosSeleccionados, bebidasSeleccionadas);
    document.getElementById('total-precio').innerText = calcularTotalPrecio(alimentosSeleccionados, bebidasSeleccionadas).toFixed(2);
}



// Función para actualizar la tabla con los combos actuales
function actualizarTablaCombos() {
    let tbody = document.getElementById('tbody-combos');
    tbody.innerHTML = ''; // Limpiar el tbody

    let registrosPorPagina = document.getElementById('registros-por-pagina').value;
    let busqueda = document.getElementById('busqueda-combo').value.toUpperCase();

    let combosFiltrados = combos.filter(sucursal => {
        return Object.values(sucursal).some(value =>
            String(value).toUpperCase().includes(busqueda)
        );
    });

    let combosMostrados = (registrosPorPagina === "all") ? combosFiltrados : combosFiltrados.slice(0, parseInt(registrosPorPagina));

    combosMostrados.forEach((combo, index) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${combo.nombre}</td>
            <td>$${combo.precio}</td>
            <td>${combo.descripcion}</td>
            <td>
                <button class="btn btn-link" onclick="mostrarDetalle(${index})">Ver Detalle</button>
                <div id="detalle-${index}" style="display: none;">
                    <p><strong>Bebidas:</strong> ${combo.bebidas.map(bebida => bebida.nombre).join(', ')}</p>
                    <p><strong>Alimentos:</strong> ${combo.alimentos.map(alimento => alimento.nombre).join(', ')}</p>
                </div>
            </td>
            <td style="text-align: center; vertical-align: middle;"><img src="${combo.fotoCombo}" style="max-width: 60px; max-height: 60px;"></td>
            <td>
                <button class="icon-button" onclick="mostrarFormulario(${index})">
                    <img src="../../recursos/media/editar.png"  alt="Icono Editar" class="icon.acciones">
                </button>
                <button class="icon-button" onclick="eliminarCombo(${index})">
                    <img src="../../recursos/media/borrar.png" alt="Icono Eliminar" class="icon.acciones">
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para mostrar el detalle del combo
function mostrarDetalle(index) {
    let combo = combos[index];
    let bebidasTexto = combo.bebidas.map(bebida => `${bebida.cantidad} ${bebida.nombre}`).join(', ');
    let alimentosTexto = combo.alimentos.map(alimento => `${alimento.cantidad} ${alimento.nombre}`).join(', ');

    Swal.fire({
        title: 'Detalle del Combo',
        html: `
            <p><strong>Bebidas:</strong> ${bebidasTexto}</p>
            <p><strong>Alimentos:</strong> ${alimentosTexto}</p>
        `
    });
}


// Función para eliminar un combo
function eliminarCombo(index) {
    Swal.fire({
        title: '¿Estás seguro de eliminar este combo?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#805A3B',
        cancelButtonColor: '#C60000',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            combos.splice(index, 1);
            guardarCombos();
            actualizarTablaCombos();
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El combo ha sido eliminado exitosamente.',
                icon: 'success',
                confirmButtonColor: '#805A3B',
                confirmButtonText: 'OK'
            });
        }
    });
}

// Función para guardar los combos en localStorage
function guardarCombos(index = null) {
    localStorage.setItem('combos', JSON.stringify(combos));

    if (index !== null) {
        Swal.fire({
            title: '¡Editado!',
            text: 'El combo fue editado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
    } else {
        Swal.fire({
            title: '¡Guardado!',
            text: 'El combo se ha agregado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#805A3B'
        });
}
}

// Cargar combos cuando la página se carga
window.onload = function () {
    fetch("../../modulos/modulo-catalago-alimento/data-alimento.json")
            .then(function (response) {
                return response.json();
            })
            .then(function (jsondata) {
                alimentosDisponibles = jsondata;
            })
            .catch(function (error) {
                console.error('Error al cargar los alimentos:', error);
            });

    fetch("../../modulos/modulo-catalago-bebida/data-bebida.json")
            .then(function (response) {
                return response.json();
            })
            .then(function (jsondata) {
                bebidasDisponibles = jsondata;
            })
            .catch(function (error) {
                console.error('Error al cargar las bebidas:', error);
            });

    fetch("../../modulos/modulo-catalago-combo/data-combo.json")
            .then(function (response) {
                return response.json();
            })
            .then(function (jsondata) {
                combos = jsondata;
                actualizarTablaCombos();
            })
            .catch(function (error) {
                console.error('Error al cargar los combos:', error);
            });
};

// Función para buscar combo por cualquier campo
function buscarCombo() {
    let input = document.getElementById('busqueda-combo').value.toUpperCase();
    let tbody = document.getElementById('tbody-combos');
    let tr = tbody.getElementsByTagName('tr');

    for (let i = 0; i < tr.length; i++) {
        let mostrarFila = false;

        // Recorrer cada celda de la fila
        for (let j = 0; j < tr[i].cells.length; j++) {
            let td = tr[i].cells[j];
            if (td) {
                let textValue = td.textContent || td.innerText;
                if (textValue.toUpperCase().indexOf(input) > -1) {
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




