/**
 * PetLembra - SPA (Single Page Application)
 * Sistema completo de gerenciamento para pets com Swagger integrado
 */

console.log('🚀 PetLembra SPA iniciado!');

// ==================== CONFIGURAÇÃO ====================
const API_BASE = '/api';
let swaggerCarregado = false;

// ==================== FUNÇÕES DA API ====================
async function fetchAPI(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.erro || `HTTP ${response.status}`);
    }
    return response.json();
}

async function getClientes() {
    return fetchAPI('/clientes');
}

async function getPets() {
    return fetchAPI('/pets');
}

async function getAgendamentos() {
    return fetchAPI('/agendamentos');
}

async function getDashboard() {
    return fetchAPI('/dashboard');
}

async function criarCliente(dados) {
    return fetchAPI('/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
}

async function deletarCliente(id) {
    return fetchAPI(`/clientes/${id}`, { method: 'DELETE' });
}

async function atualizarCliente(id, dados) {
    return fetchAPI(`/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
}

async function criarPet(dados) {
    return fetchAPI('/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
}

async function deletarPet(id) {
    return fetchAPI(`/pets/${id}`, { method: 'DELETE' });
}

async function criarAgendamento(dados) {
    return fetchAPI('/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
}

async function deletarAgendamento(id) {
    return fetchAPI(`/agendamentos/${id}`, { method: 'DELETE' });
}

async function alterarStatusAgendamento(id, status) {
    return fetchAPI(`/agendamentos/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
}

// ==================== RENDERIZADORES ====================

function renderDashboard(data) {
    const { total_clientes = 0, total_pets = 0, agendamentos_hoje = [] } = data;
    
    let agendamentosHtml = '';
    if (agendamentos_hoje.length > 0) {
        agendamentosHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Pet</th>
                        <th>Cliente</th>
                        <th>Serviço</th>
                        <th>Data</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${agendamentos_hoje.map(ag => `
                        <tr>
                            <td><strong>${ag.pet_nome || 'N/A'}</strong></td>
                            <td>${ag.cliente_nome || 'N/A'}</td>
                            <td>${ag.tipo || 'N/A'}</td>
                            <td>${ag.data || 'N/A'}</td>
                            <td><span class="status-badge ${ag.status || 'agendado'}">${ag.status || 'agendado'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        agendamentosHtml = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <p>Nenhum agendamento para hoje! 🎉</p>
            </div>
        `;
    }
    
    return `
        <div class="page-dashboard">
            <h2>📊 Dashboard</h2>
            
            <div class="cards-grid">
                <div class="card">
                    <div class="card-icon"><i class="fas fa-users"></i></div>
                    <div class="card-content">
                        <h3>Clientes</h3>
                        <div class="card-number">${total_clientes}</div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-icon"><i class="fas fa-paw"></i></div>
                    <div class="card-content">
                        <h3>Pets</h3>
                        <div class="card-number">${total_pets}</div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-icon"><i class="fas fa-calendar-day"></i></div>
                    <div class="card-content">
                        <h3>Agendamentos Hoje</h3>
                        <div class="card-number">${agendamentos_hoje.length}</div>
                    </div>
                </div>
            </div>
            
            <div class="agendamentos-section">
                <h3>📅 Agendamentos de Hoje</h3>
                ${agendamentosHtml}
            </div>
        </div>
    `;
}

function renderClientes(clientes) {
    return `
        <div class="page-crud">
            <h2>👥 Gerenciar Clientes</h2>
            
            <div class="form-section">
                <h3>➕ Novo Cliente</h3>
                <form id="form-cliente">
                    <div class="form-row">
                        <input type="text" id="cliente-nome" placeholder="Nome completo" required>
                        <input type="text" id="cliente-telefone" placeholder="Telefone (apenas números)" required oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                    <div class="form-row">
                        <input type="email" id="cliente-email" placeholder="Email">
                        <input type="text" id="cliente-endereco" placeholder="Endereço">
                    </div>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-plus"></i> Cadastrar Cliente
                    </button>
                </form>
            </div>
            
            <div class="list-section">
                <h3>📋 Clientes Cadastrados (${clientes.length})</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Email</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${clientes.map(c => `
                                <tr>
                                    <td>${c.id}</td>
                                    <td><strong>${c.nome}</strong></td>
                                    <td>${c.telefone}</td>
                                    <td>${c.email || '-'}</td>
                                    <td>
                                        <button onclick="editarCliente(${c.id})" class="btn-edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="deletarCliente(${c.id})" class="btn-delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderPets(pets, clientes) {
    return `
        <div class="page-crud">
            <h2>🐕 Gerenciar Pets</h2>
            
            <div class="form-section">
                <h3>➕ Novo Pet</h3>
                <form id="form-pet">
                    <div class="form-row">
                        <input type="text" id="pet-nome" placeholder="Nome do pet" required>
                        <select id="pet-especie" required>
                            <option value="">Espécie</option>
                            <option value="cachorro">Cachorro</option>
                            <option value="gato">Gato</option>
                            <option value="ave">Ave</option>
                            <option value="roedor">Roedor</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <input type="text" id="pet-raca" placeholder="Raça">
                        <input type="number" id="pet-idade" placeholder="Idade (anos)">
                    </div>
                    <div class="form-row">
                        <textarea id="pet-observacoes" placeholder="Observações (medicações, alergias, etc)"></textarea>
                    </div>
                    <div class="form-row">
                        <select id="pet-cliente" required>
                            <option value="">Selecione o dono</option>
                            ${clientes.map(c => `
                                <option value="${c.id}">${c.nome} - ${c.telefone}</option>
                            `).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-plus"></i> Cadastrar Pet
                    </button>
                </form>
            </div>
            
            <div class="list-section">
                <h3>📋 Pets Cadastrados (${pets.length})</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Espécie</th>
                                <th>Raça</th>
                                <th>Idade</th>
                                <th>Dono</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pets.map(p => `
                                <tr>
                                    <td><strong>${p.nome}</strong></td>
                                    <td>${p.especie}</td>
                                    <td>${p.raca || '-'}</td>
                                    <td>${p.idade || '-'}</td>
                                    <td>${p.dono_nome}</td>
                                    <td>
                                        <button onclick="deletarPet(${p.id})" class="btn-delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function renderAgendamentos(agendamentos, pets, statusFilter = '', dataFilter = '') {
    return `
        <div class="page-crud">
            <h2>📅 Gerenciar Agendamentos</h2>
            
            <div class="form-section">
                <h3>➕ Novo Agendamento</h3>
                <form id="form-agendamento">
                    <div class="form-row">
                        <select id="agendamento-pet" required>
                            <option value="">Selecione o pet</option>
                            ${pets.map(p => `
                                <option value="${p.id}">${p.nome} (${p.dono_nome})</option>
                            `).join('')}
                        </select>
                        <input type="date" id="agendamento-data" required>
                    </div>
                    <div class="form-row">
                        <select id="agendamento-tipo" required>
                            <option value="">Serviço</option>
                            <option value="banho">Banho</option>
                            <option value="tosa">Tosa</option>
                            <option value="consulta">Consulta</option>
                            <option value="vacina">Vacina</option>
                            <option value="banho e tosa">Banho e Tosa</option>
                            <option value="outro">Outro</option>
                        </select>
                        <input type="number" id="agendamento-valor" step="0.01" placeholder="Valor (R$)">
                    </div>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-plus"></i> Agendar
                    </button>
                </form>
            </div>
            
            <div class="list-section">
                <h3>📋 Agendamentos (${agendamentos.length})</h3>
                
                <!-- Filtros -->
                <div class="filters-bar">
                    <div class="filter-group">
                        <a href="#" onclick="navigate('agendamentos', {})" class="filter-btn ${!statusFilter ? 'active' : ''}">
                            <i class="fas fa-list"></i> Todos
                        </a>
                        <a href="#" onclick="navigate('agendamentos', {status:'agendado'})" class="filter-btn ${statusFilter === 'agendado' ? 'active' : ''}">
                            <i class="fas fa-clock"></i> Agendados
                        </a>
                        <a href="#" onclick="navigate('agendamentos', {status:'concluido'})" class="filter-btn ${statusFilter === 'concluido' ? 'active' : ''}">
                            <i class="fas fa-check-circle"></i> Concluídos
                        </a>
                        <a href="#" onclick="navigate('agendamentos', {status:'cancelado'})" class="filter-btn ${statusFilter === 'cancelado' ? 'active' : ''}">
                            <i class="fas fa-times-circle"></i> Cancelados
                        </a>
                    </div>
                    
                    <div class="filter-data">
                        <form id="form-filtro-data" onsubmit="event.preventDefault(); filtrarPorData();">
                            <input type="date" id="filtro-data" value="${dataFilter}">
                            <button type="submit" class="btn-secondary">
                                <i class="fas fa-search"></i> Filtrar
                            </button>
                            ${dataFilter ? `<button onclick="navigate('agendamentos', {})" class="btn-danger"><i class="fas fa-times"></i> Limpar</button>` : ''}
                        </form>
                    </div>
                </div>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Pet</th>
                                <th>Cliente</th>
                                <th>Serviço</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${agendamentos.map(a => `
                                <tr>
                                    <td>${a.data}</td>
                                    <td><strong>${a.pet_nome}</strong></td>
                                    <td>${a.cliente_nome}</td>
                                    <td>${a.tipo}</td>
                                    <td>R$ ${a.valor || '0'}</td>
                                    <td>
                                        <select onchange="alterarStatusAgendamento(${a.id}, this.value)" class="status-select">
                                            <option value="agendado" ${a.status === 'agendado' ? 'selected' : ''}>Agendado</option>
                                            <option value="concluido" ${a.status === 'concluido' ? 'selected' : ''}>Concluído</option>
                                            <option value="cancelado" ${a.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onclick="deletarAgendamento(${a.id})" class="btn-delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// ==================== RENDERIZADOR DO SWAGGER ====================
function renderSwagger() {
    return `
        <div class="page-swagger">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                <h2>📚 Documentação da API</h2>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button onclick="carregarSwagger()" class="btn-primary" id="btn-carregar-swagger">
                        <i class="fas fa-sync"></i> Carregar Documentação
                    </button>
                    <a href="/static/swagger.json" target="_blank" class="btn-secondary">
                        <i class="fas fa-file-code"></i> Ver JSON
                    </a>
                    <a href="/api/docs" target="_blank" class="btn-secondary">
                        <i class="fas fa-external-link-alt"></i> Abrir em Nova Aba
                    </a>
                </div>
            </div>
            <div id="swagger-ui-container" style="background: white; padding: 20px; border-radius: 10px; min-height: 500px;">
                <div style="text-align: center; padding: 60px 20px; color: #7f8c8d;">
                    <i class="fas fa-book" style="font-size: 64px; color: #6C63FF; margin-bottom: 20px; display: block;"></i>
                    <h3>📖 Documentação Interativa da API</h3>
                    <p style="margin: 10px 0; max-width: 500px; margin-left: auto; margin-right: auto;">
                        Clique no botão acima para carregar a documentação interativa do Swagger UI.
                        Você poderá testar todas as rotas da API diretamente pelo navegador.
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
                        <span style="background: #ecf0f1; padding: 5px 15px; border-radius: 20px; font-size: 12px;">👥 Clientes</span>
                        <span style="background: #ecf0f1; padding: 5px 15px; border-radius: 20px; font-size: 12px;">🐕 Pets</span>
                        <span style="background: #ecf0f1; padding: 5px 15px; border-radius: 20px; font-size: 12px;">📅 Agendamentos</span>
                        <span style="background: #ecf0f1; padding: 5px 15px; border-radius: 20px; font-size: 12px;">📊 Dashboard</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ==================== FUNÇÃO PARA CARREGAR SWAGGER ====================
function carregarSwagger() {
    const container = document.getElementById('swagger-ui-container');
    if (!container) {
        console.error('❌ Container não encontrado');
        return;
    }
    
    // Mostra loading
    container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
            <p>Carregando documentação...</p>
        </div>
    `;
    
    try {
        // Carrega o Swagger UI via CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.5.0/swagger-ui-bundle.js';
        script.onload = function() {
            // Adiciona o CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.5.0/swagger-ui.css';
            document.head.appendChild(link);
            
            // Inicializa o Swagger
            setTimeout(() => {
                try {
                    if (typeof window.SwaggerUIBundle !== 'undefined') {
                        const ui = window.SwaggerUIBundle({
                            url: "/static/swagger.json",
                            dom_id: '#swagger-ui-container',
                            presets: [
                                window.SwaggerUIBundle.presets.apis,
                                window.SwaggerUIBundle.SwaggerUIStandalonePreset
                            ],
                            layout: "BaseLayout",
                            deepLinking: true,
                            docExpansion: "list",
                            defaultModelsExpandDepth: 1,
                            defaultModelExpandDepth: 1,
                            showExtensions: true,
                            showCommonExtensions: true
                        });
                        
                        console.log('✅ Swagger UI carregado com sucesso!');
                        swaggerCarregado = true;
                        
                        // Atualiza o botão
                        const btn = document.getElementById('btn-carregar-swagger');
                        if (btn) {
                            btn.innerHTML = '<i class="fas fa-check"></i> Documentação Carregada';
                            btn.disabled = true;
                            btn.style.opacity = '0.7';
                            btn.style.cursor = 'default';
                        }
                    } else {
                        throw new Error('SwaggerUIBundle não encontrado');
                    }
                } catch (error) {
                    console.error('❌ Erro ao inicializar Swagger:', error);
                    container.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: #e74c3c;">
                            <i class="fas fa-exclamation-circle" style="font-size: 48px; display: block; margin-bottom: 20px;"></i>
                            <h3>❌ Erro ao carregar Swagger</h3>
                            <p>${error.message}</p>
                            <button onclick="carregarSwagger()" class="btn-primary" style="margin-top: 10px;">
                                <i class="fas fa-sync"></i> Tentar novamente
                            </button>
                        </div>
                    `;
                }
            }, 500);
        };
        script.onerror = function() {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #e74c3c;">
                    <i class="fas fa-exclamation-circle" style="font-size: 48px; display: block; margin-bottom: 20px;"></i>
                    <h3>❌ Erro ao carregar Swagger</h3>
                    <p>Não foi possível carregar a biblioteca Swagger UI.</p>
                    <p style="font-size: 14px; color: #7f8c8d;">Verifique sua conexão com a internet.</p>
                    <button onclick="carregarSwagger()" class="btn-primary" style="margin-top: 10px;">
                        <i class="fas fa-sync"></i> Tentar novamente
                    </button>
                    <div style="margin-top: 20px;">
                        <a href="/api/docs" target="_blank" class="btn-secondary">
                            <i class="fas fa-external-link-alt"></i> Abrir em Nova Aba
                        </a>
                    </div>
                </div>
            `;
        };
        document.head.appendChild(script);
        
    } catch (error) {
        console.error('❌ Erro ao carregar Swagger:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; display: block; margin-bottom: 20px;"></i>
                <h3>❌ Erro ao carregar</h3>
                <p>${error.message}</p>
                <button onclick="carregarSwagger()" class="btn-primary" style="margin-top: 10px;">
                    <i class="fas fa-sync"></i> Tentar novamente
                </button>
            </div>
        `;
    }
}

// ==================== NAVEGAÇÃO PRINCIPAL ====================
async function navigate(page, params = {}) {
    const content = document.getElementById('app-content');
    
    // Atualiza menu
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    // Se for a página da API, renderiza o Swagger
    if (page === 'api') {
        content.innerHTML = renderSwagger();
        setTimeout(carregarSwagger, 200);
        return;
    }
    
    // Mostra loading para outras páginas
    content.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Carregando...</p>
        </div>
    `;
    
    try {
        let html = '';
        
        switch(page) {
            case 'dashboard':
                const dashboardData = await getDashboard();
                html = renderDashboard(dashboardData);
                break;
                
            case 'clientes':
                const clientes = await getClientes();
                html = renderClientes(clientes);
                break;
                
            case 'pets':
                const [pets, clientesList] = await Promise.all([
                    getPets(),
                    getClientes()
                ]);
                html = renderPets(pets, clientesList);
                break;
                
            case 'agendamentos':
                const [agendamentos, petsList] = await Promise.all([
                    getAgendamentos(),
                    getPets()
                ]);
                const statusFilter = params.status || '';
                const dataFilter = params.data || '';
                html = renderAgendamentos(agendamentos, petsList, statusFilter, dataFilter);
                break;
                
            default:
                html = `
                    <div class="error-container">
                        <i class="fas fa-exclamation-circle"></i>
                        <h2>Página não encontrada</h2>
                        <button onclick="navigate('dashboard')" class="btn-primary">Voltar</button>
                    </div>
                `;
        }
        
        content.innerHTML = html;
        
        // Inicializa eventos dos forms
        initForms(page);
        
    } catch (error) {
        console.error('❌ Erro:', error);
        content.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-circle"></i>
                <h2>❌ Erro ao carregar</h2>
                <p>${error.message}</p>
                <button onclick="navigate('${page}')" class="btn-primary">
                    <i class="fas fa-sync"></i> Tentar novamente
                </button>
            </div>
        `;
    }
}

// ==================== INICIALIZAR FORMS ====================
function initForms(page) {
    // Form de Clientes
    const formCliente = document.getElementById('form-cliente');
    if (formCliente) {
        formCliente.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dados = {
                nome: document.getElementById('cliente-nome').value,
                telefone: document.getElementById('cliente-telefone').value,
                email: document.getElementById('cliente-email').value || '',
                endereco: document.getElementById('cliente-endereco').value || ''
            };
            
            try {
                await criarCliente(dados);
                showToast('✅ Cliente cadastrado com sucesso!', 'success');
                formCliente.reset();
                navigate('clientes');
            } catch (error) {
                showToast(`❌ ${error.message}`, 'error');
            }
        });
    }
    
    // Form de Pets
    const formPet = document.getElementById('form-pet');
    if (formPet) {
        formPet.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dados = {
                nome: document.getElementById('pet-nome').value,
                especie: document.getElementById('pet-especie').value,
                raca: document.getElementById('pet-raca').value || '',
                idade: document.getElementById('pet-idade').value || null,
                observacoes: document.getElementById('pet-observacoes').value || '',
                cliente_id: parseInt(document.getElementById('pet-cliente').value)
            };
            
            try {
                await criarPet(dados);
                showToast('✅ Pet cadastrado com sucesso!', 'success');
                formPet.reset();
                navigate('pets');
            } catch (error) {
                showToast(`❌ ${error.message}`, 'error');
            }
        });
    }
    
    // Form de Agendamentos
    const formAgendamento = document.getElementById('form-agendamento');
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dados = {
                pet_id: parseInt(document.getElementById('agendamento-pet').value),
                data: document.getElementById('agendamento-data').value,
                tipo: document.getElementById('agendamento-tipo').value,
                valor: parseFloat(document.getElementById('agendamento-valor').value) || null
            };
            
            try {
                await criarAgendamento(dados);
                showToast('✅ Agendamento criado com sucesso!', 'success');
                formAgendamento.reset();
                navigate('agendamentos');
            } catch (error) {
                showToast(`❌ ${error.message}`, 'error');
            }
        });
    }
}

// ==================== FUNÇÕES GLOBAIS CORRIGIDAS ====================

// ----- CLIENTES -----
window.deletarCliente = async function(id) {
    if (!confirm('⚠️ Tem certeza que deseja excluir este cliente? Todos os pets e agendamentos relacionados também serão excluídos.')) {
        console.log('❌ Exclusão cancelada pelo usuário');
        return;
    }
    
    try {
        console.log(`🗑️ Tentando excluir cliente ID: ${id}`);
        
        const response = await fetch(`/api/clientes/${id}`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📡 Resposta do servidor: ${response.status}`);
        
        if (response.ok) {
            const resultado = await response.json();
            console.log('✅ Cliente excluído com sucesso:', resultado);
            showToast('✅ Cliente excluído com sucesso!', 'success');
            navigate('clientes');
        } else {
            const erro = await response.json();
            console.error('❌ Erro do servidor:', erro);
            showToast(`❌ Erro ao excluir: ${erro.erro || 'Erro desconhecido'}`, 'error');
        }
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        showToast(`❌ Erro de conexão: ${error.message}`, 'error');
    }
};

window.editarCliente = async function(id) {
    try {
        console.log(`✏️ Tentando editar cliente ID: ${id}`);
        
        const response = await fetch(`/api/clientes/${id}`);
        if (!response.ok) {
            throw new Error('Cliente não encontrado');
        }
        const cliente = await response.json();
        console.log('📋 Dados do cliente:', cliente);
        
        const novoNome = prompt('📝 Digite o novo nome:', cliente.nome);
        if (novoNome === null || novoNome.trim() === '') {
            console.log('❌ Edição cancelada - nome vazio');
            return;
        }
        
        const novoTelefone = prompt('📱 Digite o novo telefone:', cliente.telefone);
        if (novoTelefone === null || novoTelefone.trim() === '') {
            console.log('❌ Edição cancelada - telefone vazio');
            return;
        }
        
        const novoEmail = prompt('📧 Digite o novo email:', cliente.email || '');
        if (novoEmail === null) return;
        
        const novoEndereco = prompt('📍 Digite o novo endereço:', cliente.endereco || '');
        if (novoEndereco === null) return;
        
        const dadosAtualizados = {
            nome: novoNome,
            telefone: novoTelefone,
            email: novoEmail,
            endereco: novoEndereco
        };
        
        console.log('📤 Enviando atualização:', dadosAtualizados);
        
        const updateResponse = await fetch(`/api/clientes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        });
        
        console.log(`📡 Resposta do servidor: ${updateResponse.status}`);
        
        if (updateResponse.ok) {
            const resultado = await updateResponse.json();
            console.log('✅ Cliente atualizado:', resultado);
            showToast('✅ Cliente atualizado com sucesso!', 'success');
            navigate('clientes');
        } else {
            const erro = await updateResponse.json();
            console.error('❌ Erro do servidor:', erro);
            showToast(`❌ Erro ao atualizar: ${erro.erro || 'Erro desconhecido'}`, 'error');
        }
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        showToast(`❌ Erro de conexão: ${error.message}`, 'error');
    }
};

// ----- PETS -----
window.deletarPet = async function(id) {
    if (!confirm('⚠️ Tem certeza que deseja excluir este pet? Todos os agendamentos relacionados também serão excluídos.')) {
        console.log('❌ Exclusão de pet cancelada pelo usuário');
        return;
    }
    
    try {
        console.log(`🗑️ Tentando excluir pet ID: ${id}`);
        
        const response = await fetch(`/api/pets/${id}`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📡 Resposta do servidor: ${response.status}`);
        
        if (response.ok) {
            const resultado = await response.json();
            console.log('✅ Pet excluído com sucesso:', resultado);
            showToast('✅ Pet excluído com sucesso!', 'success');
            navigate('pets');
        } else {
            const erro = await response.json();
            console.error('❌ Erro do servidor:', erro);
            showToast(`❌ Erro ao excluir pet: ${erro.erro || 'Erro desconhecido'}`, 'error');
        }
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        showToast(`❌ Erro de conexão: ${error.message}`, 'error');
    }
};

// ----- AGENDAMENTOS -----
window.deletarAgendamento = async function(id) {
    if (!confirm('⚠️ Tem certeza que deseja excluir este agendamento?')) {
        console.log('❌ Exclusão de agendamento cancelada pelo usuário');
        return;
    }
    
    try {
        console.log(`🗑️ Tentando excluir agendamento ID: ${id}`);
        
        const response = await fetch(`/api/agendamentos/${id}`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`📡 Resposta do servidor: ${response.status}`);
        
        if (response.ok) {
            const resultado = await response.json();
            console.log('✅ Agendamento excluído com sucesso:', resultado);
            showToast('✅ Agendamento excluído com sucesso!', 'success');
            navigate('agendamentos');
        } else {
            const erro = await response.json();
            console.error('❌ Erro do servidor:', erro);
            showToast(`❌ Erro ao excluir agendamento: ${erro.erro || 'Erro desconhecido'}`, 'error');
        }
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        showToast(`❌ Erro de conexão: ${error.message}`, 'error');
    }
};

window.alterarStatusAgendamento = async function(id, status) {
    try {
        console.log(`🔄 Tentando alterar status do agendamento ${id} para: ${status}`);
        
        const response = await fetch(`/api/agendamentos/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status })
        });
        
        console.log(`📡 Resposta do servidor: ${response.status}`);
        
        if (response.ok) {
            const resultado = await response.json();
            console.log('✅ Status atualizado:', resultado);
            showToast('✅ Status atualizado com sucesso!', 'success');
            navigate('agendamentos');
        } else {
            const erro = await response.json();
            console.error('❌ Erro do servidor:', erro);
            showToast(`❌ Erro ao atualizar status: ${erro.erro || 'Erro desconhecido'}`, 'error');
        }
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        showToast(`❌ Erro de conexão: ${error.message}`, 'error');
    }
};

window.carregarSwagger = carregarSwagger;
window.filtrarPorData = function() {
    const data = document.getElementById('filtro-data').value;
    if (data) {
        navigate('agendamentos', { data: data });
    } else {
        showToast('⚠️ Selecione uma data válida', 'warning');
    }
};

// ==================== TOAST ====================
function showToast(message, type = 'info') {
    // Remove toasts antigos
    document.querySelectorAll('.toast-custom').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast-custom toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="toast-close">&times;</button>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        font-family: 'Inter', sans-serif;
    `;
    
    const colors = {
        success: '#00C9A7',
        error: '#FF6B6B',
        warning: '#FFC857',
        info: '#6C63FF'
    };
    toast.style.background = colors[type] || colors.info;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM carregado');
    
    // Eventos de navegação
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                navigate(page);
            }
        });
    });
    
    // Carrega a página inicial
    navigate('dashboard');
});

console.log('✅ PetLembra SPA carregado com sucesso!');