//Importação das bibliotecas de configuração do firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configurações encontradas no console do Firebase
//Insira aqui as configurações
const firebaseConfig = {
  apiKey: "AIzaSyCCfKX-eGiC1LLRwU64BoGvk9OC7Ocd2r8",
  authDomain: "calendario-9ccc6.firebaseapp.com",
  projectId: "calendario-9ccc6",
  storageBucket: "calendario-9ccc6.appspot.com",
  messagingSenderId: "587967590374",
  appId: "1:587967590374:web:534d712c438434f3f93027",
};
//Inicialização do firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
export { db, auth };
