// Selecionando elementos do DOM
const inputTarefa = document.querySelector('.input-tarefa'); // Campo de entrada para a descrição da tarefa
const btnTarefa = document.querySelector('.btn-tarefa'); // Botão para adicionar nova tarefa
const tarefas = document.querySelector('.tarefas'); // Lista de tarefas pendentes
const selectCategoria = document.querySelector('.select-categoria'); // Seleção de categoria da tarefa
const filtroCategoria = document.querySelector('.filtro-categoria'); // Filtro de categorias de tarefas
const filtroStatus = document.querySelector('.filtro-status'); // Filtro de status das tarefas (pendente/concluída)
const btnBuscar = document.querySelector('.btn-buscar'); // Botão para aplicar filtros
const btnOrdenar = document.querySelector('.btn-ordenar'); // Botão para ordenar tarefas
const historico = document.querySelector('.historico-tarefas'); // Lista de tarefas concluídas (histórico)

// Adicionar nova tarefa ao clicar no botão
btnTarefa.addEventListener('click', () => {
    // Verifica se a tarefa possui descrição e categoria antes de adicionar
    if (!inputTarefa.value.trim() || !selectCategoria.value) return;

    // Cria um novo item de lista para a tarefa
    const li = document.createElement('li');
    li.setAttribute('data-categoria', selectCategoria.value); // Atribui categoria à tarefa
    li.setAttribute('data-status', 'pendente'); // Define o status inicial como 'pendente'
    li.innerHTML = `
        ${inputTarefa.value.trim()} - <strong>${selectCategoria.value}</strong>
        <img class="icone" src="./assets/imagem/icone-check.png" alt="Ícone de Tarefa">
        <button class="concluir">Concluir</button>
        <button class="editar">Editar</button>
        <button class="apagar">Apagar</button>
    `;

    li.classList.add('adicionar-animacao'); // Adiciona animação à tarefa
    tarefas.appendChild(li); // Adiciona a tarefa à lista de tarefas

    // Anima o ícone de tarefa
    const icone = li.querySelector('.icone');
    icone.classList.add('animacao-icone'); // Aplica a animação ao ícone da tarefa

    setTimeout(() => {
        li.classList.remove('adicionar-animacao'); // Remove a animação após um tempo
        icone.classList.remove('animacao-icone'); // Remove a animação do ícone
    }, 1000);

    inputTarefa.value = ''; // Limpa o campo de entrada
    selectCategoria.value = ''; // Reseta a categoria selecionada

    salvarTarefas(); // Salva as tarefas no localStorage
});

// Evento de clique em tarefas (concluir, editar ou apagar)
tarefas.addEventListener('click', (e) => {
    const li = e.target.closest('li'); // Encontra o item de lista clicado

    if (!li) return; // Se não for um item de lista, sai

    if (e.target.classList.contains('apagar')) {
        // Se o botão for de apagar, pergunta se o usuário tem certeza
        if (confirm('Você tem certeza que deseja apagar esta tarefa?')) {
            li.style.transition = 'opacity 0.3s'; // Animação de opacidade para a remoção
            li.style.opacity = 0; // Reduz a opacidade antes de remover
            setTimeout(() => {
                li.remove(); // Remove a tarefa da lista
                salvarTarefas(); // Atualiza o localStorage após a remoção
            }, 300);
        }
    } else if (e.target.classList.contains('editar')) {
        // Se o botão for de editar, permite editar a descrição da tarefa
        const novaDescricao = prompt('Edite a tarefa:', li.firstChild.textContent.trim());
        if (novaDescricao) {
            li.firstChild.textContent = novaDescricao.trim() + ' '; // Atualiza a descrição
            salvarTarefas(); // Atualiza o localStorage após a edição
        }
    } else if (e.target.classList.contains('concluir')) {
        // Se o botão for de concluir, alterna o status da tarefa entre 'concluída' e 'pendente'
        li.classList.toggle('concluida');
        li.setAttribute('data-status', li.classList.contains('concluida') ? 'concluida' : 'pendente');
        if (li.classList.contains('concluida')) {
            moverParaHistorico(li); // Mover para o histórico se for concluída
        } else {
            tarefas.appendChild(li); // Se voltar ao status pendente, move de volta para tarefas
        }
        salvarTarefas(); // Atualiza o localStorage após alteração de status
    }
});

// Função para mover tarefa concluída para o histórico
function moverParaHistorico(li) {
    li.querySelector('.concluir').remove(); // Remove o botão de concluir da tarefa
    historico.appendChild(li); // Adiciona a tarefa no histórico
}

// Função para salvar tarefas no localStorage
function salvarTarefas() {
    // Cria um array com as tarefas pendentes e as salva no localStorage
    const listaDeTarefas = Array.from(tarefas.querySelectorAll('li')).map(li => ({
        descricao: li.firstChild.textContent.trim(),
        categoria: li.getAttribute('data-categoria'),
        status: li.getAttribute('data-status'),
    }));
    localStorage.setItem('tarefas', JSON.stringify(listaDeTarefas));

    // Cria um array com o histórico de tarefas e as salva no localStorage
    const listaDeHistorico = Array.from(historico.querySelectorAll('li')).map(li => ({
        descricao: li.firstChild.textContent.trim(),
        categoria: li.getAttribute('data-categoria'),
        status: 'concluida',
    }));
    localStorage.setItem('historico', JSON.stringify(listaDeHistorico));
}

// Função para carregar tarefas do localStorage
function carregarTarefas() {
    // Carrega as tarefas e histórico do localStorage
    const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const historicoSalvo = JSON.parse(localStorage.getItem('historico')) || [];

    tarefas.innerHTML = ''; // Limpa a lista de tarefas
    historico.innerHTML = ''; // Limpa o histórico

    // Adiciona tarefas carregadas na lista de tarefas e no histórico
    tarefasSalvas.forEach(tarefa => adicionarTarefaNaLista(tarefa, tarefas));
    historicoSalvo.forEach(tarefa => adicionarTarefaNaLista(tarefa, historico));

    filtrarTarefas(); // Aplica os filtros, se existirem
}

// Função para adicionar tarefa na lista (tarefas ou histórico)
function adicionarTarefaNaLista(tarefa, lista) {
    const li = document.createElement('li');
    li.setAttribute('data-categoria', tarefa.categoria); // Atribui categoria à tarefa
    li.setAttribute('data-status', tarefa.status); // Atribui status à tarefa
    li.classList.toggle('concluida', tarefa.status === 'concluida'); // Marca a tarefa como concluída, se necessário
    li.innerHTML = `
        ${tarefa.descricao} - <strong>${tarefa.categoria}</strong>
        ${lista === tarefas ? ` // Se for lista de tarefas, adiciona os botões
            <button class="concluir">Concluir</button>
            <button class="editar">Editar</button>
            <button class="apagar">Apagar</button>
        ` : ''} 
    `;
    lista.appendChild(li); // Adiciona a tarefa à lista
}

// Função para filtrar tarefas de acordo com os filtros selecionados
function filtrarTarefas() {
    const categoria = filtroCategoria.value; // Pega a categoria selecionada
    const status = filtroStatus.value; // Pega o status selecionado

    let temTarefaVisivel = false;
    tarefas.querySelectorAll('li').forEach(li => {
        // Verifica se a tarefa corresponde aos filtros de categoria e status
        const matchCategoria = !categoria || li.getAttribute('data-categoria') === categoria;
        const matchStatus = !status || li.getAttribute('data-status') === status;

        if (matchCategoria && matchStatus) {
            li.style.display = ''; // Exibe a tarefa se corresponder aos filtros
            temTarefaVisivel = true;
        } else {
            li.style.display = 'none'; // Oculta a tarefa caso contrário
        }
    });

    const mensagem = document.querySelector('.mensagem-filtro');
    if (!temTarefaVisivel) {
        if (!mensagem) {
            // Exibe mensagem se não houver tarefas visíveis
            const msg = document.createElement('p');
            msg.className = 'mensagem-filtro';
            msg.textContent = 'Nenhuma tarefa encontrada com os filtros selecionados.';
            tarefas.parentElement.appendChild(msg);
        }
    } else if (mensagem) {
        mensagem.remove(); // Remove a mensagem se houver tarefas visíveis
    }
}

// Ordena as tarefas em ordem alfabética
btnOrdenar.addEventListener('click', () => {
    const lista = Array.from(tarefas.querySelectorAll('li'));
    lista.sort((a, b) => a.firstChild.textContent.localeCompare(b.firstChild.textContent)); // Ordena por descrição
    lista.forEach(li => tarefas.appendChild(li)); // Atualiza a ordem das tarefas
});

// Eventos para aplicar filtros
filtroCategoria.addEventListener('change', filtrarTarefas); // Filtro de categoria
filtroStatus.addEventListener('change', filtrarTarefas); // Filtro de status
btnBuscar.addEventListener('click', filtrarTarefas); // Botão de busca

// Carrega as tarefas ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarTarefas);
