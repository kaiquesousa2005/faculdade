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
            dataContainer.innerHTML = ''; // Limpa o conteúdo anterior

            const list = document.createElement('ul'); // Cria uma lista não ordenada

            data.forEach(user => {
                const listItem = document.createElement('li'); // Usa <li> para itens de lista
                listItem.textContent = `Nome: ${user.nome}, Email: ${user.email}, Endereço: ${user.endereco}`;

                // Cria o botão de edição
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.addEventListener('click', () => {
                    openEditModal(user);
                });

                // Cria o botão de deletar
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Deletar';
                deleteButton.addEventListener('click', () => {
                    deleteUser(user._id);
                });

                listItem.appendChild(editButton);
                listItem.appendChild(deleteButton);
                list.appendChild(listItem); // Adiciona o item à lista
            });

            dataContainer.appendChild(list); // Adiciona a lista ao container
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const dataContainer = document.getElementById('data-container');
            dataContainer.textContent = 'Failed to load data.';
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

function updateUser(userId) {
    const nome = document.getElementById('edit-nome').value;
    const email = document.getElementById('edit-email').value;
    const endereco = document.getElementById('edit-endereco').value;

    const params = new URLSearchParams();
    params.append('nome', nome);
    params.append('email', email);
    params.append('endereco', endereco);

    fetch(`/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'  // Define o tipo de conteúdo
        },
        body: params.toString()  // Converte os parâmetros para uma string URL-encoded
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();  // Processa a resposta como JSON
    })
    .then(data => {
        if (data.message === 'User updated successfully') {
            alert('Usuário atualizado com sucesso!');
            closeEditModal();
            listar();  // Atualiza a lista de usuários após a edição
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
            listar(); // Atualiza a lista de usuários após exclusão
        } else {
            alert(`Falha ao deletar usuário: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        alert('Falha ao deletar usuário.');
    });
}
