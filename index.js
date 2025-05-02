const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

function salvarNoBanco(data) {
  const filePath = path.join(__dirname, 'logs_recebidos.txt');
  const linha = JSON.stringify(data) + '\n';

  fs.appendFile(filePath, linha, (err) => {
    if (err) {
      console.error('Erro ao salvar:', err);
    } else {
      console.log('✔️ Log salvo no arquivo');
    }
  });
}

app.post('/webhook', (req, res) => {
  const payload = req.body;

  // Apenas salva tudo
  salvarNoBanco({
    ...payload,
    dataRecebimento: new Date()
  });

  res.status(200).send('Log recebido');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escutando na porta ${PORT}`);
});
