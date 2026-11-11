// const é para declarar variáveis constantes, ou seja, que não terão seus valores trocados.
// Atenção: se a constante guarda um array ou um objeto, o conteúdo dele pode mudar (dá para acrescentar itens com push, por exemplo).
// O que não dá é trocar o array inteiro por outro.
// document é a página HTML inteira. É como o JavaScript enxerga o DOM (a árvore de elementos da página).
// querySelector busca um elemento usando o mesmo seletor do CSS ("#id", ".classe", "tag") e devolve o primeiro que encontrar.
// Se não encontrar nada, devolve null. Por isso o script precisa do defer no <script>: sem ele, o JavaScript roda antes de o HTML existir.
const formulario = document.querySelector("#formulario");
const mensagem = document.querySelector("#mensagem");
const lista = document.querySelector("#lista");
const vazio = document.querySelector("#vazio");
const registro = document.querySelector("#registro");

// [] cria um array vazio, ou seja, uma lista (como a lista do Python). Aqui vamos guardar todos os recrutas cadastrados.
const recrutas = [];

// function cria uma função: um bloco de código com nome, que só roda quando é chamado.
// return devolve um resultado para quem chamou a função.
// { chave: valor } é um objeto: vários dados juntos, cada um com um nome (é o dicionário do Python, sem aspas nas chaves).
// .value traz somente o que foi digitado no campo, sempre como texto (mesmo que o campo seja de número).
function lerFormulario() {
  return {
    codinome: document.querySelector("#codinome").value,
    nome: document.querySelector("#nome").value,
    idade: document.querySelector("#idade").value,
    poder: document.querySelector("#poder").value,
    ingresso: document.querySelector("#ingresso").value,
    email: document.querySelector("#email").value,
  };
}

// texto é o parâmetro: o valor que a função recebe quando é chamada. Por exemplo, em capitalizar("viúva negra"), texto vale "viúva negra".
function capitalizar(texto) {
  // trim remove os espaços em branco antes e depois. Por exemplo, "  viúva negra  " fica "viúva negra".
  // toLowerCase deixa tudo em minúsculo. Por exemplo, "VIÚVA NEGRA" fica "viúva negra".
  // split separa a string conforme o parâmetro informado. No nosso caso, o parâmetro é " ", ou seja, o texto é separado a cada espaço.
  // Se o texto for "viúva negra", o resultado é o array ["viúva", "negra"].
  // Os três comandos estão encadeados: o resultado de um passa para o próximo, da esquerda para a direita.
  const palavras = texto.trim().toLowerCase().split(" ");
  const resultado = [];

  // O for...of percorre o array palavras e, a cada volta, guarda um item na variável palavra.
  // Se o usuário digitou "viúva negra", na primeira volta palavra vale "viúva" e, na segunda, "negra".
  // !== significa "diferente de". Verificamos se palavra não está vazia, porque, quando há dois espaços seguidos,
  // o split cria uma palavra vazia (""). Numa palavra vazia, palavra[0] não existe, e o toUpperCase daria erro.
  for (const palavra of palavras) {
    if (palavra !== "") {
      // palavra[0] pega a letra da posição 0, ou seja, a primeira letra (as posições começam em 0, como no Python).
      // toUpperCase() deixa essa letra maiúscula. Os parênteses são obrigatórios: sem eles, a função não é executada.
      // slice(1) copia a palavra da posição 1 em diante, sem alterar a original.
      // O + junta os dois textos. Com "viúva": "V" + "iúva" = "Viúva".
      // push acrescenta o resultado no fim do array resultado.
      resultado.push(palavra[0].toUpperCase() + palavra.slice(1));
    }
  }

  // join faz o contrário do split: junta os itens do array em um texto só, colocando " " entre eles.
  // ["Viúva", "Negra"] vira "Viúva Negra".
  return resultado.join(" ");
}

// Number converte um texto em número. Por exemplo, Number("35") devolve 35.
// Quando não consegue converter, devolve NaN, que significa Not a Number (não é um número). Por exemplo, Number("abc") devolve NaN.
// Armadilha: Number("") devolve 0, e um campo vazio pareceria um zero válido. Por isso tratamos o campo vazio antes.
function paraNumero(texto) {
  if (texto.trim() === "") {
    return NaN;
  }

  return Number(texto);
}

// Recebe o objeto com os dados crus do formulário e devolve um objeto novo, com os dados limpos e convertidos.
function tratar(dados) {
  return {
    codinome: capitalizar(dados.codinome),
    nome: capitalizar(dados.nome),
    idade: paraNumero(dados.idade),
    poder: paraNumero(dados.poder),
    ingresso: dados.ingresso,
    // trim remove espaços em branco antes e depois. Por exemplo, se eu digitar "  porco.aranha@shield.com  ", com o trim fica "porco.aranha@shield.com".
    // toLowerCase deixa tudo em minúsculo. Por exemplo, se eu digitar "PORCO.ARANHA@SHIELD.COM", com o toLowerCase fica "porco.aranha@shield.com".
    email: dados.email.trim().toLowerCase(),
  };
}

// O campo de data entrega o formato ano-mês-dia, como "2026-03-14".
// new Date cria uma data a partir desse texto.
// Armadilha do fuso: sem o "T00:00:00", o JavaScript entende "meia-noite no horário universal (UTC)".
// No Brasil, três horas atrás, isso ainda é dia 13, e a data apareceria com um dia a menos.
// Com o "T00:00:00", ele usa a meia-noite do horário daqui.
// toLocaleDateString("pt-BR") mostra a data no formato brasileiro: "14/03/2026".
function formatarData(dataIso) {
  return new Date(dataIso + "T00:00:00").toLocaleDateString("pt-BR");
}

// toLocaleString("pt-BR") formata o número no padrão brasileiro, com vírgula decimal.
// O objeto { ... } passado como segundo parâmetro configura as casas decimais: no mínimo 1 e no máximo 1.
// Por exemplo, 78.5 vira "78,5" e 62 vira "62,0".
function formatarNumero(numero) {
  return numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

// Confere cada regra. Se alguma não for cumprida, lança um erro com throw.
// throw interrompe a função na hora (é o raise do Python). Nada abaixo dele é executado.
// new Error("...") cria o erro com a mensagem que vai aparecer para o usuário.
// Quem chamou a função recebe o erro no catch, lá no addEventListener.
function validar(recruta) {
  // === significa "é igual a", comparando também o tipo. Por exemplo, "5" === 5 é falso, porque um é texto e o outro é número.
  if (recruta.codinome === "") {
    throw new Error("Informe o codinome.");
  }

  if (recruta.nome === "") {
    throw new Error("Informe o nome real.");
  }

  // ! significa "não"; || significa "ou".
  // Number.isInteger verifica se o valor é um número inteiro. Para NaN (campo vazio) e para 3.5, devolve false.
  // A condição se lê assim: se a idade NÃO for inteira, OU for menor que 16, OU for maior que 120, lança o erro.
  if (
    !Number.isInteger(recruta.idade) ||
    recruta.idade < 16 ||
    recruta.idade > 120
  ) {
    throw new Error("A idade deve ser um número inteiro entre 16 e 120.");
  }

  // Number.isNaN verifica se o valor é NaN, ou seja, se o campo ficou vazio ou não tinha um número.
  if (Number.isNaN(recruta.poder) || recruta.poder < 0 || recruta.poder > 100) {
    throw new Error("O nível de poder deve ir de 0 a 100.");
  }

  if (recruta.ingresso === "") {
    throw new Error("Informe a data de ingresso.");
  }

  // new Date() sem nada dentro devolve a data e a hora de agora.
  // Datas podem ser comparadas com > e <: uma data maior é uma data mais no futuro.
  if (new Date(recruta.ingresso + "T00:00:00") > new Date()) {
    throw new Error("A data de ingresso não pode estar no futuro.");
  }

  // includes verifica se o texto contém um trecho. Por exemplo, "thor@asgard.com".includes("@") devolve true.
  if (!recruta.email.includes("@") || !recruta.email.includes(".")) {
    throw new Error("Informe um e-mail válido.");
  }

  // Percorre os recrutas já cadastrados para impedir codinomes repetidos.
  // A template string usa crases e ${ } para encaixar valores no texto (é a f-string do Python).
  // Por exemplo, se o codinome for "Thor", a mensagem fica "Thor já faz parte da equipe.".
  for (const existente of recrutas) {
    if (existente.codinome === recruta.codinome) {
      throw new Error(`${recruta.codinome} já faz parte da equipe.`);
    }
  }
}

// if, else if e else funcionam como o if, elif e else do Python: só o primeiro bloco verdadeiro é executado.
// Por isso a ordem importa: começamos pelo maior valor.
function classificar(poder) {
  if (poder >= 80) {
    return "Ameaça global";
  } else if (poder >= 50) {
    return "Herói de elite";
  } else if (poder >= 20) {
    return "Agente de campo";
  }

  return "Em treinamento";
}

// Monta o cartão de um recruta e o coloca na página.
function mostrarRecruta(recruta) {
  // createElement cria um elemento novo, que ainda não aparece na página.
  // className aplica uma classe do CSS. Aqui, a classe "cartao" já tem um estilo pronto no style.css.
  const item = document.createElement("li");
  item.className = "cartao";

  // textContent escreve o texto dentro do elemento.
  // Para dados digitados pelo usuário, use textContent, e não innerHTML: com innerHTML, um código malicioso digitado no formulário seria executado.
  const titulo = document.createElement("h3");
  titulo.textContent = recruta.codinome;

  const detalhes = document.createElement("p");
  detalhes.textContent = `${recruta.nome}, ${recruta.idade} anos · poder ${recruta.poder} · ${classificar(recruta.poder)}`;

  const contato = document.createElement("p");
  contato.textContent = `Na equipe desde ${formatarData(recruta.ingresso)} · ${recruta.email}`;

  // append coloca os elementos dentro de outro: primeiro o título e os parágrafos dentro do cartão;
  // depois, o cartão dentro da lista que já existe na página. Só nesse momento ele aparece na tela.
  item.append(titulo, detalhes, contato);
  lista.append(item);
}

// Calcula e mostra o resumo da equipe: total, média de poder e o mais poderoso.
function atualizarResumo() {
  // let é para variáveis que vão mudar de valor. soma começa em 0 e cresce a cada volta do for.
  // maior começa com o primeiro recruta (posição 0) e é trocado sempre que aparece alguém mais forte.
  let soma = 0;
  let maior = recrutas[0];

  for (const recruta of recrutas) {
    soma = soma + recruta.poder;

    if (recruta.poder > maior.poder) {
      maior = recruta;
    }
  }

  // length é a quantidade de itens do array (é o len() do Python).
  // A média é a soma dividida pela quantidade, formatada com uma casa decimal.
  document.querySelector("#total").textContent = recrutas.length;
  document.querySelector("#media").textContent = formatarNumero(
    soma / recrutas.length,
  );
  document.querySelector("#maior").textContent =
    `${maior.codinome} (${maior.poder})`;

  // hidden = true esconde o elemento. Aqui, some o aviso "Nenhum recruta ainda.".
  vazio.hidden = true;
}

// Escreve uma mensagem no parágrafo #mensagem.
// O tipo ("erro" ou "sucesso") vira uma classe do CSS, que pinta o texto de vermelho ou de verde.
function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = "mensagem " + tipo;
}

// Registra o que aconteceu em dois lugares: no Console (F12) e no painel "Registro de atividades" da página.
function registrar(tipo, texto) {
  // toLocaleTimeString("pt-BR") devolve a hora atual no formato brasileiro, como "14:35:20".
  const hora = new Date().toLocaleTimeString("pt-BR");
  const linha = `[${hora}] ${texto}`;

  // console.error escreve no Console em vermelho, para os erros ficarem fáceis de achar.
  // console.info escreve uma mensagem informativa, para o resto.
  if (tipo === "erro") {
    console.error(linha);
  } else {
    console.info(linha);
  }

  // prepend coloca o item no início da lista (o append coloca no fim). Assim, o registro mais recente fica em cima.
  const item = document.createElement("li");
  item.textContent = linha;
  item.className = tipo;
  registro.prepend(item);
}

// addEventListener diz o que fazer quando o formulário for enviado (evento "submit").
// A função não roda agora: ela fica guardada e só é executada quando alguém clicar em Recrutar.
// evento é o objeto com as informações do que aconteceu, entregue pelo navegador.
formulario.addEventListener("submit", function (evento) {
  // Cancela o comportamento padrão do navegador, que seria recarregar a página e perder tudo o que foi feito.
  evento.preventDefault();

  // try tenta executar o bloco. Se algum throw for lançado lá dentro (por exemplo, no validar),
  // o JavaScript pula direto para o catch, sem executar o resto do try.
  try {
    // Primeiro lê os dados crus, depois trata: a saída do lerFormulario entra no tratar.
    const recruta = tratar(lerFormulario());
    validar(recruta);

    // Se chegou até aqui, nenhum erro foi lançado: o recruta é válido.
    // push acrescenta o recruta no fim do array recrutas.
    recrutas.push(recruta);
    mostrarRecruta(recruta);
    atualizarResumo();
    mostrarMensagem(`${recruta.codinome} entrou para a equipe.`, "sucesso");
    registrar("info", `Recrutado: ${recruta.codinome}`);

    // console.table mostra o array de objetos em forma de tabela no Console.
    console.table(recrutas);

    // reset limpa todos os campos do formulário.
    formulario.reset();
  } catch (erro) {
    // erro é o objeto criado pelo new Error lá no validar. erro.message é a mensagem que escrevemos.
    // Em vez de a ação parar no meio, mostramos o motivo ao usuário e registramos o erro.
    mostrarMensagem(erro.message, "erro");
    registrar("erro", `Cadastro recusado: ${erro.message}`);
  } finally {
    // finally roda sempre, tenha dado certo ou errado (como o caixa eletrônico que sempre devolve o cartão).
    // focus coloca o cursor no campo codinome, pronto para o próximo cadastro.
    document.querySelector("#codinome").focus();
  }
});

// Chamada feita uma única vez, quando a página termina de carregar, para mostrar que a central está funcionando.
registrar("info", "Central de recrutamento pronta.");
