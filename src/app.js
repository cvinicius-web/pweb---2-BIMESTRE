const express = require("express");

const salasRoutes = require("./routes/salas.routes");
const reservasRoutes = require("./routes/reservas.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const relatoriosRoutes = require("./routes/relatorios.routes");

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        project: "Sistema de Reserva de Salas",
        status: "ok",
        message: "Servidor no ar. Implemente as rotas descritas no README.",
    });
});


app.use("/salas", salasRoutes);
app.use("/reservas", reservasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/relatorios", relatoriosRoutes);


app.use((req, res) => {
    res.status(404).json({
        erro: "Rota não encontrada."
    });
});

module.exports = app;