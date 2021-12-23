const { ipcMain } = require('electron');
const data = require('./data');


module.exports = {
    templateInicial: null, // criar essa variavel para poder buscar ela apra add outros cursos

    geraTrayTemplate(win) {
        let template = [
            { 
                'label': 'Cursos' 
            },
            { 
                type: 'separator' 
            }
        ];

        let cursos = data.pegaNomeDosCursos(); // pegando o nome de todos os cursos
        cursos.forEach((curso) => {
            let menuItem = {
                label: curso,
                type: 'radio',
                click: () => {
                    //console.log(curso);
                    win.send('curso-trocado', curso);
                }
            }
            template.push(menuItem);
        });
        this.templateInicial = template; // me permite que tenho acesso do template incial em outras funções
        return template;
    },

    adicionaCursoNoTray(curso, win){
        this.templateInicial.push({
            label: curso,
            type: 'radio',
            checked: true,
            click: () => {
                win.send('curso-trocado', curso);
            }
        })

        return this.templateInicial;
    },
   
    geraMenuPrincipalTemplate(app){ // alterar o menu da aplicação em si.
        let templateMenu = [
            {
                label: 'View',
                submenu: [{ 
                    role: 'reload'
                },
                { 
                    role: 'toggledevtools'
                },
            ]
        },
        {
            label: 'Window',
            submenu: [
                {
                    role: 'minimize'
                },
                {
                    role: 'close'
                },
            ]
        },
        { 
            label: 'Sobre',
            submenu: [
                {
                    label: 'Sobre o Alura Timer', // quando for no alura timer, posso dar um clcique que irá executar uma função
                    click: () => {
                        ipcMain.emit('abrir-janela-sobre');
                    },
                    accelerator: 'CmdOrCtrl+I'//coloca atalhos no menu
                },
                {
                    label: 'Item 2'
                }
            ]
    
        }];
        if( process.platform == 'darwin'){
            templateMenu.unshift({
                label: app.getName(),
                Submenu: [
                    {
                        label: 'Estou rodando no Mac.'
                    }
                ]
            })
        }
        return templateMenu;
    }
}