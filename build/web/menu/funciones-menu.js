/*Copyright 2024*/

let productosAgregados = [];

function calcular(index) {
    const precio = parseFloat(document.getElementById('precio' + index).value);
    const cantidad = parseInt(document.getElementById('cantidad' + index).value); // Obtener el valor de cantidad
    const total = document.getElementById('total' + index);
    total.value = (precio * cantidad).toFixed(2); // Calcular el total
}

function agregar(index, idProducto) {
    const nombre = document.getElementById('cantidad' + index).closest('.card-body').querySelector('.card-title').innerText;
    const precio = parseFloat(document.getElementById('precio' + index).value);
    const cantidad = parseInt(document.getElementById('cantidad' + index).value);

    // Validar cantidad
    if (isNaN(cantidad) || cantidad < 1 || cantidad > 10) {
        Swal.fire({
            icon: 'error',
            title: 'Cantidad Inválida',
            text: 'La cantidad debe ser un número entre 1 y 10.',
        });
        return; // Salir si la validación falla
    }

    // Almacenar los detalles del producto en la variable
    productosAgregados.push({idProducto, nombre, precio, cantidad});

    // Mostrar el mensaje de éxito
    Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Producto Agregado Exitosamente",
        showConfirmButton: false,
        timer: 1500
    });

    // Imprimir los productos agregados en la consola
    console.log(productosAgregados);
}

function actualizarTarjetasAlimentos() {
    let ruta = "http://localhost:8080/Zarape/api/alimento/getAllAlimento";
    fetch(ruta)
            .then(response => response.json())
            .then(data => {
                const contenedor1 = document.getElementById('tarjetas-alimentos-pincipales');
                const contenedor2 = document.getElementById('tarjetas-alimentos-postres');

                // Recorrer los datos y agregar las tarjetas solo si están activos
                data.forEach((alimento, index) => {
                    if (alimento.producto.activo) { // Verificar si el alimento está activo
                        if (alimento.categoria.descripcion == "PLATILLOS PRINCIPALES") {
                            contenedor1.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <img src="./recursos/recursos-menu/${alimento.producto.nombre}.jpg" class="card-img-top alimentos" alt="comida" />
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
                            contenedor2.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <img src="./recursos/recursos-menu/${alimento.producto.nombre}.jpg" class="card-img-top alimentos" alt="comida" />
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
    let ruta = "http://localhost:8080/Zarape/api/bebida/getAllBebida";
    fetch(ruta)
            .then(response => response.json())
            .then(data => {
                const contenedor1 = document.getElementById('tarjetas-bebidas-jugos');
                const contenedor2 = document.getElementById('tarjetas-bebidas-refrescos');
                const contenedor3 = document.getElementById('tarjetas-bebidas-cervezas');

                // Recorrer los datos y agregar las tarjetas solo si están activos
                data.forEach((bebida, index) => {
                    if (bebida.producto.activo) { // Verificar si el alimento está activo
                        if (bebida.categoria.descripcion == "JUGOS") {
                            contenedor1.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <img src="./recursos/recursos-menu/${bebida.producto.nombre}.jpg" class="card-img-top alimentos" alt="comida" />
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
                            contenedor2.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <img src="./recursos/recursos-menu/${bebida.producto.nombre}.jpg" class="card-img-top alimentos" alt="comida" />
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
                            contenedor3.innerHTML += `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100">
                                <img src="./recursos/recursos-menu/${bebida.producto.nombre}.jpg" class="card-img-top alimentos" alt="comida" />
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