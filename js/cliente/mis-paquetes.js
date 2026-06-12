const API_URL ="http://127.0.0.1:8000/api";
let paquetesGlobal = [];
document.addEventListener( "DOMContentLoaded",
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
    await cargarPaquetes();
    document.getElementById("buscar").addEventListener("input",filtrarPaquetes);
}
async function cargarPaquetes(){
    try{
        const token =localStorage.getItem("token");
        const response =await fetch(
                `${API_URL}/mis-paquetes`,
                {
                    headers:{
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );
        const paquetes =await response.json();
        paquetesGlobal =paquetes;
        mostrarPaquetes(paquetes);
    }catch(error){
        console.error(error);
    }
}
function mostrarPaquetes(paquetes){
    const tabla =document.getElementById("tablaPaquetes");
    tabla.innerHTML = "";
    let total = 0;
    let transito = 0;
    let entregados = 0;
    paquetes.forEach(paquete => {
        total++;
        const estado =paquete.estado || "Registrado";
        if(estado.toLowerCase().includes("transito")){
            transito++;
        }
        if(estado.toLowerCase().includes("entregado")){
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
                    ${paquete.sucursal_origen?.nombre ?? "-"}
                </td>
                <td>
                    ${paquete.sucursal_destino?.nombre ?? "-"}
                </td>
                <td>
                    ${paquete.fecha_salida ?? "-"}
                </td>
                <td>
                    ${paquete.fecha_entrega ?? "-"}
                </td>
                <td>
                    <span class="badge bg-primary">
                        ${estado}
                    </span>
                </td>
                <td>
                    <button
                        class="btn btn-sm btn-info text-white"
                        onclick="verHistorial(${paquete.id})">
                        Ver Historial
                    </button>
                </td>
            </br>
        `;
    });
    document.getElementById("totalPaquetes").textContent = total;
    document.getElementById( "enTransito").textContent = transito;
    document.getElementById("entregados").textContent = entregados;
}
function filtrarPaquetes(){
    const texto =document.getElementById("buscar").value.toLowerCase();
    const resultado =paquetesGlobal.filter(paquete =>paquete.codigo_seguimiento.toLowerCase().includes(texto) || paquete.titulo.toLowerCase().includes(texto));
    mostrarPaquetes(resultado);
}
async function verHistorial(id){
    try{
        const token =localStorage.getItem("token");
        const response = await fetch(
                `${API_URL}/paquetes/${id}/historial`,
                {
                    headers:{
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );
        const historial =await response.json();
        const container =document.getElementById( "historialContainer");
        container.innerHTML = "";
        if(historial.length === 0){
            container.innerHTML = "<p>No existe historial.</p>";
        }else{
            historial.forEach(item => {
                container.innerHTML += `
                    <div class="timeline-item">
                        <h6>
                            Estado ID: ${item.estado_seguimiento_id}
                        </h6>
                        <p>
                            ${item.observacion ?? ''}
                        </p>
                        <p>
                            ${item.ubicacion}
                        </p>
                        <small>
                            ${item.fecha_hora}
                        </small>
                    </div>
                `;
            });
        }
        const modal =new bootstrap.Modal(document.getElementById("modalHistorial"));
        modal.show();
    }catch(error){
        console.error(error);
    }
}