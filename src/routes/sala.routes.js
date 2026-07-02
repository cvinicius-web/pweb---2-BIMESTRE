const router = require("express").Router();
const db = require("../database");

// POST /salas - Criar Sala
router.post("/", (req, res) => {
    const dados = db.carregar();
    const { nome, capacidade, recursos } = req.body;

    if (!nome || capacidade == null) {
        return res.status(400).json({
            error: "Nome e capacidade são obrigatórios."
        });
    }

    const sala = {
        id: Date.now(),
        nome,
        capacidade: Number(capacidade),
        recursos: recursos || []
    };

    dados.salas.push(sala);
    db.salvar(dados);

    res.status(201).json(sala);
});

// GET /salas - Listar com Filtro de Capacidade
router.get("/", (req, res) => {
    const dados = db.carregar();
    let resultado = dados.salas;

    if (req.query.capacidade) {
        const minimo = Number(req.query.capacidade);
        resultado = resultado.filter(sala => sala.capacidade >= minimo);
    }

    res.json(resultado);
});

// GET /salas/:id - Detalhes da Sala
router.get("/:id", (req, res) => {
    const dados = db.carregar();
    const sala = dados.salas.find(s => s.id == req.params.id);

    if (!sala) {
        return res.status(404).json({
            error: "Sala não encontrada."
        });
    }

    res.json(sala);
});

// PUT /salas/:id - Editar Sala
router.put("/:id", (req, res) => {
    const dados = db.carregar();
    const sala = dados.salas.find(s => s.id == req.params.id);

    if (!sala) {
        return res.status(404).json({
            error: "Sala não encontrada."
        });
    }

    const { nome, capacidade, recursos } = req.body;

    if (nome !== undefined) sala.nome = nome;
    if (capacidade !== undefined) sala.capacidade = Number(capacidade);
    if (recursos !== undefined) sala.recursos = recursos;

    db.salvar(dados);
    res.json(sala);
});

// DELETE /salas/:id - Excluir Sala e suas reservas
router.delete("/:id", (req, res) => {
    const dados = db.carregar();
    const indice = dados.salas.findIndex(s => s.id == req.params.id);

    if (indice === -1) {
        return res.status(404).json({
            error: "Sala não encontrada."
        });
    }

    dados.salas.splice(indice, 1);

    // Remove também as reservas da sala deletada
    dados.reservas = dados.reservas.filter(r => r.salaId != req.params.id);

    db.salvar(dados);
    res.sendStatus(204);
});

// GET /salas/:id/disponibilidade?data=YYYY-MM-DD
router.get("/:id/disponibilidade", (req, res) => {
    const dados = db.carregar();
    const sala = dados.salas.find(s => s.id == req.params.id);

    if (!sala) {
        return res.status(404).json({
            error: "Sala não encontrada."
        });
    }

    const data = req.query.data;
    if (!data) {
        return res.status(400).json({
            error: "Informe a data."
        });
    }

    const reservas = dados.reservas
        .filter(r => r.salaId == req.params.id && r.inicio.startsWith(data))
        .sort((a, b) => new Date(a.inicio) - new Date(b.inicio));

    res.json({
        salaId: sala.id,
        data,
        reservas
    });
});

module.exports = router;