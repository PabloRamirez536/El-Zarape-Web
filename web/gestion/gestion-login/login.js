/* Copyright 2024 */
function validateForm() {
    let username = document.getElementById('username').value.trim();
    let password = document.getElementById('password').value.trim();
    
    // Mensaje de error
    let errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';

    // Configura la solicitud HTTP
    fetch('http://localhost:8080/Zarape/api/usuario/loginEmpelado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `nombre=${encodeURIComponent(username)}&contrasenia=${encodeURIComponent(password)}`,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                // Guarda el token y el nombre del usuario en localStorage
                localStorage.setItem('token', data.token || '');
                localStorage.setItem('username', username);
                
                if(data.rol === 1){
                  window.location.href = '../../comanda/vista-proceso.html';   
                }
                else{
                  window.location.href = '../gestion-inicio/view-gestion-inicio.html';   
                }
            } else {
                // Muestra el mensaje de error
                errorMessage.textContent = data.message;
                errorMessage.style.display = 'block';
            }
        })
        .catch((error) => {
            console.error('Error al verificar las credenciales:', error);
            errorMessage.textContent = 'Error en el servidor.';
            errorMessage.style.display = 'block';
        });
}
