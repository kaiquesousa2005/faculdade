import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import User from './models/User.js'

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

app.listen(3000, function(){
    console.log('Rodando na porta 3000')
})



app.get('/listar', async (req, res)=>{

    const users = await User.find()

    return res.json(users)
})



app.post('/cadastrar', async (req, res)=>{
    try {
        const user = req.body;

        // Cria um novo usuário
        await User.create(user);

        // Envia uma resposta de sucesso sem retornar os dados do usuário
        return res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        // Envia uma resposta de erro caso algo dê errado
        return res.status(500).json({ error: 'Ocorreu um erro ao criar o usuário.' });
    }

})



app.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nome, email, endereco } = req.body;

        // Verifica se os dados necessários foram fornecidos
        if (!nome || !email || !endereco) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Atualiza o usuário no banco de dados
        const result = await User.updateOne(
            { _id: id },  // Filtro para encontrar o usuário pelo ID
            { $set: { nome, email, endereco } }  // Atualiza os campos fornecidos
        );

        // Verifica se algum documento foi atualizado
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


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





mongoose.connect("mongodb+srv://user01:wPFKWnRqWaOYbWWE@cluster0.eziai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=> console.log("deu bom"))
.catch(()=> console.log("Deu ruim"))