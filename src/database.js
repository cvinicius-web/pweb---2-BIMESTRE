const fs = require("fs");
const path = require("path");

const caminhoArquivo = path.join(__dirname, "..", "data", "database.json");

function carregar() {
    try {
        if (!fs.existsSync(caminhoArquivo)) {
            return { usuarios: [], salas: [], reservas: [] };
        }
        const dados = fs.readFileSync(caminhoArquivo, "utf-8");
        return dados ? JSON.parse(dados) : { usuarios: [], salas: [], reservas: [] };
    } catch (error) {
        return { usuarios: [], salas: [], reservas: [] };
    }
}

function salvar(dados) {
    try {
        fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2), "utf-8");
    } catch (error) {
        console.error("Erro ao salvar o banco de dados:", error);
    }
}

module.exports = { carregar, salvar };