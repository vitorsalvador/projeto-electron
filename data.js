//responsável para criar nossos arquiso jason com o nome do curso.. para empresas maiores, tem outros bancos de dados mais complexos que pode ser instalado (drivers)
const jsonfile = require('jsonfile-promised');
const fs = require('fs'); // para ver se o arquivo exixte o proprio node tem o modulo do filesystem que ve isso

module.exports = {
    salvaDados(curso, tempoEstudado) {
        let arquivoDoCurso = __dirname + '/data/' + curso + '.json';
        if(fs.existsSync(arquivoDoCurso)) { //salva
                this.adicionaTempoAoCurso(arquivoDoCurso, tempoEstudado);

        } else { //cria e salva
            this.criaArquivoDeCurso(arquivoDoCurso, {})
                .then(() => {
                    this.adicionaTempoAoCurso(arquivoDoCurso, tempoEstudado);
                });

        }

    },

    adicionaTempoAoCurso(arquivoDoCurso, tempoEstudado){
        let dados = {
            ultimoEstudo: new Date().toString(),
            tempo: tempoEstudado
        }

        jsonfile.writeFile(arquivoDoCurso, dados, {spaces: 2}) // spaces: 2 coloca em duas linhas
                .then(() => {
                    console.log('Tempo salvo com sucesso.');
                }).catch((err) => {
                    console.log(err);
                })
    },


    criaArquivoDeCurso(nomeArquivo, conteudoArquivo){
        return jsonfile.writeFile(nomeArquivo, conteudoArquivo) // recebe o caminho do arquivo e depois o conteudo dele
                .then(() => {
                    console.log('Arquivo Criado')
                }) .catch((err) => {
                    console.log(err);
                });
    },

    pegaDados(curso) {
        let arquivoDoCurso = __dirname + '/data/' + curso + '.json';
        return jsonfile.readFile(arquivoDoCurso);
    },

    pegaNomeDosCursos(){
        let arquivos = fs.readdirSync(__dirname + '/data/');
        let cursos = arquivos.map((arquivo) => {
            return arquivo.substr(0, arquivo.lastIndexOf('.'));
    });

    return cursos;
    }
}