const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());

// Conexão com o banco (feita uma vez só)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // necessário para o Neon
});

// Função real de salvamento no banco
async function salvarNoBanco(data) {
  try {
    await pool.query("INSERT INTO logs (conteudo) VALUES ($1)", [data]);
    console.log("✔️ Log salvo no banco Neon");
  } catch (err) {
    console.error("❌ Erro ao salvar log no banco:", err);
  }
}

// Rota de recebimento do webhook
app.post("/webhook", (req, res) => {
  const payload = req.body;

  // Salva o conteúdo completo com timestamp
  salvarNoBanco({
    ...payload,
    dataRecebimento: new Date(),
  });

  res.status(200).send("Log recebido");
});

// Inicializa servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
