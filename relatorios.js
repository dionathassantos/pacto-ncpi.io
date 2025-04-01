// Reports Data
const relatoriosData = {
    relatorios: [
        {
            id: 1,
            titulo: "Relatório Trimestral Q1 2024",
            tipo: "trimestral",
            data: "2024-03-31",
            status: "concluido",
            autor: "João Silva",
            resumo: "Relatório de acompanhamento do primeiro trimestre de 2024",
            conteudo: {
                indicadores: [
                    {
                        id: 1,
                        nome: "Indicador 1",
                        valor: 75,
                        meta: 100,
                        tendencia: "positiva"
                    }
                ],
                metas: [
                    {
                        id: 1,
                        nome: "Meta 1",
                        progresso: 60,
                        status: "em_andamento"
                    }
                ],
                avaliacoes: [
                    {
                        id: 1,
                        tipo: "trimestral",
                        data: "2024-03-01",
                        resultados: [
                            {
                                indicador_id: 1,
                                valor: 75,
                                observacao: "Resultado do trimestre"
                            }
                        ]
                    }
                ],
                recomendacoes: [
                    "Recomendação 1",
                    "Recomendação 2"
                ]
            },
            anexos: [
                {
                    id: 1,
                    nome: "Anexo 1.pdf",
                    tipo: "pdf",
                    tamanho: "2.5MB",
                    url: "/anexos/anexo1.pdf"
                }
            ]
        }
    ],
    templates: [
        {
            id: 1,
            nome: "Template Trimestral",
            descricao: "Template para relatórios trimestrais",
            estrutura: {
                secoes: [
                    {
                        titulo: "Resumo Executivo",
                        conteudo: "Template para resumo executivo"
                    },
                    {
                        titulo: "Indicadores",
                        conteudo: "Template para indicadores"
                    },
                    {
                        titulo: "Metas",
                        conteudo: "Template para metas"
                    },
                    {
                        titulo: "Avaliações",
                        conteudo: "Template para avaliações"
                    },
                    {
                        titulo: "Recomendações",
                        conteudo: "Template para recomendações"
                    }
                ]
            }
        }
    ]
};

// Load reports data
function loadRelatoriosData() {
    const data = JSON.parse(localStorage.getItem('relatoriosData')) || relatoriosData;
    localStorage.setItem('relatoriosData', JSON.stringify(data));
    return data;
}

// Render reports dashboard
function renderRelatorios() {
    const data = loadRelatoriosData();
    
    // Render reports list
    renderReportsList(data.relatorios);
    
    // Render templates
    renderTemplates(data.templates);
}

// Render reports list
function renderReportsList(reports) {
    const container = document.querySelector('.reports-grid');
    
    const reportsHTML = reports.map(report => `
        <div class="report-card">
            <div class="report-header">
                <h4>${report.titulo}</h4>
                <span class="status-badge ${report.status}">${getStatusText(report.status)}</span>
            </div>
            <div class="report-content">
                <p>${report.resumo}</p>
                <div class="report-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(report.data)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-user"></i>
                        <span>${report.autor}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-file-alt"></i>
                        <span>${report.tipo}</span>
                    </div>
                </div>
                <div class="report-attachments">
                    <h5>Anexos</h5>
                    <ul>
                        ${report.anexos.map(anexo => `
                            <li>
                                <a href="${anexo.url}" target="_blank">
                                    <i class="fas fa-file-${getFileIcon(anexo.tipo)}"></i>
                                    ${anexo.nome}
                                    <small>(${anexo.tamanho})</small>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            <div class="report-actions">
                <button onclick="viewReport(${report.id})" class="btn-view">
                    <i class="fas fa-eye"></i> Visualizar
                </button>
                <button onclick="editReport(${report.id})" class="btn-edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="downloadReport(${report.id})" class="btn-download">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = reportsHTML;
}

// Render templates
function renderTemplates(templates) {
    const container = document.querySelector('.templates-grid');
    
    const templatesHTML = templates.map(template => `
        <div class="template-card">
            <div class="template-header">
                <h4>${template.nome}</h4>
            </div>
            <div class="template-content">
                <p>${template.descricao}</p>
                <div class="template-sections">
                    <h5>Estrutura</h5>
                    <ul>
                        ${template.estrutura.secoes.map(secao => `
                            <li>${secao.titulo}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            <div class="template-actions">
                <button onclick="useTemplate(${template.id})" class="btn-use">
                    <i class="fas fa-file-alt"></i> Usar Template
                </button>
                <button onclick="editTemplate(${template.id})" class="btn-edit">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = templatesHTML;
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        concluido: 'Concluído',
        em_andamento: 'Em Andamento',
        pendente: 'Pendente',
        cancelado: 'Cancelado'
    };
    return statusMap[status] || status;
}

// Get file icon
function getFileIcon(type) {
    const iconMap = {
        pdf: 'pdf',
        doc: 'word',
        docx: 'word',
        xls: 'excel',
        xlsx: 'excel',
        ppt: 'powerpoint',
        pptx: 'powerpoint',
        jpg: 'image',
        jpeg: 'image',
        png: 'image'
    };
    return iconMap[type] || 'alt';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// View report
function viewReport(id) {
    const data = loadRelatoriosData();
    const report = data.relatorios.find(r => r.id === id);
    
    if (!report) return;

    const modal = document.getElementById('viewReportModal');
    const container = modal.querySelector('.report-content');

    // Render report content
    container.innerHTML = `
        <div class="report-view">
            <h2>${report.titulo}</h2>
            <div class="report-meta">
                <p><strong>Data:</strong> ${formatDate(report.data)}</p>
                <p><strong>Autor:</strong> ${report.autor}</p>
                <p><strong>Tipo:</strong> ${report.tipo}</p>
                <p><strong>Status:</strong> ${getStatusText(report.status)}</p>
            </div>
            
            <div class="report-section">
                <h3>Resumo Executivo</h3>
                <p>${report.resumo}</p>
            </div>
            
            <div class="report-section">
                <h3>Indicadores</h3>
                <div class="indicators-grid">
                    ${report.conteudo.indicadores.map(indicator => `
                        <div class="indicator-item">
                            <h4>${indicator.nome}</h4>
                            <div class="indicator-value">
                                ${indicator.valor} / ${indicator.meta}
                                <span class="trend ${indicator.tendencia}">
                                    <i class="fas fa-arrow-${indicator.tendencia === 'positiva' ? 'up' : 'down'}"></i>
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="report-section">
                <h3>Metas</h3>
                <div class="goals-grid">
                    ${report.conteudo.metas.map(goal => `
                        <div class="goal-item">
                            <h4>${goal.nome}</h4>
                            <div class="goal-progress">
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${goal.progresso}%"></div>
                                </div>
                                <span class="status-badge ${goal.status}">${getStatusText(goal.status)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="report-section">
                <h3>Avaliações</h3>
                <div class="evaluations-list">
                    ${report.conteudo.avaliacoes.map(evaluation => `
                        <div class="evaluation-item">
                            <h4>Avaliação ${evaluation.tipo}</h4>
                            <p><strong>Data:</strong> ${formatDate(evaluation.data)}</p>
                            <div class="evaluation-results">
                                ${evaluation.resultados.map(resultado => `
                                    <div class="result-item">
                                        <strong>Indicador ${resultado.indicador_id}:</strong>
                                        ${resultado.valor}
                                        <br>
                                        <small>${resultado.observacao}</small>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="report-section">
                <h3>Recomendações</h3>
                <ul>
                    ${report.conteudo.recomendacoes.map(rec => `
                        <li>${rec}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="report-section">
                <h3>Anexos</h3>
                <ul>
                    ${report.anexos.map(anexo => `
                        <li>
                            <a href="${anexo.url}" target="_blank">
                                <i class="fas fa-file-${getFileIcon(anexo.tipo)}"></i>
                                ${anexo.nome}
                                <small>(${anexo.tamanho})</small>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;

    // Show modal
    modal.style.display = 'block';
}

// Edit report
function editReport(id) {
    const data = loadRelatoriosData();
    const report = data.relatorios.find(r => r.id === id);
    
    if (!report) return;

    const modal = document.getElementById('editReportModal');
    const form = modal.querySelector('form');

    // Populate form
    form.querySelector('[name="titulo"]').value = report.titulo;
    form.querySelector('[name="tipo"]').value = report.tipo;
    form.querySelector('[name="data"]').value = report.data;
    form.querySelector('[name="status"]').value = report.status;
    form.querySelector('[name="autor"]').value = report.autor;
    form.querySelector('[name="resumo"]').value = report.resumo;

    // Populate indicators
    const indicatorsContainer = form.querySelector('.indicators-container');
    indicatorsContainer.innerHTML = report.conteudo.indicadores.map(indicator => `
        <div class="indicator-item">
            <input type="text" name="indicador_nome" value="${indicator.nome}" required>
            <input type="number" name="indicador_valor" value="${indicator.valor}" required>
            <input type="number" name="indicador_meta" value="${indicator.meta}" required>
            <select name="indicador_tendencia" required>
                <option value="positiva" ${indicator.tendencia === 'positiva' ? 'selected' : ''}>Positiva</option>
                <option value="negativa" ${indicator.tendencia === 'negativa' ? 'selected' : ''}>Negativa</option>
            </select>
            <button type="button" onclick="removeIndicator(this)">Remover</button>
        </div>
    `).join('');

    // Populate goals
    const goalsContainer = form.querySelector('.goals-container');
    goalsContainer.innerHTML = report.conteudo.metas.map(goal => `
        <div class="goal-item">
            <input type="text" name="meta_nome" value="${goal.nome}" required>
            <input type="number" name="meta_progresso" value="${goal.progresso}" required>
            <select name="meta_status" required>
                <option value="em_andamento" ${goal.status === 'em_andamento' ? 'selected' : ''}>Em Andamento</option>
                <option value="concluida" ${goal.status === 'concluida' ? 'selected' : ''}>Concluída</option>
                <option value="atrasada" ${goal.status === 'atrasada' ? 'selected' : ''}>Atrasada</option>
            </select>
            <button type="button" onclick="removeGoal(this)">Remover</button>
        </div>
    `).join('');

    // Populate recommendations
    const recommendationsContainer = form.querySelector('.recommendations-container');
    recommendationsContainer.innerHTML = report.conteudo.recomendacoes.map(rec => `
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
        
        // Update report
        report.titulo = form.querySelector('[name="titulo"]').value;
        report.tipo = form.querySelector('[name="tipo"]').value;
        report.data = form.querySelector('[name="data"]').value;
        report.status = form.querySelector('[name="status"]').value;
        report.autor = form.querySelector('[name="autor"]').value;
        report.resumo = form.querySelector('[name="resumo"]').value;

        // Update indicators
        report.conteudo.indicadores = Array.from(indicatorsContainer.querySelectorAll('.indicator-item')).map(item => ({
            nome: item.querySelector('[name="indicador_nome"]').value,
            valor: Number(item.querySelector('[name="indicador_valor"]').value),
            meta: Number(item.querySelector('[name="indicador_meta"]').value),
            tendencia: item.querySelector('[name="indicador_tendencia"]').value
        }));

        // Update goals
        report.conteudo.metas = Array.from(goalsContainer.querySelectorAll('.goal-item')).map(item => ({
            nome: item.querySelector('[name="meta_nome"]').value,
            progresso: Number(item.querySelector('[name="meta_progresso"]').value),
            status: item.querySelector('[name="meta_status"]').value
        }));

        // Update recommendations
        report.conteudo.recomendacoes = Array.from(recommendationsContainer.querySelectorAll('.recommendation-item input')).map(input => input.value);

        // Save data
        localStorage.setItem('relatoriosData', JSON.stringify(data));

        // Close modal and refresh
        modal.style.display = 'none';
        renderRelatorios();
    };
}

// Download report
function downloadReport(id) {
    const data = loadRelatoriosData();
    const report = data.relatorios.find(r => r.id === id);
    
    if (!report) return;

    // Create report content
    const reportContent = `
        <html>
            <head>
                <title>${report.titulo}</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .header { text-align: center; margin-bottom: 2em; }
                    .section { margin-bottom: 2em; }
                    .progress-bar { background: #eee; height: 20px; border-radius: 10px; overflow: hidden; }
                    .progress { background: #4CAF50; height: 100%; }
                    .status-badge { padding: 5px 10px; border-radius: 15px; font-size: 0.8em; }
                    .concluido { background: #4CAF50; color: white; }
                    .em_andamento { background: #FFC107; color: black; }
                    .atrasado { background: #F44336; color: white; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${report.titulo}</h1>
                    <p>Data: ${formatDate(report.data)}</p>
                    <p>Autor: ${report.autor}</p>
                    <p>Tipo: ${report.tipo}</p>
                    <p>Status: ${getStatusText(report.status)}</p>
                </div>

                <div class="section">
                    <h2>Resumo Executivo</h2>
                    <p>${report.resumo}</p>
                </div>

                <div class="section">
                    <h2>Indicadores</h2>
                    ${report.conteudo.indicadores.map(indicator => `
                        <div class="indicator">
                            <h3>${indicator.nome}</h3>
                            <p>Valor: ${indicator.valor} / ${indicator.meta}</p>
                            <p>Tendência: ${indicator.tendencia === 'positiva' ? '↑' : '↓'}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="section">
                    <h2>Metas</h2>
                    ${report.conteudo.metas.map(goal => `
                        <div class="goal">
                            <h3>${goal.nome}</h3>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${goal.progresso}%"></div>
                            </div>
                            <p>Progresso: ${goal.progresso}%</p>
                            <p>Status: ${getStatusText(goal.status)}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="section">
                    <h2>Avaliações</h2>
                    ${report.conteudo.avaliacoes.map(evaluation => `
                        <div class="evaluation">
                            <h3>Avaliação ${evaluation.tipo}</h3>
                            <p>Data: ${formatDate(evaluation.data)}</p>
                            ${evaluation.resultados.map(resultado => `
                                <div class="result">
                                    <p><strong>Indicador ${resultado.indicador_id}:</strong> ${resultado.valor}</p>
                                    <p><small>${resultado.observacao}</small></p>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>

                <div class="section">
                    <h2>Recomendações</h2>
                    <ul>
                        ${report.conteudo.recomendacoes.map(rec => `
                            <li>${rec}</li>
                        `).join('')}
                    </ul>
                </div>

                <div class="section">
                    <h2>Anexos</h2>
                    <ul>
                        ${report.anexos.map(anexo => `
                            <li>${anexo.nome} (${anexo.tamanho})</li>
                        `).join('')}
                    </ul>
                </div>
            </body>
        </html>
    `;

    // Create and download report
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.titulo.toLowerCase().replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Use template
function useTemplate(id) {
    const data = loadRelatoriosData();
    const template = data.templates.find(t => t.id === id);
    
    if (!template) return;

    const modal = document.getElementById('newReportModal');
    const form = modal.querySelector('form');

    // Populate form with template structure
    form.querySelector('[name="titulo"]').value = `Novo Relatório - ${template.nome}`;
    form.querySelector('[name="tipo"]').value = template.nome.split(' ')[0].toLowerCase();
    form.querySelector('[name="data"]').value = new Date().toISOString().split('T')[0];
    form.querySelector('[name="status"]').value = 'em_andamento';
    form.querySelector('[name="autor"]').value = 'Usuário Atual';
    form.querySelector('[name="resumo"]').value = '';

    // Show modal
    modal.style.display = 'block';

    // Handle form submission
    form.onsubmit = (e) => {
        e.preventDefault();
        
        // Create new report
        const newReport = {
            id: Math.max(...data.relatorios.map(r => r.id), 0) + 1,
            titulo: form.querySelector('[name="titulo"]').value,
            tipo: form.querySelector('[name="tipo"]').value,
            data: form.querySelector('[name="data"]').value,
            status: form.querySelector('[name="status"]').value,
            autor: form.querySelector('[name="autor"]').value,
            resumo: form.querySelector('[name="resumo"]').value,
            conteudo: {
                indicadores: [],
                metas: [],
                avaliacoes: [],
                recomendacoes: []
            },
            anexos: []
        };

        // Add report to data
        data.relatorios.push(newReport);
        localStorage.setItem('relatoriosData', JSON.stringify(data));

        // Close modal and refresh
        modal.style.display = 'none';
        renderRelatorios();
    };
}

// Edit template
function editTemplate(id) {
    const data = loadRelatoriosData();
    const template = data.templates.find(t => t.id === id);
    
    if (!template) return;

    const modal = document.getElementById('editTemplateModal');
    const form = modal.querySelector('form');

    // Populate form
    form.querySelector('[name="nome"]').value = template.nome;
    form.querySelector('[name="descricao"]').value = template.descricao;

    // Populate sections
    const sectionsContainer = form.querySelector('.sections-container');
    sectionsContainer.innerHTML = template.estrutura.secoes.map(secao => `
        <div class="section-item">
            <input type="text" name="secao_titulo" value="${secao.titulo}" required>
            <textarea name="secao_conteudo" placeholder="Template para ${secao.titulo}">${secao.conteudo}</textarea>
            <button type="button" onclick="removeSection(this)">Remover</button>
        </div>
    `).join('');

    // Show modal
    modal.style.display = 'block';

    // Handle form submission
    form.onsubmit = (e) => {
        e.preventDefault();
        
        // Update template
        template.nome = form.querySelector('[name="nome"]').value;
        template.descricao = form.querySelector('[name="descricao"]').value;
        template.estrutura.secoes = Array.from(sectionsContainer.querySelectorAll('.section-item')).map(item => ({
            titulo: item.querySelector('[name="secao_titulo"]').value,
            conteudo: item.querySelector('[name="secao_conteudo"]').value
        }));

        // Save data
        localStorage.setItem('relatoriosData', JSON.stringify(data));

        // Close modal and refresh
        modal.style.display = 'none';
        renderRelatorios();
    };
}

// Add indicator to report form
function addIndicator(form) {
    const container = form.querySelector('.indicators-container');
    const newIndicator = document.createElement('div');
    newIndicator.className = 'indicator-item';
    newIndicator.innerHTML = `
        <input type="text" name="indicador_nome" placeholder="Nome do Indicador" required>
        <input type="number" name="indicador_valor" placeholder="Valor" required>
        <input type="number" name="indicador_meta" placeholder="Meta" required>
        <select name="indicador_tendencia" required>
            <option value="positiva">Positiva</option>
            <option value="negativa">Negativa</option>
        </select>
        <button type="button" onclick="removeIndicator(this)">Remover</button>
    `;
    container.appendChild(newIndicator);
}

// Remove indicator from report form
function removeIndicator(button) {
    button.parentElement.remove();
}

// Add goal to report form
function addGoal(form) {
    const container = form.querySelector('.goals-container');
    const newGoal = document.createElement('div');
    newGoal.className = 'goal-item';
    newGoal.innerHTML = `
        <input type="text" name="meta_nome" placeholder="Nome da Meta" required>
        <input type="number" name="meta_progresso" placeholder="Progresso (%)" required>
        <select name="meta_status" required>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
            <option value="atrasada">Atrasada</option>
        </select>
        <button type="button" onclick="removeGoal(this)">Remover</button>
    `;
    container.appendChild(newGoal);
}

// Remove goal from report form
function removeGoal(button) {
    button.parentElement.remove();
}

// Add recommendation to report form
function addRecommendation(form) {
    const container = form.querySelector('.recommendations-container');
    const newRecommendation = document.createElement('div');
    newRecommendation.className = 'recommendation-item';
    newRecommendation.innerHTML = `
        <input type="text" name="recomendacao" placeholder="Nova Recomendação" required>
        <button type="button" onclick="removeRecommendation(this)">Remover</button>
    `;
    container.appendChild(newRecommendation);
}

// Remove recommendation from report form
function removeRecommendation(button) {
    button.parentElement.remove();
}

// Add section to template form
function addSection(form) {
    const container = form.querySelector('.sections-container');
    const newSection = document.createElement('div');
    newSection.className = 'section-item';
    newSection.innerHTML = `
        <input type="text" name="secao_titulo" placeholder="Título da Seção" required>
        <textarea name="secao_conteudo" placeholder="Template para esta seção"></textarea>
        <button type="button" onclick="removeSection(this)">Remover</button>
    `;
    container.appendChild(newSection);
}

// Remove section from template form
function removeSection(button) {
    button.parentElement.remove();
}

// Initialize reports
document.addEventListener('DOMContentLoaded', () => {
    renderRelatorios();
});