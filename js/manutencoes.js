// ============================================
// PMOC ENERGISA
// MÓDULO DE MANUTENÇÕES
// ============================================


import { db } from "./firebase.js";


import {

    collection,
    getDocs,
    query,
    orderBy

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ============================================
// VARIÁVEIS
// ============================================


let listaManutencoes = [];







// ============================================
// ELEMENTOS
// ============================================


const tabela = 
document.getElementById(
    "listaManutencoes"
);



const total =
document.getElementById(
    "totalManutencoes"
);



const preventivas =
document.getElementById(
    "totalPreventivas"
);



const corretivas =
document.getElementById(
    "totalCorretivas"
);



const pendentes =
document.getElementById(
    "totalPendentes"
);






// FILTROS


const filtroTipo =
document.getElementById(
    "filtroTipo"
);



const filtroStatus =
document.getElementById(
    "filtroStatus"
);



const filtroEquipamento =
document.getElementById(
    "filtroEquipamento"
);








// ============================================
// BUSCAR MANUTENÇÕES
// ============================================


async function carregarManutencoes(){



try{


const consulta = query(

    collection(
        db,
        "manutencoes"
    ),

    orderBy(
        "criadoEm",
        "desc"
    )

);




const resultado =

await getDocs(
    consulta
);





listaManutencoes = [];





resultado.forEach((documento)=>{


listaManutencoes.push({

    id:
    documento.id,

    ...documento.data()

});


});





console.log(
"Manutenções:",
listaManutencoes
);





atualizarIndicadores();


mostrarTabela(
    listaManutencoes
);





}


catch(error){


console.error(

"Erro ao carregar manutenções:",

error

);



tabela.innerHTML = `

<tr>

<td colspan="6">

Erro ao carregar dados.

</td>

</tr>

`;



}



}









// ============================================
// INDICADORES
// ============================================


function atualizarIndicadores(){



let totalPreventiva = 0;

let totalCorretiva = 0;

let totalPendente = 0;





listaManutencoes.forEach((item)=>{



if(item.tipo === "Preventiva"){

totalPreventiva++;

}



if(item.tipo === "Corretiva"){

totalCorretiva++;

}



if(item.status === "Pendente"){

totalPendente++;

}



});





total.innerHTML =
listaManutencoes.length;



preventivas.innerHTML =
totalPreventiva;



corretivas.innerHTML =
totalCorretiva;



pendentes.innerHTML =
totalPendente;



}









// ============================================
// MOSTRAR TABELA
// ============================================


function mostrarTabela(dados){



if(dados.length === 0){



tabela.innerHTML = `


<tr>

<td colspan="6">

Nenhuma manutenção encontrada.

</td>


</tr>


`;

return;


}






tabela.innerHTML = "";





dados.forEach((item)=>{



tabela.innerHTML += `


<tr>



<td>

${item.data || "-"}

</td>





<td>

${item.equipamento || "-"}

</td>





<td>

${item.tipo || "-"}

</td>





<td>

${item.tecnico || "-"}

</td>





<td>


<span class="status verde-status">

${item.status || "Concluído"}

</span>


</td>





<td>


<a href="detalhes_equipamento.html?id=${item.equipamento}">

<i class='bx bx-show'></i>

</a>



</td>




</tr>


`;



});



}









// ============================================
// FILTROS
// ============================================


function aplicarFiltros(){



let resultado = listaManutencoes;




if(filtroTipo.value){


resultado = resultado.filter(

item =>

item.tipo === filtroTipo.value

);


}




if(filtroStatus.value){


resultado = resultado.filter(

item =>

item.status === filtroStatus.value

);


}






if(filtroEquipamento.value){


resultado = resultado.filter(

item =>

item.equipamento

.toLowerCase()

.includes(

filtroEquipamento.value

.toLowerCase()

)

);


}




mostrarTabela(resultado);



}








// EVENTOS


filtroTipo.addEventListener(

"change",

aplicarFiltros

);



filtroStatus.addEventListener(

"change",

aplicarFiltros

);



filtroEquipamento.addEventListener(

"input",

aplicarFiltros

);








// INICIAR


carregarManutencoes();