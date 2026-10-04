const API_URL = "https://api-filmes-back.onrender.com";

// Selecionando os novos IDs do HTML
const formulario = document.querySelector("#form-filme");
const campoId = document.querySelector("#filme-id");
const campoTitulo = document.querySelector("#titulo");
const campoDiretor = document.querySelector("#diretor");
const campoDataLancamento = document.querySelector("#dataLancamento");
const campoGenero = document.querySelector("#genero");

const tituloFormulario = document.querySelector("#titulo-formulario");
const botaoSalvar = document.querySelector("#botao-salvar");
const botaoCancelar = document.querySelector("#botao-cancelar");
const listaFilmes = document.querySelector("#lista-filmes");
const mensagem = document.querySelector("#mensagem");
const formularioBusca = document.querySelector("#form-busca");
const campoBuscaId = document.querySelector("#busca-id");

async function fazerRequisicao(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.mensagem || "Não foi possível concluir a operação");
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
}

function criarCartaoFilme(filme) {
  const cartao = document.createElement("article");
  cartao.className = "usuario"; // Mantido como 'usuario' para preservar a formatação do seu CSS original

  const titulo = document.createElement("h3");
  titulo.textContent = filme.titulo;

  const diretor = document.createElement("p");
  diretor.textContent = `Diretor: ${filme.diretor}`;

  const dataLancamento = document.createElement("p");
  dataLancamento.textContent = `Lançamento: ${filme.dataLancamento}`;

  const genero = document.createElement("p");
  genero.textContent = `Gênero: ${filme.genero}`;

  const id = document.createElement("p");
  id.textContent = `ID: ${filme._id}`;

  const acoes = document.createElement("div");
  acoes.className = "acoes-usuario";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => carregarFilmeParaEdicao(filme._id));

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "perigo";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", () => excluirFilme(filme._id));

  acoes.append(botaoEditar, botaoExcluir);
  cartao.append(titulo, diretor, dataLancamento, genero, id, acoes);

  return cartao;
}

function exibirFilmes(filmes) {
  listaFilmes.innerHTML = "";

  if (filmes.length === 0) {
    mostrarMensagem("Nenhum filme cadastrado");
    return;
  }

  filmes.forEach((filme) => {
    listaFilmes.appendChild(criarCartaoFilme(filme));
  });

  mostrarMensagem(`${filmes.length} filme(s) encontrado(s)`);
}

async function listarFilmes() {
  try {
    mostrarMensagem("Carregando filmes...");
    const filmes = await fazerRequisicao(API_URL);
    exibirFilmes(filmes);
  } catch (erro) {
    listaFilmes.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
}

async function buscarFilmePorId(id) {
  const filme = await fazerRequisicao(`${API_URL}/${id}`);
  exibirFilmes([filme]);
  return filme;
}

async function salvarFilme(evento) {
  evento.preventDefault();

  const filme = {
    titulo: campoTitulo.value.trim(),
    diretor: campoDiretor.value.trim(),
    dataLancamento: campoDataLancamento.value,
    genero: campoGenero.value.trim()
  };

  const id = campoId.value;
  const estaEditando = Boolean(id);
  const url = estaEditando ? `${API_URL}/${id}` : API_URL;
  const metodo = estaEditando ? "PUT" : "POST";

  try {
    await fazerRequisicao(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filme)
    });

    limparFormulario();
    mostrarMensagem(estaEditando ? "Filme atualizado" : "Filme cadastrado");
    await listarFilmes();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function carregarFilmeParaEdicao(id) {
  try {
    const filme = await fazerRequisicao(`${API_URL}/${id}`);

    campoId.value = filme._id;
    campoTitulo.value = filme.titulo;
    campoDiretor.value = filme.diretor;
    campoDataLancamento.value = filme.dataLancamento;
    campoGenero.value = filme.genero;
    
    tituloFormulario.textContent = "Editar filme";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.classList.remove("oculto");
    campoTitulo.focus();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function excluirFilme(id) {
  const confirmou = window.confirm("Deseja excluir este filme?");

  if (!confirmou) {
    return;
  }

  try {
    await fazerRequisicao(`${API_URL}/${id}`, { method: "DELETE" });
    limparFormulario();
    mostrarMensagem("Filme excluído");
    await listarFilmes();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

function limparFormulario() {
  formulario.reset();
  campoId.value = "";
  tituloFormulario.textContent = "Novo filme";
  botaoSalvar.textContent = "Cadastrar";
  botaoCancelar.classList.add("oculto");
}

formulario.addEventListener("submit", salvarFilme);
botaoCancelar.addEventListener("click", limparFormulario);
document.querySelector("#botao-atualizar").addEventListener("click", listarFilmes);
document.querySelector("#botao-limpar-busca").addEventListener("click", () => {
  campoBuscaId.value = "";
  listarFilmes();
});

formularioBusca.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const id = campoBuscaId.value.trim();

  if (!id) {
    mostrarMensagem("Informe um ID para realizar a busca", true);
    return;
  }

  try {
    await buscarFilmePorId(id);
  } catch (erro) {
    listaFilmes.innerHTML = "";
    mostrarMensagem(erro.message, true);
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

listarFilmes();