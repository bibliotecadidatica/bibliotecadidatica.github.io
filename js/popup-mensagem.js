/**
 * Popup de Incentivo - Compartilhamento de Materiais
 * 
 * Para ATIVAR o popup: popupMensagem.mostrar()
 * Para DESATIVAR: popupMensagem.esconder()
 * 
 * Para mostrar automaticamente ao carregar a página:
 * popupMensagem.mostrarSeNaoVisto()
 */

const popupMensagem = {
    // Configurações
    config: {
        storageKey: 'popup_compartilhamento_visto',
        popupId: 'popup-incentivo-compartilhamento',
        overlayId: 'popup-overlay-compartilhamento',
        delay: 2000, // Delay para mostrar automaticamente (ms)
        mostrarNoCarregamento: true, // Mudar para false para desativar completamente
    },

    // Elementos do DOM
    elementos: {
        overlay: null,
        popup: null,
        btnFechar: null,
        btnNaoMostrar: null,
        checkNaoMostrar: null
    },

    /**
     * Inicializa o popup
     */
    init: function() {
        // Criar elementos se não existirem
        if (!document.getElementById(this.config.overlayId)) {
            this.criarPopup();
        }

        // Obter referências dos elementos
        this.elementos.overlay = document.getElementById(this.config.overlayId);
        this.elementos.popup = document.getElementById(this.config.popupId);
        this.elementos.btnFechar = document.querySelector('.popup-close');
        this.elementos.checkNaoMostrar = document.getElementById('popup-nao-mostrar');
        
        // Configurar eventos
        this.configurarEventos();

        // Mostrar automaticamente se configurado
        if (this.config.mostrarNoCarregamento) {
            setTimeout(() => {
                this.mostrarSeNaoVisto();
            }, this.config.delay);
        }
    },

    /**
     * Cria a estrutura HTML do popup
     */
    criarPopup: function() {
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.id = this.config.overlayId;
        
        overlay.innerHTML = `
            <div class="popup-container" id="${this.config.popupId}">
                <div class="popup-header">
                    <div class="popup-header-icon">
                        <i class="fas fa-share-alt"></i>
                    </div>
                    <div class="popup-header-title">
                        <h3>Compartilhe Conhecimento! 📚</h3>
                        <p>Faça parte da nossa comunidade</p>
                    </div>
                    <button class="popup-close" aria-label="Fechar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="popup-body">
                    <div class="popup-message">
                        <p><strong>Professor(a),</strong> sua contribuição é muito importante!</p>
                        <p>Compartilhe seus materiais pedagógicos e ajude a <i>enriquecer</i> nossa biblioteca.</p>
                    </div>
                    
                    <div class="popup-benefits">
                        <h4><i class="fas fa-star"></i> Por que compartilhar?</h4>
                        <ul>
                            <li>
                                <i class="fas fa-check-circle"></i>
                                <span>Ajude outros professores com seus materiais</span>
                            </li>
                            <li>
                                <i class="fas fa-check-circle"></i>
                                <span>Seu trabalho reconhecido pela comunidade</span>
                            </li>
                            <li>
                                <i class="fas fa-check-circle"></i>
                                <span>Contribua para uma educação mais colaborativa</span>
                            </li>
                            <li>
                                <i class="fas fa-check-circle"></i>
                                <span>Seus materiais avaliados por especialistas</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="popup-actions">
                        <a href="compartilhar.html" class="popup-btn popup-btn-primary">
                            <i class="fas fa-upload"></i>
                            Quero Compartilhar Agora
                        </a>
                        <button class="popup-btn popup-btn-secondary" id="popup-lembrar-depois">
                            <i class="fas fa-clock"></i>
                            Lembrar Depois
                        </button>
                    </div>
                    
                    <div class="popup-dont-show">
                        <input type="checkbox" id="popup-nao-mostrar">
                        <label for="popup-nao-mostrar">Não mostrar esta mensagem novamente</label>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    },

    /**
     * Configura os eventos do popup
     */
    configurarEventos: function() {
        // Fechar com botão X
        if (this.elementos.btnFechar) {
            this.elementos.btnFechar.addEventListener('click', () => {
                this.esconder();
            });
        }

        // Botão "Lembrar Depois"
        const btnLembrarDepois = document.getElementById('popup-lembrar-depois');
        if (btnLembrarDepois) {
            btnLembrarDepois.addEventListener('click', () => {
                this.esconder();
            });
        }

        // Checkbox "Não mostrar novamente"
        if (this.elementos.checkNaoMostrar) {
            this.elementos.checkNaoMostrar.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setVisto();
                } else {
                    this.removerVisto();
                }
            });
        }

        // Fechar ao clicar no overlay (fundo escuro)
        this.elementos.overlay.addEventListener('click', (e) => {
            if (e.target === this.elementos.overlay) {
                this.esconder();
            }
        });

        // Fechar com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elementos.overlay.classList.contains('active')) {
                this.esconder();
            }
        });
    },

    /**
     * Mostra o popup
     */
    mostrar: function() {
        if (this.elementos.overlay) {
            this.elementos.overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impede rolagem da página
        }
    },

    /**
     * Esconde o popup
     */
    esconder: function() {
        if (this.elementos.overlay) {
            this.elementos.overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restaura rolagem
        }
    },

    /**
     * Verifica se o popup já foi visto
     */
    foiVisto: function() {
        return localStorage.getItem(this.config.storageKey) === 'true';
    },

    /**
     * Marca como visto
     */
    setVisto: function() {
        localStorage.setItem(this.config.storageKey, 'true');
    },

    /**
     * Remove marcação de visto
     */
    removerVisto: function() {
        localStorage.removeItem(this.config.storageKey);
    },

    /**
     * Mostra o popup apenas se ainda não foi visto
     */
    mostrarSeNaoVisto: function() {
        if (!this.foiVisto()) {
            this.mostrar();
        }
    },

    /**
     * Reseta o popup (limpa localStorage)
     */
    resetar: function() {
        localStorage.removeItem(this.config.storageKey);
        if (this.elementos.checkNaoMostrar) {
            this.elementos.checkNaoMostrar.checked = false;
        }
    },

    /**
     * Ativa/Desativa o popup completamente
     * @param {boolean} ativar - true para ativar, false para desativar
     */
    setAtivo: function(ativar) {
        this.config.mostrarNoCarregamento = ativar;
        if (!ativar) {
            this.esconder();
        }
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    popupMensagem.init();
});

// Expor globalmente para fácil acesso no console
window.popupMensagem = popupMensagem;