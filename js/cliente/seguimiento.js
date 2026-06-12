const API_URL ="http://127.0.0.1:8000/api";
document.addEventListener("DOMContentLoaded",
    iniciar
);
function iniciar(){
    const usuario =
        JSON.parse(
            localStorage.getItem("usuario")
        );
    if(!usuario){
        window.location.href ="../login.html";
        return;
    }
    document.getElementById("btnBuscar").addEventListener("click",buscarPaquete);
}
async function buscarPaquete(){
    const codigo =document.getElementById("codigoSeguimiento").value.trim();
    if(!codigo){
        alert("Ingrese un código de seguimiento");
        return;
    }
    try{
        const token =localStorage.getItem("token");
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
        const paquete =paquetes.find(p =>p.codigo_seguimiento === codigo);
        if(!paquete){
            alert("Paquete no encontrado");
            return;
        }
        mostrarPaquete( paquete);
        await cargarHistorial(paquete.id);
    }catch(error){
        console.error(error);
        alert("Error al consultar paquete");
    }
}
function mostrarPaquete(paquete){
    document.getElementById("resultado").style.display ="block";
    document.getElementById( "infoCodigo").textContent =paquete.codigo_seguimiento;
    document.getElementById("infoTitulo").textContent =paquete.titulo;
    document.getElementById("infoEstado").textContent =paquete.estado || "Registrado";
    document.getElementById("infoOrigen").textContent =paquete.sucursal_origen?.nombre|| "-";
    document.getElementById("infoDestino").textContent =paquete.sucursal_destino?.nombre|| "-";
    document.getElementById("infoEntrega").textContent =paquete.fecha_entrega|| "-";
}
async function cargarHistorial(id){
    try{
        const token =localStorage.getItem("token");
        const response = await fetch(
                `${API_URL}/mis-paquetes/${id}/historial`,
                {
                    headers:{
                        Authorization:
                        `Bearer ${token}`
                    }
                }
            );
        const historial =await response.json();
        const container =document.getElementById("historialContainer");
        container.innerHTML = "";
        if(historial.length === 0){
            container.innerHTML = `
                <div class="alert alert-warning">
                    No existe historial
                    para este paquete.
                </div>
            `;
            return;
        }
        historial.forEach(item => {
            container.innerHTML += `
                <div class="timeline-item">
                    <h6>
                        ${item.estado}
                    </h6>
                    <p>
                        ${item.descripcion ?? ''}
                    </p>
                    <small>
                        ${item.created_at}
                    </small>
                </div>
            `;
        });
    }catch(error){
        console.error(error);
    }
}