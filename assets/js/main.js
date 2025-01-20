const inputTarefa = document.querySelector('.input-tarefa');
const btnTarefa = document.querySelector('.btn-tarefa');
const tarefas = document.querySelector('.tarefas');
const selectCategoria = document.querySelector('.select-categoria');
const filtroCategoria = document.querySelector('.filtro-categoria');
const filtroStatus = document.querySelector('.filtro-status');
const btnBuscar = document.querySelector('.btn-buscar');


btnTarefa.addEventListener('click', () => {
    if (!inputTarefa.value || !selectCategoria.value) return;

    const li = document.createElement('li');
    li.setAttribute('data-categoria', selectCategoria.value);
    li.setAttribute('data-status', 'pendente');
    li.innerHTML = `
        ${inputTarefa.value} - <strong>${selectCategoria.value}</strong>
        <button class="concluir">Concluir</button>
        <button class="editar">Editar</button>
        <button class="apagar">Apagar</button>
    `;

    tarefas.appendChild(li);
    inputTarefa.value = '';
    selectCategoria.value = '';

    salvarTarefas(); 
});


tarefas.addEventListener('click', (e) => {
    const li = e.target.parentElement;

    if (e.target.classList.contains('apagar')) {
        li.remove();
        salvarTarefas(); 
    } else if (e.target.classList.contains('editar')) {
        const novaDescricao = prompt('Edite a tarefa:', li.firstChild.textContent.trim());
        if (novaDescricao) li.firstChild.textContent = novaDescricao + ' ';
        salvarTarefas(); 
    } else if (e.target.classList.contains('concluir')) {
        li.classList.toggle('concluida');
        li.setAttribute('data-status', li.classList.contains('concluida') ? 'concluida' : 'pendente');
        salvarTarefas(); 
    }
});

// Salvar tarefas no localStorage
function salvarTarefas() {
    const listaDeTarefas = Array.from(tarefas.querySelectorAll('li')).map(li => ({
        descricao: li.firstChild.textContent.trim(),
        categoria: li.getAttribute('data-categoria'),
        status: li.getAttribute('data-status'),
    }));
    localStorage.setItem('tarefas', JSON.stringify(listaDeTarefas));
}

// Carregar tarefas do localStorage
function carregarTarefas() {
    const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefasSalvas.forEach(tarefa => {
        const li = document.createElement('li');
        li.setAttribute('data-categoria', tarefa.categoria);
        li.setAttribute('data-status', tarefa.status);
        li.classList.toggle('concluida', tarefa.status === 'concluida');
        li.innerHTML = `
            ${tarefa.descricao} - <strong>${tarefa.categoria}</strong>
            <button class="concluir">Concluir</button>
            <button class="editar">Editar</button>
            <button class="apagar">Apagar</button>
        `;
        tarefas.appendChild(li);
    });
}

// Filtrar tarefas
function filtrarTarefas() {
    const categoria = filtroCategoria.value;
    const status = filtroStatus.value;

    document.querySelectorAll('.tarefas li').forEach((li) => {
        const matchCategoria = !categoria || li.getAttribute('data-categoria') === categoria;
        const matchStatus = !status || li.getAttribute('data-status') === status;

        li.style.display = matchCategoria && matchStatus ? '' : 'none';
    });
}

// Eventos para filtros
filtroCategoria.addEventListener('change', filtrarTarefas);
filtroStatus.addEventListener('change', filtrarTarefas);
btnBuscar.addEventListener('click', filtrarTarefas);


// Carregar tarefas ao carregar a página
document.addEventListener('DOMContentLoaded', carregarTarefas);

