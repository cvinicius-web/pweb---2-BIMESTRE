const router = require("express").Router();
const db = require("../database");

router.post("/", (req, res) => {
    const dados = db.carregar();
    const { nome, email, departamento } = req.body;

    if (!nome || !email || !departamento) {
        return res.status(400).json({
            error: "Nome, email e departamento são obrigatórios."
        });
    }

    const existe = dados.usuarios.find(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existe) {
        return res.status(409).json({
            error: "E-mail já cadastrado."
        });
    }

    const usuario = {
        id: Date.now(),
        nome,
        email,
        departamento
    };

    dados.usuarios.push(usuario);
    db.salvar(dados);

    res.status(201).json(usuario);
});


router.get("/:id/reservas", (req, res) => {
    const dados = db.carregar();
    const usuario = dados.usuarios.find(u => u.id == req.params.id);

    if (!usuario) {
        return res.status(404).json({
            error: "Usuário não encontrado."
        });
    }

    const reservas = dados.reservas.filter(r => r.usuarioId == usuario.id);

    res.json({
        usuario,
        reservas
    });
});

module.exports = router;