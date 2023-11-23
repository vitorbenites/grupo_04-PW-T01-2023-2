import { useState, useEffect } from "react";
import "w3-css/w3.css";
import Calendar from "react-calendar";
import styled from "styled-components";
import "./style.css";
import "@fontsource/jetbrains-mono";
import { auth, db } from "../../firebaseConnection";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export default function Calendario() {
  // VARIÁVEIS E FUNÇÕES DO COMPONENTE CALENDÁRIO
  const [selectedDate, setSelectedDate] = useState(new Date());
  const date = new Date();
  const [eventDate, setEventDate] = useState(date.toLocaleDateString("pt-br"));
  // Mudar data selecionada
  function handleDate(nextValue) {
    setSelectedDate(nextValue);
    setEventDate(nextValue.toLocaleDateString("pt-br"));
  }

  // VARIÁVEIS DOS USUÁRIOS E EVENTOS
  // Usuário
  const [user, setUser] = useState({});
  // Evento editando
  const [editando, setEditando] = useState({});
  // Lista de eventos
  const [eventos, setEventos] = useState([]);
  // O objeto evento
  const [eventoData, setEventoData] = useState({
    titulo: "",
    dataInicio: "",
    dataFim: "",
    horarioInicio: "",
    horarioFim: "",
    local: "",
    frequencia: "",
    desc: "",
  });
  // Carrega os eventos do usuário logado no sistema ao acessar a rota /calendario da aplicação e ao atualizar a página
  useEffect(() => {
    // Função que carrega os eventos do usuário logado no sistema
    async function loadEventos() {
      // localStorage.getItem é utilizado para recuperar o objeto userData do localStorage do navegador do usuário
      // JSON.parse é utilizado para converter a string JSON em um objeto JavaScript novamente e armazenar na variável data o objeto userData
      const userDetail = localStorage.getItem("@detailUser");
      // setUser é utilizado para armazenar o objeto userData na variável user
      setUser(JSON.parse(userDetail));
      // Verifica se o usuário está logado utilizando o objeto user retornado pelo localStorage.getItem
      if (userDetail) {
        const data = JSON.parse(userDetail);
        // collection é utilizado para acessar a coleção eventos do banco de dados Firestore do Firebase
        const eventoRef = collection(db, "eventos");
        // query é utilizado para realizar uma consulta na coleção eventos do banco de dados Firestore do Firebase
        // para recuperar os eventos do usuário logado no sistema
        const q = query(
          eventoRef,
          orderBy("created", "desc"),
          where("userUid", "==", data?.uid),
        );
        // onSnapshot é utilizado para recuperar os dados da consulta realizada na coleção eventos do banco de dados Firestore do Firebase
        // e atualizar a variável eventos com os dados retornados da consulta
        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              evento: doc.data().evento,
              userUid: doc.data().evento.userUid,
            });
          });
          setEventos(lista);
        });
      }
    }
    loadEventos();
  }, []);

  // MODAL ADICIONAR/EDITAR EVENTO
  // Função para abrir o modal de adicionar/editar evento
  const handleAdicionarEditarEvento = () => {
    // Nome da janela é "Adicionar Evento"
    document.getElementById("modal").textContent = "Adicionar Evento";
    // Mostra o modal
    document.getElementById("evento").style.display = "block";
  };

  // Função para fechar o modal de adicionar evento
  const handleFecharJanela = () => {
    // Limpa o formulário
    setEventoData({
      titulo: "",
      dataInicio: "",
      dataFim: "",
      horarioInicio: "",
      horarioFim: "",
      local: "",
      frequencia: "",
      desc: "",
    });
    // Esconde o modal
    document.getElementById("evento").style.display = "none";
  };

  // FUNÇÕES PARA REGISTRAR, EDITAR E EXCLUIR EVENTO
  // Função para registrar o evento quando clicar no botão submit
  async function registrarEvento(event) {
    event.preventDefault();

    // Verifica se o campo evento foi preenchido para atualizar um evento existente
    if (editando?.id) {
      editarEvento();
      return;
    }
    // addDoc é utilizado para registrar um nova evento no banco de dados Firestore do Firebase
    await addDoc(collection(db, "eventos"), {
      evento: eventoData,
      created: new Date(),
      userUid: user?.uid,
    })
      .then(() => {
        console.log("EVENTO REGISTRADO");
        setEventoData({});
      })
      .catch((error) => {
        console.log("ERRO AO REGISTRAR " + error);
      });

    // Fecha o modal depois do submit
    document.getElementById("evento").style.display = "none";
  }

  // Função para excluir um evento quando o usuário clica em "Excluir"
  async function excluirEvento(id) {
    const docRef = doc(db, "eventos", id);
    await deleteDoc(docRef);
  }

  // Editar informações de um evento existente no banco de dados Firestore do Firebase
  function editEvento(item) {
    handleAdicionarEditarEvento();
    document.getElementById("modal").textContent = "Editar Evento";
    setEventoData(item.evento);
    setEditando(item);
  }

  // Função para editar o evento
  async function editarEvento(evento) {
    const docRef = doc(db, "eventos", editando?.id);
    await updateDoc(docRef, {
      evento: eventoData,
    })
      .then(() => {
        console.log("EVENTO ATUALIZADO");
        setEventoData({
          titulo: "",
          dataInicio: "",
          dataFim: "",
          horarioInicio: "",
          horarioFim: "",
          local: "",
          frequencia: "",
          desc: "",
        });
        setEditando({});
      })
      .catch(() => {
        console.log("ERRO AO ATUALIZAR");
        setEventoData({
          titulo: "",
          dataInicio: "",
          dataFim: "",
          horarioInicio: "",
          horarioFim: "",
          local: "",
          frequencia: "",
          desc: "",
        });
        setEditando({});
      });
    handleFecharJanela();
  }

  // Realiza o logout
  async function handleLogout() {
    await signOut(auth);
  }

  // Filtrar pelos eventos para serem renderizados apenas naquele dia
  const dataSemTempo = selectedDate.toISOString().split("T")[0];

  const eventosFiltrados = eventos.filter((item) => {
    const dataInicio = new Date(item.evento.dataInicio);
    const dataFim = new Date(item.evento.dataFim);
    const dataAtual = new Date(dataSemTempo);
    return (
      dataAtual.getTime() >= dataInicio.getTime() &&
      dataAtual.getTime() <= dataFim.getTime()
    );
  });

  // Marcar os dias do componente react-calendar que possuem um evento
  const tileClassName = ({ date, view }) => {
    const eventoNaData = eventos.some((item) => {
      const dataInicio = new Date(item.evento.dataInicio);
      const dataFim = new Date(item.evento.dataFim);
      const dataRender = new Date(date);
      return (
        (dataRender.getTime() >= dataInicio.getTime() &&
          dataRender.getTime() <= dataFim.getTime()) ||
        item.evento.dataFim === date.toISOString().split("T")[0]
      );
    });
    return eventoNaData ? "highlight" : "";
  };

  // Renderização do componente
  return (
    <div id="Calendario">
      <div className="w3-display-middle w3-center">
        <div
          className="w3-card w3-cell w3-mobile w3-light-blue"
          id="calendario-card"
        >
          <div className="w3-teal">
            <span className="w3-xxlarge w3-padding">Calendário</span>
          </div>
          {/*Componente Calendar */}
          <CalendarioContainer>
            <Calendar
              locale="pt-BR"
              className="w3-light-blue"
              calendarType="gregory"
              onChange={handleDate}
              value={selectedDate}
              tileClassName={tileClassName}
            />
          </CalendarioContainer>
        </div>
        {/*Parte dos Eventos*/}
        <div className="w3-card w3-cell w3-mobile w3-teal">
          <div>
            <span className="w3-xlarge">Eventos</span>
          </div>
          <div>
            <span className="w3-xlarge">{eventDate}</span>
          </div>
          <div>
            {/*Mostrar os eventos do dia selecionado*/}
            {eventosFiltrados.map((item) => (
              <div
                key={item.id}
                className="w3-card w3-cursive w3-light-green w3-margin"
              >
                <div>
                  <span className="w3-left w3-padding">
                    {item.evento.titulo}
                  </span>
                </div>
                <div className="w3-left w3-padding">
                  <span>
                    {item.evento.horarioInicio} - {item.evento.horarioFim}
                  </span>
                </div>
                <div
                  className="w3-button w3-block w3-padding-small w3-blue w3-hover-indigo"
                  onClick={() => editEvento(item)}
                >
                  Editar
                </div>
                <div
                  className="w3-button w3-block w3-padding-small w3-red w3-hover-indigo"
                  onClick={() => excluirEvento(item.id)}
                >
                  Excluir
                </div>
              </div>
            ))}
          </div>
          {/*Botão de adicionar eventos*/}
          <div className="btn-adicionar-eventos w3-padding w3-margin">
            <button
              onClick={handleAdicionarEditarEvento}
              className="w3-button w3-green w3-hover-indigo"
            >
              Adicionar Evento
            </button>
          </div>
        </div>
      </div>
      {/*Modal de Adicionar Evento */}
      <form onSubmit={registrarEvento}>
        <div id="evento" className="w3-modal">
          <div className="w3-modal-content">
            <div className="w3-container w3-padding w3-cursive w3-teal">
              <span
                onClick={handleFecharJanela}
                className="w3-button w3-display-topright w3-xlarge"
              >
                &times;
              </span>
              {/*Nome da janela */}
              <div className="w3-xlarge w3-center">
                <span id="modal"></span>
              </div>
              <div className="w3-large w3-center">
                <span>{eventDate}</span>
              </div>
              {/*Input do título*/}
              <div className="w3-container">
                <label>Título</label>
                <input
                  className="w3-input w3-border w3-hover-border-black"
                  type="text"
                  name="titulo"
                  value={eventoData.titulo}
                  onChange={(e) =>
                    setEventoData({
                      ...eventoData,
                      titulo: e.target.value,
                    })
                  }
                  required
                />
              </div>
              {/* Linha de inputs sobre os horários e datas */}
              <div className="w3-row-padding w3-mobile">
                <div className="w3-quarter">
                  <label>Data Início</label>
                  <input
                    className="w3-input w3-border w3-hover-border-black"
                    type="date"
                    name="dataInicio"
                    value={eventoData.dataInicio}
                    onChange={(e) =>
                      setEventoData({
                        ...eventoData,
                        dataInicio: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="w3-quarter">
                  <label>Data Fim</label>
                  <input
                    className="w3-input w3-border w3-hover-border-black"
                    type="date"
                    name="dataFim"
                    value={eventoData.dataFim}
                    onChange={(e) =>
                      setEventoData({ ...eventoData, dataFim: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="w3-quarter">
                  <label>Horário Início</label>
                  <input
                    className="w3-input w3-border w3-hover-border-black"
                    type="time"
                    name="horarioInicio"
                    value={eventoData.horarioInicio}
                    onChange={(e) =>
                      setEventoData({
                        ...eventoData,
                        horarioInicio: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="w3-quarter">
                  <label>Horário Fim</label>
                  <input
                    className="w3-input w3-border w3-hover-border-black"
                    type="time"
                    name="horarioFim"
                    value={eventoData.horarioFim}
                    onChange={(e) =>
                      setEventoData({
                        ...eventoData,
                        horarioFim: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              {/*Input do local*/}
              <div className="w3-row-padding w3-mobile">
                <div className="w3-twothird">
                  <label>Local</label>
                  <input
                    className="w3-input w3-border w3-hover-border-black"
                    type="text"
                    name="local"
                    value={eventoData.local}
                    onChange={(e) =>
                      setEventoData({ ...eventoData, local: e.target.value })
                    }
                  />
                </div>
                {/*Input da frequencia*/}
                <div className="w3-third">
                  <label>Frequência</label>
                  <select
                    className="w3-select"
                    name="frequencia"
                    value={eventoData.frequencia}
                    onChange={(e) =>
                      setEventoData({
                        ...eventoData,
                        frequencia: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="1">Hoje</option>
                    <option value="2">Diário</option>
                    <option value="3">Semanal</option>
                  </select>
                </div>
              </div>
              {/*Input da descrição do evento*/}
              <div className="w3-container w3-padding">
                <label>Descrição</label>
                <textarea
                  className="w3-input w3-border w3-hover-border-black"
                  rows="3"
                  name="desc"
                  value={eventoData.desc}
                  onChange={(e) =>
                    setEventoData({ ...eventoData, desc: e.target.value })
                  }
                ></textarea>
              </div>
              {/*Botão de salvar*/}
              <input
                type="submit"
                value="Salvar"
                className="w3-button w3-right w3-margin w3-green w3-hover-indigo"
              />
            </div>
          </div>
        </div>
      </form>
      <div
        className="w3-button w3-red w3-display-topright w3-margin w3-padding"
        onClick={handleLogout}
      >
        Sair
      </div>
    </div>
  );
}

// CSS do componente react-calendar
const CalendarioContainer = styled.div`
  .highlight {
    background-color: olivedrab;
  }
  background-color: #009688;

  .react-calendar__navigation {
    display: flex;

    .react-calendar__navigation__label {
      font-weight: bold;
    }

    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
    }
  }

  .react-calendar__month-view__weekdays {
    color: white;
    text-align: center;
    font-weight: bold;
    text-decoration: none;
    background-color: steelblue;
  }

  button {
    background-color: steelblue;
    border: 0;
    border-radius: 0px;
    color: white;
    padding: 8px;
    cursor: pointer;

    &:hover {
      background-color: slategrey;
    }

    &:active {
    }
  }

  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

    .react-calendar__tile {
      max-width: initial !important;
    }

    .react-calendar__tile--range {
      background-color: darkcyan;
    }
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.7;
  }
  .react-calendar__month-view__days__day--weekend {
    color: #dfdfdf;
  }

  .react-calendar__year-view__months,
  .react-calendar__decade-view__years,
  .react-calendar__century-view__decades {
    display: grid !important;
    grid-template-columns: 20% 20% 20% 20% 20%;

    &.react-calendar__year-view__months {
      grid-template-columns: 33.3% 33.3% 33.3%;
    }

    .react-calendar__tile {
      max-width: initial !important;
    }
  }
`;
