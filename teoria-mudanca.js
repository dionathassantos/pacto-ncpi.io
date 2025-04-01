// Theory of Change Data
const teoriaMudancaData = {
    impactos: [
        {
            id: 1,
            name: "Impacto 1",
            description: "Descrição do impacto 1",
            ods: [1, 2, 3]
        }
    ],
    resultados: [
        {
            id: 1,
            name: "Resultado 1",
            description: "Descrição do resultado 1",
            impactos: [1]
        }
    ],
    produtos: [
        {
            id: 1,
            name: "Produto 1",
            description: "Descrição do produto 1",
            resultados: [1]
        }
    ],
    atividades: [
        {
            id: 1,
            name: "Atividade 1",
            description: "Descrição da atividade 1",
            produtos: [1]
        }
    ],
    recursos: [
        {
            id: 1,
            name: "Recurso 1",
            description: "Descrição do recurso 1",
            atividades: [1]
        }
    ]
};

// Load teoria da mudança data
function loadTeoriaMudancaData() {
    const data = JSON.parse(localStorage.getItem('teoriaMudancaData')) || teoriaMudancaData;
    localStorage.setItem('teoriaMudancaData', JSON.stringify(data));
    return data;
}

// Render teoria da mudança
function renderTeoriaMudanca() {
    const data = loadTeoriaMudancaData();
    const container = document.querySelector('.teoria-mudanca-grid');

    const sections = [
        {
            title: 'Impactos',
            items: data.impactos,
            icon: 'fas fa-bullseye'
        },
        {
            title: 'Resultados',
            items: data.resultados,
            icon: 'fas fa-chart-line'
        },
        {
            title: 'Produtos',
            items: data.produtos,
            icon: 'fas fa-box'
        },
        {
            title: 'Atividades',
            items: data.atividades,
            icon: 'fas fa-tasks'
        },
        {
            title: 'Recursos',
            items: data.recursos,
            icon: 'fas fa-tools'
        }
    ];

    const sectionsHTML = sections.map(section => `
        <div class="section">
            <div class="section-label">
                <i class="${section.icon}"></i>
                ${section.title}
            </div>
            <div class="section-content">
                ${renderSectionItems(section.items)}
            </div>
        </div>
    `).join('');

    container.innerHTML = sectionsHTML;
}

// Render section items
function renderSectionItems(items) {
    return items.map(item => `
        <div class="box">
            <p>${item.name}</p>
            <small>${item.description}</small>
            ${renderODSIcons(item.ods)}
        </div>
    `).join('');
}

// Render ODS icons
function renderODSIcons(ods) {
    if (!ods) return '';
    
    return `
        <div class="ods-icons">
            ${ods.map(odsNumber => `
                <img src="assets/ods/${odsNumber}.png" alt="ODS ${odsNumber}">
            `).join('')}
        </div>
    `;
}

// Edit item
function editItem(type, id) {
    const data = loadTeoriaMudancaData();
    const item = data[type].find(i => i.id === id);
    
    if (!item) return;

    const modal = document.getElementById('editItemModal');
    const form = modal.querySelector('form');

    // Populate form
    form.querySelector('[name="name"]').value = item.name;
    form.querySelector('[name="description"]').value = item.description;
    if (item.ods) {
        form.querySelector('[name="ods"]').value = item.ods.join(',');
    }

    // Show modal
    modal.style.display = 'block';

    // Handle form submission
    form.onsubmit = (e) => {
        e.preventDefault();
        
        // Update item
        item.name = form.querySelector('[name="name"]').value;
        item.description = form.querySelector('[name="description"]').value;
        if (item.ods) {
            item.ods = form.querySelector('[name="ods"]').value
                .split(',')
                .map(n => parseInt(n.trim()))
                .filter(n => !isNaN(n));
        }

        // Save data
        localStorage.setItem('teoriaMudancaData', JSON.stringify(data));

        // Close modal and refresh
        modal.style.display = 'none';
        renderTeoriaMudanca();
    };
}

// Delete item
function deleteItem(type, id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    const data = loadTeoriaMudancaData();
    data[type] = data[type].filter(i => i.id !== id);
    localStorage.setItem('teoriaMudancaData', JSON.stringify(data));
    renderTeoriaMudanca();
}

// Add new item
function addItem(type) {
    const data = loadTeoriaMudancaData();
    const newItem = {
        id: Math.max(...data[type].map(i => i.id), 0) + 1,
        name: 'Novo Item',
        description: 'Descrição do novo item',
        ods: []
    };

    data[type].push(newItem);
    localStorage.setItem('teoriaMudancaData', JSON.stringify(data));
    renderTeoriaMudanca();
}

// Initialize teoria da mudança
document.addEventListener('DOMContentLoaded', () => {
    renderTeoriaMudanca();
});