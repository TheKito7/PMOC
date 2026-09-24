// ============================================
// PMOC ENERGISA
// DETALHES DO EQUIPAMENTO
// ============================================


import { db } from "./firebase.js";


import {

    doc,
    getDoc,
    collection,
    getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ============================================
// ID DO EQUIPAMENTO
// ============================================


const parametros = new URLSearchParams(
    window.location.search
);



const idEquipamento = parametros.get("id");



console.log(
    "ID recebido pela URL:",
    idEquipamento
);




// ============================================
// ELEMENTOS HTML
// ============================================


const codigo =
document.getElementById("codigo");


const unidade =
document.getElementById("unidade");


const ambiente =
document.getElementById("ambiente");


const marca =
document.getElementById("marca");


const modelo =
document.getElementById("modelo");


const capacidade =
document.getElementById("capacidade");


const listaManutencoes =
document.getElementById("listaManutencoes");






// ============================================
// CARREGAR EQUIPAMENTO
// ============================================


async function carregarEquipamento(){


try{


if(!idEquipamento){

console.error(
"ID do equipamento não informado"
);

return;

}





const referencia = doc(

    db,

    "equipamentos",

    idEquipamento

);




const resultado = await getDoc(
    referencia
);





if(!resultado.exists()){


console.error(
"Equipamento não encontrado"
);


return;


}





const equipamento =
resultado.data();




console.log(
"Equipamento encontrado:",
equipamento
);






codigo.innerHTML =

equipamento.codigo || "-";





unidade.innerHTML =

equipamento.unidade || "-";





ambiente.innerHTML =

equipamento.ambiente || "-";





marca.innerHTML =

equipamento.marca || "-";





modelo.innerHTML =

equipamento.modelo || "-";





capacidade.innerHTML =

equipamento.btus || "-";






carregarHistorico();




}


catch(error){


console.error(

"Erro ao carregar equipamento:",

error

);


}



}









// ============================================
// CARREGAR HISTÓRICO DE MANUTENÇÃO
// ============================================


async function carregarHistorico(){


try{



const referencia = collection(


db,


"equipamentos",


idEquipamento,


"manutencoes"


);





const resultado = await getDocs(
    referencia
);





listaManutencoes.innerHTML = "";






if(resultado.empty){


listaManutencoes.innerHTML = `


<tr>

<td colspan="4">

Nenhuma manutenção registrada.

</td>


</tr>


`;



return;


}






resultado.forEach((documento)=>{



const manutencao =
documento.data();






listaManutencoes.innerHTML += `



<tr>



<td>

${manutencao.data || "-"}

</td>



<td>

${manutencao.tipo || "-"}

</td>



<td>

${manutencao.tecnico || "-"}

</td>



<td>


<span class="status concluido">

${manutencao.status || "-"}

</span>


</td>



</tr>


`;



});




}


catch(error){


console.error(

"Erro ao carregar histórico:",

error

);



}



}









// ============================================
// BOTÃO NOVA MANUTENÇÃO
// ============================================


const botaoManutencao =

document.querySelector(
"#novaManutencao"
);





if(botaoManutencao){


botaoManutencao.addEventListener(

"click",

()=>{


window.location.href =


`cadastro_manutencao.html?id=${idEquipamento}`;



}


);


}







// ============================================
// VOLTAR
// ============================================


const botaoVoltar =

document.querySelector(
"#voltar"
);



if(botaoVoltar){


botaoVoltar.addEventListener(

"click",

()=>{


window.history.back();


}


);


}







// INICIAR

carregarEquipamento();  