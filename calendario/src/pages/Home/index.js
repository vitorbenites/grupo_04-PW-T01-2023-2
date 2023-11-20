import { useState } from "react";
import "./home.css";

import { Link } from "react-router-dom";

import { auth } from "../../firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useNavigate } from "react-router-dom";

// Componente Home que é utilizado para fazer o login no sistema e acessar a rota /admin da aplicação
export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Função que é executada quando o formulário é submetido para fazer o login no sistema
  async function handleLogin(e) {
    e.preventDefault();

    // verifica se os campos email e password foram preenchidos para fazer o login
    if (email !== "" && password !== "") {
      // faz o login no sistema com o email e password informados
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          // navegar para /admin
          // se o login foi realizado com sucesso, redireciona para a rota /admin da aplicação
          // replace: true é utilizado para substituir a rota atual pela rota /admin
          navigate("/calendario", { replace: true });
        })
        .catch(() => {
          // se ocorreu algum erro ao fazer o login, exibe uma mensagem de erro
          console.log("ERRO AO FAZER O LOGIN");
        });
    } else {
      // caso os campos email e password não tenham sido preenchidos, exibe uma mensagem de erro
      alert("Preencha todos os campos!");
    }
  }

  return (
    <div className="w3-container w3-cursive w3-large w3-pale-green">
      <div
        id="login-container"
        className="w3-card w3-white w3-mobile w3-display-middle"
      >
        <header className="w3-center w3-teal">
          <span className="w3-xxlarge">Calendário</span>
        </header>
        <form onSubmit={handleLogin} className="w3-padding w3-margin">
          <label>Email</label>
          <input
            className="w3-input w3-border w3-hover-border-black w3-margin-bottom"
            type="text"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Senha</label>
          <input
            className="w3-input w3-border w3-hover-border-black"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w3-button w3-hover-indigo w3-green w3-margin-top"
          >
            Entrar
          </button>
          <Link to="/Register" className="w3-button w3-grey w3-margin-top">
            Cadastre-se
          </Link>
        </form>
      </div>
    </div>
  );
}
