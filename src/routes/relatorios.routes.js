const router = require("express").Router();
const db = require("../database");


router.get("/ocupacao", (req, res) => {
    const dados = db.carregar();
    const totalPorSala = {};
    const totalReservas = dados.reservas.length;

    dados.reservas.forEach(r => {
        totalPorSala[r.salaId] = (totalPorSala[r.salaId] || 0) + 1;
    });

    const resultado = Object.keys(totalPorSala).map(salaId => {
        const quantidade = totalPorSala[salaId];
        return {
            salaId: Number(salaId),
            totalReservas: quantidade,
            percentual: totalReservas
                ? ((quantidade / totalReservas) * 100).toFixed(2) : "0.00"
        };
    });

    res.json(resultado);
});


router.get("/pico", (req, res) => {
    const dados = db.carregar();
    const porHora = {};

    dados.reservas.forEach(r => {
        const hora = new Date(r.inicio).getHours();
        porHora[hora] = (porHora[hora] || 0) + 1;
    });

    const resultado = Object.keys(porHora)
        .map(hora => ({
            hora: Number(hora),
            quantidade: porHora[hora]
        }))
        .sort((a, b) => b.quantidade - a.quantidade);

    res.json(resultado);
});

module.exports = router;