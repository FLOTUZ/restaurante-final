import "./App.css";
const faker = require("faker");
const simpleQueue = require("./Queue");

const lobby = new simpleQueue();
const cocina = new simpleQueue();
const entrada = new simpleQueue();

//Variables de restaurante
let numClientes = 7;
let capacidadLobby = 3; //Capacidad del restaurante

let menu = [
  { nombre: "Tacos", tPreparacion: 3 },
  { nombre: "Fideos", tPreparacion: 3 },
  { nombre: "Asada", tPreparacion: 3 },
  { nombre: "Chilaquiles", tPreparacion: 3 },
];
let ordenesAtendidas = 0;

export default function App() {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-2">
            <div>Entrada</div>
            <div id="entrada" className="container"></div>
          </div>
          <div className="col-6">
            <div>Lobby</div>
            <div className="container">
              <div id="lobby" className="row row-cols-2"></div>
            </div>
          </div>
          <div className="col-4">
            <div id="ordenes">Ordenes</div>
            <div id="cocinas" className="container"></div>
          </div>
        </div>
      </div>
      <div
        className="float"
        onClick={() => {main()}}
      >
      <p className="float-text noselect">Iniciar</p>
      </div>
      <div className="float-container">Hola</div>
    </>
  );
}

function main() {
  console.log("Entra main");
  for (let i = 0; i < numClientes; i++) {
    entrada.enqueue({
      nombre: faker.name.firstName(), //Se obtiene el nombre randoom con faker
      tComiendo: Math.floor(Math.random() * (16 - 5)) + 5, //Tiempo del comensal para comer de 5-16
      platillo: menu[Math.floor(Math.random() * menu.length)], //Se obtiene algun platillo del menu
    });
  }

  pintarFila();

  darMesaAComensal();
  alert("Se cerró el restautante");
}
function darMesaAComensal() {
  while (capacidadLobby !== 0 && !entrada.isEmpty()) {
    let candidatoAMesa = entrada.dequeue();
    lobby.enqueue(candidatoAMesa);
    capacidadLobby--;
    console.log({ entrada: entrada.size() });
    console.log(`${candidatoAMesa.nombre} ha tomado una mesa`);

    //Se pinta al comensal sentado en la mesa
    pintarComensalSentado();
    //Se pinta la actual fila
    pintarFila();

    //Se pone a comer el comensal
    comensalComiendo(candidatoAMesa);
  }
  pintarPlatillosEnCocina();
}

async function comensalComiendo(comensal) {
  //El comensal ordena y se agrega la orden a la cola de la concina
  await nuevaOrden(comensal);

  pintarComensalSentado();

  //El comensal empieza a comer
  await time(comensal.tComiendo);
  console.log(`El comensal ${comensal.nombre} ha teminado de comer`);
  lobby.dequeue();
  pintarComensalSentado();
  capacidadLobby++;
  darMesaAComensal();
}

async function nuevaOrden(comensal) {
  let platillo = comensal.platillo;

  cocina.enqueue(comensal);

  //Se cocina el platillo que esté en el primer lugar de la cola
  console.log(`${platillo.nombre} para ${comensal.nombre} se está cocinando`);
  await time(platillo.tPreparacion);
  console.log(
    `${platillo.nombre} para ${comensal.nombre} Está listo y servido`
  );
  pintarPlatillosEnCocina();
  ordenesAtendidas++;
  document.getElementById(
    "ordenes"
  ).innerHTML = `<div id="ordenes"> # Atendidos ${ordenesAtendidas} Ordenes ${cocina.size()} </div>`;
  //Se quita el primer elemento de la cola
  cocina.dequeue();
}

function pintarFila() {
  document.getElementById("entrada").innerHTML = "";
  for (let i = 0; i < entrada.size(); i++) {
    document.getElementById(
      "entrada"
    ).innerHTML += `<div className="comensal row-sm-auto">${
      entrada.print()[i].nombre
    }</div>`;
  }
}

function pintarComensalSentado() {
  document.getElementById("lobby").innerHTML = "";
  for (let i = 0; i < lobby.size(); i++) {
    document.getElementById(
      "lobby"
    ).innerHTML += `<div className="mesa col-sm-6">${
      lobby.print()[i].nombre
    }</div>`;
  }
}
function pintarPlatillosEnCocina() {
  document.getElementById("cocinas").innerHTML = "";
  for (let i = 0; i < cocina.size(); i++) {
    document.getElementById(
      "cocinas"
    ).innerHTML += `<div className="orden row">${
      cocina.print()[i].platillo.nombre
    } para ${cocina.print()[i].nombre}</div>`;
  }
}
// sleep time expects milliseconds
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Usage!
async function time(t) {
  t = t * 1000;
  await sleep(t).then(() => {});
}
