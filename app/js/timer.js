const { ipcRenderer } = require('electron'); // para enviar mensagem para o main.js sobre qual curso parei e o tempo
const moment = require('moment');
let segundos = 0;
let timer;
let tempo; // me da acesso ao tempo na função inicar e função aprar, por isso foi jogada para fora.

module.exports = {
    iniciar(el){
        //console.log(el);
       // console.log(el.textContent);
        tempo = moment.duration(el.textContent); // pega uma string e faz a duração de tempo
        segundos = tempo.asSeconds();
        //console.log("Limpou o timer id:", timer);
        clearInterval(timer);
        timer = setInterval(() =>{ // essa função retornar um id
            segundos++;
            el.textContent = this.segundosParaTempo(segundos);
        }, 1000);
        //console.log(timer); // mostra o id do setInterval
        //console.log("Inicio do timer id:", timer);

    },parar(curso) { // busca o nome do curso
        clearInterval(timer);
        let tempoEstudado = this.segundosParaTempo(segundos);
        ipcRenderer.send('curso-parado', curso, tempoEstudado);

    }, segundosParaTempo(segundos) {
        return moment().startOf('day').seconds(segundos).format("HH:mm:ss");
    }
   
}