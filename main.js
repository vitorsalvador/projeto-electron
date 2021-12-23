const { app } = require('electron'); // sub modo do electron que controla o ciclo de vida da aplicação
const { BrowserWindow } = require('electron'); // respondavél para criar janelas
const { ipcMain, Tray, Menu, globalShortcut } = require('electron'); // é o cara responsavel de esscutar o evento do ipc rederer, globalShortcut importaa e consegue configurar atalhos globais (funciona em qq parte do sistema).
const data = require('./data')
const templateGenerator = require('./template')

// const { app, BrowserWindow, ipcMain } = require('electron');
let tray = null;
let mainWindow = null;
app.on('ready', () => {
    console.log('Aplicacão iniciada');
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400
    });
    tray = new Tray( __dirname + '/app/img/icon-tray.png');
    let template = templateGenerator.geraTrayTemplate(mainWindow);  // gerando template com o templateGenerator
    let trayMenu = Menu.buildFromTemplate(template); // criando o menu com o template gerado

    tray.setContextMenu(trayMenu);

    let templateMenu = templateGenerator.geraMenuPrincipalTemplate(app);
    let menuPrincipal = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(menuPrincipal);

    globalShortcut.register('CmdOrCtrl+S', () => { // criar o atalho de start
        mainWindow.send('atalho-iniciar-parar'); // vou ter que escutar isso no renderer ... 

    });

    //mainWindow.openDevTools(); // para recuperar os atalhos padrões
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);

});

app.on('window-all-closed', () => {
    app.quit();
});

let sobreWindow = null; // ajustar para abrir uma unica vez a janela, e se já estiver aberta, não abrir. 
ipcMain.on('abrir-janela-sobre', () =>{
    if(sobreWindow == null){
        sobreWindow = new BrowserWindow({
            width: 300,
            height: 220,
            alwaysOntop: true,
            frame: false
        });

        sobreWindow.on('closed', () => { // não deixa a janela ser destruida, mantém ela sendo escutada.
            sobreWindow = null;
        })
    }
    sobreWindow.loadURL(`file://${__dirname}/app/sobre.html`);
});

ipcMain.on('fechar-janela-sobre', () => {
    sobreWindow.close();
});

ipcMain.on('curso-parado', (event, curso, tempoEstudado) => {
    console.log(`O curso ${curso} foi estudado por ${tempoEstudado}`);
    data.salvaDados(curso, tempoEstudado);
});

ipcMain.on('curso-adicionado', (event, novoCurso) => {
    let novoTemplate = templateGenerator.adicionaCursoNoTray(novoCurso, mainWindow);
    let novoTrayMenu = Menu.buildFromTemplate(novoTemplate);
    tray.setContextMenu(novoTrayMenu);
});