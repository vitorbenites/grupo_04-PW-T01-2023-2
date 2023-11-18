import React from "react";
import { useState, useContext } from "react";
import "w3-css/w3.css";

export default function EventoMiniatura({ dataSelecionada, evento, contexto }) {
  // Variáveis de contexto
  const { excluirEvento } = useContext(contexto);
  const { editarEvento } = useContext(contexto);
  // Se a data selecionada é igual a à data do início do evento
  // Renderiza a miniatura
  if (evento.dataInicio === dataSelecionada) {
    return (
      <div className="w3-card w3-cursive w3-light-green w3-margin">
        <div>
          <span className="w3-left w3-padding">{evento.titulo}</span>
        </div>
        <div className="w3-left w3-padding">
          <span>
            {evento.horarioInicio} - {evento.horarioFim}
          </span>
        </div>
        <div
          className="w3-button w3-block w3-padding-small w3-blue w3-hover-indigo"
          onClick={() => editarEvento(evento)}
        >
          Editar
        </div>
        <div
          className="w3-button w3-block w3-padding-small w3-red w3-hover-indigo"
          onClick={() => excluirEvento(evento)}
        >
          Excluir
        </div>
      </div>
    );
  } else {
    return null;
  }
}
