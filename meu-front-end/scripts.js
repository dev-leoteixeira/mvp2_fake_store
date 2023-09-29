// Variáveis para armazenar os produtos e o carrinho
var produtos = [];
        var carrinho = [];

        // Função para verificar se o carrinho está armazenado no localStorage e carregá-lo
        function carregarCarrinhoDoLocalStorage() {
          var carrinhoSalvo = localStorage.getItem("carrinho");
          if (carrinhoSalvo) {
            carrinho = JSON.parse(carrinhoSalvo);
            atualizarCarrinho();
          }
        }

        // Função para salvar o carrinho no localStorage
        function salvarCarrinhoNoLocalStorage() {
          localStorage.setItem("carrinho", JSON.stringify(carrinho));
        }

        // Função para fazer a solicitação AJAX para a API de produtos
        function carregarProdutos() {
          // Use o objeto XMLHttpRequest para fazer a solicitação
          var xhr = new XMLHttpRequest();

          // Especifique o método HTTP e a URL da API
          xhr.open("GET", "https://fakestoreapi.com/products", true);

          // Defina uma função de retorno de chamada para quando a resposta da API for recebida
          xhr.onload = function () {
            if (xhr.status === 200) {
              // Parseie os dados JSON da resposta e armazene-os na variável "produtos"
              produtos = JSON.parse(xhr.responseText);

              // Selecione o elemento UL onde os produtos serão exibidos
              var listaProdutos = document.getElementById("lista-produtos");

              // Itere sobre os produtos e crie elementos LI para cada um
              produtos.forEach(function (produto) {
                var li = document.createElement("li");
                li.innerHTML = `
                            <h2>${produto.title}</h2>
                            <p>Preço: R$ ${produto.price}</p>
                            <p>Categoria: ${produto.category}</p>
                            <p>Descrição: ${produto.description}</p>
                            <img src="${produto.image}" alt="${produto.title}" width="200">
                            <button type="button" onclick="comprarProduto(${produto.id})">Comprar</button>
                            <button type="button" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                        `;

                // Adicione o elemento LI à lista
                listaProdutos.appendChild(li);
              });
            } else {
              // Lida com erros de solicitação
              console.error("Erro ao carregar produtos:", xhr.statusText);
            }
          };

          // Lida com erros de rede
          xhr.onerror = function () {
            console.error("Erro de rede ao carregar produtos");
          };

          // Faça a solicitação para a API
          xhr.send();
        }

        // Função para carregar e exibir categorias
        function carregarCategorias() {
          // Use o objeto XMLHttpRequest para fazer a solicitação
          var xhr = new XMLHttpRequest();

          // Especifique o método HTTP e a URL da API para categorias
          xhr.open("GET", "https://fakestoreapi.com/products/categories", true);

          // Defina uma função de retorno de chamada para quando a resposta da API for recebida
          xhr.onload = function () {
            if (xhr.status === 200) {
              // Parseie os dados JSON da resposta e armazene-os na variável "categorias"
              var categorias = JSON.parse(xhr.responseText);

              // Selecione o elemento DIV onde as categorias serão exibidas
              var divCategorias = document.getElementById("categorias");

              // Crie um elemento SELECT para as categorias
              var selectCategorias = document.createElement("select");
              selectCategorias.id = "category-buttons";

              // Adicione uma opção para todas as categorias
              var optionTodas = document.createElement("option");
              optionTodas.value = "all";
              optionTodas.textContent = "All categories";
              selectCategorias.appendChild(optionTodas);

              // Itere sobre as categorias e crie opções para cada uma
              categorias.forEach(function (categoria) {
                var option = document.createElement("option");
                option.value = categoria;
                option.textContent = categoria;
                selectCategorias.appendChild(option);
              });

              // Adicione o elemento SELECT de categorias ao elemento DIV
              divCategorias.appendChild(selectCategorias);

              // Adicione um evento de mudança no menu suspenso para carregar produtos quando a categoria é selecionada
              selectCategorias.addEventListener("change", function () {
                var selectedCategory = selectCategorias.value;
                atualizarProdutosPorCategoria(selectedCategory);
              });
            } else {
              // Lida com erros de solicitação
              console.error("Erro ao carregar categorias:", xhr.statusText);
            }
          };

          // Lida com erros de rede
          xhr.onerror = function () {
            console.error("Erro de rede ao carregar categorias");
          };

          // Faça a solicitação para a API de categorias
          xhr.send();
        }

        // Função para atualizar a lista de produtos com base na categoria selecionada
        function atualizarProdutosPorCategoria(categoriaSelecionada) {
          // Limpe a lista de produtos atual
          var listaProdutos = document.getElementById("lista-produtos");
          listaProdutos.innerHTML = "";

          // Filtrar produtos com base na categoria selecionada
          var produtosFiltrados = produtos.filter(function (produto) {
            return (
              categoriaSelecionada === "all" ||
              produto.category === categoriaSelecionada
            );
          });

          // Adicione os produtos filtrados à lista
          produtosFiltrados.forEach(function (produto) {
            var li = document.createElement("li");
            li.innerHTML = `
                    <h2>${produto.title}</h2>
                    <p>Preço: R$ ${produto.price}</p>
                    <p>Categoria: ${produto.category}</p>
                    <p>Descrição: ${produto.description}</p>
                    <img src="${produto.image}" alt="${produto.title}" width="200">
                    <button type="button" onclick="comprarProduto(${produto.id})">Comprar</button>
                    <button type="button" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                `;
            listaProdutos.appendChild(li);
          });
        }

        // Função para comprar um produto (você pode personalizá-la)
        function comprarProduto(idProduto) {
          var produto = produtos.find(function (p) {
            return p.id === idProduto;
          });
          alert(
            "Você comprou o produto: " + produto.title + "Preço: R$" + produto.price
          );
        }

        // Função para adicionar um produto ao carrinho
        function adicionarAoCarrinho(idProduto) {
          var produto = produtos.find(function (p) {
            return p.id === idProduto;
          });
          carrinho.push(produto);
          salvarCarrinhoNoLocalStorage(); // Salvar o carrinho no localStorage
          atualizarCarrinho();
          alert(
            "Adicionado ao carrinho: " + produto.title + "Preço: R$" + produto.price
          );
        }

        // Função para deletar um produto do carrinho pelo índice
        function deletarDoCarrinho(index) {
          carrinho.splice(index, 1); // Remove o item do carrinho
          salvarCarrinhoNoLocalStorage(); // Salvar o carrinho no localStorage
          atualizarCarrinho();
        }

        // Função para limpar o carrinho
        function limparCarrinho() {
          carrinho = []; // Limpa o carrinho
          salvarCarrinhoNoLocalStorage(); // Salvar o carrinho vazio no localStorage
          atualizarCarrinho();
        }

        // Função para atualizar o conteúdo do carrinho e exibi-lo
        function atualizarCarrinho() {
          var carrinhoContainer = document.getElementById("carrinho");
          var itensCarrinho = document.getElementById("itens-carrinho");
          var totalCarrinho = document.getElementById("total-carrinho");
          var limparCarrinhoBtn = document.getElementById("limpar-carrinho");

          // Limpe o conteúdo atual do carrinho
          itensCarrinho.innerHTML = "";

          // Itere sobre os itens do carrinho e crie elementos LI para cada um
          carrinho.forEach(function (produto, index) {
            var li = document.createElement("li");
            li.innerHTML = `${produto.title} - R$ ${produto.price} <button onclick="deletarDoCarrinho(${index})">Deletar</button>`;

            // Adicione o elemento LI ao carrinho
            itensCarrinho.appendChild(li);
          });

          // Calcule o total do carrinho e exiba-o
          var total = carrinho.reduce(function (acc, produto) {
            return acc + produto.price;
          }, 0);
          totalCarrinho.textContent = total.toFixed(2);

          // Exiba o carrinho
          carrinhoContainer.style.display = "block";

          // Adicione um evento de clique ao botão "Limpar Carrinho"
          limparCarrinhoBtn.addEventListener("click", function () {
            limparCarrinho();
          });
        }

      

        // Chame a função para carregar os produtos e categorias quando a página for carregada
        window.onload = function () {
          carregarProdutos();
          carregarCategorias();
          carregarCarrinhoDoLocalStorage(); // Carregar o carrinho salvo no localStorage
          atualizarCarrinho(); // Atualize o carrinho quando a página for carregada
        };



        const http = require('http');

// Dados a serem retornados pelo endpoint
const responseData = {
  success: true,
  message: 'Application Invoked !',
  data: {
    versions: {
      latest: 'v1',
      all: {
        v1: 'v1'
      }
    },
    endpoints: {
      card: {
        payment: {
          endpoint: 'payment/card',
          type: 'post'
        },
        history: {
          endpoint: 'payment/card',
          type: 'get'
        }
      },
      phone: {
        payment: {
          endpoint: 'payment/phone',
          type: 'post'
        },
        history: {
          endpoint: 'payment/phone',
          type: 'get'
        }
      }
    },
    examples: {
      payment: {
        card: 'api/v1/payment/card',
        phone: 'api/v1/payment/phone'
      }
    }
  }
};

// Crie um servidor HTTP que escute em uma porta específica (por exemplo, 3000)
const server = http.createServer((req, res) => {
  // Defina os cabeçalhos de resposta para indicar que estamos retornando JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Retorne os dados no formato JSON
  res.end(JSON.stringify(responseData, null, 2));
});

// Inicie o servidor na porta 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});

