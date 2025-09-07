// Dashboard functionality
class DashboardManager {
    constructor() {
        this.apiBaseUrl = '/api';
        this.currentTab = 'interviews';
        this.uploadedData = null;
        this.init();
    }

    async init() {
        console.log('Dashboard manager initializing...');
        await this.loadDashboardData();
        this.setupEventListeners();
        this.setupTabNavigation();
        console.log('Dashboard manager initialized');
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadDashboardData());
        }
    }

    async loadDashboardData() {
        try {
            this.showLoading(true);
            
            // Load interviews data
            const interviews = await this.fetchInterviews();
            this.updateStats(interviews);
            this.displayInterviews(interviews);
            
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            this.showError('Erro ao carregar dados do dashboard');
        } finally {
            this.showLoading(false);
        }
    }

    async fetchInterviews() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/interviews`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.interviews || [];
        } catch (error) {
            console.error('Erro ao buscar entrevistas:', error);
            // Return mock data for demonstration
            return this.getMockInterviews();
        }
    }

    getMockInterviews() {
        return [
            {
                id: 1,
                candidateName: 'João Silva',
                candidateEmail: 'joao@email.com',
                score: 85,
                status: 'completed',
                createdAt: new Date().toISOString(),
                completedAt: new Date().toISOString()
            },
            {
                id: 2,
                candidateName: 'Maria Santos',
                candidateEmail: 'maria@email.com',
                score: 92,
                status: 'completed',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                completedAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 3,
                candidateName: 'Pedro Costa',
                candidateEmail: 'pedro@email.com',
                score: 78,
                status: 'in_progress',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                completedAt: null
            }
        ];
    }

    updateStats(interviews) {
        const totalInterviews = interviews.length;
        const todayInterviews = interviews.filter(interview => {
            const today = new Date().toDateString();
            const interviewDate = new Date(interview.createdAt).toDateString();
            return today === interviewDate;
        }).length;

        const completedInterviews = interviews.filter(interview => interview.status === 'completed');
        const averageScore = completedInterviews.length > 0 
            ? Math.round(completedInterviews.reduce((sum, interview) => sum + interview.score, 0) / completedInterviews.length)
            : 0;

        const completionRate = totalInterviews > 0 
            ? Math.round((completedInterviews.length / totalInterviews) * 100)
            : 0;

        // Update DOM elements
        this.updateElement('total-interviews', totalInterviews);
        this.updateElement('today-interviews', todayInterviews);
        this.updateElement('average-score', averageScore);
        this.updateElement('completion-rate', `${completionRate}%`);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    displayInterviews(interviews) {
        const container = document.getElementById('interviews-list');
        if (!container) return;

        if (interviews.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="inbox" class="w-12 h-12 text-slate-400 mx-auto mb-4"></i>
                    <p class="text-slate-600 dark:text-slate-400">Nenhuma entrevista encontrada</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        const interviewsHtml = interviews.map(interview => this.createInterviewCard(interview)).join('');
        container.innerHTML = interviewsHtml;
        lucide.createIcons();
    }

    createInterviewCard(interview) {
        const statusColor = interview.status === 'completed' ? 'green' : 'yellow';
        const statusText = interview.status === 'completed' ? 'Concluída' : 'Em Andamento';
        const scoreDisplay = interview.status === 'completed' ? `${interview.score}/100` : '-';
        
        const createdAt = new Date(interview.createdAt).toLocaleDateString('pt-BR');
        const completedAt = interview.completedAt 
            ? new Date(interview.completedAt).toLocaleDateString('pt-BR')
            : '-';

        return `
            <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                            <i data-lucide="user" class="w-5 h-5 text-indigo-600 dark:text-indigo-400"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold text-slate-900 dark:text-white">${interview.candidateName}</h4>
                            <p class="text-sm text-slate-600 dark:text-slate-400">${interview.candidateEmail}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-1 text-xs font-medium rounded-full bg-${statusColor}-100 dark:bg-${statusColor}-900/50 text-${statusColor}-800 dark:text-${statusColor}-200">
                            ${statusText}
                        </span>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p class="text-slate-600 dark:text-slate-400">Pontuação</p>
                        <p class="font-semibold text-slate-900 dark:text-white">${scoreDisplay}</p>
                    </div>
                    <div>
                        <p class="text-slate-600 dark:text-slate-400">Iniciada em</p>
                        <p class="font-semibold text-slate-900 dark:text-white">${createdAt}</p>
                    </div>
                    <div>
                        <p class="text-slate-600 dark:text-slate-400">Concluída em</p>
                        <p class="font-semibold text-slate-900 dark:text-white">${completedAt}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>
                        <button class="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                            <i data-lucide="download" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showLoading(show) {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        const container = document.getElementById('interviews-list');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="alert-circle" class="w-12 h-12 text-red-400 mx-auto mb-4"></i>
                    <p class="text-red-600 dark:text-red-400">${message}</p>
                </div>
            `;
            lucide.createIcons();
        }
    }

    // Tab Navigation
    setupTabNavigation() {
        const tabs = ['interviews-tab', 'training-tab', 'analytics-tab'];
        const contents = ['interviews-content', 'training-content', 'analytics-content'];

        tabs.forEach((tabId, index) => {
            const tab = document.getElementById(tabId);
            if (tab) {
                tab.addEventListener('click', () => {
                    this.switchTab(tabId, contents[index]);
                });
            }
        });
    }

    switchTab(tabId, contentId) {
        console.log('Switching to tab:', tabId, contentId);
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active', 'border-indigo-500', 'text-indigo-600', 'dark:text-indigo-400');
            btn.classList.add('border-transparent', 'text-slate-500', 'dark:text-slate-400');
        });

        const activeTab = document.getElementById(tabId);
        if (activeTab) {
            activeTab.classList.add('active', 'border-indigo-500', 'text-indigo-600', 'dark:text-indigo-400');
            activeTab.classList.remove('border-transparent', 'text-slate-500', 'dark:text-slate-400');
        }

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        const activeContent = document.getElementById(contentId);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        this.currentTab = tabId.replace('-tab', '');
        console.log('Current tab:', this.currentTab);

        // Load data for specific tab
        if (this.currentTab === 'training') {
            console.log('Loading training data...');
            this.loadTrainingData();
        }
    }

    // Training functionality
    async loadTrainingData() {
        console.log('Loading training data...');
        try {
            this.showTrainingLoading(true);
            
            // Load training statistics
            const stats = await this.fetchTrainingStats();
            this.updateTrainingStats(stats);
            
            // Load prompts
            const prompts = await this.fetchPrompts();
            this.displayPrompts(prompts);

            // Setup training events
            console.log('Setting up training events...');
            this.setupTrainingEvents();
            
        } catch (error) {
            console.error('Erro ao carregar dados de treinamento:', error);
            this.showTrainingError('Erro ao carregar dados de treinamento');
        } finally {
            this.showTrainingLoading(false);
        }
    }

    async fetchTrainingStats() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/training/stats`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar estatísticas de treinamento:', error);
            // Return mock data
            return {
                activePrompts: 0,
                trainingSessions: 0,
                categories: 0,
                lastUpdate: 'Nunca'
            };
        }
    }

    async fetchPrompts() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/training/prompts`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar prompts:', error);
            // Return mock data
            return this.getMockPrompts();
        }
    }

    getMockPrompts() {
        return [
            {
                id: '1',
                name: 'Pergunta sobre experiência',
                category: 'INTERVIEW',
                promptType: 'FOLLOW_UP',
                content: 'Conte-me sobre sua experiência anterior em atendimento ao cliente.',
                language: 'pt-BR',
                behavior: 'PROFESSIONAL',
                tone: 'NEUTRAL',
                context: 'Usado na fase inicial da entrevista para avaliar experiência prévia',
                expectedResponse: 'Candidato deve mencionar experiências relevantes, conquistas e aprendizados',
                evaluationCriteria: 'Clareza na comunicação, exemplos específicos, relevância da experiência',
                difficulty: 'MEDIUM',
                timeLimit: 120,
                keywords: ['experiência', 'atendimento', 'cliente', 'trabalho anterior'],
                priority: 1,
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Avaliação de soft skills',
                category: 'INTERVIEW',
                promptType: 'EVALUATION',
                content: 'Avalie as habilidades de comunicação e resolução de problemas do candidato.',
                language: 'pt-BR',
                behavior: 'PROFESSIONAL',
                tone: 'ENCOURAGING',
                context: 'Aplicado durante a análise final do candidato',
                expectedResponse: 'Avaliação detalhada das competências comportamentais observadas',
                evaluationCriteria: 'Comunicação clara, pensamento crítico, criatividade, trabalho em equipe',
                difficulty: 'HARD',
                timeLimit: 180,
                keywords: ['soft skills', 'comunicação', 'resolução de problemas', 'avaliação'],
                priority: 2,
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Atendimento reativo',
                category: 'CUSTOMER_SERVICE',
                promptType: 'INITIAL_MESSAGE',
                content: 'Como você lidaria com um cliente insatisfeito com nosso produto?',
                language: 'pt-BR',
                behavior: 'FRIENDLY',
                tone: 'POSITIVE',
                context: 'Cenário de simulação para testar habilidades de atendimento',
                expectedResponse: 'Demonstrar empatia, escuta ativa, busca por solução e follow-up',
                evaluationCriteria: 'Empatia, proatividade, conhecimento do produto, técnicas de resolução',
                difficulty: 'MEDIUM',
                timeLimit: 150,
                keywords: ['atendimento', 'cliente insatisfeito', 'resolução', 'empresa'],
                priority: 1,
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: '4',
                name: 'Venda consultiva',
                category: 'SALES',
                promptType: 'FOLLOW_UP',
                content: 'Demonstre como você faria uma venda consultiva para um produto complexo.',
                language: 'pt-BR',
                behavior: 'PROFESSIONAL',
                tone: 'CHALLENGING',
                context: 'Teste prático de habilidades de vendas consultivas',
                expectedResponse: 'Processo estruturado: descoberta, apresentação, objeções, fechamento',
                evaluationCriteria: 'Estrutura do processo, perguntas qualificadoras, handling de objeções',
                difficulty: 'EXPERT',
                timeLimit: 300,
                keywords: ['venda consultiva', 'processo de vendas', 'qualificação', 'fechamento'],
                priority: 3,
                isActive: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    updateTrainingStats(stats) {
        this.updateElement('active-prompts', stats.activePrompts || 0);
        this.updateElement('training-sessions', stats.trainingSessions || 0);
        this.updateElement('prompt-categories', stats.categories || 0);
        this.updateElement('last-update', stats.lastUpdate || 'Nunca');
    }

    displayPrompts(prompts) {
        const container = document.getElementById('prompts-list');
        if (!container) return;

        if (prompts.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="brain" class="w-12 h-12 text-slate-400 mx-auto mb-4"></i>
                    <p class="text-slate-600 dark:text-slate-400">Nenhum prompt encontrado</p>
                    <p class="text-sm text-slate-500 dark:text-slate-500 mt-2">Crie seu primeiro prompt para começar o treinamento</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        const promptsHtml = prompts.map(prompt => this.createPromptCard(prompt)).join('');
        container.innerHTML = promptsHtml;
        lucide.createIcons();
    }

    createPromptCard(prompt) {
        const categoryLabels = {
            'INTERVIEW': 'Entrevista',
            'CUSTOMER_SERVICE': 'Atendimento',
            'SALES': 'Vendas',
            'TECHNICAL': 'Técnico'
        };

        const typeLabels = {
            'INITIAL_MESSAGE': 'Mensagem Inicial',
            'FOLLOW_UP': 'Acompanhamento',
            'EVALUATION': 'Avaliação',
            'CUSTOM': 'Personalizado'
        };

        const difficultyLabels = {
            'EASY': 'Fácil',
            'MEDIUM': 'Médio',
            'HARD': 'Difícil',
            'EXPERT': 'Especialista'
        };

        const behaviorLabels = {
            'PROFESSIONAL': 'Profissional',
            'FRIENDLY': 'Amigável',
            'FORMAL': 'Formal',
            'CASUAL': 'Casual'
        };

        const toneLabels = {
            'NEUTRAL': 'Neutro',
            'POSITIVE': 'Positivo',
            'ENCOURAGING': 'Encorajador',
            'CHALLENGING': 'Desafiador'
        };

        const statusColor = prompt.isActive ? 'green' : 'gray';
        const statusText = prompt.isActive ? 'Ativo' : 'Inativo';
        const difficultyColor = {
            'EASY': 'green',
            'MEDIUM': 'yellow',
            'HARD': 'orange',
            'EXPERT': 'red'
        }[prompt.difficulty] || 'gray';

        return `
            <div class="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <h4 class="font-semibold text-slate-900 dark:text-white">${prompt.name}</h4>
                            <span class="px-2 py-1 text-xs font-medium rounded-full bg-${statusColor}-100 dark:bg-${statusColor}-900/50 text-${statusColor}-800 dark:text-${statusColor}-200">
                                ${statusText}
                            </span>
                            <span class="px-2 py-1 text-xs font-medium rounded-full bg-${difficultyColor}-100 dark:bg-${difficultyColor}-900/50 text-${difficultyColor}-800 dark:text-${difficultyColor}-200">
                                ${difficultyLabels[prompt.difficulty] || prompt.difficulty}
                            </span>
                        </div>
                        
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                            <span><i data-lucide="tag" class="w-3 h-3 inline mr-1"></i>${categoryLabels[prompt.category] || prompt.category}</span>
                            <span><i data-lucide="type" class="w-3 h-3 inline mr-1"></i>${typeLabels[prompt.promptType] || prompt.promptType}</span>
                            <span><i data-lucide="globe" class="w-3 h-3 inline mr-1"></i>${prompt.language || 'pt-BR'}</span>
                            <span><i data-lucide="clock" class="w-3 h-3 inline mr-1"></i>${prompt.timeLimit ? prompt.timeLimit + 's' : 'Sem limite'}</span>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                            <span><i data-lucide="user" class="w-3 h-3 inline mr-1"></i>${behaviorLabels[prompt.behavior] || prompt.behavior}</span>
                            <span><i data-lucide="message-circle" class="w-3 h-3 inline mr-1"></i>${toneLabels[prompt.tone] || prompt.tone}</span>
                        </div>
                        
                        <div class="space-y-2">
                            <p class="text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded border">
                                <strong>Prompt:</strong> ${prompt.content}
                            </p>
                            
                            ${prompt.context ? `
                                <p class="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-600 p-2 rounded">
                                    <strong>Contexto:</strong> ${prompt.context}
                                </p>
                            ` : ''}
                            
                            ${prompt.expectedResponse ? `
                                <p class="text-xs text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                    <strong>Resposta Esperada:</strong> ${prompt.expectedResponse}
                                </p>
                            ` : ''}
                            
                            ${prompt.evaluationCriteria ? `
                                <p class="text-xs text-slate-600 dark:text-slate-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                    <strong>Critérios:</strong> ${prompt.evaluationCriteria}
                                </p>
                            ` : ''}
                            
                            ${prompt.keywords && prompt.keywords.length > 0 ? `
                                <div class="flex flex-wrap gap-1">
                                    ${prompt.keywords.map(keyword => `
                                        <span class="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full">
                                            ${keyword}
                                        </span>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="flex items-center gap-2 ml-4">
                        <button class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors" onclick="editPrompt('${prompt.id}')">
                            <i data-lucide="edit" class="w-4 h-4"></i>
                        </button>
                        <button class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors" onclick="deletePrompt('${prompt.id}')">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showTrainingLoading(show) {
        const loadingState = document.getElementById('prompts-loading');
        if (loadingState) {
            loadingState.style.display = show ? 'block' : 'none';
        }
    }

    showTrainingError(message) {
        const container = document.getElementById('prompts-list');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="alert-circle" class="w-12 h-12 text-red-400 mx-auto mb-4"></i>
                    <p class="text-red-600 dark:text-red-400">${message}</p>
                </div>
            `;
            lucide.createIcons();
        }
    }

    // Setup training form events
    setupTrainingEvents() {
        // Prompt form
        const promptForm = document.getElementById('prompt-form');
        if (promptForm) {
            promptForm.addEventListener('submit', (e) => this.handlePromptSubmit(e));
        }

        // Training form
        const trainingForm = document.getElementById('training-form');
        if (trainingForm) {
            trainingForm.addEventListener('submit', (e) => this.handleTrainingSubmit(e));
        }

        // Refresh prompts button
        const refreshPromptsBtn = document.getElementById('refresh-prompts');
        if (refreshPromptsBtn) {
            refreshPromptsBtn.addEventListener('click', () => this.loadTrainingData());
        }

        // Filter category
        const filterCategory = document.getElementById('filter-category');
        if (filterCategory) {
            filterCategory.addEventListener('change', (e) => this.filterPrompts(e.target.value));
        }

        // Upload functionality
        console.log('Setting up upload events...');
        this.setupUploadEvents();
    }

    setupUploadEvents() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const selectFileBtn = document.getElementById('select-file-btn');
        const confirmUpload = document.getElementById('confirm-upload');
        const cancelUpload = document.getElementById('cancel-upload');

        console.log('Setting up upload events:', { uploadArea, fileInput, selectFileBtn, confirmUpload, cancelUpload });

        if (uploadArea && fileInput) {
            console.log('Upload area and file input found, setting up events');
            
            // Click on upload area to select file
            uploadArea.addEventListener('click', (e) => {
                console.log('Upload area clicked');
                e.preventDefault();
                fileInput.click();
            });

            // Click on select file button
            if (selectFileBtn) {
                selectFileBtn.addEventListener('click', (e) => {
                    console.log('Select file button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    fileInput.click();
                });
            }

            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('border-indigo-400', 'bg-indigo-50', 'dark:bg-indigo-900/20');
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('border-indigo-400', 'bg-indigo-50', 'dark:bg-indigo-900/20');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('border-indigo-400', 'bg-indigo-50', 'dark:bg-indigo-900/20');
                
                const files = e.dataTransfer.files;
                console.log('Files dropped:', files);
                if (files.length > 0) {
                    this.handleFileUpload(files[0]);
                }
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                console.log('File input changed:', e.target.files);
                if (e.target.files.length > 0) {
                    // Show visual feedback
                    this.showFileSelected(e.target.files[0]);
                    this.handleFileUpload(e.target.files[0]);
                }
            });
        } else {
            console.error('Upload area or file input not found');
        }

        if (confirmUpload) {
            confirmUpload.addEventListener('click', () => this.confirmBulkUpload());
        }

        if (cancelUpload) {
            cancelUpload.addEventListener('click', () => this.cancelUpload());
        }
    }

    async handlePromptSubmit(e) {
        e.preventDefault();
        
        // Get form data directly from form elements
        const name = document.getElementById('prompt-name')?.value;
        const category = document.getElementById('prompt-category')?.value;
        const promptType = document.getElementById('prompt-type')?.value;
        const content = document.getElementById('prompt-content')?.value;
        const language = document.getElementById('prompt-language')?.value || 'pt-BR';
        const behavior = document.getElementById('prompt-behavior')?.value || 'PROFESSIONAL';
        const tone = document.getElementById('prompt-tone')?.value || 'NEUTRAL';
        const context = document.getElementById('prompt-context')?.value || null;
        const expectedResponse = document.getElementById('prompt-expected-response')?.value || null;
        const evaluationCriteria = document.getElementById('prompt-evaluation-criteria')?.value || null;
        const difficulty = document.getElementById('prompt-difficulty')?.value || 'MEDIUM';
        const timeLimit = document.getElementById('prompt-time-limit')?.value ? parseInt(document.getElementById('prompt-time-limit').value) : null;
        const keywords = document.getElementById('prompt-keywords')?.value ? document.getElementById('prompt-keywords').value.split(',').map(k => k.trim()).filter(k => k) : null;
        const priority = parseInt(document.getElementById('prompt-priority')?.value) || 1;
        const isActive = document.getElementById('prompt-active')?.checked || false;
        
        const promptData = {
            name,
            category,
            promptType,
            content,
            language,
            behavior,
            tone,
            context,
            expectedResponse,
            evaluationCriteria,
            difficulty,
            timeLimit,
            keywords,
            priority,
            isActive
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/training/prompts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(promptData)
            });

            if (response.ok) {
                this.showSuccess('Prompt criado com sucesso!');
                e.target.reset();
                this.loadTrainingData();
            } else {
                throw new Error('Erro ao criar prompt');
            }
        } catch (error) {
            console.error('Erro ao criar prompt:', error);
            this.showError('Erro ao criar prompt');
        }
    }

    async handleTrainingSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
            .map(cb => cb.value);

        const trainingData = {
            sessionName: formData.get('sessionName'),
            description: formData.get('description'),
            categories: selectedCategories
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/training/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trainingData)
            });

            if (response.ok) {
                this.showSuccess('Sessão de treinamento iniciada!');
                e.target.reset();
                this.loadTrainingData();
            } else {
                throw new Error('Erro ao iniciar treinamento');
            }
        } catch (error) {
            console.error('Erro ao iniciar treinamento:', error);
            this.showError('Erro ao iniciar treinamento');
        }
    }

    filterPrompts(category) {
        // Implementation for filtering prompts by category
        console.log('Filtering prompts by category:', category);
    }

    showSuccess(message) {
        // You can implement a toast notification here
        console.log('Success:', message);
        alert(message);
    }

    showError(message) {
        console.error('Error:', message);
        alert('Erro: ' + message);
    }

    // File upload methods
    async handleFileUpload(file) {
        console.log('handleFileUpload called with file:', file);
        const fileType = file.name.split('.').pop().toLowerCase();
        console.log('File type detected:', fileType);
        
        if (!['csv', 'xlsx'].includes(fileType)) {
            this.showError('Formato de arquivo não suportado. Use CSV ou Excel (.xlsx)');
            return;
        }

        this.showUploadProgress(true);
        
        try {
            console.log('Starting file parsing...');
            const data = await this.parseFile(file, fileType);
            console.log('File parsed successfully, data:', data);
            this.uploadedData = data;
            this.showPreview(data);
        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            this.showError('Erro ao processar arquivo. Verifique o formato e tente novamente.');
        } finally {
            this.showUploadProgress(false);
        }
    }

    async parseFile(file, fileType) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    let data;
                    
                    if (fileType === 'csv') {
                        data = this.parseCSV(e.target.result);
                    } else if (fileType === 'xlsx') {
                        data = this.parseExcel(e.target.result);
                    }
                    
                    // Validate data
                    const validatedData = this.validateUploadData(data);
                    resolve(validatedData);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            
            if (fileType === 'csv') {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        });
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = this.parseCSVLine(lines[i]);
                if (values.length >= headers.length) {
                    const row = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index] ? values[index].trim().replace(/"/g, '') : '';
                    });
                    data.push(row);
                }
            }
        }

        return data;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    parseExcel(arrayBuffer) {
        try {
            console.log('Parsing Excel file...');
            
            // Check if XLSX library is loaded
            if (typeof XLSX === 'undefined') {
                console.error('XLSX library not loaded');
                throw new Error('XLSX library not loaded. Please use CSV format or refresh the page.');
            }

            console.log('XLSX library found, reading workbook...');
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            console.log('Workbook read, sheet names:', workbook.SheetNames);
            
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log('Excel data converted to JSON:', jsonData);
            
            if (jsonData.length < 2) {
                throw new Error('Arquivo Excel vazio ou sem dados válidos');
            }

            // Convert to object format like CSV
            const headers = jsonData[0];
            const data = [];

            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (row && row.length > 0) {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index] ? String(row[index]).trim() : '';
                    });
                    data.push(obj);
                }
            }

            console.log('Excel parsing completed, final data:', data);
            return data;
        } catch (error) {
            console.error('Error parsing Excel:', error);
            throw new Error('Erro ao processar arquivo Excel. Verifique se o arquivo está no formato correto.');
        }
    }

    validateUploadData(data) {
        console.log('Validating upload data:', data);
        
        // Map Portuguese headers to English
        const headerMap = {
            'Nome do Prompt': 'name',
            'Categoria': 'category', 
            'Tipo de Prompt': 'promptType',
            'Conteúdo': 'content',
            'Idioma': 'language',
            'Comportamento': 'behavior',
            'Tom': 'tone',
            'Contexto': 'context',
            'Resposta Esperada': 'expectedResponse',
            'Critérios de Avaliação': 'evaluationCriteria',
            'Dificuldade': 'difficulty',
            'Limite de Tempo (s)': 'timeLimit',
            'Palavras-chave': 'keywords',
            'Prioridade': 'priority',
            'Ativo': 'isActive'
        };

        // Map Portuguese values to English values
        const valueMaps = {
            category: {
                'Entrevista': 'INTERVIEW',
                'Atendimento ao Cliente': 'CUSTOMER_SERVICE',
                'Vendas': 'SALES',
                'Técnico': 'TECHNICAL'
            },
            promptType: {
                'Mensagem Inicial': 'INITIAL_MESSAGE',
                'Pergunta de Acompanhamento': 'FOLLOW_UP',
                'Avaliação': 'EVALUATION',
                'Personalizado': 'CUSTOM'
            },
            language: {
                'Português (Brasil)': 'pt-BR',
                'English (US)': 'en-US',
                'Español': 'es-ES'
            },
            behavior: {
                'Profissional': 'PROFESSIONAL',
                'Amigável': 'FRIENDLY',
                'Formal': 'FORMAL',
                'Casual': 'CASUAL'
            },
            tone: {
                'Neutro': 'NEUTRAL',
                'Positivo': 'POSITIVE',
                'Encorajador': 'ENCOURAGING',
                'Desafiador': 'CHALLENGING'
            },
            difficulty: {
                'Fácil': 'EASY',
                'Médio': 'MEDIUM',
                'Difícil': 'HARD',
                'Especialista': 'EXPERT'
            }
        };

        // Normalize data headers and values
        const normalizedData = data.map(row => {
            const normalizedRow = {};
            Object.keys(row).forEach(key => {
                const normalizedKey = headerMap[key] || key;
                let value = row[key];
                
                // Convert Portuguese values to English
                if (valueMaps[normalizedKey] && valueMaps[normalizedKey][value]) {
                    value = valueMaps[normalizedKey][value];
                }
                
                normalizedRow[normalizedKey] = value;
            });
            return normalizedRow;
        });

        console.log('Normalized data:', normalizedData);

        const requiredFields = ['name', 'category', 'promptType', 'content'];
        const validCategories = ['INTERVIEW', 'CUSTOMER_SERVICE', 'SALES', 'TECHNICAL'];
        const validTypes = ['INITIAL_MESSAGE', 'FOLLOW_UP', 'EVALUATION', 'CUSTOM'];
        const validLanguages = ['pt-BR', 'en-US', 'es-ES'];
        const validBehaviors = ['PROFESSIONAL', 'FRIENDLY', 'FORMAL', 'CASUAL'];
        const validTones = ['NEUTRAL', 'POSITIVE', 'ENCOURAGING', 'CHALLENGING'];
        const validDifficulties = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];

        const validatedData = [];
        const allErrors = [];

        normalizedData.forEach((row, index) => {
            const rowErrors = [];
            
            // Check required fields
            requiredFields.forEach(field => {
                if (!row[field] || row[field].trim() === '') {
                    rowErrors.push(`Linha ${index + 2}: Campo obrigatório '${field}' está vazio`);
                }
            });

            // Validate enums
            if (row.category && !validCategories.includes(row.category)) {
                rowErrors.push(`Linha ${index + 2}: Categoria inválida '${row.category}'`);
            }

            if (row.promptType && !validTypes.includes(row.promptType)) {
                rowErrors.push(`Linha ${index + 2}: Tipo de prompt inválido '${row.promptType}'`);
            }

            if (row.language && !validLanguages.includes(row.language)) {
                rowErrors.push(`Linha ${index + 2}: Idioma inválido '${row.language}'`);
            }

            if (row.behavior && !validBehaviors.includes(row.behavior)) {
                rowErrors.push(`Linha ${index + 2}: Comportamento inválido '${row.behavior}'`);
            }

            if (row.tone && !validTones.includes(row.tone)) {
                rowErrors.push(`Linha ${index + 2}: Tom inválido '${row.tone}'`);
            }

            if (row.difficulty && !validDifficulties.includes(row.difficulty)) {
                rowErrors.push(`Linha ${index + 2}: Dificuldade inválida '${row.difficulty}'`);
            }

            // Validate numeric fields
            if (row.timeLimit && (isNaN(row.timeLimit) || row.timeLimit < 30 || row.timeLimit > 600)) {
                rowErrors.push(`Linha ${index + 2}: Limite de tempo deve ser entre 30 e 600 segundos`);
            }

            if (row.priority && (isNaN(row.priority) || row.priority < 0 || row.priority > 3)) {
                rowErrors.push(`Linha ${index + 2}: Prioridade deve ser entre 0 e 3`);
            }

            if (rowErrors.length === 0) {
                // Process keywords
                if (row.keywords) {
                    row.keywords = row.keywords.split(',').map(k => k.trim()).filter(k => k);
                }

                // Convert boolean
                row.isActive = row.isActive === 'true' || row.isActive === true || row.isActive === 1;

                // Set defaults
                row.language = row.language || 'pt-BR';
                row.behavior = row.behavior || 'PROFESSIONAL';
                row.tone = row.tone || 'NEUTRAL';
                row.difficulty = row.difficulty || 'MEDIUM';
                row.priority = parseInt(row.priority) || 1;

                validatedData.push(row);
            } else {
                allErrors.push(...rowErrors);
                rowErrors.forEach(error => console.error(error));
            }
        });

        if (allErrors.length > 0) {
            this.showError(`Encontrados ${allErrors.length} erros de validação. Verifique o console para detalhes.`);
        }

        return validatedData;
    }

    showUploadProgress(show) {
        const progressDiv = document.getElementById('upload-progress');
        if (progressDiv) {
            progressDiv.classList.toggle('hidden', !show);
        }
    }

    showPreview(data) {
        const previewArea = document.getElementById('preview-area');
        const previewContent = document.getElementById('preview-content');
        
        if (previewArea && previewContent) {
            previewArea.classList.remove('hidden');
            
            const table = this.createPreviewTable(data);
            previewContent.innerHTML = table;
        }
    }

    createPreviewTable(data) {
        if (data.length === 0) return '<p>Nenhum dado válido encontrado.</p>';

        const headers = ['Nome', 'Categoria', 'Tipo', 'Idioma', 'Comportamento', 'Tom', 'Dificuldade'];
        
        let table = '<table class="w-full text-xs border-collapse">';
        table += '<thead><tr class="bg-slate-200 dark:bg-slate-600">';
        headers.forEach(header => {
            table += `<th class="border border-slate-300 dark:border-slate-500 px-2 py-1 text-left">${header}</th>`;
        });
        table += '</tr></thead><tbody>';

        data.slice(0, 5).forEach(row => {
            table += '<tr class="border-b border-slate-200 dark:border-slate-600">';
            table += `<td class="border border-slate-300 dark:border-slate-500 px-2 py-1">${row.name || ''}</td>`;
            table += `<td class="border border-slate-300 dark:border-slate-500 px-2 py-1">${row.category || ''}</td>`;
            table += `<td class="border border-slate-300 dark:border-slate-500 px-2 py-1">${row.promptType || ''}</td>`;
            table += `<td class="border border-slate-300 dark:border-slate-500 px-2 py-1">${row.language || ''}</td>`;
            table += `<td class="border border-slate-300 dark:border-slate-500 px-2 py-1">${row.behavior || ''}</td>`;
            table += `<td class="border border-slate-300 dark:border-slate-500 px-2 py-1">${row.tone || ''}</td>`;
            table += `<td class="border border-slate-300 dark:border-slate-500 px-2 py-1">${row.difficulty || ''}</td>`;
            table += '</tr>';
        });

        table += '</tbody></table>';
        
        if (data.length > 5) {
            table += `<p class="text-xs text-slate-500 mt-2">Mostrando 5 de ${data.length} registros</p>`;
        }

        return table;
    }

    async confirmBulkUpload() {
        if (!this.uploadedData || this.uploadedData.length === 0) {
            this.showError('Nenhum dado válido para importar');
            return;
        }

        // Validate data first
        const validatedData = this.validateUploadData(this.uploadedData);
        
        if (validatedData.length === 0) {
            this.showError('Nenhum dado válido para importar após validação');
            return;
        }

        this.showUploadProgress(true);
        
        try {
            let successCount = 0;
            let errorCount = 0;
            const errors = [];

            for (let i = 0; i < validatedData.length; i++) {
                const promptData = validatedData[i];
                
                // Update progress
                const progress = ((i + 1) / validatedData.length) * 100;
                this.updateUploadProgress(progress, `Processando ${i + 1} de ${validatedData.length} prompts...`);
                
                try {
                    const response = await fetch(`${this.apiBaseUrl}/training/prompts`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(promptData)
                    });

                    if (response.ok) {
                        successCount++;
                    } else {
                        errorCount++;
                        const errorData = await response.json();
                        errors.push(`Linha ${i + 2}: ${errorData.error || 'Erro desconhecido'}`);
                    }
                } catch (error) {
                    console.error('Erro ao salvar prompt:', error);
                    errorCount++;
                    errors.push(`Linha ${i + 2}: Erro de conexão - ${error.message}`);
                }
            }

            // Show results
            if (successCount > 0) {
                this.showSuccess(`Importados ${successCount} prompts com sucesso!`);
            }
            
            if (errorCount > 0) {
                this.showError(`${errorCount} prompts falharam. Verifique o console para detalhes.`);
                errors.forEach(error => console.error(error));
            }

            this.cancelUpload();
            this.loadTrainingData();
        } catch (error) {
            console.error('Erro na importação em massa:', error);
            this.showError('Erro durante a importação em massa');
        } finally {
            this.showUploadProgress(false);
        }
    }

    updateUploadProgress(percentage, text) {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = text;
        }
    }

    cancelUpload() {
        const previewArea = document.getElementById('preview-area');
        const fileInput = document.getElementById('file-input');
        
        if (previewArea) {
            previewArea.classList.add('hidden');
        }
        
        if (fileInput) {
            fileInput.value = '';
        }
        
        this.uploadedData = null;
    }

    showFileSelected(file) {
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            // Add visual feedback
            uploadArea.classList.add('border-green-400', 'bg-green-50', 'dark:bg-green-900/20');
            
            // Show file name
            const fileName = file.name;
            const fileSize = (file.size / 1024).toFixed(2) + ' KB';
            
            // Create or update file info display
            let fileInfo = document.getElementById('file-info');
            if (!fileInfo) {
                fileInfo = document.createElement('div');
                fileInfo.id = 'file-info';
                fileInfo.className = 'mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm';
                uploadArea.appendChild(fileInfo);
            }
            
            fileInfo.innerHTML = `
                <div class="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <i data-lucide="file" class="w-4 h-4"></i>
                    <span class="font-medium">${fileName}</span>
                    <span class="text-xs text-green-600 dark:text-green-400">(${fileSize})</span>
                </div>
            `;
            
            // Recreate icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
}

// Global functions for prompt actions
function editPrompt(promptId) {
    console.log('Edit prompt:', promptId);
    // Implementation for editing prompt
}

function deletePrompt(promptId) {
    if (confirm('Tem certeza que deseja excluir este prompt?')) {
        console.log('Delete prompt:', promptId);
        // Implementation for deleting prompt
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing DashboardManager...');
    new DashboardManager();
});

