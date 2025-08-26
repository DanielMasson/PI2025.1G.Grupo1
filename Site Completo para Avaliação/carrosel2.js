// Espera o DOM carregar antes de executar
document.addEventListener("DOMContentLoaded", () => {

  const slidesSecao3 = [
    {
      titulo: "Cordas",
      descricao: "O Cifra Club é um portal online brasileiro que oferece cifras, tablaturas e aulas gratuitas para aprender a tocar instrumentos, com foco em violão e guitarra, sendo uma ferramenta prática e acessível para músicos iniciantes e intermediários."
    },
    {
      titulo: "Percurssão",
      descricao: "O Aprendendo Percussão é um projeto didático liderado por músicos profissionais que se dedicam a ensinar bateria e percussão de forma clara e aprofundada. O conteúdo é distribuído principalmente através de vídeo-aulas no YouTube e, para um estudo mais estruturado, eles oferecem cursos pagos."
    },
    {
      titulo: "Sopro",
      descricao: "O Canal do Sopro é um projeto brasileiro voltado para o ensino de instrumentos de sopro como flauta, clarinete, saxofone e oboé. O conteúdo é focado em aulas de alta qualidade, com uma didática clara e técnica, ministradas por músicos profissionais com formação. Eles oferecem desde o básico, como a postura e a emissão do som, até tópicos mais avançados, como improvisação e repertório."
    }
  ];

  const quadro = document.querySelector("#quadro2");
  const titulo = document.querySelector("#titulo2");
  const descricao = document.querySelector("#descricao2");
  const setaEsquerda = document.querySelector(".seta_esquerda2");
  const setaDireita = document.querySelector(".seta_direita2");

  let indice = 0; 

  function atualizarCarrossel() {
    titulo.textContent = slidesSecao3[indice].titulo;
    descricao.textContent = slidesSecao3[indice].descricao;
  }

  setaEsquerda.addEventListener("click", () => {
    indice = (indice - 1 + slidesSecao3.length) % slidesSecao3.length;
    atualizarCarrossel();
  });

  setaDireita.addEventListener("click", () => {
    indice = (indice + 1) % slidesSecao3.length;
    atualizarCarrossel();
  });

  // Inicializa o carrossel
  atualizarCarrossel();

});
