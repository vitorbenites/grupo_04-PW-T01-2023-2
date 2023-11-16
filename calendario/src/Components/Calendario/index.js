import { useState } from "react";
import "w3-css/w3.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventoMiniatura from "./EventoMiniatura";

export default function Calendario() {
  // COMPONENTE CALENDÁRIO
  // Hooks
  const [selectedDate, setSelectedDate] = useState(new Date());
  const date = new Date();
  const [eventDate, setEventDate] = useState(date.toLocaleDateString("pt-br"));

  // On Change
  function handleDate(nextValue) {
    setSelectedDate(nextValue);
    setEventDate(nextValue.toLocaleDateString("pt-br"));
  }

  // MODAL ADICIONAR EVENTO
  // Função para abrir o modal
  const handleAdicionarEvento = () => {
    document.getElementById("evento").style.display = "block";
  };
  // Função para fechar o modal
  const handleFecharJanela = () => {
    document.getElementById("evento").style.display = "none";
  };

  // EVENTOS
  // Vetor de Eventos
  const [eventos, setEventos] = useState([]);
  // Objeto Evento
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

  const registrarEvento = (event) => {
    event.preventDefault();

    // Create a new event object
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

    // Add the new event to the list of events
    setEventos([...eventos, evento]);

    alert(`Evento ${evento.titulo} registrado com sucesso!`);

    // Clear the form
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

    // Close the modal
    document.getElementById("evento").style.display = "none";
  };

  return (
    <>
      <div className="w3-display-middle w3-center">
        <div className="w3-card w3-cell w3-mobile" id="calendario-card">
          <div className="w3-teal">
            <span className="w3-cursive w3-xxlarge">Calendário</span>
          </div>
          <Calendar onChange={handleDate} value={selectedDate} />
        </div>
        <div className="w3-card w3-cell w3-mobile w3-teal">
          <div>
            <span className="w3-xlarge">Eventos</span>
          </div>
          <div>
            <span className="w3-xlarge">{eventDate}</span>
          </div>
          <div
            className="eventosLista"
            children={eventos.map((evento) => (
              <EventoMiniatura evento={evento} />
            ))}
          ></div>
          <div className="btn-adicionar-eventos w3-padding w3-margin">
            <button
              onClick={handleAdicionarEvento}
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
              <div className="w3-xlarge w3-center">
                <span>Adicionar Evento</span>
              </div>
              <div className="w3-large w3-center">
                <span>{eventDate}</span>
              </div>
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
                      setEventoData({ ...eventoData, titulo: e.target.value })
                    }
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
                      setEventoData({ ...eventoData, titulo: e.target.value })
                    }
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
                      setEventoData({ ...eventoData, titulo: e.target.value })
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
                      setEventoData({ ...eventoData, titulo: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="w3-row-padding w3-mobile">
                <div className="w3-twothird">
                  <label>Local</label>
                  <input
                    className="w3-input w3-border w3-hover-border-black"
                    type="text"
                    name="local"
                    value={eventoData.local}
                    onChange={(e) =>
                      setEventoData({ ...eventoData, titulo: e.target.value })
                    }
                  />
                </div>
                <div className="w3-third">
                  <label>Frequência</label>
                  <select
                    className="w3-select"
                    name="frequencia"
                    value={eventoData.frequencia}
                    onChange={(e) =>
                      setEventoData({ ...eventoData, titulo: e.target.value })
                    }
                  >
                    <option value="" disabled selected>
                      Escolha
                    </option>
                    <option value="1">Hoje</option>
                    <option value="2">Diário</option>
                    <option value="3">Semanal</option>
                  </select>
                </div>
              </div>
              <div className="w3-container w3-padding">
                <label>Descrição</label>
                <textarea
                  className="w3-input w3-border w3-hover-border-black"
                  rows="3"
                  name="desc"
                  value={eventoData.desc}
                  onChange={(e) =>
                    setEventoData({ ...eventoData, titulo: e.target.value })
                  }
                ></textarea>
              </div>
              <input
                type="submit"
                className="w3-button w3-right w3-margin w3-green w3-hover-indigo"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
