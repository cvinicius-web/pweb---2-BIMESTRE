const router = require("express").Router();
const db = require("../database");


function existeConflito(inicioNovo, fimNovo, inicioExistente, fimExistente) {
    return inicioNovo < fimExistente && fimNovo > inicioExistente;
}


router.post("/", (req, res) => {
    const dados = db.carregar();
    const { salaId, responsavel, usuarioId, inicio, fim } = req.body;

    if (!salaId || !inicio || !fim) {
        return res.status(400).json({
            error: "Dados obrigatórios não informados."
        });
    }

    const sala = dados.salas.find(s => s.id == salaId);
    if (!sala) {
        return res.status(404).json({
            error: "Sala não encontrada."
        });
    }

    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);

    if (isNaN(dataInicio) || isNaN(dataFim)) {
        return res.status(400).json({
            error: "Data inválida."
        });
    }

    if (dataInicio >= dataFim) {
        return res.status(400).json({
            error: "Horário inválido."
        });
    }

    
    if (dataInicio < new Date()) {
        return res.status(400).json({
            error: "Não é permitido reservar no passado."
        });
    }

   
    const conflito = dados.reservas.some(r => {
        return (
            r.salaId == salaId &&
            existeConflito(
                dataInicio,
                dataFim,
                new Date(r.inicio),
                new Date(r.fim)
            )
        );
    });

    if (conflito) {
        return res.status(409).json({
            error: "Já existe uma reserva para esse horário."
        });
    }

    const reserva = {
        id: Date.now(),
        salaId: Number(salaId),
        usuarioId: usuarioId ? Number(usuarioId) : null,
        responsavel: responsavel || "",
        inicio: dataInicio.toISOString(),
        fim: dataFim.toISOString()
    };

    dados.reservas.push(reserva);
    db.salvar(dados);

    res.status(201).json(reserva);
});


router.get("/", (req, res) => {
    const dados = db.carregar();
    let resultado = [...dados.reservas];

    if (req.query.sala) {
        resultado = resultado.filter(r => r.salaId == req.query.sala);
    }

    if (req.query.inicio && req.query.fim) {
        const inicioFiltro = new Date(req.query.inicio);
        const fimFiltro = new Date(req.query.fim);

        resultado = resultado.filter(r => {
            return existeConflito(
                inicioFiltro,
                fimFiltro,
                new Date(r.inicio),
                new Date(r.fim)
            );
        });
    }

    res.json(resultado);
});


router.delete("/:id", (req, res) => {
    const dados = db.carregar();
    const indice = dados.reservas.findIndex(r => r.id == req.params.id);

    if (indice === -1) {
        return res.status(404).json({
            error: "Reserva não encontrada."
        });
    }

    dados.reservas.splice(indice, 1);
    db.salvar(dados);

    res.sendStatus(204);
});

module.exports = router;