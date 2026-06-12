async function login() {
    const email =document.getElementById("email").value.trim();
    const password =document.getElementById("password").value;
    try {
        const response =
            await fetch(
                "http://127.0.0.1:8000/api/auth/login",
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        email,password
                    })
                }
            );
        const data =await response.json();
        if ( response.ok && data.access_token) {
            localStorage.setItem("token",data.access_token);
            localStorage.setItem("usuario",JSON.stringify(data.user));
            if (data.user.rol_id === 1) {
                window.location.href ="admin/dashboard.html";
            } else {
                window.location.href ="cliente/cliente-dashboard.html";
            }
        } else {
            alert("Credenciales incorrectas");
        }
    }
    catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor");
    }
}