// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBYcTwJLUA9YXfZsigyLGJy6WMsYKfdJXo",
    authDomain: "ncpi-102ca.firebaseapp.com",
    databaseURL: "https://ncpi-102ca-default-rtdb.firebaseio.com",
    projectId: "ncpi-102ca",
    storageBucket: "ncpi-102ca.firebasestorage.app",
    messagingSenderId: "592471971260",
    appId: "1:592471971260:web:acea66a4add39211d387b9",
    measurementId: "G-KR1NKD77R7"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Initial data structure
const initialData = {
    portaFora: {
        initiatives: [
            {
                id: 1,
                name: "Advocacy e Comunicação",
                description: "Fortalecer a visibilidade e o conhecimento sobre primeira infância",
                status: "Em andamento",
                progress: 75,
                leader: "João Silva",
                results: [
                    {
                        id: 1,
                        text: "Aumentar a visibilidade da primeira infância na mídia",
                        status: "Em andamento",
                        progress: 80
                    },
                    {
                        id: 2,
                        text: "Fortalecer a comunicação com gestores públicos",
                        status: "Em andamento",
                        progress: 70
                    }
                ],
                goals: [
                    {
                        id: 1,
                        text: "Realizar 5 workshops com gestores públicos",
                        semester: "1º semestre 2024",
                        status: "Em andamento",
                        progress: 60
                    },
                    {
                        id: 2,
                        text: "Publicar 10 artigos na mídia",
                        semester: "2º semestre 2024",
                        status: "Em andamento",
                        progress: 80
                    }
                ]
            }
        ]
    },
    portaDentro: {
        initiatives: [
            {
                id: 1,
                name: "Fortalecimento Institucional",
                description: "Fortalecer a capacidade técnica e operacional dos atores",
                status: "Em andamento",
                progress: 65,
                leader: "Maria Santos",
                results: [
                    {
                        id: 1,
                        text: "Capacitar equipes técnicas",
                        status: "Em andamento",
                        progress: 70
                    }
                ],
                goals: [
                    {
                        id: 1,
                        text: "Realizar 3 workshops de capacitação",
                        semester: "1º semestre 2024",
                        status: "Em andamento",
                        progress: 50
                    }
                ]
            }
        ]
    }
};

// Load data from localStorage or initialize with default data
function loadInitialData() {
    const data = localStorage.getItem('dashboardData');
    if (!data) {
        localStorage.setItem('dashboardData', JSON.stringify(initialData));
        return initialData;
    }
    return JSON.parse(data);
}

// Update statistics
function updateStats(initiatives) {
    const stats = {
        total: initiatives.length,
        emAndamento: initiatives.filter(i => i.status === "Em andamento").length,
        concluidas: initiatives.filter(i => i.status === "Concluída").length,
        criticas: initiatives.filter(i => i.status === "Em crítico").length
    };

    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;

    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-content">
                <div class="stat-label">Total de Iniciativas</div>
                <div class="stat-value">${stats.total}</div>
                <div class="trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+${stats.total} este mês</span>
                </div>
            </div>
            <div class="stat-icon blue">
                <i class="fas fa-project-diagram"></i>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-content">
                <div class="stat-label">Em Andamento</div>
                <div class="stat-value">${stats.emAndamento}</div>
                <div class="trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+${stats.emAndamento} este mês</span>
                </div>
            </div>
            <div class="stat-icon purple">
                <i class="fas fa-spinner"></i>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-content">
                <div class="stat-label">Concluídas</div>
                <div class="stat-value">${stats.concluidas}</div>
                <div class="trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+${stats.concluidas} este mês</span>
                </div>
            </div>
            <div class="stat-icon green">
                <i class="fas fa-check-circle"></i>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-content">
                <div class="stat-label">Em Crítico</div>
                <div class="stat-value">${stats.criticas}</div>
                <div class="trend negative">
                    <i class="fas fa-arrow-down"></i>
                    <span>-${stats.criticas} este mês</span>
                </div>
            </div>
            <div class="stat-icon pink">
                <i class="fas fa-exclamation-circle"></i>
            </div>
        </div>
    `;
}

// Render initiatives
function renderInitiatives(data) {
    const initiativesSection = document.querySelector('.initiatives');
    if (!initiativesSection) return;

    // Limpar conteúdo anterior
    initiativesSection.innerHTML = '<h2>Iniciativas</h2><div class="initiatives-container"></div>';
    const initiativesContainer = initiativesSection.querySelector('.initiatives-container');

    // Filtra apenas iniciativas da "Porta para fora"
    const portaForaIniciativas = data.Iniciativas.filter(i => i.Porta === "Porta para fora");
    
    portaForaIniciativas.forEach(iniciativa => {
        const card = createInitiativeCard(iniciativa);
        initiativesContainer.appendChild(card);
    });
}

// Load dashboard data
function loadDashboardData(pageId) {
    const data = loadInitialData();
    const initiatives = pageId === 'porta-fora' ? data.portaFora.initiatives : data.portaDentro.initiatives;
    
    updateStats(initiatives);
    renderInitiatives(data);
}

// Show page content
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }

    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = {
            'porta-fora': 'Painel da Estratégia - Porta para Fora',
            'porta-dentro': 'Painel da Estratégia - Porta para Dentro',
            'teoria-mudanca': 'Teoria da Mudança NCPI',
            'governanca': 'Governança',
            'sistematica': 'Sistemática de Monitoramento e Avaliação',
            'relatorios': 'Relatórios de Avaliação NCPI'
        };
        pageTitle.textContent = titles[pageId] || 'Painel da Estratégia';
    }

    // Load page specific data
    switch (pageId) {
        case 'porta-fora':
        case 'porta-dentro':
            loadDashboardData(pageId);
            break;
        case 'teoria-mudanca':
            renderTeoriaMudanca();
            break;
        case 'governanca':
            renderGovernanca();
            break;
        case 'sistematica':
            renderMonitoramento();
            break;
        case 'relatorios':
            renderRelatorios();
            break;
    }
}

// Setup navigation
function setupNavigation() {
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const navItems = document.querySelectorAll('.nav-item, .submenu-item');
    const dropdowns = document.querySelectorAll('.menu-dropdown');

    // Toggle sidebar
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // Handle menu item clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
            }
        });
    });

    // Handle dropdowns
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const submenu = dropdown.querySelector('.submenu');

        if (toggle && submenu) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                submenu.classList.toggle('active');
                toggle.classList.toggle('active');
            });
        }
    });
}

// Edit initiative
function editInitiative(id) {
    const data = loadInitialData();
    const initiative = [...data.portaFora.initiatives, ...data.portaDentro.initiatives]
        .find(i => i.id === id);

    if (!initiative) return;

    // Show edit modal
    const modal = document.getElementById('editInitiativeModal');
    if (modal) {
        const form = modal.querySelector('form');
        form.querySelector('#initiativeName').value = initiative.name;
        form.querySelector('#initiativeDescription').value = initiative.description;
        form.querySelector('#initiativeStatus').value = initiative.status;
        form.querySelector('#initiativeLeader').value = initiative.leader;

        modal.style.display = 'block';

        // Handle form submission
        form.onsubmit = (e) => {
            e.preventDefault();
            const updatedInitiative = {
                ...initiative,
                name: form.querySelector('#initiativeName').value,
                description: form.querySelector('#initiativeDescription').value,
                status: form.querySelector('#initiativeStatus').value,
                leader: form.querySelector('#initiativeLeader').value
            };

            // Update data
            if (data.portaFora.initiatives.find(i => i.id === id)) {
                data.portaFora.initiatives = data.portaFora.initiatives.map(i => 
                    i.id === id ? updatedInitiative : i
                );
            } else {
                data.portaDentro.initiatives = data.portaDentro.initiatives.map(i => 
                    i.id === id ? updatedInitiative : i
                );
            }

            localStorage.setItem('dashboardData', JSON.stringify(data));
            modal.style.display = 'none';
            showPage(document.querySelector('.page[style*="display: block"]').id);
        };
    }
}

// Delete initiative
function deleteInitiative(id) {
    if (!confirm('Tem certeza que deseja excluir esta iniciativa?')) return;

    const data = loadInitialData();
    if (data.portaFora.initiatives.find(i => i.id === id)) {
        data.portaFora.initiatives = data.portaFora.initiatives.filter(i => i.id !== id);
    } else {
        data.portaDentro.initiatives = data.portaDentro.initiatives.filter(i => i.id !== id);
    }

    localStorage.setItem('dashboardData', JSON.stringify(data));
    showPage(document.querySelector('.page[style*="display: block"]').id);
}

// Close modals
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await initDashboard(); // Inicializa o dashboard com os dados do JSON
});

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterInitiatives(searchTerm);
    });
}

function filterInitiatives(searchTerm) {
    const initiativeCards = document.querySelectorAll('.initiative-card');
    initiativeCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter functionality
function initializeFilters() {
    const periodSelect = document.getElementById('period');
    const filterButton = document.querySelector('.btn-filter');

    filterButton.addEventListener('click', () => {
        const selectedPeriod = periodSelect.value;
        applyFilters(selectedPeriod);
    });
}

function applyFilters(period) {
    // Implement period filtering logic here
    console.log(`Filtering by period: ${period}`);
}

// Update metrics display
function updateMetrics(data) {
    const metrics = document.querySelector('.metrics');
    metrics.innerHTML = `
        <div class="metric-card blue">
            <div class="metric-label">Iniciativas</div>
            <div class="metric-value">${data.iniciativas || 0}</div>
        </div>
        <div class="metric-card orange">
            <div class="metric-label">Resultados</div>
            <div class="metric-value">${data.resultados || 0}</div>
        </div>
        <div class="metric-card purple">
            <div class="metric-label">Metas</div>
            <div class="metric-value">${data.metas || 0}</div>
        </div>
    `;
}

// Export functionality
document.querySelector('.btn-export').addEventListener('click', () => {
    exportDashboard();
});

function exportDashboard() {
    // Implement export logic here
    console.log('Exporting dashboard data...');
    alert('Exportação iniciada. O arquivo será baixado em breve.');
}

// Handle responsive sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Update progress bars animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Call animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    animateProgressBars();
});

// Função para carregar os dados do Firebase
async function loadData() {
    try {
        // Primeiro tenta carregar do localStorage
        const localData = localStorage.getItem('dashboardData');
        if (localData) {
            return JSON.parse(localData);
        }
        
        // Se não houver dados no localStorage, carrega do Firebase
        const snapshot = await database.ref('/dashboardData').once('value');
        const data = snapshot.val();
        
        if (data) {
            // Salva os dados no localStorage para cache
            localStorage.setItem('dashboardData', JSON.stringify(data));
            return data;
        }
        
        // Se não houver dados no Firebase, carrega do arquivo JSON
        const response = await fetch('data_ncpi.json');
        const jsonData = await response.json();
        
        // Salva os dados iniciais no Firebase
        await database.ref('/dashboardData').set(jsonData);
        
        // Salva os dados no localStorage para cache
        localStorage.setItem('dashboardData', JSON.stringify(jsonData));
        
        return jsonData;
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        return null;
    }
}

// Função para calcular métricas
function calculateMetrics(data) {
    const iniciativas = data.Iniciativas.filter(i => i.Porta === "Porta para fora").length;
    
    let totalResultados = 0;
    let totalMetas = 0;
    let metasPorStatus = {
        Concluída: 0,
        Satisfatório: 0,
        Alerta: 0,
        Crítico: 0,
        "Não monitorado": 0
    };

    data.Iniciativas.filter(i => i.Porta === "Porta para fora").forEach(iniciativa => {
        if (iniciativa.Resultados) {
            totalResultados += iniciativa.Resultados.length;
            
            iniciativa.Resultados.forEach(resultado => {
                if (resultado.Metas) {
                    totalMetas += resultado.Metas.length;
                    
                    resultado.Metas.forEach(meta => {
                        switch (meta["FAROL NO TRIMESTRE"]) {
                            case "Concluída":
                                metasPorStatus.Concluída++;
                                break;
                            case "Satisfatório":
                                metasPorStatus.Satisfatório++;
                                break;
                            case "Alerta":
                                metasPorStatus.Alerta++;
                                break;
                            case "Crítico":
                                metasPorStatus.Crítico++;
                                break;
                            case "Não monitorado":
                                metasPorStatus["Não monitorado"]++;
                                break;
                        }
                    });
                }
            });
        }
    });

    return {
        iniciativas,
        totalResultados,
        totalMetas,
        metasPorStatus
    };
}

// Função para atualizar os cards de métricas
function updateMetricCards(metrics) {
    document.querySelector('.metric-card:nth-child(1) .metric-value').textContent = metrics.iniciativas;
    document.querySelector('.metric-card:nth-child(2) .metric-value').textContent = metrics.totalResultados;
    document.querySelector('.metric-card:nth-child(3) .metric-value').textContent = metrics.totalMetas;
}

// Função para atualizar as barras de status
function updateStatusBars(metasPorStatus) {
    const statusBars = document.querySelector('.status-bars');
    statusBars.innerHTML = `
        <div class="status-cards">
            <div class="status-card green">
                <div class="status-card-value">${metasPorStatus.Concluída || 0}</div>
                <div class="status-card-label">Concluídas</div>
            </div>
            <div class="status-card blue">
                <div class="status-card-value">${metasPorStatus.Satisfatório || 0}</div>
                <div class="status-card-label">Satisfatório</div>
            </div>
            <div class="status-card yellow">
                <div class="status-card-value">${metasPorStatus.Alerta || 0}</div>
                <div class="status-card-label">Alerta</div>
            </div>
            <div class="status-card red">
                <div class="status-card-value">${metasPorStatus.Crítico || 0}</div>
                <div class="status-card-label">Crítico</div>
            </div>
            <div class="status-card gray">
                <div class="status-card-value">${metasPorStatus['Não monitorado'] || 0}</div>
                <div class="status-card-label">Não monitorados</div>
            </div>
        </div>
    `;
}

// Função para renderizar as iniciativas
function renderInitiatives(data) {
    const initiativesSection = document.querySelector('.initiatives');
    const initiativesContainer = document.createElement('div');
    initiativesContainer.className = 'initiatives-container';

    data.Iniciativas.filter(i => i.Porta === "Porta para fora").forEach(iniciativa => {
        const card = createInitiativeCard(iniciativa);
        initiativesContainer.appendChild(card);
    });

    // Limpar conteúdo anterior e adicionar novos cards
    const existingContainer = initiativesSection.querySelector('.initiatives-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    initiativesSection.appendChild(initiativesContainer);
}

function createInitiativeCard(iniciativa) {
    const card = document.createElement('div');
    card.className = 'initiative-card';
    
    // Calcular contagem de metas por status para toda a iniciativa
    const metasPorStatus = {
        Concluída: 0,
        Satisfatório: 0,
        Alerta: 0,
        Crítico: 0,
        "Não monitorado": 0
    };
    
    let totalMetas = 0;
    let metasConcluidas = 0;
    let metasSatisfatorias = 0;
    
    // Somar todas as metas de todos os resultados
    iniciativa.Resultados?.forEach(resultado => {
        resultado.Metas?.forEach(meta => {
            totalMetas++;
            const status = meta["FAROL NO TRIMESTRE"];
            if (status in metasPorStatus) {
                metasPorStatus[status]++;
            }
            if (status === "Concluída") {
                metasConcluidas++;
            } else if (status === "Satisfatório") {
                metasSatisfatorias++;
            }
        });
    });
    
    // Calcular progresso considerando metas concluídas como 100% e satisfatórias como 70%
    const progressPercentage = totalMetas > 0 ? 
        ((metasConcluidas * 100) + (metasSatisfatorias * 70)) / (totalMetas * 100) * 100 : 0;
    
    // Determinar a cor da barra de progresso
    let progressColor = 'var(--gray)';
    if (progressPercentage >= 75) {
        progressColor = 'var(--green)';
    } else if (progressPercentage >= 50) {
        progressColor = 'var(--blue)';
    } else if (progressPercentage >= 25) {
        progressColor = 'var(--yellow)';
    } else if (progressPercentage > 0) {
        progressColor = 'var(--red)';
    }
    
    // Criar as tags de status apenas para os que têm contagem > 0, na ordem correta
    const statusOrder = ['Concluída', 'Satisfatório', 'Alerta', 'Crítico', 'Não monitorado'];
    const statusTags = statusOrder
        .filter(status => metasPorStatus[status] > 0)
        .map(status => {
            const colorClass = getStatusColor(status);
            return `
                <div class="status-tag ${colorClass}">
                    <span class="icon"></span>
                    ${status}
                    <span class="count">${metasPorStatus[status]}</span>
                </div>
            `;
        })
        .join('');
    
    card.innerHTML = `
        <div class="initiative-header">
            <div class="initiative-header-content">
                <div class="initiative-title">
                    <div class="initiative-title-content">
                        <h3>${iniciativa.Iniciativas}</h3>
                        <p title="${iniciativa["O que é"]}">${iniciativa["O que é"]}</p>
                    </div>
                    <div class="progress-section">
                        <div class="progress-info">
                            <span>Alcance</span>
                            <span class="progress-value">${progressPercentage.toFixed(0)}%</span>
                        </div>
                        <div class="progress-bar-wrapper">
                            <div class="progress" style="width: ${progressPercentage}%; background: ${progressColor};"></div>
                        </div>
                    </div>
                </div>
                <div class="initiative-metrics">
                    <div class="status-tags">
                        ${statusTags}
                    </div>
                </div>
            </div>
            <svg class="chevron-icon" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5H7z" fill="currentColor"/>
            </svg>
        </div>
        <div class="initiative-content">
            <div class="initiative-details">
                <div class="detail-section">
                    <h4>Descrição</h4>
                    <p>${iniciativa.Descrição}</p>
                </div>
                ${renderResultados(iniciativa.Resultados)}
            </div>
        </div>
    `;
    
    // Adicionar evento de clique para expandir/recolher
    const header = card.querySelector('.initiative-header');
    header.addEventListener('click', () => {
        card.classList.toggle('expanded');
    });
    
    return card;
}

function renderResultados(resultados) {
    if (!resultados) return '';
    
    return resultados.map((resultado, index) => `
        <div class="detail-section">
            <div class="resultado-header" onclick="toggleResultado(this)">
                <h4>Resultado ${index + 1}</h4>
                <div class="resultado-title">
                    <h5>${resultado.Resultado}</h5>
                    <svg class="chevron-icon" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
            <div class="resultado-content" style="display: none;">
                <div class="result-item">
                    <table class="goals-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Semestre</th>
                                <th>Meta</th>
                                <th>Responsável</th>
                                <th>Observações</th>
                                <th>Encaminhamento</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${renderMetas(resultado.Metas)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `).join('');
}

// Atualizar função para toggle do resultado
function toggleResultado(header) {
    const content = header.nextElementSibling;
    header.classList.toggle('expanded');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        // Animar a abertura
        content.style.opacity = '0';
        setTimeout(() => {
            content.style.opacity = '1';
        }, 10);
    } else {
        // Animar o fechamento
        content.style.opacity = '0';
        setTimeout(() => {
            content.style.display = 'none';
        }, 300);
    }
}

function renderMetas(metas) {
    if (!metas) return '';
    
    return metas.map(meta => `
        <tr>
            <td>
                <div class="status-dot ${getStatusColor(meta["FAROL NO TRIMESTRE"])}" 
                     title="${meta["FAROL NO TRIMESTRE"]}">
                </div>
            </td>
            <td>${meta.Semestre}</td>
            <td>${meta.Meta}</td>
            <td>${meta.LÍDER}</td>
            <td>${meta.OBSERVAÇÕES || ''}</td>
            <td>${meta.ENCAMINHAMENTO || ''}</td>
            <td>
                <button class="edit-button" onclick="editMeta(event, this)" data-meta='${JSON.stringify(meta)}'>
                    <svg viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusColor(status) {
    const statusColors = {
        'Concluída': 'green',
        'Satisfatório': 'blue',
        'Alerta': 'yellow',
        'Crítico': 'red',
        'Não monitorado': 'gray'
    };
    return statusColors[status] || 'gray';
}

// Função para editar meta
function editMeta(event, button) {
    event.stopPropagation();
    const meta = JSON.parse(button.dataset.meta);
    
    // Criar e mostrar modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Editar Meta</h3>
                <button class="modal-close" onclick="closeModal(this)">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Status</label>
                    <select id="metaStatus">
                        <option value="Concluída" ${meta["FAROL NO TRIMESTRE"] === "Concluída" ? "selected" : ""}>Concluída</option>
                        <option value="Satisfatório" ${meta["FAROL NO TRIMESTRE"] === "Satisfatório" ? "selected" : ""}>Satisfatório</option>
                        <option value="Alerta" ${meta["FAROL NO TRIMESTRE"] === "Alerta" ? "selected" : ""}>Alerta</option>
                        <option value="Crítico" ${meta["FAROL NO TRIMESTRE"] === "Crítico" ? "selected" : ""}>Crítico</option>
                        <option value="Não monitorado" ${meta["FAROL NO TRIMESTRE"] === "Não monitorado" ? "selected" : ""}>Não monitorado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Responsável</label>
                    <input type="text" id="metaResponsavel" value="${meta.LÍDER}">
                </div>
                <div class="form-group">
                    <label>Semestre</label>
                    <input type="text" id="metaSemestre" value="${meta.Semestre}">
                </div>
                <div class="form-group">
                    <label>Observações</label>
                    <textarea id="metaObservacoes" rows="3">${meta.OBSERVAÇÕES || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Encaminhamento</label>
                    <textarea id="metaEncaminhamento" rows="3">${meta.ENCAMINHAMENTO || ''}</textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal(this)">Cancelar</button>
                <button class="btn btn-primary" onclick="saveMeta(this)">Salvar</button>
            </div>
        </div>
    `;
    
    // Adicionar o botão de edição ao modal para referência
    const editButton = button.cloneNode(true);
    modal.querySelector('.modal-body').appendChild(editButton);
    editButton.style.display = 'none';
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal(button) {
    const modal = button.closest('.modal');
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
}

// Função para salvar meta
async function saveMeta(button) {
    const modal = button.closest('.modal');
    const status = modal.querySelector('#metaStatus').value;
    const responsavel = modal.querySelector('#metaResponsavel').value;
    const semestre = modal.querySelector('#metaSemestre').value;
    const observacoes = modal.querySelector('#metaObservacoes').value;
    const encaminhamento = modal.querySelector('#metaEncaminhamento').value;
    
    // Get the meta data from the edit button that opened the modal
    const editButton = modal.querySelector('.edit-button[data-meta]');
    const metaData = JSON.parse(editButton.dataset.meta);
    
    try {
        // Load current data from Firebase
        const snapshot = await database.ref('/dashboardData').once('value');
        let data = snapshot.val();
        
        // Find and update the specific meta in the data structure
        let metaUpdated = false;
        data.Iniciativas.forEach(iniciativa => {
            if (iniciativa.Resultados) {
                iniciativa.Resultados.forEach(resultado => {
                    if (resultado.Metas) {
                        resultado.Metas.forEach(meta => {
                            // Match the meta using multiple properties to ensure uniqueness
                            if (meta.Meta === metaData.Meta && 
                                meta.Semestre === metaData.Semestre && 
                                meta.LÍDER === metaData.LÍDER) {
                                // Update the meta with new values
                                meta["FAROL NO TRIMESTRE"] = status;
                                meta.LÍDER = responsavel;
                                meta.Semestre = semestre;
                                meta.OBSERVAÇÕES = observacoes;
                                meta.ENCAMINHAMENTO = encaminhamento;
                                metaUpdated = true;
                            }
                        });
                    }
                });
            }
        });

        if (!metaUpdated) {
            throw new Error('Meta não encontrada para atualização');
        }

        // Save to Firebase
        await database.ref('/dashboardData').set(data);
        
        // Save to localStorage as backup
        localStorage.setItem('dashboardData', JSON.stringify(data));
        
        // Update the table row
        const row = editButton.closest('tr');
        if (row) {
            const statusDot = row.querySelector('.status-dot');
            statusDot.className = `status-dot ${getStatusColor(status)}`;
            statusDot.title = status;
            row.cells[1].textContent = semestre;
            row.cells[3].textContent = responsavel;
            row.cells[4].textContent = observacoes;
            row.cells[5].textContent = encaminhamento;
            
            // Update the meta data in the edit button
            const updatedMeta = {
                ...metaData, 
                "FAROL NO TRIMESTRE": status, 
                LÍDER: responsavel, 
                Semestre: semestre,
                OBSERVAÇÕES: observacoes,
                ENCAMINHAMENTO: encaminhamento
            };
            editButton.dataset.meta = JSON.stringify(updatedMeta);
        }

        // Atualizar apenas as métricas do card específico
        const card = row.closest('.initiative-card');
        if (card) {
            const progressSection = card.querySelector('.progress-section');
            const progressValue = progressSection.querySelector('.progress-value');
            const progressBar = progressSection.querySelector('.progress');
            
            // Recalcular o progresso do card
            const metas = card.querySelectorAll('tr');
            let totalMetas = 0;
            let metasConcluidas = 0;
            let metasSatisfatorias = 0;
            
            metas.forEach(metaRow => {
                const statusDot = metaRow.querySelector('.status-dot');
                const status = statusDot.title;
                totalMetas++;
                
                if (status === "Concluída") {
                    metasConcluidas++;
                } else if (status === "Satisfatório") {
                    metasSatisfatorias++;
                }
            });
            
            const progressPercentage = totalMetas > 0 ? 
                ((metasConcluidas * 100) + (metasSatisfatorias * 70)) / (totalMetas * 100) * 100 : 0;
            
            progressValue.textContent = `${progressPercentage.toFixed(0)}%`;
            progressBar.style.width = `${progressPercentage}%`;
            
            // Atualizar a cor da barra de progresso
            let progressColor = 'var(--gray)';
            if (progressPercentage >= 75) {
                progressColor = 'var(--green)';
            } else if (progressPercentage >= 50) {
                progressColor = 'var(--blue)';
            } else if (progressPercentage >= 25) {
                progressColor = 'var(--yellow)';
            } else if (progressPercentage > 0) {
                progressColor = 'var(--red)';
            }
            progressBar.style.background = progressColor;
        }
        
        closeModal(button);
    } catch (error) {
        console.error('Erro ao salvar as alterações:', error);
        alert('Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.');
    }
}

// Inicialização
async function initDashboard() {
    try {
        // Carrega os dados do Firebase
        const data = await loadData();
        
        if (data) {
            // Atualiza a interface com os dados
            const metrics = calculateMetrics(data);
            updateMetricCards(metrics);
            updateStatusBars(metrics.metasPorStatus);
            renderInitiatives(data);
        }
    } catch (error) {
        console.error('Erro ao inicializar o dashboard:', error);
        alert('Erro ao carregar os dados. Por favor, recarregue a página.');
    }
}

// Adiciona um evento para limpar o localStorage quando necessário
document.addEventListener('DOMContentLoaded', () => {
    // Descomente a linha abaixo para limpar o localStorage e recarregar os dados do Firebase
    // localStorage.removeItem('dashboardData');
    
    initDashboard();
});
