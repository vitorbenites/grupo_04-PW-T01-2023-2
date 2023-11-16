import React from "react";
import { useState } from "react";
import "w3-css/w3.css";

export default function EventoMiniatura({ evento }) {
  return (
    <div className="w3-card w3-light-green w3-margin">
      <h3>{evento.titulo}</h3>
    </div>
  );
}
