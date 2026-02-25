// popup-incentivo.js
// Pop-up para incentivar professores a compartilharem materiais

const POPUP_CONFIG = {
    ATIVO: true, // Mude para false para desativar completamente
    DELAY: 5000, // Tempo em ms para aparecer (5 segundos)
    EXIBIR_UMA_VEZ: true, // Exibir apenas uma vez por sessão
    COOKIE_NAME: 'popup_incentivo_visto', // Nome do cookie
    COOKIE_DURATION: 7 // Duração em dias
};

class PopupIncentivo {
    constructor() {
        this.popup = null;
        this.overlay = null;
        this.fechado = false;
    }

    init() {
        // Verificar se está ativo
        if (!POPUP_CONFIG.ATIVO) return;
        
        // Verificar se já foi visto (se configurado)
        if (POPUP_CONFIG.EXIBIR_UMA_VEZ && this.getCookie(POPUP_CONFIG.COOKIE_NAME)) return;
        
        // Criar elementos do popup
        this.createPopup();
        
        // Configurar timeout para exibir
        setTimeout(() => this.show(), POPUP_CONFIG.DELAY);
        
        // Configurar eventos
        this.setupEvents();
    }

    createPopup() {
        // Criar overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'popup-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(26, 54, 93, 0.85);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(3px);
        `;

        // Criar popup (MENOR)
        this.popup = document.createElement('div');
        this.popup.className = 'popup-incentivo';
        this.popup.style.cssText = `
            background: white;
            color: var(--dark, #2d3748);
            padding: 25px 30px;
            border-radius: 16px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            transform: scale(0.9);
            transition: transform 0.3s ease;
            border: 1px solid var(--light-gray, #e2e8f0);
        `;

        // Conteúdo do popup (mais compacto)
        this.popup.innerHTML = `
            <button class="popup-close" style="
                position: absolute;
                top: 12px;
                right: 15px;
                background: none;
                border: none;
                color: var(--gray, #a0aec0);
                font-size: 24px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s;
                padding: 0 8px;
                line-height: 1;
                font-weight: 300;
            ">&times;</button>
            
            <div style="
                background: linear-gradient(135deg, var(--primary-light, #4299e1), var(--primary, #2c5282));
                width: 70px;
                height: 70px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
                color: white;
                font-size: 32px;
                box-shadow: 0 4px 10px rgba(44, 82, 130, 0.3);
            ">
                📤
            </div>
            
            <h3 style="
                color: var(--primary-dark, #1a365d);
                margin-bottom: 8px;
                font-size: 22px;
                font-weight: 600;
            ">Compartilhe seus materiais!</h3>
            
            <p style="
                margin-bottom: 15px;
                font-size: 15px;
                line-height: 1.5;
                color: var(--dark-gray, #4a5568);
            ">
                Você cria materiais incríveis para suas aulas?<br>
                <strong>Compartilhe com a rede!</strong>
            </p>
            
            <div style="
                background: var(--light, #f7fafc);
                padding: 12px;
                border-radius: 12px;
                margin-bottom: 20px;
                text-align: left;
                font-size: 14px;
                border-left: 3px solid var(--primary, #2c5282);
            ">
                <p style="margin: 3px 0;"><span style="color: var(--primary);">✓</span> Atividades e exercícios</p>
                <p style="margin: 3px 0;"><span style="color: var(--primary);">✓</span> Apresentações e slides</p>
                <p style="margin: 3px 0;"><span style="color: var(--primary);">✓</span> Projetos e avaliações</p>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 10px;">
                <a href="compartilhar.html" class="popup-btn popup-btn-primary" style="
                    background: var(--primary, #2c5282);
                    color: white;
                    padding: 12px 25px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 15px;
                    transition: all 0.2s;
                    border: none;
                    box-shadow: 0 2px 8px rgba(44, 82, 130, 0.3);
                    flex: 2;
                ">Enviar Material</a>
                
                <button class="popup-btn popup-btn-later" style="
                    background: var(--light-gray, #e2e8f0);
                    color: var(--dark, #2d3748);
                    padding: 12px 15px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 14px;
                    transition: all 0.2s;
                    border: none;
                    cursor: pointer;
                    flex: 1;
                ">Depois</button>
            </div>
            
            <p style="
                font-size: 11px;
                color: var(--gray, #a0aec0);
                margin-top: 5px;
            ">
                Seu material passará por avaliação da equipe
            </p>
        `;

        document.body.appendChild(this.overlay);
        this.overlay.appendChild(this.popup);
    }

    show() {
        if (this.fechado) return;
        
        this.overlay.style.display = 'flex';
        setTimeout(() => {
            this.overlay.style.opacity = '1';
            this.popup.style.transform = 'scale(1)';
        }, 10);
    }

    hide() {
        this.overlay.style.opacity = '0';
        this.popup.style.transform = 'scale(0.9)';
        this.fechado = true;
        
        setTimeout(() => {
            this.overlay.style.display = 'none';
        }, 300);
        
        // Marcar como visto se configurado
        if (POPUP_CONFIG.EXIBIR_UMA_VEZ) {
            this.setCookie(POPUP_CONFIG.COOKIE_NAME, 'true', POPUP_CONFIG.COOKIE_DURATION);
        }
    }

    setupEvents() {
        // Fechar com botão X
        const closeBtn = this.popup.querySelector('.popup-close');
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.hide();
        });

        // Fechar com botão "Depois"
        const laterBtn = this.popup.querySelector('.popup-btn-later');
        laterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.hide();
        });

        // Fechar ao clicar no overlay
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });

        // Animações dos botões
        const primaryBtn = this.popup.querySelector('.popup-btn-primary');
        primaryBtn.addEventListener('mouseenter', () => {
            primaryBtn.style.background = 'var(--primary-dark, #1a365d)';
            primaryBtn.style.transform = 'translateY(-2px)';
            primaryBtn.style.boxShadow = '0 4px 12px rgba(26, 54, 93, 0.4)';
        });
        primaryBtn.addEventListener('mouseleave', () => {
            primaryBtn.style.background = 'var(--primary, #2c5282)';
            primaryBtn.style.transform = 'translateY(0)';
            primaryBtn.style.boxShadow = '0 2px 8px rgba(44, 82, 130, 0.3)';
        });

        const laterBtn = this.popup.querySelector('.popup-btn-later');
        laterBtn.addEventListener('mouseenter', () => {
            laterBtn.style.background = 'var(--gray, #a0aec0)';
            laterBtn.style.color = 'white';
        });
        laterBtn.addEventListener('mouseleave', () => {
            laterBtn.style.background = 'var(--light-gray, #e2e8f0)';
            laterBtn.style.color = 'var(--dark, #2d3748)';
        });
    }

    // Utilitários de cookie
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }

    getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) return cookieValue;
        }
        return null;
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const popup = new PopupIncentivo();
    popup.init();
});
