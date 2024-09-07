import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import User from './models/User.js'

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));


mongoose.connect("mongodb+srv://user01:wPFKWnRqWaOYbWWE@cluster0.eziai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=> console.log("Conectado ao banco de dados com sucesso"))
.catch(()=> console.log("Erro ao conectar no Banco de dados"))


app.listen(3000, function(){
    console.log('Rodando na porta 3000')
})



//Rotas

//Buscar Usuarios
app.get('/listar', async (req, res)=>{

    const users = await User.find()

    return res.json(users)
})


//Cadastrar Usuarios
app.post('/cadastrar', async (req, res)=>{
    const { nome, email, endereco } = req.body;

    if (!nome || !email || !endereco) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    }

    await User.create({ nome, email, endereco });

    return res.status(201).json({ message: 'Usuário criado com sucesso!' });
})


//Atualizar Usuarios
app.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nome, email, endereco } = req.body;

        if (!nome || !email || !endereco) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const result = await User.updateOne(
            { _id: id },  
            { $set: { nome, email, endereco } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//Deletar Usuarios
app.delete('/:id', async (req, res)=>{
    try {
        const id = req.params.id;
        const result = await User.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})