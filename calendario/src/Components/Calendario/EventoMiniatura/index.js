import React from "react";
import { useState } from "react";
import "w3-css/w3.css";

export default function EventoMiniatura({ dataSelecionada, evento }) {
  if (evento.dataInicio === dataSelecionada) {
    return (
      <div className="w3-card w3-cursive w3-light-green w3-margin">
        <div className="">
          <span>{evento.titulo}</span>
        </div>
        <div className="">
          <span>
            {evento.horarioInicio} - {evento.horarioFim}
          </span>
        </div>
        <div className="w3-button w3-block w3-padding-small w3-blue w3-hover-indigo">
          Editar
        </div>
        <div className="w3-button w3-block w3-padding-small w3-red w3-hover-indigo">
          Excluir
        </div>
      </div>
    );
  } else {
    return null;
  }
}
