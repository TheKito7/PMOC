// Importar Firebase

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import { getAuth } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



import { getFirestore } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// Configuração do projeto

const firebaseConfig = {
    apiKey: "AIzaSyDWbe-S2crSSkmMhm3GuHB9kncsxR3lPJs",
    authDomain: "pmoc-energisa.firebaseapp.com",
    projectId: "pmoc-energisa",
    storageBucket: "pmoc-energisa.firebasestorage.app",
    messagingSenderId: "254427215532",
    appId: "1:254427215532:web:faf0882d265aea7d4c5109",
    measurementId: "G-NK7FV6HNBW"
  };



// Inicializar Firebase

const app = initializeApp(firebaseConfig);


// Serviços

const auth = getAuth(app);

const db = getFirestore(app);


// Exportar

export { auth, db };