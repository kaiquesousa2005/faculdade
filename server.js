import express from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Simula o __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializando o app Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

const produtos = []

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'produto.html'));
});

// Criando uma rota POST para adicionar produtos
app.post('/produtos', async (req, res) => {
  const { produto, quantidade, tipo, descricao } = req.body;
  const id = Date.now().toString();  // Adiciona um ID único baseado na data
  const novoProduto = { id, produto, quantidade, tipo, descricao };
  produtos.push(novoProduto);
  console.log("Adicionando produto", novoProduto);
  try {
    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Criando uma rota GET para listar produtos
app.get('/produtos', async (req, res) => {
  try {
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criando uma rota DELETE para excluir produtos
app.delete('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = produtos.findIndex(produto => produto.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    produtos.splice(index, 1);  // Remove o produto da lista
    res.status(204).send();  // No conteúdo ao deletar
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciando o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


