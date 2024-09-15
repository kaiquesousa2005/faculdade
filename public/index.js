

document.getElementById('formProduto').addEventListener('submit', async (e) => {
  e.preventDefault();

  let produtos = [];  // Definida globalmente para armazenar a lista de produtos

  const produtoData = getFormData();

  try {
    const response = await enviarProduto(produtoData);

    if (response.ok) {
      alert('Produto adicionado com sucesso!');
      listarProdutos(); // Atualiza a lista de produtos
    } else {
      alert('Erro ao adicionar produto.');
    }
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
  }
});

function getFormData() {
  const produto = document.getElementById('produto').value;
  const quantidade = document.getElementById('quantidade').value;
  const tipo = document.querySelector('input[name="tipo"]:checked').value;
  const descricao = document.getElementById('descricao').value;

  return { produto, quantidade, tipo, descricao };
}

async function enviarProduto(produtoData) {
  return await fetch('http://localhost:3000/produtos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produtoData),
  });
}

async function listarProdutos() {
  const lista = document.getElementById('listaProdutos');
  lista.innerHTML = ''; // Limpa a lista antes de adicionar novos produtos

  try {
    const response = await fetch('http://localhost:3000/produtos');
    produtos = await response.json();  // Atribui a resposta à variável global 'produtos'

    if (!Array.isArray(produtos)) {
      throw new TypeError('Resposta do servidor não é um array');
    }

    produtos.forEach(produto => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${produto.produto} - ${produto.quantidade} - ${produto.tipo}
        <button onclick="deletarProduto('${produto.id}')">Deletar</button>
        <button onclick="prepararAtualizacao('${produto.id}')">Atualizar</button>
      `;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
}


async function atualizarProduto(id) {
  const produtoData = getFormData(); // Pega os dados do formulário

  try {
    const response = await fetch(`http://localhost:3000/produtos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produtoData),
    });

    if (response.ok) {
      alert('Produto atualizado com sucesso!');
      listarProdutos(); // Atualiza a lista de produtos
    } else {
      alert('Erro ao atualizar produto.');
    }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
  }
}

function prepararAtualizacao(id) {
  // Busca o produto pelo ID usando a lista de produtos armazenada globalmente
  const produto = produtos.find(produto => produto.id === id);

  if (!produto) {
    alert('Produto não encontrado!');
    return;
  }

  // Preenche o formulário com os dados do produto
  document.getElementById('produto').value = produto.produto;
  document.getElementById('quantidade').value = produto.quantidade;
  document.querySelector(`input[name="tipo"][value="${produto.tipo}"]`).checked = true;
  document.getElementById('descricao').value = produto.descricao;

  // Alterar o comportamento do botão "Adicionar" para "Atualizar"
  document.getElementById('formProduto').onsubmit = (e) => {
    e.preventDefault();
    atualizarProduto(id); // Chama a função de atualização
  };
}



async function deletarProduto(id) {
  try {
    const response = await fetch(`http://localhost:3000/produtos/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Produto deletado com sucesso!');
      listarProdutos(); // Atualiza a lista após a exclusão
    } else {
      alert('Erro ao deletar produto.');
    }
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
  }
}

// Carrega os produtos assim que a página é carregada
window.onload = listarProdutos;


  console.log(`Servidor rodando em http://localhost:3000}`);
