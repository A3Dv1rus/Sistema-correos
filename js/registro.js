document.getElementById("formRegistro").addEventListener( "submit", registrar);
async function registrar(e) {
    e.preventDefault();
    const nombre =document.getElementById("nombre").value.trim();
    const email =document.getElementById("email").value.trim();
    const password =document.getElementById( "password").value;
    const password_confirmation =document.getElementById("password_confirmation").value;
    if (nombre.length < 3) {
        alert("Ingrese un nombre válido");
        return;
    }
    const gmailRegex =/^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        alert( "Debe ingresar un correo Gmail válido");
        return;
    }
    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.");
        return;
    }
    if (password !== password_confirmation) {
        alert("Las contraseñas no coinciden");
        return;
    }
    try {
        const response = await fetch(
                "http://127.0.0.1:8000/api/auth/registro",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        nombre,email,password,password_confirmation
                    })
                }
            );
        const data =await response.json();
        if (response.ok &&data.access_token) {
            localStorage.setItem("token",data.access_token);
            localStorage.setItem("usuario",JSON.stringify(data.user));
            alert("Registro exitoso");
            window.location.href ="cliente/cliente-dashboard.html";
        } else {
            console.error(data);
            if (data.errors) {
                let mensaje = "";
                Object.values(data.errors).forEach(error => {
                    mensaje += error[0] + "\n";
                });
                alert(mensaje);
            } else {
                alert( "No se pudo registrar el usuario");
            }
        }
    }
    catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor");
    }
}