// =====================================
// LOGIN PMOC ENERGISA
// Firebase Authentication
// =====================================


// Importar Firebase

import { auth, db } from "./firebase.js";


// Importar funções de autenticação

import { 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Importar Firestore

import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// Capturar formulário

const loginForm = document.getElementById("loginForm");



// Quando clicar em entrar

loginForm.addEventListener("submit", async (e)=>{


    e.preventDefault();



    // pegar valores digitados

    const email = document.getElementById("email").value;

    const senha = document.getElementById("senha").value;


    const mensagem = document.getElementById("mensagem");



    try{


        // Login no Firebase

        const usuario = await signInWithEmailAndPassword(

            auth,

            email,

            senha

        );



        // Pegar UID do usuário

        const uid = usuario.user.uid;



        console.log("Usuário autenticado:", uid);



        // Buscar perfil no Firestore

        const usuarioRef = doc(

            db,

            "usuarios",

            uid

        );


        const usuarioSnap = await getDoc(usuarioRef);



        if(usuarioSnap.exists()){



            const dados = usuarioSnap.data();



            console.log("Perfil:", dados.perfil);



            // Verificar permissão


            if(dados.perfil === "admin"){


                window.location.href =
                "paginas/dashboard.html";


            }



            else if(dados.perfil === "prestador"){


                window.location.href =
                "paginas/prestador.html";


            }


            else{


                mensagem.innerHTML =
                "Perfil sem permissão.";


            }



        }

        else{


            mensagem.innerHTML =
            "Usuário sem cadastro no sistema.";


        }




    }


    catch(error){


        console.error(error);



        if(error.code === "auth/too-many-requests"){

            mensagem.innerHTML =
            "Muitas tentativas. Aguarde alguns minutos.";
    
        }
    
    
        else if(error.code === "auth/invalid-credential"){
    
            mensagem.innerHTML =
            "E-mail ou senha incorretos.";
    
        }
    
    
        else{
    
            mensagem.innerHTML =
            "Erro ao realizar login.";
    
        }


    }



});