const API_URL ="http://127.0.0.1:8000/api";
document.addEventListener("DOMContentLoaded",
    iniciar
);
async function iniciar(){
    const usuario =
        JSON.parse(
            localStorage.getItem("usuario")
        );
    if(!usuario){
        window.location.href ="../login.html";
        return;
    }
    cargarDatos(usuario);
    document.getElementById( "formPerfil").addEventListener( "submit",actualizarPerfil);
}
function cargarDatos(usuario){
    document.getElementById("nombreTitulo").textContent =usuario.nombre;
    document.getElementById("correoTitulo").textContent =usuario.email;
    document.getElementById("nombre").value =usuario.nombre;
    document.getElementById("email").value =usuario.email;
    document.getElementById( "usuarioId").value =usuario.id;
    document.getElementById("rol").value =usuario.rol_id == 1 ? "Administrador": "Cliente";
    document.getElementById("fechaRegistro").value =usuario.created_at ? usuario.created_at : "No disponible";
}
async function actualizarPerfil(event){
    event.preventDefault();
    const nombre =document.getElementById("nombre").value;
    const email =document.getElementById("email").value;
    const usuario =
        JSON.parse(localStorage.getItem("usuario")
        );
    try{
        const token =localStorage.getItem( "token" );
        const response =
            await fetch(
                `${API_URL}/perfil`,
                {
                    method:"PUT",
                    headers:{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body:JSON.stringify({nombre,email})
                }
            );
        if(!response.ok){
            throw new Error("Error al actualizar");
        }
        const usuarioActualizado =
            {
                ...usuario,
                nombre,
                email
            };
        localStorage.setItem("usuario",
            JSON.stringify(usuarioActualizado)
        );
        document.getElementById("mensaje").innerHTML =
        `
            <div class="alert alert-success">
                Perfil actualizado correctamente.
            </div>
        `;
        document.getElementById("nombreTitulo").textContent = nombre;
        document.getElementById("correoTitulo").textContent =email;
    }catch(error){
        console.error(error);
        document.getElementById("mensaje").innerHTML =
        `
            <div class="alert alert-danger">
                No se pudo actualizar el perfil.
            </div>
        `;
    }
}