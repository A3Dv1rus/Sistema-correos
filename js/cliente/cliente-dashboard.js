const API_URL = "http://127.0.0.1:8000/api";
document.addEventListener("DOMContentLoaded",
    iniciar
);
async function iniciar() {
    const usuario =
        JSON.parse(
            localStorage.getItem("usuario")
        );
    if (!usuario) {
        window.location.href = "../login.html";
        return;
    }
    document.getElementById("nombreUsuario").textContent = usuario.nombre;
    document.getElementById("nombreBienvenida").textContent = usuario.nombre;
    await cargarPaquetes();
}
async function cargarPaquetes() {
    try {
        const token =
            localStorage.getItem( "token");
        const response =
            await fetch(
                `${API_URL}/mis-paquetes`,
                {
                    headers:{
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );
        const paquetes =await response.json();
        mostrarPaquetes( paquetes);
    } catch(error){
        console.error(error);
    }
}
function mostrarPaquetes(paquetes){
    const tabla =document.getElementById( "tablaPaquetes");
    tabla.innerHTML = "";
    let total = 0;
    let transito = 0;
    let entregados = 0;
    paquetes.forEach(paquete => {
        total++;
        const estado =
            paquete.estado ||
            "Registrado";
        if(
            estado
            .toLowerCase()
            .includes( "transito")
        ){
            transito++;
        }
        if(
            estado
            .toLowerCase()
            .includes( "entregado")
        ){
            entregados++;
        }
        tabla.innerHTML += `
            <tr>
                <td>
                    ${paquete.codigo_seguimiento}
                </td>
                <td>
                    ${paquete.titulo}
                </td>
                <td>
                    ${paquete.sucursal_origen?.nombre ?? '-'}
                </td>
                <td>
                    ${paquete.sucursal_destino?.nombre ?? '-'}
                </td>
                <td>
                    ${estado}
                </td>
            </tr>
        `;
    });
    document.getElementById("totalPaquetes").textContent =total;
    document.getElementById( "enTransito").textContent =transito;
    document.getElementById( "entregados").textContent =entregados;
}
async function logout(){
    try{
        const token =localStorage.getItem( "token" );
        await fetch(
            `${API_URL}/logout`,
            {
                method:"POST",
                headers:{
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );
    }catch(error){
        console.error(error);
    }
    localStorage.removeItem( "token");
    localStorage.removeItem("usuario");
    window.location.href ="../index.html";
}