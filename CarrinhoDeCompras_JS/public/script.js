const menu = document.getElementById('menu') // Seleciona o elemento do menu
const cartBtn = document.getElementById('cart-btn') // Seleciona o botão do carrinho no menu
const cartModal = document.getElementById('cart-modal') // Seleciona o modal do carrinho
const cartItemsContainer = document.getElementById('cart-items') // Seleciona o container dos itens no carrinho
const cartTotal = document.getElementById('cart-total') // Seleciona o elemento que exibe o total do carrinho
const checkoutBtn = document.getElementById('checkout-btn') // Seleciona o botão de checkout
const closeModalBtn = document.getElementById('close-modal-btn') // Seleciona o botão para fechar o modal do carrinho
const cartCounter = document.getElementById('cart-count') // Seleciona o contador de itens no carrinho

// Função para verificar se o restaurante está aberto ou fechado com base no horário
function checkarHorario() {
    let relogio = new Date()
    let hora = relogio.getHours()
    let dateSpan = document.getElementById('date-span') // Seleciona o elemento onde a cor de fundo será alterada

    if (hora >= 18 && hora <= 22) {
        // Se estiver aberto
        dateSpan.style.backgroundColor = 'green' // Define a cor de fundo para verde
        Toastify({
            text: "Restaurante aberto!", // Mensagem de toast
            duration: 3000, // Duração do toast em milissegundos
            destination: "https://github.com/apvarun/toastify-js", // Link para mais informações
            close: false, // Define se o toast pode ser fechado
            gravity: "top", // Posição do toast (top ou bottom)
            position: "left", // Posição do toast (left, center ou right)
            stopOnFocus: true, // Impede o fechamento do toast ao focar
            style: {
                background: "green", // Estilo de fundo do toast
            },
        }).showToast() // Exibe o toast
        return true // Retorna verdadeiro se o restaurante estiver aberto
    } else {
        // Se estiver fechado
        Toastify({
            text: "Restaurante fechado no momento!", // Mensagem de toast
            duration: 3000, // Duração do toast em milissegundos
            destination: "https://github.com/apvarun/toastify-js", // Link para mais informações
            close: true, // Define se o toast pode ser fechado
            gravity: "top", // Posição do toast (top ou bottom)
            position: "left", // Posição do toast (left, center ou right)
            stopOnFocus: true, // Impede o fechamento do toast ao focar
            style: {
                background: "#ef4444", // Estilo de fundo do toast
            },
        }).showToast() // Exibe o toast
        dateSpan.style.backgroundColor = 'red' // Define a cor de fundo para vermelho
        return false // Retorna falso se o restaurante estiver fechado
    }
}

// Função para abrir o modal do carrinho
function abrirModalCarrinho() {
    cartModal.style.display = 'flex' // Exibe o modal do carrinho
}

// Função para fechar o modal do carrinho
function fecharModalCarrinho() {
    cartModal.style.display = 'none' // Oculta o modal do carrinho
}

// Event listeners para abrir e fechar o modal do carrinho
cartBtn.addEventListener('click', abrirModalCarrinho)
closeModalBtn.addEventListener('click', fecharModalCarrinho)

cartModal.addEventListener('click', (event) => {
    // Fecha o modal se o clique ocorrer fora da área do modal
    if (event.target === cartModal) {
        fecharModalCarrinho()
    }
})

let listaProdutos = [] // Array para armazenar os produtos adicionados ao carrinho

// Captura o clique no menu para adicionar produtos ao carrinho
function capturarCliqueProduto(event) {
    let btnClicado = event.target.closest('.add-to-cart-btn')

    if (btnClicado) {
        let nomeProduto = btnClicado.getAttribute('data-name') // Obtém o nome do produto
        let precoProduto = parseFloat(btnClicado.getAttribute('data-price')) // Obtém o preço do produto convertido para float
        let imagemUrl = btnClicado.getAttribute('data-image-url') // Obtém a URL da imagem do produto

        adicionarCarrinho(nomeProduto, precoProduto, imagemUrl) // Chama a função para adicionar o produto ao carrinho
    }
}

menu.addEventListener('click', capturarCliqueProduto) // Adiciona o event listener para cliques no menu

// Função para adicionar um produto ao carrinho
function adicionarCarrinho(nome, preco, imagemUrl) {
    let indexProduto = listaProdutos.findIndex((produto) => produto.nome === nome)

    if (indexProduto !== -1) {
        listaProdutos[indexProduto].quantidade += 1 // Incrementa a quantidade se o produto já estiver no carrinho
    } else {
        listaProdutos.push({ // Adiciona o novo produto ao carrinho se ainda não estiver presente
            nome,
            preco,
            quantidade: 1,
            imagemUrl,
        })
    }

    console.log(listaProdutos) // Exibe a lista de produtos no console
    atualizaCarrinho() // Atualiza a exibição do carrinho na interface
}

// Função para atualizar a exibição do carrinho na interface
function atualizaCarrinho() {
    cartItemsContainer.innerHTML = '' // Limpa o conteúdo atual do container de itens do carrinho

    let total = 0 // Inicializa o total do carrinho como zero
    let contador = 0 // Inicializa o contador de itens como zero

    listaProdutos.forEach((produto) => {
        let produtoItemDiv = document.createElement('div') // Cria um novo elemento div para cada produto
        produtoItemDiv.style.borderBottom = '2px solid black' // Estilo de borda para separação dos itens
        produtoItemDiv.style.paddingBlock = '10px' // Espaçamento interno do elemento

        // Monta a estrutura HTML para exibir cada item no carrinho
        produtoItemDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <img src="${produto.imagemUrl}" alt="${produto.nome}" class="w-28 h-28 rounded-md  mr-2"> 
                <div>
                    <p>${produto.nome}</p>
                    <p class="text-red">Quantidade: ${produto.quantidade}</p>
                    <p>Preço: ${produto.preco.toFixed(2)}</p>
                </div>
                <div>
                    <button class='btn-remover  bg-red-500  text-white px-4 py-1 ' data-name="${produto.nome}">Remover</button>
                </div>
            </div>
        `

        total += produto.quantidade * produto.preco // Calcula o total atual do carrinho
        contador += produto.quantidade // Conta a quantidade total de itens no carrinho

        cartItemsContainer.appendChild(produtoItemDiv) // Adiciona o elemento do produto ao container

        // Adiciona um event listener para o botão "Remover" do produto
        produtoItemDiv.querySelector('.btn-remover').addEventListener('click', () => {
            removerProduto(produto.nome) // Chama a função para remover o produto do carrinho
        })

    })

    cartCounter.innerHTML = contador // Atualiza o contador de itens no carrinho na interface
    cartTotal.innerHTML = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) // Formata e exibe o total do carrinho

    return total // Retorna o total calculado
}

// Função para remover um produto do carrinho
function removerProduto(nome) {
    const indexProduto = listaProdutos.findIndex(produto => produto.nome === nome)

    if (indexProduto !== -1) {
        // Diminui a quantidade ou remove completamente se for o último item
        if (listaProdutos[indexProduto].quantidade > 1) {
            listaProdutos[indexProduto].quantidade--
        } else {
            listaProdutos.splice(indexProduto, 1) // Remove o produto do array se a quantidade for 1
        }

        atualizaCarrinho() // Atualiza a exibição do carrinho após a remoção
    }

    if (listaProdutos.length === 0) {
        cartTotal.innerHTML = 'R$ 0,00' // Exibe zero no total do carrinho se não houver produtos
    }
}

// Buscar endereço a partir do CEP usando a API ViaCEP
let inputCep = document.getElementById('input-cep') // Seleciona o input do CEP
let inputCidade = document.getElementById('input-cidade') // Seleciona o input da cidade
let inputBairro = document.getElementById('input-bairro') // Seleciona o input do bairro
let inputRua = document.getElementById('input-rua') // Seleciona o input da rua
let inputNumero = document.getElementById('input-numero') // Seleciona o input do número

// Função assíncrona para buscar e preencher automaticamente o endereço baseado no CEP digitado
async function buscarEndereco() {
    let cep = inputCep.value.trim() // Obtém o valor do CEP digitado

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`) // Requisição GET para a API ViaCEP com o CEP
        const dados = await resposta.json() // Converte a resposta para JSON

        // Preenche automaticamente os campos de cidade, bairro e rua com os dados obtidos
        inputCidade.value = dados.localidade // Preenche a cidade
        inputBairro.value = dados.bairro // Preenche o bairro
        inputRua.value = dados.logradouro // Preenche a rua
    } catch (error) {
        console.log('Erro ao buscar endereço!', error) // Exibe mensagem de erro no console, se houver
    }
}

inputCep.addEventListener('input', buscarEndereco) // Adiciona um event listener para capturar o input do CEP e buscar o endereço

let restauranteAbertoVerificado = false // Variável de controle para verificar se o restaurante aberto já foi verificado

// Função para finalizar o pedido e abrir uma conversa no WhatsApp com os detalhes do pedido
function finalizarPedido() {
    // Verifica se há produtos no carrinho
    if (listaProdutos.length === 0) {
        Toastify({
            text: "O carrinho está vazio. Adicione produtos antes de enviar o pedido.",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            close: true,
            gravity: "top",
            position: "left",
            stopOnFocus: true,
            style: {
                background: "red",
            },
        }).showToast()
        return // Retorna para interromper a execução se o carrinho estiver vazio
    }

    // Verifica se todos os campos obrigatórios de endereço estão preenchidos
    if (!inputCidade.value || !inputBairro.value || !inputRua.value || !inputNumero.value) {
        Toastify({
            text: "Preencha os campos obrigatórios de endereço antes de enviar o pedido.",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            close: true,
            gravity: "top",
            position: "left",
            stopOnFocus: true,
            style: {
                background: "red",
            },
        }).showToast()
        return // Retorna para interromper a execução se algum campo obrigatório de endereço estiver vazio
    }

    // Verifica se o restaurante aberto já foi verificado
    if (!restauranteAbertoVerificado) {
        // Chama a função para verificar se o restaurante está aberto
        if (!checkarHorario()) {
            return; // Retorna se o restaurante estiver fechado
        }
        restauranteAbertoVerificado = true // Marca como verificado
    }

    let phone = '5547999611833' // Número de telefone para enviar o pedido (formato internacional sem "+")

    let mensagem = `Olá, gostaria de fazer um pedido!\n\n`;
    mensagem += `Produtos:\n`

    listaProdutos.forEach((produto) => {
        mensagem += `- ${produto.nome}: ${produto.quantidade}x\n`
    });

    let total = atualizaCarrinho() // Calcula o total novamente antes de enviar a mensagem
    mensagem += `\n\n`
    mensagem += `Total: R$ ${total.toFixed(2)}\n`
    mensagem += `\nEndereço de entrega:\n`
    mensagem += `- Cidade: ${inputCidade.value}\n`
    mensagem += `- Bairro: ${inputBairro.value}\n`
    mensagem += `- Rua: ${inputRua.value}\n`
    mensagem += `- Número: ${inputNumero.value}\n`

    let url = `https://wa.me/${phone}?text=${encodeURIComponent(mensagem)}`
    window.open(url, "_blank")
    console.log('Clicou no botão de checkout')
}

checkoutBtn.addEventListener('click', finalizarPedido) // Event listener para o botão de checkout
checkarHorario() // Chama a função checkarHorario() no carregamento da página
