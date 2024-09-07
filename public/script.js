async function cadastrar(event) {
    event.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const endereco = document.getElementById('endereco').value;

    const params = new URLSearchParams();
    params.append('nome', nome);
    params.append('email', email);
    params.append('endereco', endereco);

    try {
        const response = await fetch('/cadastrar', {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params.toString()
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.message === 'Usuário criado com sucesso!') {
            document.getElementById('mensagem').textContent = 'Usuário cadastrado com sucesso!';
            document.getElementById('mensagem').style.color = 'green';
            document.getElementById('mensagem').style.display = 'block';
            document.getElementById('cadastro-form').reset();
            listar()
        } else {
            document.getElementById('mensagem').textContent = `Falha ao cadastrar usuário: ${data.message}`;
            document.getElementById('mensagem').style.color = 'red';
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        document.getElementById('mensagem').textContent = 'Falha ao cadastrar usuário.';
        document.getElementById('mensagem').style.color = 'red';
    }
}


document.getElementById('cadastro-form').addEventListener('submit', cadastrar)

function listar() {
    fetch('/listar')
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            const dataContainer = document.getElementById('data-container');
            dataContainer.style.display = 'block';
            dataContainer.innerHTML = ''; 

            if (data.length === 0) {
                dataContainer.textContent = 'Nenhum usuário encontrado.';
                return;
            }

            const list = document.createElement('ul');
            list.className = 'user-list';

            data.forEach(user => {
                const listItem = document.createElement('li');
                listItem.className = 'user-item'; 
                listItem.innerHTML = `
                    <div class="user-info">
                        <p><strong>Nome:</strong> ${user.nome}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Endereço:</strong> ${user.endereco}</p>
                    </div>
                `;

                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'action-button edit-button';
                editButton.addEventListener('click', () => {
                    openEditModal(user);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Deletar';
                deleteButton.className = 'action-button delete-button';
                deleteButton.addEventListener('click', () => {
                    if (confirm('Você realmente deseja excluir este usuário?')) {
                        deleteUser(user._id);
                    }

                });

                buttonContainer.appendChild(editButton);
                buttonContainer.appendChild(deleteButton);
                listItem.appendChild(buttonContainer);
                list.appendChild(listItem);
            });

            dataContainer.appendChild(list);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const dataContainer = document.getElementById('data-container');
            dataContainer.textContent = 'Falha ao carregar os dados.';
        });
}


function updateUser(userId) {
    const nome = document.getElementById('edit-nome').value;
    const email = document.getElementById('edit-email').value;
    const endereco = document.getElementById('edit-endereco').value;

    const params = new URLSearchParams();
    params.append('nome', nome);
    params.append('email', email);
    params.append('endereco', endereco);

    fetch(`/${userId}`, {method: 'PATCH', headers: {'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json(); 
    })
    .then(data => {
        if (data.message === 'User updated successfully') {
            alert('Usuário atualizado com sucesso!');
            closeEditModal();
            listar();
        } else {
            alert(`Falha ao atualizar usuário: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Falha ao atualizar usuário.');
    });
}


function deleteUser(userId) {
    fetch(`/${userId}`, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    })
    .then(data => {
        if (data.message === 'User deleted successfully') {
            alert('Usuário deletado com sucesso!');
            listar();
        } else {
            alert(`Falha ao deletar usuário: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        alert('Falha ao deletar usuário.');
    });
}


function openEditModal(user) {
    document.getElementById('edit-nome').value = user.nome;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-endereco').value = user.endereco;
    document.getElementById('edit-form').onsubmit = (event) => {
        event.preventDefault();
        updateUser(user._id);
    };
    document.getElementById('edit-modal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}