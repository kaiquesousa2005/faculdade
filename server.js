import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Simula o __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializando o app Express
const app = express();

// Conectando ao MongoDB
mongoose.connect('mongodb+srv://Kaique:Kaique1020!@cluster0.lotm3.mongodb.net/');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Definindo o esquema do produto
const produtoSchema = new mongoose.Schema({
  produto: String,
  quantidade: Number,
  tipo: String,
  descricao: String,
});

const Produto = mongoose.model('Produto', produtoSchema);

// Criando uma rota POST para adicionar produtos
app.post('/produtos', async (req, res) => {
  const { produto, quantidade, tipo, descricao } = req.body;
  const novoProduto = new Produto({ produto, quantidade, tipo, descricao });
  try {
    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Criando uma rota GET para listar produtos
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criando uma rota DELETE para excluir produtos
app.delete('/produtos/:id', async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciando o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
