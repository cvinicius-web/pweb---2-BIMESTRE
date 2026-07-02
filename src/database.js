const fs = require("fs");
const path = require("path");

const arquivo = path.join(__dirname, "..", "data", "data.json");

function carregar() {
    if (!fs.existsSync(arquivo)) {
        const inicial = {
            salas: [],
            reservas: [],
            usuarios: []
        };

        fs.writeFileSync(arquivo, JSON.stringify(inicial, null, 2));
        return inicial;
    }

    const conteudo = fs.readFileSync(arquivo, "utf8");

    if (!conteudo.trim()) {
        return {
            salas: [],
            reservas: [],
            usuarios: []
        };
    }

    return JSON.parse(conteudo);
}

function salvar(dados) {
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
}

module.exports = {
    carregar,
    salvar
};