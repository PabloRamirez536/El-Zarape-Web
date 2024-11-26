/*Copyright 2024*/

function calcular(index) {
  var precio = parseFloat(document.getElementById('precio' + index).value);
  var cantidad = parseFloat(document.getElementById('cantidad' + index).value);
  var total = document.getElementById('total' + index);
  total.value = precio * cantidad;
}


function agregar() {
  Swal.fire({
    position: "top-center",
    icon: "success",
    title: "Producto Agregado Exitosamente",
    showConfirmButton: false,
    timer: 1500
  });
} 