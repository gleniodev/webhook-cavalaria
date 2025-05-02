const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

function salvarNoBanco(data) {
  const { Pool } = require("pg");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // necessário para o Neon
  });

  async function salvarNoBanco(data) {
    try {
      await pool.query("INSERT INTO logs (conteudo) VALUES ($1)", [data]);
      console.log("✔️ Log salvo no banco Neon");
    } catch (err) {
      console.error("❌ Erro ao salvar log no banco:", err);
    }
  }
}

app.post("/webhook", (req, res) => {
  const payload = req.body;

  // Apenas salva tudo
  salvarNoBanco({
    ...payload,
    dataRecebimento: new Date(),
  });

  res.status(200).send("Log recebido");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
