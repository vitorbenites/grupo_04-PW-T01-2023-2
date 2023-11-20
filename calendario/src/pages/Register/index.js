import { useState } from "react";

import { Link } from "react-router-dom";
import { auth } from "../../firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./style.css";

// Componente Register que é utilizado para cadastrar um novo usuário no sistema
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Função que é executada quando o formulário é submetido para cadastrar um novo usuário no sistema
  async function handleRegister(e) {
    e.preventDefault();

    // verifica se os campos email e password foram preenchidos
    if (email !== "" && password !== "") {
      // cria um novo usuário no sistema
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          // se o usuário foi criado com sucesso, redireciona para a rota /admin da aplicação
          navigate("/calendario", { replace: true });
        })
        .catch(() => {
          // se ocorreu algum erro ao criar o usuário, exibe uma mensagem de erro
          console.log("ERRO AO FAZER O CADASTRO");
        });
    } else {
      // Caso os campos email e password não tenham sido preenchidos, exibe uma mensagem de erro
      alert("Preencha todos os campos!");
    }
  }

  return (
    <div className="w3-container w3-cursive w3-large w3-pale-green">
      <div
        id="registro-container"
        className="w3-card w3-white w3-mobile w3-display-middle"
      >
        <header className="w3-center w3-teal">
          <span className="w3-xxlarge">Calendário</span>
        </header>
        <div className="w3-center">
          <span className="w3-xlarge">Cadastro</span>
        </div>

        <form onSubmit={handleRegister} className="w3-padding w3-margin">
          <label>Digite seu email:</label>
          <input
            className="w3-input w3-border w3-hover-border-black w3-margin-bottom"
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Digite uma senha:</label>
          <input
            className="w3-input w3-border w3-hover-border-black"
            type="password"
            placeholder="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w3-button w3-hover-indigo w3-green w3-margin-top"
          >
            Cadastrar
          </button>
          <Link to="/" className="w3-button w3-grey w3-margin-top">
            Voltar
          </Link>
        </form>
      </div>
    </div>
  );
}
