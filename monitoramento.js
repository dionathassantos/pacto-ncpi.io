// Monitoring and Evaluation Data
const monitoramentoData = {
    indicadores: [
        {
            id: 1,
            name: "Indicador 1",
            description: "Descrição do indicador 1",
            tipo: "quantitativo",
            unidade: "número",
            meta: 100,
            atual: 75,
            status: "em_andamento",
            responsavel: "João Silva",
            frequencia: "mensal",
            fonte: "Sistema X",
            historico: [
                {
                    data: "2024-01-01",
                    valor: 50,
                    observacao: "Início do período"
                },
                {
                    data: "2024-02-01",
                    valor: 75,
                    observacao: "Progresso significativo"
                }
            ]
        }
    ],
    metas: [
        {
            id: 1,
            name: "Meta 1",
            description: "Descrição da meta 1",
            prazo: "2024-12-31",
            status: "em_andamento",
            progresso: 60,
            indicadores: [1],
            responsavel: "Maria Santos",
            atividades: [
                {
                    id: 1,
                    name: "Atividade 1",
                    status: "concluida",
                    data_inicio: "2024-01-01",
                    data_fim: "2024-02-01"
                }
            ]
        }
    ],
    avaliacoes: [
        {
            id: 1,
            tipo: "trimestral",
            data: "2024-03-01",
            status: "em_andamento",
            resultados: [
                {
                    indicador_id: 1,
                    valor: 75,
                    observacao: "Resultado do trimestre"
                }
            ],
            recomendacoes: [
                "Recomendação 1",
                "Recomendação 2"
            ]
        }
    ]
};

// Load monitoring data
function loadMonitoramentoData() {
    const data = JSON.parse(localStorage.getItem('monitoramentoData')) || monitoramentoData;
    localStorage.setItem('monitoramentoData', JSON.stringify(data));
    return data;
}

// Render monitoring dashboard
function renderMonitoramento() {
    const data = loadMonitoramentoData();
    
    // Render indicators
    renderIndicators(data.indicadores);
    
    // Render goals
    renderGoals(data.metas);
    
    // Render evaluations
    renderEvaluations(data.avaliacoes);
}

// Render indicators
function renderIndicators(indicators) {
    const container = document.querySelector('.indicators-grid');
    
    const indicatorsHTML = indicators.map(indicator => `
        <div class="indicator-card">
            <div class="indicator-header">
                <h4>${indicator.name}</h4>
                <span class="status-badge ${indicator.status}">${getStatusText(indicator.status)}</span>
            </div>
            <div class="indicator-content">
                <p>${indicator.description}</p>
                <div class="indicator-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(indicator.atual / indicator.meta) * 100}%"></div>
                    </div>
                    <div class="progress-text">
                        ${indicator.atual} / ${indicator.meta} ${indicator.unidade}
                    </div>
                </div>
                <div class="indicator-details">
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <span>${indicator.responsavel}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${indicator.frequencia}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-database"></i>
                        <span>${indicator.fonte}</span>
                    </div>
                </div>
            </div>
            <div class="indicator-actions">
                <button onclick="editIndicator(${indicator.id})" class="btn-edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="viewIndicatorHistory(${indicator.id})" class="btn-view">
                    <i class="fas fa-chart-line"></i> Histórico
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = indicatorsHTML;
}

// Render goals
function renderGoals(goals) {
    const container = document.querySelector('.goals-grid');
    
    const goalsHTML = goals.map(goal => `
        <div class="goal-card">
            <div class="goal-header">
                <h4>${goal.name}</h4>
                <span class="status-badge ${goal.status}">${getStatusText(goal.status)}</span>
            </div>
            <div class="goal-content">
                <p>${goal.description}</p>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${goal.progresso}%"></div>
                    </div>
                    <div class="progress-text">
                        ${goal.progresso}% concluído
                    </div>
                </div>
                <div class="goal-details">
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <span>${goal.responsavel}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>Prazo: ${formatDate(goal.prazo)}</span>
                    </div>
                </div>
            </div>
            <div class="goal-actions">
                <button onclick="editGoal(${goal.id})" class="btn-edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="viewGoalActivities(${goal.id})" class="btn-view">
                    <i class="fas fa-tasks"></i> Atividades
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = goalsHTML;
}

// Render evaluations
function renderEvaluations(evaluations) {
    const container = document.querySelector('.evaluations-grid');
    
    const evaluationsHTML = evaluations.map(evaluation => `
        <div class="evaluation-card">
            <div class="evaluation-header">
                <h4>Avaliação ${evaluation.tipo}</h4>
                <span class="status-badge ${evaluation.status}">${getStatusText(evaluation.status)}</span>
            </div>
            <div class="evaluation-content">
                <div class="evaluation-date">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(evaluation.data)}</span>
                </div>
                <div class="evaluation-results">
                    <h5>Resultados</h5>
                    <ul>
                        ${evaluation.resultados.map(resultado => `
                            <li>
                                <strong>Indicador ${resultado.indicador_id}:</strong>
                                ${resultado.valor}
                                <br>
                                <small>${resultado.observacao}</small>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="evaluation-recommendations">
                    <h5>Recomendações</h5>
                    <ul>
                        ${evaluation.recomendacoes.map(rec => `
                            <li>${rec}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            <div class="evaluation-actions">
                <button onclick="editEvaluation(${evaluation.id})" class="btn-edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="generateReport(${evaluation.id})" class="btn-report">
                    <i class="fas fa-file-alt"></i> Relatório
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = evaluationsHTML;
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        em_andamento: 'Em Andamento',
        concluida: 'Concluída',
        atrasada: 'Atrasada',
        cancelada: 'Cancelada'
    };
    return statusMap[status] || status;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Edit indicator
function editIndicator(id) {
    const data = loadMonitoramentoData();
    const indicator = data.indicadores.find(i => i.id === id);
    
    if (!indicator) return;

    const modal = document.getElementById('editIndicatorModal');
    const form = modal.querySelector('form');

    // Populate form
    form.querySelector('[name="name"]').value = indicator.name;
    form.querySelector('[name="description"]').value = indicator.description;
    form.querySelector('[name="tipo"]').value = indicator.tipo;
    form.querySelector('[name="unidade"]').value = indicator.unidade;
    form.querySelector('[name="meta"]').value = indicator.meta;
    form.querySelector('[name="atual"]').value = indicator.atual;
    form.querySelector('[name="status"]').value = indicator.status;
    form.querySelector('[name="responsavel"]').value = indicator.responsavel;
    form.querySelector('[name="frequencia"]').value = indicator.frequencia;
    form.querySelector('[name="fonte"]').value = indicator.fonte;

    // Show modal
    modal.style.display = 'block';

    // Handle form submission
    form.onsubmit = (e) => {
        e.preventDefault();
        
        // Update indicator
        indicator.name = form.querySelector('[name="name"]').value;
        indicator.description = form.querySelector('[name="description"]').value;
        indicator.tipo = form.querySelector('[name="tipo"]').value;
        indicator.unidade = form.querySelector('[name="unidade"]').value;
        indicator.meta = Number(form.querySelector('[name="meta"]').value);
        indicator.atual = Number(form.querySelector('[name="atual"]').value);
        indicator.status = form.querySelector('[name="status"]').value;
        indicator.responsavel = form.querySelector('[name="responsavel"]').value;
        indicator.frequencia = form.querySelector('[name="frequencia"]').value;
        indicator.fonte = form.querySelector('[name="fonte"]').value;

        // Add to history
        indicator.historico.push({
            data: new Date().toISOString().split('T')[0],
            valor: indicator.atual,
            observacao: "Atualização do indicador"
        });

        // Save data
        localStorage.setItem('monitoramentoData', JSON.stringify(data));

        // Close modal and refresh
        modal.style.display = 'none';
        renderMonitoramento();
    };
}

// View indicator history
function viewIndicatorHistory(id) {
    const data = loadMonitoramentoData();
    const indicator = data.indicadores.find(i => i.id === id);
    
    if (!indicator) return;

    const modal = document.getElementById('historyModal');
    const container = modal.querySelector('.history-content');

    // Generate history chart
    const chartData = indicator.historico.map(h => ({
        date: new Date(h.data),
        value: h.valor
    }));

    // Render history
    container.innerHTML = `
        <div class="history-chart">
            <canvas id="historyChart"></canvas>
        </div>
        <div class="history-list">
            <h4>Histórico de Atualizações</h4>
            <ul>
                ${indicator.historico.map(h => `
                    <li>
                        <strong>${formatDate(h.data)}</strong>
                        <br>
                        Valor: ${h.valor} ${indicator.unidade}
                        <br>
                        <small>${h.observacao}</small>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // Show modal
    modal.style.display = 'block';

    // Initialize chart
    const ctx = document.getElementById('historyChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.map(d => formatDate(d.date)),
            datasets: [{
                label: indicator.name,
                data: chartData.map(d => d.value),
                borderColor: '#4CAF50',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Edit goal
function editGoal(id) {
    const data = loadMonitoramentoData();
    const goal = data.metas.find(g => g.id === id);
    
    if (!goal) return;

    const modal = document.getElementById('editGoalModal');
    const form = modal.querySelector('form');

    // Populate form
    form.querySelector('[name="name"]').value = goal.name;
    form.querySelector('[name="description"]').value = goal.description;
    form.querySelector('[name="prazo"]').value = goal.prazo;
    form.querySelector('[name="status"]').value = goal.status;
    form.querySelector('[name="progresso"]').value = goal.progresso;
    form.querySelector('[name="responsavel"]').value = goal.responsavel;

    // Show modal
    modal.style.display = 'block';

    // Handle form submission
    form.onsubmit = (e) => {
        e.preventDefault();
        
        // Update goal
        goal.name = form.querySelector('[name="name"]').value;
        goal.description = form.querySelector('[name="description"]').value;
        goal.prazo = form.querySelector('[name="prazo"]').value;
        goal.status = form.querySelector('[name="status"]').value;
        goal.progresso = Number(form.querySelector('[name="progresso"]').value);
        goal.responsavel = form.querySelector('[name="responsavel"]').value;

        // Save data
        localStorage.setItem('monitoramentoData', JSON.stringify(data));

        // Close modal and refresh
        modal.style.display = 'none';
        renderMonitoramento();
    };
}

// View goal activities
function viewGoalActivities(id) {
    const data = loadMonitoramentoData();
    const goal = data.metas.find(g => g.id === id);
    
    if (!goal) return;

    const modal = document.getElementById('activitiesModal');
    const container = modal.querySelector('.activities-content');

    // Render activities
    container.innerHTML = `
        <div class="activities-list">
            <h4>Atividades da Meta</h4>
            <ul>
                ${goal.atividades.map(activity => `
                    <li>
                        <div class="activity-header">
                            <strong>${activity.name}</strong>
                            <span class="status-badge ${activity.status}">${getStatusText(activity.status)}</span>
                        </div>
                        <div class="activity-dates">
                            <small>
                                Início: ${formatDate(activity.data_inicio)}
                                <br>
                                Fim: ${formatDate(activity.data_fim)}
                            </small>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // Show modal
    modal.style.display = 'block';
}

// Edit evaluation
function editEvaluation(id) {
    const data = loadMonitoramentoData();
    const evaluation = data.avaliacoes.find(e => e.id === id);
    
    if (!evaluation) return;

    const modal = document.getElementById('editEvaluationModal');
    const form = modal.querySelector('form');

    // Populate form
    form.querySelector('[name="tipo"]').value = evaluation.tipo;
    form.querySelector('[name="data"]').value = evaluation.data;
    form.querySelector('[name="status"]').value = evaluation.status;

    // Populate results
    const resultsContainer = form.querySelector('.results-container');
    resultsContainer.innerHTML = evaluation.resultados.map(resultado => `
        <div class="result-item">
            <input type="number" name="resultado_${resultado.indicador_id}" value="${resultado.valor}" required>
            <textarea name="observacao_${resultado.indicador_id}" placeholder="Observação">${resultado.observacao}</textarea>
            <button type="button" onclick="removeResult(this)">Remover</button>
        </div>
    `).join('');

    // Populate recommendations
    const recommendationsContainer = form.querySelector('.recommendations-container');
    recommendationsContainer.innerHTML = evaluation.recomendacoes.map(rec => `
        <div class="recommendation-item">
            <input type="text" name="recomendacao" value="${rec}" required>
            <button type="button" onclick="removeRecommendation(this)">Remover</button>
        </div>
    `).join('');

    // Show modal
    modal.style.display = 'block';

    // Handle form submission
    form.onsubmit = (e) => {
        e.preventDefault();
        
        // Update evaluation
        evaluation.tipo = form.querySelector('[name="tipo"]').value;
        evaluation.data = form.querySelector('[name="data"]').value;
        evaluation.status = form.querySelector('[name="status"]').value;

        // Update results
        evaluation.resultados = Array.from(resultsContainer.querySelectorAll('.result-item')).map(item => ({
            indicador_id: Number(item.querySelector('input').name.split('_')[1]),
            valor: Number(item.querySelector('input').value),
            observacao: item.querySelector('textarea').value
        }));

        // Update recommendations
        evaluation.recomendacoes = Array.from(recommendationsContainer.querySelectorAll('.recommendation-item input')).map(input => input.value);

        // Save data
        localStorage.setItem('monitoramentoData', JSON.stringify(data));

        // Close modal and refresh
        modal.style.display = 'none';
        renderMonitoramento();
    };
}

// Generate report
function generateReport(id) {
    const data = loadMonitoramentoData();
    const evaluation = data.avaliacoes.find(e => e.id === id);
    
    if (!evaluation) return;

    // Create report content
    const reportContent = `
        <h2>Relatório de Avaliação ${evaluation.tipo}</h2>
        <p>Data: ${formatDate(evaluation.data)}</p>
        <p>Status: ${getStatusText(evaluation.status)}</p>
        
        <h3>Resultados</h3>
        <ul>
            ${evaluation.resultados.map(resultado => `
                <li>
                    <strong>Indicador ${resultado.indicador_id}:</strong>
                    ${resultado.valor}
                    <br>
                    <small>${resultado.observacao}</small>
                </li>
            `).join('')}
        </ul>
        
        <h3>Recomendações</h3>
        <ul>
            ${evaluation.recomendacoes.map(rec => `
                <li>${rec}</li>
            `).join('')}
        </ul>
    `;

    // Create and download report
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_avaliacao_${evaluation.id}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Add result to evaluation form
function addResult(form) {
    const container = form.querySelector('.results-container');
    const newResult = document.createElement('div');
    newResult.className = 'result-item';
    newResult.innerHTML = `
        <input type="number" name="resultado_new" required>
        <textarea name="observacao_new" placeholder="Observação"></textarea>
        <button type="button" onclick="removeResult(this)">Remover</button>
    `;
    container.appendChild(newResult);
}

// Remove result from evaluation form
function removeResult(button) {
    button.parentElement.remove();
}

// Add recommendation to evaluation form
function addRecommendation(form) {
    const container = form.querySelector('.recommendations-container');
    const newRecommendation = document.createElement('div');
    newRecommendation.className = 'recommendation-item';
    newRecommendation.innerHTML = `
        <input type="text" name="recomendacao" required>
        <button type="button" onclick="removeRecommendation(this)">Remover</button>
    `;
    container.appendChild(newRecommendation);
}

// Remove recommendation from evaluation form
function removeRecommendation(button) {
    button.parentElement.remove();
}

// Initialize monitoring
document.addEventListener('DOMContentLoaded', () => {
    renderMonitoramento();
});