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
            background: rgba(0,0,0,0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(5px);
        `;

        // Criar popup
        this.popup = document.createElement('div');
        this.popup.className = 'popup-incentivo';
        this.popup.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease;
            border: 1px solid rgba(255,255,255,0.2);
        `;

        // Conteúdo do popup
        this.popup.innerHTML = `
            <button class="popup-close" style="
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                opacity: 0.8;
                transition: opacity 0.2s;
                padding: 0 10px;
                line-height: 1;
            ">&times;</button>
            
            <div style="font-size: 60px; margin-bottom: 20px;">📚</div>
            
            <h2 style="
                color: white;
                margin-bottom: 20px;
                font-size: 28px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">Compartilhe seu conhecimento! 👩‍🏫</h2>
            
            <p style="
                margin-bottom: 25px;
                font-size: 18px;
                line-height: 1.6;
                opacity: 0.95;
            ">
                Você cria materiais incríveis para suas aulas?<br>
                <strong>Compartilhe com a rede!</strong>
            </p>
            
            <div style="
                background: rgba(255,255,255,0.2);
                padding: 20px;
                border-radius: 15px;
                margin-bottom: 25px;
                text-align: left;
            ">
                <p style="margin: 5px 0;">✅ Atividades e exercícios</p>
                <p style="margin: 5px 0;">✅ Apresentações e slides</p>
                <p style="margin: 5px 0;">✅ Projetos pedagógicos</p>
                <p style="margin: 5px 0;">✅ Avaliações e recuperações</p>
                <p style="margin: 5px 0;">✅ Qualquer material didático</p>
            </div>
            
            <p style="
                margin-bottom: 30px;
                font-size: 16px;
                font-style: italic;
            ">
                "O conhecimento se multiplica quando compartilhado." 💙
            </p>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <a href="compartilhar.html" class="popup-btn popup-btn-primary" style="
                    background: #4CAF50;
                    color: white;
                    padding: 15px 30px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 18px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    display: inline-block;
                    border: 2px solid rgba(255,255,255,0.3);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                ">📤 Enviar Material</a>
                
                <button class="popup-btn popup-btn-later" style="
                    background: transparent;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 16px;
                    transition: all 0.2s;
                    border: 2px solid rgba(255,255,255,0.3);
                    cursor: pointer;
                ">Lembrar depois</button>
            </div>
            
            <p style="
                margin-top: 20px;
                font-size: 14px;
                opacity: 0.7;
            ">
                Seu material passará por avaliação da equipe pedagógica
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

        // Fechar com botão "Lembrar depois"
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
        const btns = this.popup.querySelectorAll('.popup-btn');
        btns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = btn.classList.contains('popup-btn-primary') ? 
                    '0 4px 15px rgba(0,0,0,0.2)' : 'none';
            });
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