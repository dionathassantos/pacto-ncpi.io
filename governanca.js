// Governance Data
const governancaData = {
    comites: [
        {
            id: 1,
            name: "Comitê Executivo",
            description: "Comitê responsável pela tomada de decisões estratégicas",
            membros: [
                {
                    id: 1,
                    name: "João Silva",
                    role: "Presidente",
                    organization: "Organização 1"
                }
            ],
            responsabilidades: [
                "Definir estratégias e prioridades",
                "Aprovar orçamentos",
                "Monitorar resultados"
            ]
        }
    ],
    responsabilidades: {
        executivo: [
            "Coordenação geral do projeto",
            "Gestão de recursos",
            "Comunicação com stakeholders"
        ],
        tecnico: [
            "Desenvolvimento de metodologias",
            "Análise de dados",
            "Produção de relatórios"
        ],
        operacional: [
            "Implementação de atividades",
            "Coleta de dados",
            "Gestão de processos"
        ]
    },
    equipe: {
        backbone: {
            name: "Equipe Backbone",
            description: "Equipe responsável pela coordenação e suporte",
            membros: [
                {
                    id: 1,
                    name: "Maria Santos",
                    role: "Coordenadora",
                    organization: "Organização 2"
                }
            ]
        },
        core: {
            name: "Equipe Core",
            description: "Equipe principal de implementação",
            membros: [
                {
                    id: 1,
                    name: "Pedro Oliveira",
                    role: "Gestor",
                    organization: "Organização 3"
                }
            ]
        },
        suporte: {
            name: "Equipe de Suporte",
            description: "Equipe de apoio técnico e administrativo",
            membros: [
                {
                    id: 1,
                    name: "Ana Costa",
                    role: "Assistente",
                    organization: "Organização 4"
                }
            ]
        }
    }
};

// Load governance data
function loadGovernancaData() {
    const data = JSON.parse(localStorage.getItem('governancaData')) || governancaData;
    localStorage.setItem('governancaData', JSON.stringify(data));
    return data;
}

// Render governance structure
function renderGovernanca() {
    const data = loadGovernancaData();
    
    // Render committees
    renderCommittees(data.comites);
    
    // Render responsibilities
    renderResponsibilities(data.responsabilidades);
    
    // Render team structure
    renderTeamStructure(data.equipe);
}

// Render committees
function renderCommittees(committees) {
    const container = document.querySelector('.committees-table');
    
    const committeesHTML = committees.map(committee => `
        <div class="committee-row">
            <div class="committee-header">
                <h4>${committee.name}</h4>
            </div>
            <div class="committee-content">
                <div class="committee-column">
                    <h4>Membros</h4>
                    <ul>
                        ${committee.membros.map(membro => `
                            <li>
                                <strong>${membro.name}</strong>
                                <br>
                                ${membro.role} - ${membro.organization}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="committee-column">
                    <h4>Responsabilidades</h4>
                    <ul>
                        ${committee.responsabilidades.map(resp => `
                            <li>${resp}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = committeesHTML;
}

// Render responsibilities
function renderResponsibilities(responsibilities) {
    const container = document.querySelector('.resp-grid');
    
    const responsibilitiesHTML = Object.entries(responsibilities).map(([key, items]) => `
        <div class="resp-column">
            <h4>${getResponsibilityTitle(key)}</h4>
            <ol>
                ${items.map(item => `
                    <li>${item}</li>
                `).join('')}
            </ol>
        </div>
    `).join('');
    
    container.innerHTML = responsibilitiesHTML;
}

// Get responsibility title
function getResponsibilityTitle(key) {
    const titles = {
        executivo: 'Executivo',
        tecnico: 'Técnico',
        operacional: 'Operacional'
    };
    return titles[key] || key;
}

// Render team structure
function renderTeamStructure(team) {
    const container = document.querySelector('.team-diagram');
    
    const teamHTML = `
        <div class="backbone-section">
            <h4>${team.backbone.name}</h4>
            <div class="team-meetings">
                <div class="meeting-circle">
                    <i class="fas fa-users"></i>
                    <span>${team.backbone.membros.length} membros</span>
                </div>
                <div class="connector-line"></div>
                <div class="meeting-circle">
                    <i class="fas fa-calendar"></i>
                    <span>Reuniões mensais</span>
                </div>
                <div class="connector-line"></div>
                <div class="meeting-circle">
                    <i class="fas fa-chart-bar"></i>
                    <span>Monitoramento</span>
                </div>
            </div>
        </div>
        <div class="team-core">
            <div class="team-box">
                <h4>${team.core.name}</h4>
                <p>${team.core.description}</p>
                <ul>
                    ${team.core.membros.map(membro => `
                        <li>
                            <strong>${membro.name}</strong>
                            <br>
                            ${membro.role} - ${membro.organization}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        <div class="support-section">
            <h4>${team.suporte.name}</h4>
            <div class="support-boxes">
                ${team.suporte.membros.map(membro => `
                    <div class="support-box">
                        <strong>${membro.name}</strong>
                        <small>${membro.role}</small>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = teamHTML;
}

// Edit committee
function editCommittee(id) {
    const data = loadGovernancaData();
    const committee = data.comites.find(c => c.id === id);
    
    if (!committee) return;

    const modal = document.getElementById('editCommitteeModal');
    const form = modal.querySelector('form');

    // Populate form
    form.querySelector('[name="name"]').value = committee.name;
    form.querySelector('[name="description"]').value = committee.description;
    form.querySelector('[name="responsabilidades"]').value = committee.responsabilidades.join('\n');

    // Show modal
    modal.style.display = 'block';

    // Handle form submission
    form.onsubmit = (e) => {
        e.preventDefault();
        
        // Update committee
        committee.name = form.querySelector('[name="name"]').value;
        committee.description = form.querySelector('[name="description"]').value;
        committee.responsabilidades = form.querySelector('[name="responsabilidades"]').value
            .split('\n')
            .map(r => r.trim())
            .filter(r => r);

        // Save data
        localStorage.setItem('governancaData', JSON.stringify(data));

        // Close modal and refresh
        modal.style.display = 'none';
        renderGovernanca();
    };
}

// Delete committee
function deleteCommittee(id) {
    if (!confirm('Tem certeza que deseja excluir este comitê?')) return;

    const data = loadGovernancaData();
    data.comites = data.comites.filter(c => c.id !== id);
    localStorage.setItem('governancaData', JSON.stringify(data));
    renderGovernanca();
}

// Add committee member
function addCommitteeMember(committeeId) {
    const data = loadGovernancaData();
    const committee = data.comites.find(c => c.id === committeeId);
    
    if (!committee) return;

    const modal = document.getElementById('addMemberModal');
    const form = modal.querySelector('form');

    // Show modal
    modal.style.display = 'block';

    // Handle form submission
    form.onsubmit = (e) => {
        e.preventDefault();
        
        // Add new member
        const newMember = {
            id: Math.max(...committee.membros.map(m => m.id), 0) + 1,
            name: form.querySelector('[name="name"]').value,
            role: form.querySelector('[name="role"]').value,
            organization: form.querySelector('[name="organization"]').value
        };

        committee.membros.push(newMember);
        localStorage.setItem('governancaData', JSON.stringify(data));

        // Close modal and refresh
        modal.style.display = 'none';
        renderGovernanca();
    };
}

// Initialize governance
document.addEventListener('DOMContentLoaded', () => {
    renderGovernanca();
});