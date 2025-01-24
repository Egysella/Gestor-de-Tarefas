const inputTarefa = document.querySelector('.input-tarefa');
const btnTarefa = document.querySelector('.btn-tarefa');
const tarefas = document.querySelector('.tarefas');
const selectCategoria = document.querySelector('.select-categoria');
const filtroCategoria = document.querySelector('.filtro-categoria');
const filtroStatus = document.querySelector('.filtro-status');
const btnBuscar = document.querySelector('.btn-buscar');
const btnOrdenar = document.querySelector('.btn-ordenar');
const historico = document.querySelector('.historico-tarefas'); // Adicionado para histórico

// Adicionar nova tarefa
btnTarefa.addEventListener('click', () => {
    if (!inputTarefa.value.trim() || !selectCategoria.value) return;

    const li = document.createElement('li');
    li.setAttribute('data-categoria', selectCategoria.value);
    li.setAttribute('data-status', 'pendente');
    li.innerHTML = `
        ${inputTarefa.value.trim()} - <strong>${selectCategoria.value}</strong>
        <img class="icone" src="./assets/imagem/icone-check.png" alt="Ícone de Tarefa">
        <button class="concluir">Concluir</button>
        <button class="editar">Editar</button>
        <button class="apagar">Apagar</button>
    `;

    li.classList.add('adicionar-animacao'); // Adicionando animação à tarefa
    tarefas.appendChild(li);

    // Aplicando animação na imagem
    const icone = li.querySelector('.icone');
    icone.classList.add('animacao-icone'); // Classe de animação para a imagem

    setTimeout(() => {
        li.classList.remove('adicionar-animacao');
        icone.classList.remove('animacao-icone'); // Remover animação após a execução
    }, 1000);

    inputTarefa.value = '';
    selectCategoria.value = '';

    salvarTarefas();
});
// Eventos de clique em cada tarefa
tarefas.addEventListener('click', (e) => {
    const li = e.target.closest('li');

    if (!li) return;

    if (e.target.classList.contains('apagar')) {
        if (confirm('Você tem certeza que deseja apagar esta tarefa?')) {
            li.style.transition = 'opacity 0.3s';
            li.style.opacity = 0; // Animação de saída
            setTimeout(() => {
                li.remove();
                salvarTarefas();
            }, 300);
        }
    } else if (e.target.classList.contains('editar')) {
        const novaDescricao = prompt('Edite a tarefa:', li.firstChild.textContent.trim());
        if (novaDescricao) {
            li.firstChild.textContent = novaDescricao.trim() + ' ';
            salvarTarefas();
        }
    } else if (e.target.classList.contains('concluir')) {
        li.classList.toggle('concluida');
        li.setAttribute('data-status', li.classList.contains('concluida') ? 'concluida' : 'pendente');
        if (li.classList.contains('concluida')) {
            moverParaHistorico(li);
        } else {
            tarefas.appendChild(li);
        }
        salvarTarefas();
    }
});

// Mover tarefa concluída para histórico
function moverParaHistorico(li) {
    li.querySelector('.concluir').remove(); // Remove botão de conclusão
    historico.appendChild(li);
}

// Salvar tarefas no localStorage
function salvarTarefas() {
    const listaDeTarefas = Array.from(tarefas.querySelectorAll('li')).map(li => ({
        descricao: li.firstChild.textContent.trim(),
        categoria: li.getAttribute('data-categoria'),
        status: li.getAttribute('data-status'),
    }));
    localStorage.setItem('tarefas', JSON.stringify(listaDeTarefas));

    const listaDeHistorico = Array.from(historico.querySelectorAll('li')).map(li => ({
        descricao: li.firstChild.textContent.trim(),
        categoria: li.getAttribute('data-categoria'),
        status: 'concluida',
    }));
    localStorage.setItem('historico', JSON.stringify(listaDeHistorico));
}

// Carregar tarefas do localStorage
function carregarTarefas() {
    const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const historicoSalvo = JSON.parse(localStorage.getItem('historico')) || [];

    tarefas.innerHTML = '';
    historico.innerHTML = '';

    tarefasSalvas.forEach(tarefa => adicionarTarefaNaLista(tarefa, tarefas));
    historicoSalvo.forEach(tarefa => adicionarTarefaNaLista(tarefa, historico));

    filtrarTarefas();
}

function adicionarTarefaNaLista(tarefa, lista) {
    const li = document.createElement('li');
    li.setAttribute('data-categoria', tarefa.categoria);
    li.setAttribute('data-status', tarefa.status);
    li.classList.toggle('concluida', tarefa.status === 'concluida');
    li.innerHTML = `
        ${tarefa.descricao} - <strong>${tarefa.categoria}</strong>
        ${lista === tarefas ? `
            <button class="concluir">Concluir</button>
            <button class="editar">Editar</button>
            <button class="apagar">Apagar</button>
        ` : ''}
    `;
    lista.appendChild(li);
}

// Filtrar tarefas
function filtrarTarefas() {
    const categoria = filtroCategoria.value;
    const status = filtroStatus.value;

    let temTarefaVisivel = false;
    tarefas.querySelectorAll('li').forEach(li => {
        const matchCategoria = !categoria || li.getAttribute('data-categoria') === categoria;
        const matchStatus = !status || li.getAttribute('data-status') === status;

        if (matchCategoria && matchStatus) {
            li.style.display = '';
            temTarefaVisivel = true;
        } else {
            li.style.display = 'none';
        }
    });

    const mensagem = document.querySelector('.mensagem-filtro');
    if (!temTarefaVisivel) {
        if (!mensagem) {
            const msg = document.createElement('p');
            msg.className = 'mensagem-filtro';
            msg.textContent = 'Nenhuma tarefa encontrada com os filtros selecionados.';
            tarefas.parentElement.appendChild(msg);
        }
    } else if (mensagem) {
        mensagem.remove();
    }
}

// Ordenar tarefas
btnOrdenar.addEventListener('click', () => {
    const lista = Array.from(tarefas.querySelectorAll('li'));
    lista.sort((a, b) => a.firstChild.textContent.localeCompare(b.firstChild.textContent));
    lista.forEach(li => tarefas.appendChild(li));
});

// Eventos de filtros
filtroCategoria.addEventListener('change', filtrarTarefas);
filtroStatus.addEventListener('change', filtrarTarefas);
btnBuscar.addEventListener('click', filtrarTarefas);

// Carregar tarefas ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarTarefas);
