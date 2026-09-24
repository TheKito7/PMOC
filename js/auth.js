// =====================================
// CONTROLE DE AUTENTICAÇÃO
// PMOC ENERGISA
// =====================================


import { auth, db } from "./firebase.js";



import {

    onAuthStateChanged,
    signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// Verificar usuário logado

onAuthStateChanged(auth, async (usuario)=>{


    const paginaAtual = window.location.pathname;



    // Caso não exista usuário

    if(!usuario){


        if(!paginaAtual.includes("index.html")){


            window.location.href="../index.html";


        }


        return;


    }



    // Usuário existe

    console.log(
        "Usuário conectado:",
        usuario.email
    );



    // Buscar dados no Firestore


    const referenciaUsuario = doc(

        db,

        "usuarios",

        usuario.uid

    );



    const documento = await getDoc(
        referenciaUsuario
    );



    if(documento.exists()){


        const dados = documento.data();



        console.log(
            "Perfil:",
            dados.perfil
        );



        // Mostrar nome no sistema


        const nomeUsuario =
        document.querySelector("#nomeUsuario");


        if(nomeUsuario){

            nomeUsuario.innerHTML =
            dados.nome;

        }



        const perfilUsuario =
        document.querySelector("#perfilUsuario");


        if(perfilUsuario){

            perfilUsuario.innerHTML =
            dados.perfil;

        }



    }


});




// FUNÇÃO SAIR


const botaoSair =
document.querySelector("#logout");



if(botaoSair){


    botaoSair.addEventListener(
    "click",
    async ()=>{


        await signOut(auth);


        window.location.href="../index.html";


    });


}