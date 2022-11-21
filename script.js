window.onload = function () {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('button').style.display = 'block';
};

function previewImage() {
  document.getElementById("label-container").innerHTML = "";
  document.getElementById("label-container-menor").innerHTML = "";
  var image = document.querySelector("input[name=image]").files[0];
  var preview = document.querySelector("img");
  var reader = new FileReader();
  reader.onloadend = () => {
    preview.src = reader.result;
  };

  if (image) {
    reader.readAsDataURL(image);
    console.log(image);
    document.getElementById("location-src").innerText = image.name;
  } else {
    preview.src = "";
  }
}

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/vSuoaNnxF/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {

  document.getElementById('loading').style.display = 'block';
  document.getElementById('button').style.display = 'none';

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
  predict();
  document.getElementById("location-src").innerText =
    "Clique aqui para enviar a figura";
}

async function loop() {
  await predict();
}

// run the webcam image through the image model
async function predict() {
  var desc;

  const predictions = await model.predict(document.getElementById("preview"));

  //busca o maior valor probabilistico da classificação de uma imagem
  var max = predictions.reduce(function (prev, current) {
    return prev.probability > current.probability ? prev : current;
  });

  if (max.className == "Deserto")
    desc = "É a vegetação típica de regiões semiáridas, áridas e hiperáridas. A quantidade de chuva é baixíssima, fato que impossibilita o desenvolvimento de vida animal e de vegetação na maior parte dos desertos.";
  else if (max.className == "Estepe")
    desc = "O clima predominante é o temperado continental, comum na região central da América do Norte, centro-sul da América do Sul, Ásia Central, leste da Austrália e sul da África. A cobertura vegetal é composta por gramíneas e arbustos de pequeno porte.";
  else if (max.className == "Floresta de coníferas")
    desc = "Comum das regiões de temperaturas baixas, cujo clima é continental frio ou polar. A maioria das árvores tem folhas em forma de agulha, sendo uma forma de não acumular neve, como, por exemplo, o pinheiro.";
  else if (max.className == "Floresta temperada")
    desc = "Vegetação típica de regiões de clima temperado, apresentando as quatro estações do ano bem definidas: primavera, verão, outono e inverno. As principais espécies vegetais são carvalhos, faias e bordos.";
  else if (max.className == "Floresta tropical")
    desc = "Compreende as regiões próximas à linha do Equador. A temperatura média, a umidade e a quantidade de chuvas são bastante elevadas. A fauna e a flora são diversificadas, como o que ocorre na floresta Amazônica, que é a maior floresta tropical do mundo.";
  else if (max.className == "Savana")
    desc = "Também conhecida como cerrado, esse tipo de vegetação é comum na porção central da América do Sul, norte da América Central, além de áreas da Austrália e do continente africano. As árvores são de pequeno porte e têm o caule torto.";
  else if (max.className == "Tundra")
    desc = "É a vegetação predominante no extremo norte do Hemisfério Setentrional. A vegetação é composta basicamente por capim e junco. Apresenta baixas temperaturas.";

  document.getElementById("label-container").innerHTML = max.className;
  document.getElementById("label-container-menor").innerHTML = desc;

  document.getElementById('loading').style.display = 'none';
  document.getElementById('button').style.display = 'block';
  console.log(max.className);
}