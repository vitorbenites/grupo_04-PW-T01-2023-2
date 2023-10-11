// Script do Calendário
// Vitor de Freitas Benites
const diasTag = document.querySelector(".dias"),
  dataAtual = document.querySelector(".data-atual"),
  prevProxIcon = document.querySelectorAll(".icons span");

// Atribuindo data, ano atual e mes atual
let data = new Date(),
  anoAtual = data.getFullYear(),
  mesAtual = data.getMonth();

// Atribuindo o nome de todos os meses em um vetor
const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Função mostraCalendario
const mostrarCalendario = () => {
  let primeiroDiaMes = new Date(anoAtual, mesAtual, 1).getDay(), // primeiro dia do mês
    ultimaDataMes = new Date(anoAtual, mesAtual + 1, 0).getDate(), // ultima data do mês
    ultimoDiaMes = new Date(anoAtual, mesAtual, ultimaDataMes).getDay(), // ultimo dia do mês
    ultimaDataUltimoMes = new Date(anoAtual, mesAtual, 0).getDate(); // ultima data do mês anterior
  let liTag = "";

  for (let i = primeiroDiaMes; i > 0; i--) {
    // Listando os últimos dias do mês anterior
    liTag += `<li class="inactive">${ultimaDataUltimoMes - i + 1}</li>`;
  }

  for (let i = 1; i <= ultimaDataMes; i++) {
    // Listando os dias do mês atual
    // Classe ativa se é o dia atual
    let ehHoje =
      i === data.getDate() &&
      mesAtual === new Date().getMonth() &&
      anoAtual === new Date().getFullYear()
        ? "active"
        : "";
    liTag += `<li class="${ehHoje}">${i}</li>`;
  }

  for (let i = ultimoDiaMes; i < 6; i++) {
    // Listando os primeiros dias do próximo mês
    liTag += `<li class="inactive">${i - ultimoDiaMes + 1}</li>`;
  }
  dataAtual.innerText = `${meses[mesAtual]} ${anoAtual}`;
  diasTag.innerHTML = liTag;
};
mostrarCalendario();

prevProxIcon.forEach((icon) => {
  // Eventos dos ícones de mes anterior e posterior
  // Evento de clique nos ícones
  icon.addEventListener("click", () => {
    // Se o ícone clicado for o anterior decrementa o mes, se não aumenta o mes
    mesAtual = icon.id === "prev" ? mesAtual - 1 : mesAtual + 1;

    // Se o mes for menor que 0 ou maior que 11
    if (mesAtual < 0 || mesAtual > 11) {
      // Cria uma nova data
      data = new Date(anoAtual, mesAtual, new Date().getDate());
      anoAtual = data.getFullYear(); // Atualiza o ano
      mesAtual = data.getMonth(); // Atualiza o mes
    } else {
      data = new Date(); // Cria uma nova data
    }
    mostrarCalendario(); // chama a função mostrarCalendario
  });
});
