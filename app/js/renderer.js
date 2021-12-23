const { ipcRenderer } = require('electron');
const timer = require('./timer'); // importando o timer .js
const data = require('../../data');

let linkSobre = document.querySelector('#link-sobre');
let botaoPlay = document.querySelector('.botao-play');
let tempo = document.querySelector('.tempo'); //selecionando o span
let curso = document.querySelector('.curso'); // chama o curso no index.html
let botaoAdicionar = document.querySelector('.botao-adicionar') // selecionar o botão adicionar
let campoAdicionar = document.querySelector('.campo-adicionar')

window.onload = () => {
    data.pegaDados(curso.textContent)
        .then((dados) => {
            //console.log(dados);
            tempo.textContent = dados.tempo;
        })
}

linkSobre.addEventListener('click' , function(){
    ipcRenderer.send('abrir-janela-sobre');
});

let imgs = ['img/play-button.svg', 'img/stop-button.svg'];
let play = false;
botaoPlay.addEventListener('click', function () {
    if(play){
        timer.parar(curso.textContent); // informa qual curso
        play = false;
        new Notification('Alura timer', {
            body: `O curso ${curso.textContent} foi parado!!`,
            icon: 'img/stop-button.png'
        });
    } else { 
        timer.iniciar(tempo);
        play = true;
        new Notification('Alura timer', {
            body: `O curso ${curso.textContent} foi iniciado!!`,
            icon: 'img/play-button.png'
        });
    }

    //timer.iniciar(tempo);
    //console.log('Pre inversao', imgs);
    imgs = imgs.reverse();
        //console.log('pos inversao', imgs);
    botaoPlay.src = imgs[0];
});

ipcRenderer.on('curso-trocado', (event, nomeCurso) => {
    //console.log('curso foi trocado', curso);
    timer.parar(curso.textContent);//quando trocar de curso, sem apertar o botão stop, fazer ele parar.
    data.pegaDados(nomeCurso)
        .then((dados) => {
            tempo.textContent = dados.tempo;
        }).catch((err) => { //zerar o tempo do curso novo.
            console.log('O curso ainda não possui um JSON');
            tempo.textContent = "00:00:00"
        })
    curso.textContent = nomeCurso;
});

//adicionar evento de click no botão adicionar
botaoAdicionar.addEventListener('click', function(){

    if(campoAdicionar.value == ''){// não deixar salvar nome de curso em branco
        console.log('Não posso adicionar um curso com nome vazio');
        return;
    }

    let novoCurso = campoAdicionar.value;//pegar o campo adicionar, o conteudo de texto dele
    curso.textContent = novoCurso; //substituir o texto do curso anterior 
    tempo.textContent = '00:00:00'; // zerar o tempo para o novo curso
    campoAdicionar.value = '';//limpar o campo 
    ipcRenderer.send('curso-adicionado', novoCurso);//enviar evento com o nome do curso adicionado para o trayMenu, tem que pendurar no ipcMain 
});

ipcRenderer.on('atalho-iniciar-parar', () => {
    console.log('Atalho no renderer process')// para ver se o atalho está funcioanndo
    let click = new MouseEvent('click'); // clica no botão parar
    botaoPlay.dispatchEvent(click);

    // new Notification('Vai!'); // notificar o usuario que começou o timer.
});