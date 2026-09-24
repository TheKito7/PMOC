// ============================================
// PMOC ENERGISA
// CADASTRO DE MANUTENÇÃO
// ============================================


import { db } from "./firebase.js";


import {

    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ============================================
// ID EQUIPAMENTO
// ============================================


const parametros = new URLSearchParams(
    window.location.search
);


const codigoEquipamento =
parametros.get("id");



console.log(
    "Equipamento:",
    codigoEquipamento
);








// ============================================
// CARREGAR EQUIPAMENTO
// ============================================


async function carregarEquipamento(){


try{


const referencia = doc(

    db,

    "equipamentos",

    codigoEquipamento

);



const resultado = await getDoc(
    referencia
);




if(resultado.exists()){


const equipamento = resultado.data();



document.getElementById(
"codigoEquipamento"
).innerHTML = equipamento.codigo;



document.getElementById(
"descricaoEquipamento"
).innerHTML =

`${equipamento.unidade} - ${equipamento.ambiente}`;



}



}


catch(error){


console.error(

"Erro ao carregar equipamento:",

error

);


}



}









// ============================================
// SALVAR MANUTENÇÃO
// ============================================



const botaoSalvar =

document.querySelector(
".btn-principal"
);





botaoSalvar.addEventListener(

"click",

async ()=>{



const data =

document.getElementById(
"dataManutencao"
).value;



const tipo =

document.getElementById(
"tipoServico"
).value;




const tecnico =

document.getElementById(
"tecnico"
).value;




const observacao =

document.getElementById(
"observacao"
).value;






// CHECKLIST


const checkboxes =

document.querySelectorAll(

".check-list input"

);



let servicos=[];



checkboxes.forEach((item)=>{


if(item.checked){


servicos.push(

item.parentElement.innerText.trim()

);


}


});








if(!data || !tecnico){


alert(

"Informe a data e o técnico responsável."

);


return;


}








const manutencao = {



equipamento:

codigoEquipamento,



data:data,



tipo:tipo,



tecnico:tecnico,



servicos:servicos,



observacao:observacao,



status:"Concluído",



criadoEm:

serverTimestamp()



};







try{



// NOVA ESTRUTURA FIRESTORE

await addDoc(


collection(

db,

"equipamentos",

codigoEquipamento,

"manutencoes"

),


manutencao



);






alert(

"Manutenção registrada com sucesso!"

);






window.location.href =


`detalhes_equipamento.html?id=${codigoEquipamento}`;




}



catch(error){


console.error(

"Erro ao salvar manutenção:",

error

);



alert(

"Erro ao salvar manutenção."

);



}



});










// INICIAR


carregarEquipamento();