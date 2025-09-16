document.addEventListener("DOMContentLoaded", () => {
  // Conteúdo do primeiro carrossel
  const slidesSecao2 = [
    { imagem: "imagens/percurssaoback.png", titulo: "Percussão", descricao: "Instrumentos de percussão são aqueles que produzem som por meio de batidas, choques ou agitação. Eles podem ser tocados com as mãos, baquetas ou outros objetos. Exemplos comuns incluem o tambor, o pandeiro e o triângulo. São usados principalmente para marcar o ritmo e dar intensidade à música." },
    { imagem: "imagens/cordasback.png", titulo: "Cordas", descricao: "Instrumentos de corda são aqueles que produzem som pela vibração de cordas esticadas. Eles se dividem em dois grupos principais: cordas friccionadas, como o violino e o violoncelo, que são tocados com um arco; e cordas dedilhadas, como o violão e a guitarra, que são tocados ao pinçar ou dedilhar as cordas com os dedos ou palheta." },
    { imagem: "imagens/soproback.png", titulo: "Sopro", descricao: "Instrumentos de sopro produzem som quando o músico sopra ar em seu interior. Eles se dividem em dois grupos principais: madeiras, como a flauta e o clarinete, e metais, como o trompete e o trombone. O som é criado pela vibração do ar e pode variar conforme o formato e o material do instrumento.." }
  ];

  const slidesSecao4 = [
    { imagem: "imagens/cordasback.png", titulo: "Corda", descricao: "Para alcançar um nível avançado em instrumentos de corda, é fundamental desenvolver consciência corporal e técnica refinada, com postura correta e economia de movimento. A teoria musical deve ser aplicada com profundidade, incluindo modos, escalas exóticas, substituições harmônicas e análise funcional dos acordes. A expressividade é aprimorada com vibrato controlado, dinâmica intencional, fraseado musical e exploração de timbres. Técnicas virtuosas como tapping, sweep picking, hybrid picking e fingerstyle exigem coordenação precisa e independência dos dedos." },
    { imagem: "imagens/soproback.png", titulo: "Sopro", descricao: "Para dominar instrumentos de sopro em nível avançado, é essencial controlar a respiração com apoio diafragmático, manter postura eficiente e desenvolver embocadura precisa. A técnica inclui articulação clara (como staccato e double tonguing), dedilhado limpo, controle de dinâmica e afinação. A teoria musical deve ser aplicada com fluência na leitura, compreensão de modos, escalas e funções harmônicas. A expressividade surge com fraseado intencional, vibrato controlado e variações de timbre e dinâmica. O ritmo exige domínio de polirritmos, compassos irregulares e modulação métrica." },
    { imagem: "imagens/percurssaoback.png", titulo: "Percurssão", descricao: "Para atingir um nível avançado em percussão, é crucial dominar técnica corporal e coordenação motora, com foco na postura, economia de movimento e independência dos membros. A precisão rítmica é central, exigindo domínio de subdivisões, polirritmos, métricas ímpares e modulação métrica. A técnica inclui controle de dinâmica, articulação (como flams, drags, rolls), uso de diferentes baquetas e superfícies, além de domínio de técnicas específicas como rudimentos, ghost notes e acentuação. A leitura rítmica avançada e a improvisação são essenciais para versatilidade e expressão." }
  ];
  
  // Função genérica
  function criarCarrossel(slides, setaEsquerdaSel, setaDireitaSel, quadroSel, tituloSel, descricaoSel, usarImagem = true) {
    let indice = 0;
    const setaEsquerda = document.querySelector(setaEsquerdaSel);
    const setaDireita = document.querySelector(setaDireitaSel);
    const quadro = document.querySelector(quadroSel);
    const titulo = document.querySelector(tituloSel);
    const descricao = document.querySelector(descricaoSel);

    function atualizarCarrossel() {
      if (usarImagem) quadro.style.backgroundImage = `url(${slides[indice].imagem})`;
      titulo.textContent = slides[indice].titulo;
      descricao.textContent = slides[indice].descricao;
    }

    setaEsquerda.addEventListener("click", () => {
      indice = (indice - 1 + slides.length) % slides.length;
      atualizarCarrossel();
    });

    setaDireita.addEventListener("click", () => {
      indice = (indice + 1) % slides.length;
      atualizarCarrossel();
    });

    atualizarCarrossel();
  }

  // Criar carrosséis
  criarCarrossel(slidesSecao2, ".seta_esquerda", ".seta_direita", "#quadro", "#titulo", "#descricao");
  criarCarrossel(slidesSecao4, ".seta_esquerda1", ".seta_direita1", "#quadro1", "#titulo1", "#descricao1");
});