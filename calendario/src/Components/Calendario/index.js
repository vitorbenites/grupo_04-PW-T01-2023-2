import { useState, useContext, createContext } from "react";
import "w3-css/w3.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventoMiniatura from "./EventoMiniatura";
import "./style.css";
import "@fontsource/jetbrains-mono";

export default function Calendario() {
  // VARIÁVEIS E FUNÇÕES DO COMPONENTE CALENDÁRIO
  // Hooks
  const [selectedDate, setSelectedDate] = useState(new Date());
  const date = new Date();
  const [eventDate, setEventDate] = useState(date.toLocaleDateString("pt-br"));
  // Mudar data selecionada
  function handleDate(nextValue) {
    setSelectedDate(nextValue);
    setEventDate(nextValue.toLocaleDateString("pt-br"));
  }

  // VARIÁVEIS DOS EVENTOS
  // data para passar ao componente miniatura
  const [dataSemTempo] = selectedDate.toISOString().split("T");
  // Variável booleana para determinar se é uma edição de evento
  const [editando, setEditando] = useState([false]);
  // Variável que guarda o índice de um evento na lista de eventos
  const [indiceEvento, setIndiceEvento] = useState([]);
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

  // MODAL ADICIONAR/EDITAR EVENTO
  // Função para abrir o modal de adicionar/editar evento
  const handleAdicionarEditarEvento = () => {
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
    // Não está editando, está adicionando
    setEditando(false);
    // Nome da janela é "Adicinar Evento"
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
  const registrarEvento = (event) => {
    event.preventDefault();

    // Cria novo evento
    const evento = {
      titulo: eventoData.titulo,
      dataInicio: eventoData.dataInicio,
      dataFim: eventoData.dataFim,
      horarioInicio: eventoData.horarioInicio,
      horarioFim: eventoData.horarioFim,
      local: eventoData.local,
      frequencia: eventoData.frequencia,
      desc: eventoData.desc,
    };

    // Se é uma edição de evento
    if (editando == true) {
      // Substitui o evento no índice previamente guardado
      eventos.splice(indiceEvento, 1, evento);
      // editando é falso
      setEditando(false);
    } else {
      // Adiciona o evento na lista
      setEventos([...eventos, evento]);
    }

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

    // Fecha o modal depois do submit
    document.getElementById("evento").style.display = "none";
  };

  // Função para excluir um evento quando o usuário clica em "Excluir"
  function excluirEvento(evento) {
    // Remove o evento da lista
    const eventosAtualizados = eventos.filter((e) => e !== evento);
    // Atualiza o estado da lista
    setEventos(eventosAtualizados);
  }

  // Função para editar o evento
  const editarEvento = (evento) => {
    // Mostra o modal de adicionar/editar evento
    handleAdicionarEditarEvento();
    // Nome da janela é "Editar Evento"
    document.getElementById("modal").textContent = "Editar Evento";
    // Filtra pelo evento selecionado para editar
    const eventoSelecionado = eventos.filter((e) => e === evento);
    // Armazena o índice do evento
    setIndiceEvento(eventos.findIndex((e) => e === evento));
    // Editando é verdadeiro
    setEditando(true);
    // O estado de eventoData é o evento a ser editado
    setEventoData(evento);
  };

  // Contexto para ser utilizado no EventoMiniatura
  const CalendarioContexto = createContext();

  return (
    <div id="Calendario">
      <div className="w3-display-middle w3-center">
        <div
          className="w3-card w3-cell w3-mobile w3-light-blue"
          id="calendario-card"
        >
          <div className="w3-teal">
            <span className="w3-cursive w3-xxlarge w3-padding">Calendário</span>
          </div>
          {/*Componente Calendar */}
          <Calendar
            locale="pt-BR"
            className="w3-light-blue"
            calendarType="gregory"
            onChange={handleDate}
            value={selectedDate}
          />
        </div>
        {/*Parte dos Eventos*/}
        <div className="w3-card w3-cell w3-mobile w3-teal">
          <div>
            <span className="w3-xlarge">Eventos</span>
          </div>
          <div>
            <span className="w3-xlarge">{eventDate}</span>
          </div>
          {/*Contexto do Calendário passando a lista de eventos e os métodos excluirEvento 
					e editarEvento para o componente EventoMiniatura*/}
          <CalendarioContexto.Provider
            value={{ eventos, excluirEvento, editarEvento }}
          >
            {/*Div de renderização dos eventos*/}
            <div
              className="eventosLista"
              children={eventos.map((evento) => (
                <EventoMiniatura
                  key={evento}
                  dataSelecionada={dataSemTempo}
                  evento={evento}
                  contexto={CalendarioContexto}
                />
              ))}
            ></div>
          </CalendarioContexto.Provider>
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
    </div>
  );
}
