// ============================================
// PMOC ENERGISA
// CADASTRO DE EQUIPAMENTOS
// ============================================


import { db } from "./firebase.js";


import {

    doc,
    setDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// Formulário

const formulario = 
document.getElementById("formEquipamento");






formulario.addEventListener(
"submit",
async (evento)=>{


    evento.preventDefault();




    // Captura dados


    const equipamento = {


        codigo:
        document.getElementById("codigo").value,



        unidade:
        document.getElementById("unidade").value,



        ambiente:
        document.getElementById("ambiente").value,



        marca:
        document.getElementById("marca").value,



        modelo:
        document.getElementById("modelo").value,



        btus:
        Number(
        document.getElementById("btus").value
        ),



        ultimaManutencao:
        document.getElementById("ultimaManutencao").value,



        status:
        document.getElementById("status").value,



        criadoEm:
        new Date()



    };






    try{



        // cria documento usando o código como ID


        await setDoc(

            doc(
                db,
                "equipamentos",
                equipamento.codigo
            ),

            equipamento

        );






        alert(
            "Equipamento cadastrado com sucesso!"
        );





        window.location.href =
        "equipamentos.html";




    }



    catch(error){



        console.error(
            "Erro ao cadastrar:",
            error
        );



        alert(
            "Erro ao cadastrar equipamento."
        );


    }



});