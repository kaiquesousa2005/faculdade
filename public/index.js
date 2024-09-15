

document.getElementById('formProduto').addEventListener('submit', async (e) => {
  e.preventDefault();

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
    const produtos = await response.json();

    if (!Array.isArray(produtos)) {
      throw new TypeError('Resposta do servidor não é um array');
    }

    produtos.forEach(produto => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${produto.produto} - ${produto.quantidade} - ${produto.tipo}
        <button onclick="deletarProduto('${produto.id}')">Deletar</button>
      `;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
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



  console.log(`Servidor rodando em http://localhost:${port}`);
