let allProducts = []; // Inicializar la comanda vacía

// Función para calcular el total basado en el precio y la cantidad
function calcular(index) {
    var precio = parseFloat(document.getElementById('precio' + index).value);
    var cantidad = parseFloat(document.getElementById('cantidad' + index).value);
    var total = document.getElementById('total' + index);
    total.value = (precio * cantidad).toFixed(2);
}

function actualizarComanda() {
    const comandaLista = document.getElementById('comanda-lista');
    comandaLista.innerHTML = '';

    if (allProducts.length === 0) {
        // Mostrar mensaje si no hay productos en la comanda
        comandaLista.innerHTML = '<div class="alert alert-info">La comanda está vacía.</div>';

        // Establecer subtotal, IVA y total a cero
        document.getElementById('subtotal').innerText = '0.00';
        document.getElementById('iva').innerText = '0.00';
        document.getElementById('total').innerText = '0.00';

        return; // Salir si la comanda está vacía
    }

    let subtotal = 0;
    allProducts.forEach((product, index) => {
        comandaLista.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="flex-grow-1" style="font-size: 1.2em;">
                    ${product.quantity} x ${product.title} ($${(product.price).toFixed(2)})
                </div>
                <div style="font-size: 1.2em; margin-right: 10px;">
                    $${(product.price * product.quantity).toFixed(2)}
                </div>
                <button class="btn btn-sm btn-danger ml-2" onclick="eliminarProducto(${index})" style="padding: 0.25rem 0.5rem;">Eliminar</button>
            </div>
        `;
        subtotal += product.price * product.quantity;
    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    document.getElementById('iva').innerText = iva.toFixed(2);
    document.getElementById('total').innerText = total.toFixed(2);
}


function agregar(index, idProducto) {
    const nombre = document.getElementById('cantidad' + index).closest('.card-body').querySelector('.card-title').innerText;
    const precio = parseFloat(document.getElementById('precio' + index).value);
    const cantidadInput = document.getElementById('cantidad' + index);
    let cantidad = parseInt(cantidadInput.value);

    // Validar cantidad
    if (isNaN(cantidad) || cantidad < 1 || cantidad > 10) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad Inválida',
            text: 'La cantidad debe ser un número entre 1 y 10.',
        });
        return; // Salir si la validación falla
    }

    // Verificar si el producto ya está en la comanda
    const existingProductIndex = allProducts.findIndex(product => product.title === nombre);
    if (existingProductIndex > -1) {
        // Si ya existe, sumar la cantidad
        allProducts[existingProductIndex].quantity += cantidad;
    } else {
        const infoProduct = {
            idProducto: idProducto,
            title: nombre,
            price: precio,
            quantity: cantidad
        };
        allProducts.push(infoProduct);
    }

    // Restablecer la cantidad a 1 en la tarjeta
    cantidadInput.value = 1;

    const totalElement = document.getElementById('total' + index); // Asegúrate de que cada tarjeta tenga un ID único para el total
    if (totalElement) {
        calcular(index); // Restablecer a 1
    }

    console.log(allProducts);
    actualizarComanda(); // Actualiza la comanda después de agregar productos
}

function eliminarProducto(index) {
    allProducts.splice(index, 1); // Eliminar el producto de la comanda
    actualizarComanda(); // Actualizar la vista de la comanda
}

function cancelar() {
    allProducts = []; // Limpiar la comanda
    actualizarComanda(); // Actualizar la vista de la comanda
}

function cargarFormulario() {
    let subtotal = 0;
    allProducts.forEach(product => {
        subtotal += product.price * product.quantity;
    });
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    if (total == 0) {
        Swal.fire({
            icon: 'error',
            title: 'No hay nada en la comanda',
            text: 'Pavor de agregar productos a la comanda.',
        });
        return; // Salir si la validación falla
    }

    fetch('menu/view-tarjeta.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el contenido');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('contenido-modal').innerHTML = data;
                abrirModal(); // Abre el modal después de cargar el contenido
                inicializarFormulario(total);
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

function abrirModal() {
    const modal = document.getElementById('modal');
    modal.style.display = "block"; // Mostrar el modal
}

function cerrarModal() {
    const modal = document.getElementById('modal');
    modal.style.display = "none"; // Ocultar el modal
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function actualizarTarjetasAlimentos() {
    const token = localStorage.getItem('tokenCliente');
    if (!token) { // Validar si el token no existe
        Swal.fire({
            title: '¡Acceso denegado!',
            text: 'Debes iniciar sesión para realizar esta acción.',
            icon: 'warning',
            timer: 5000, // Duración de 5 segundos
            showConfirmButton: false, // Oculta el botón de confirmación
            timerProgressBar: true // Muestra la barra de progreso
        }).then(() => {
            window.location.href = '../../gestion/gestion-login/view-login.html'; // Redirige a la página de inicio de sesión
        });
        return; // Detener la ejecución
    }
    
    let ruta = "http://localhost:8080/Zarape/api/alimento/getAllAlimento?token=" + token;
    fetch(ruta)
            .then(response => response.json())
            .then(data => {
                const contenedorP = document.getElementById('tarjetas-p');
                const contenedorPos = document.getElementById('tarjetas-pos');

                // Recorrer los datos y agregar las tarjetas solo si están activos
                data.forEach((alimento, index) => {
                    if (alimento.producto.activo) { // Verificar si el alimento está activo
                        if (alimento.categoria.descripcion == "PLATILLOS PRINCIPALES") {
                            contenedorP.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <img src="${alimento.producto.foto}" class="card-img-top alimentos" alt="comida" />
                                <div class="card-body d-flex flex-column justify-content-between">
                                    <h5 class="card-title">${alimento.producto.nombre}</h5>
                                    <p class="card-text">${alimento.producto.descripcion}</p>
                                    <label>Precio:</label>
                                    <input type="text" id="precio${index}" class="form-control datos" name="precio[${index}]" value="${alimento.producto.precio.toFixed(2)}" disabled>
                                    <label for="cantidad${index}">Cantidad:</label>
                                    <input type="number" id="cantidad${index}" pattern="[0-9]{2}" min="1" max="10" class="form-control" name="cantidad[${index}]" value="1" onchange="calcular('${index}');" required> <!-- Habilitado -->
                                    <label>Total:</label>
                                    <input type="text" id="total${index}" class="form-control datos" name="total[${index}]" value="${alimento.producto.precio.toFixed(2)}" disabled>
                                    <button type="button" class="btn btn-danger mt-2 align-self-center" onclick="agregar('${index}', '${alimento.producto.idProducto}');">Añadir</button>
                                </div>
                            </div>
                        </div>
                    `;
                        }

                        if (alimento.categoria.descripcion == "POSTRES") {
                            contenedorPos.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <img src="${alimento.producto.foto}" class="card-img-top alimentos" alt="comida" />
                                <div class="card-body d-flex flex-column justify-content-between">
                                    <h5 class="card-title">${alimento.producto.nombre}</h5>
                                    <p class="card-text">${alimento.producto.descripcion}</p>
                                    <label>Precio:</label>
                                    <input type="text" id="precio${index}" class="form-control datos" name="precio[${index}]" value="${alimento.producto.precio.toFixed(2)}" disabled>
                                    <label for="cantidad${index}">Cantidad:</label>
                                    <input type="number" id="cantidad${index}" pattern="[0-9]{2}" min="1" max="10" class="form-control" name="cantidad[${index}]" value="1" onchange="calcular('${index}');" required> <!-- Habilitado -->
                                    <label>Total:</label>
                                    <input type="text" id="total${index}" class="form-control datos" name="total[${index}]" value="${alimento.producto.precio.toFixed(2)}" disabled>
                                    <button type="button" class="btn btn-danger mt-2 align-self-center" onclick="agregar('${index}', '${alimento.producto.idProducto}');">Añadir</button>
                                </div>
                            </div>
                        </div>
                        `;
                        }

                        // Calcular el total al cargar la tarjeta
                        calcular(index); // Llama a la función aquí para calcular el total al instante
                    }
                });
            })
            .catch(error => console.error('Error al cargar productos de tipo alimento:', error));
}

function actualizarTarjetasBebidas() {
    const token = localStorage.getItem('tokenCliente');
    if (!token) { // Validar si el token no existe
        Swal.fire({
            title: '¡Acceso denegado!',
            text: 'Debes iniciar sesión para realizar esta acción.',
            icon: 'warning',
            timer: 5000, // Duración de 5 segundos
            showConfirmButton: false, // Oculta el botón de confirmación
            timerProgressBar: true // Muestra la barra de progreso
        }).then(() => {
            window.location.href = '../../gestion/gestion-login/view-login.html'; // Redirige a la página de inicio de sesión
        });
        return; // Detener la ejecución
    }
    
    let ruta = "http://localhost:8080/Zarape/api/bebida/getAllBebida?token=" + token;
    fetch(ruta)
            .then(response => response.json())
            .then(data => {
                const contenedorJ = document.getElementById('tarjetas-j');
                const contenedorR = document.getElementById('tarjetas-r');
                const contenedorC = document.getElementById('tarjetas-c');

                // Recorrer los datos y agregar las tarjetas solo si están activos
                data.forEach((bebida, index) => {
                    if (bebida.producto.activo) { // Verificar si el alimento está activo
                        if (bebida.categoria.descripcion == "JUGOS") {
                            contenedorJ.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <img src="${bebida.producto.foto}" class="card-img-top alimentos" alt="comida" />
                                <div class="card-body d-flex flex-column justify-content-between">
                                    <h5 class="card-title">${bebida.producto.nombre}</h5>
                                    <p class="card-text">${bebida.producto.descripcion}</p>
                                    <label>Precio:</label>
                                    <input type="text" id="precio${index}" class="form-control datos" name="precio[${index}]" value="${bebida.producto.precio.toFixed(2)}" disabled>
                                    <label for="cantidad${index}">Cantidad:</label>
                                    <input type="number" id="cantidad${index}" pattern="[0-9]{2}" min="1" max="10" class="form-control" name="cantidad[${index}]" value="1" onchange="calcular('${index}');" required> <!-- Habilitado -->
                                    <label>Total:</label>
                                    <input type="text" id="total${index}" class="form-control datos" name="total[${index}]" value="${bebida.producto.precio.toFixed(2)}" disabled>
                                    <button type="button" class="btn btn-danger mt-2 align-self-center" onclick="agregar('${index}', '${bebida.producto.idProducto}');">Añadir</button>
                                </div>
                            </div>
                        </div>
                        `;
                        }

                        if (bebida.categoria.descripcion == "REFRESCOS") {
                            contenedorR.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <img src="${bebida.producto.foto}" class="card-img-top alimentos" alt="comida" />
                                <div class="card-body d-flex flex-column justify-content-between">
                                    <h5 class="card-title">${bebida.producto.nombre}</h5>
                                    <p class="card-text">${bebida.producto.descripcion}</p>
                                    <label>Precio:</label>
                                    <input type="text" id="precio${index}" class="form-control datos" name="precio[${index}]" value="${bebida.producto.precio.toFixed(2)}" disabled>
                                    <label for="cantidad${index}">Cantidad:</label>
                                    <input type="number" id="cantidad${index}" pattern="[0-9]{2}" min="1" max="10" class="form-control" name="cantidad[${index}]" value="1" onchange="calcular('${index}');" required> <!-- Habilitado -->
                                    <label>Total:</label>
                                    <input type="text" id="total${index}" class="form-control datos" name="total[${index}]" value="${bebida.producto.precio.toFixed(2)}" disabled>
                                    <button type="button" class="btn btn-danger mt-2 align-self-center" onclick="agregar('${index}', '${bebida.producto.idProducto}');">Añadir</button>
                                </div>
                            </div>
                        </div>
                        `;
                        }

                        if (bebida.categoria.descripcion == "CERVEZAS") {
                            contenedorC.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <img src="${bebida.producto.foto}" class="card-img-top alimentos" alt="comida" />
                                <div class="card-body d-flex flex-column justify-content-between">
                                    <h5 class="card-title">${bebida.producto.nombre}</h5>
                                    <p class="card-text">${bebida.producto.descripcion}</p>
                                    <label>Precio:</label>
                                    <input type="text" id="precio${index}" class="form-control datos" name="precio[${index}]" value="${bebida.producto.precio.toFixed(2)}" disabled>
                                    <label for="cantidad${index}">Cantidad:</label>
                                    <input type="number" id="cantidad${index}" pattern="[0-9]{2}" min="1" max="10" class="form-control" name="cantidad[${index}]" value="1" onchange="calcular('${index}');" required> <!-- Habilitado -->
                                    <label>Total:</label>
                                    <input type="text" id="total${index}" class="form-control datos" name="total[${index}]" value="${bebida.producto.precio.toFixed(2)}" disabled>
                                    <button type="button" class="btn btn-danger mt-2 align-self-center" onclick="agregar('${index}', '${bebida.producto.idProducto}');">Añadir</button>
                                </div>
                            </div>
                        </div>
                        `;
                        }

                        // Calcular el total al cargar la tarjeta
                        calcular(index); // Llama a la función aquí para calcular el total al instante
                    }
                });
            })
            .catch(error => console.error('Error al cargar productos de tipo bebidas:', error));
}

function inicializarFormulario(total) {
    const tarjeta = document.querySelector('#tarjeta'),
            formulario = document.querySelector('#formulario-tarjeta'),
            numeroTarjeta = document.querySelector('#tarjeta .numero'),
            nombreTarjeta = document.querySelector('#tarjeta .nombre'),
            logoMarca = document.querySelector('#logo-marca'),
            firma = document.querySelector('#tarjeta .firma p'),
            mesExpiracion = document.querySelector('#tarjeta .mes'),
            yearExpiracion = document.querySelector('#tarjeta .year'),
            ccv = document.querySelector('#tarjeta .ccv');

    document.getElementById('total-pagar').textContent = total.toFixed(2);

    //* Voltear tarjeta y actualizar el CCV
    formulario.inputCCV.addEventListener('keyup', () => {
        tarjeta.classList.add('active'); // Aseguramos que la clase se agrega siempre

        formulario.inputCCV.value = formulario.inputCCV.value
                .replace(/\s/g, '') // Eliminamos espacios en blanco
                .replace(/\D/g, ''); // Eliminamos cualquier letra o caracter no numérico

        // Mostrar el valor en la tarjeta
        ccv.textContent = formulario.inputCCV.value;

    });

    formulario.inputCCV.addEventListener('focus', () => {
        tarjeta.classList.add('active'); // Voltea la tarjeta cuando el usuario escribe en el CCV
        formulario.inputCCV.value = formulario.inputCCV.value
                .replace(/\s/g, '') // Eliminamos espacios en blanco
                .replace(/\D/g, ''); // Eliminamos cualquier letra o caracter no numérico

        // Mostrar el valor en la tarjeta
        ccv.textContent = formulario.inputCCV.value;
    });

    formulario.inputCCV.addEventListener('blur', () => {
        tarjeta.classList.remove('active'); // La vuelve a su posición original al salir del input
        formulario.inputCCV.value = formulario.inputCCV.value
                .replace(/\s/g, '') // Eliminamos espacios en blanco
                .replace(/\D/g, ''); // Eliminamos cualquier letra o caracter no numérico

        // Mostrar el valor en la tarjeta
        ccv.textContent = formulario.inputCCV.value;
    });


    //* Rotacion de la tarjeta
    tarjeta.addEventListener('click', () => {
        tarjeta.classList.toggle('active');
    });

//* Volteamos la tarjeta para mostrar el frente
    const mostrarFrente = () => {
        if (tarjeta.classList.contains('active')) {
            tarjeta.classList.remove('active');
        }
    };

//* Select del mes generado dinamicamente
    for (let i = 1; i <= 12; i++) {
        let opcion = document.createElement('option');
        opcion.value = i;
        opcion.innerText = i;
        formulario.selectMes.appendChild(opcion);
    }

//* Select del año generado dinamicamente
    const yearActual = new Date().getFullYear();
    for (let i = yearActual; i <= yearActual + 8; i++) {
        let opcion = document.createElement('option');
        opcion.value = i;
        opcion.innerText = i;
        formulario.selectYear.appendChild(opcion);
    }

//* Input numero de tarjeta
    formulario.inputNumero.addEventListener('keyup', (e) => {
        let valorInput = e.target.value;

        formulario.inputNumero.value = valorInput
                //* Eliminamos espacios en blanco
                .replace(/\s/g, '')
                //* Eliminar las letras
                .replace(/\D/g, '')
                //* Ponemos espacio cada cuatro numeros
                .replace(/([0-9]{4})/g, '$1 ')
                //* Elimina el ultimo espaciado
                .trim();

        numeroTarjeta.textContent = valorInput;

        if (valorInput == '') {
            numeroTarjeta.textContent = '#### #### #### ####';
            logoMarca.innerHTML = '';
        }

        if (valorInput[0] == 4) {
            logoMarca.innerHTML = '';
            const imagen = document.createElement('img');
            imagen.src = 'menu/img/logos/visa.png';
            logoMarca.appendChild(imagen);
        } else if (valorInput[0] == 5) {
            logoMarca.innerHTML = '';
            const imagen = document.createElement('img');
            imagen.src = 'menu/img/logos/mastercard.png';
            logoMarca.appendChild(imagen);
        }

        //* Volteamos la tarjeta para que el usuario vea el frente
        mostrarFrente();

    });

//* Input nombre de tarjeta
    formulario.inputNombre.addEventListener('input', (e) => {
        let valorInput = e.target.value.toUpperCase().replace(/[0-9]/g, ''); // Convierte a mayúsculas y elimina números

        formulario.inputNombre.value = valorInput; // Asigna el valor limpio al input
        nombreTarjeta.textContent = valorInput || 'JHON DOE'; // Si está vacío, muestra 'JHON DOE'
        firma.textContent = valorInput;

        mostrarFrente();
    });

//* Select mes
    formulario.selectMes.addEventListener('change', (e) => {
        mesExpiracion.textContent = e.target.value;

        mostrarFrente();
    });

//* Select año
    formulario.selectYear.addEventListener('change', (e) => {
        yearExpiracion.textContent = e.target.value.slice(2);

        mostrarFrente();
    });
}


function validarFormulario() {
    const numeroTarjeta = document.getElementById('inputNumero').value.replace(/\s+/g, '');
    const nombreTarjeta = document.getElementById('inputNombre').value.trim();
    const mesExpiracion = document.getElementById('selectMes').value;
    const yearExpiracion = document.getElementById('selectYear').value;
    const ccv = document.getElementById('inputCCV').value.trim();

    // Validar el número de tarjeta
    if (numeroTarjeta === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor, ingresa el número de la tarjeta.'
        });
        return false;
    }
    if (!/^\d{16}$/.test(numeroTarjeta)) {
        Swal.fire({
            icon: 'warning',
            title: 'Número de tarjeta inválido',
            text: 'El número de tarjeta debe tener 16 dígitos.'
        });
        return false;
    }

    // Validar el nombre
    if (nombreTarjeta === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor, ingresa el nombre de la tarjeta.'
        });
        return false;
    }

    // Validar la fecha de expiración
    if (mesExpiracion === 'Mes' || yearExpiracion === 'Año') {
        Swal.fire({
            icon: 'warning',
            title: 'Fecha de expiración',
            text: 'Por favor, selecciona la fecha de expiración.'
        });
        return false;
    }

    // Validar el CCV
    if (ccv === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Campo vacío',
            text: 'Por favor, ingresa el CCV.'
        });
        return false;
    }
    if (!/^\d{3}$/.test(ccv)) {
        Swal.fire({
            icon: 'warning',
            title: 'CCV inválido',
            text: 'El CCV debe tener 3 dígitos.'
        });
        return false;
    }

    return true; // Todos los campos son válidos
}

async function procesarPago() {

    if (!validarFormulario()) {
        return; // Detener el proceso si la validación falla
    }

    const idCliente = localStorage.getItem("idCliente");
    const idSucursal = 1;

    if (!idCliente) {
        alert("No se ha identificado el cliente.");
        return;
    }

    if (!Array.isArray(allProducts) || allProducts.length === 0) {
        alert("No hay productos en el carrito.");
        return;
    }

    const productos = allProducts.map(producto => ({
            cantidad: producto.quantity,
            precio: producto.price,
            idProducto: producto.idProducto || null,
            idCombo: producto.idCombo || null
        }));

    const datosPago = {
        idCliente: parseInt(idCliente),
        idSucursal: idSucursal,
        productos: productos
    };

    console.log("Datos de Pago:", JSON.stringify(datosPago));

    try {
        const response = await fetch('http://localhost:8080/Zarape/api/pago/pagoComanda', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Cambiado a application/json
            },
            body: JSON.stringify(datosPago)
        });

        const responseBody = await response.text(); // Captura la respuesta como texto
//        console.log("Respuesta del servidor:", responseBody); // Imprime la respuesta

        if (response.ok) {
            const data = JSON.parse(responseBody); // Intenta convertir el texto a JSON
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: "Pago procesado con éxito. ID de ticket: " + data.idTicket
            }).then(() => {
                // Limpiar la comanda
                allProducts = []; // Vaciar el carrito
                actualizarComanda();
                cerrarModal();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Error al procesar el pago: " + (responseBody.error || "Error desconocido")
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: "Hubo un error al procesar el pago."
        });
    }
}

