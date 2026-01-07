// Configuração com sua chave API e IDs de pasta
window.CONFIG = {
  API_KEY: "AIzaSyAnO6lMGiJ5UyT6zo7qW2NSGPiBGtMPl88",
  FOLDER_IDS: {
    portugues: "1oCNLcON1a7WAtNcxPgQCpYz1G5YwghZZ",
    ingles: "1ksd-52gkZx94eXx9UAG_RudDrPZHORk0",
    espanhol: "1pCHeDYyW3DpXQ4-3cAkhR5s3A_A7vTMW",
    libras: "1W_fMGLSquBinpH3vsKwG5kHmO1mF4OOD",
    artes: "1NZXxMTdRTn6YusM5Ky-LJqS0qglLMO-K",
    edfisica: "11-umz15mtLA_lqERIBkJ81PzXgbJG04v",
    matematica: "1fz2fraVVCpn8ZglbnGuPc02yW8irQ9d5",
    biologia: "1qMoaTxz6-swFZFJRtCO78jkaAol_zFmm",
    fisica: "1qwAReRChvqNMOLH7STI1K8G5n7Zm-084",
    quimica: "1OccZdwjb5LcEalTgQun8gyjG-LXvd3Qz",
    ciencias: "15cESDdkeC-iIuq_SoSArCSHoYlYHK8rE",
    historia: "1V-bcys64AATEpH9slBgLqUY8JH4Y5ve4",
    geografia: "1VIPSMAfAaNE2iqtGXhv3RKT_MyAJ1dK5",
    filosofia: "17XYMa9O68VS8fIzvBlTT2RQ5i3zMambX",
    sociologia: "1_oOvhr7Tx0naH3HSSGBSX0G9dd_nU2qL",
    adaptadasEF: "1S3CI-0JXi0ZqLQYeVBpvwGwe3_qt0TLl",
    adaptadasEM: "1Rg3zlxKuUjvHPbbwH45llX3i6WZgd-XF"
  }
};

/* Integração com Google Drive API */
const MIME_ICONS = [
  {match: "pdf", icon: '<i class="fas fa-file-pdf"></i>'},
  {match: "spreadsheet", icon: '<i class="fas fa-file-excel"></i>'},
  {match: "presentation", icon: '<i class="fas fa-file-powerpoint"></i>'},
  {match: "word", icon: '<i class="fas fa-file-word"></i>'},
  {match: "image", icon: '<i class="fas fa-file-image"></i>'},
  {match: "video", icon: '<i class="fas fa-file-video"></i>'},
  {match: "audio", icon: '<i class="fas fa-file-audio"></i>'},
  {match: "zip", icon: '<i class="fas fa-file-archive"></i>'},
  {match: "text", icon: '<i class="fas fa-file-alt"></i>'},
];

function iconForMime(mime) {
  for(const m of MIME_ICONS) {
    if(mime.includes(m.match)) return m.icon;
  }
  return '<i class="fas fa-file"></i>';
}

function showSection(id) {
  // Verifica se a seção existe (para evitar erros na página Sobre Nós)
  const section = document.getElementById(id);
  if(!section) return;
  
  document.querySelectorAll(".content-section").forEach(s => s.classList.add("hidden"));
  section.classList.remove("hidden");
  
  // Atualiza botões ativos
  document.querySelectorAll(".nav-link").forEach(b => {
    b.classList.remove("active");
    if(b.getAttribute('data-target') === id || 
       (id === 'inicio' && b.getAttribute('href') === 'index.html')) {
      b.classList.add("active");
    }
  });
  
  // Rola para o topo da página
  window.scrollTo(0, 0);
  
  // Atualiza a URL com hash
  if (id !== 'inicio') {
    window.history.replaceState(null, null, `#${id}`);
  } else {
    window.history.replaceState(null, null, ' ');
  }
  
  // Se a seção de favoritos foi aberta, carrega os favoritos
  if (id === 'favoritos') {
    loadFavorites();
  }
  
  // Fecha todos os submenus ao navegar
  closeAllSubmenus();
}

// Configuração do Submenu
function setupSubmenu() {
  const submenuTriggers = document.querySelectorAll('.nav-main-link[data-submenu]');
  let submenuOverlay = document.getElementById('submenu-overlay');
  
  if (!submenuOverlay) {
    submenuOverlay = document.createElement('div');
    submenuOverlay.id = 'submenu-overlay';
    submenuOverlay.className = 'submenu-overlay';
    document.body.appendChild(submenuOverlay);
  }
  
  function closeAllSubmenus() {
    document.querySelectorAll('.nav-item-with-submenu.active').forEach(item => {
      item.classList.remove('active');
    });
    submenuOverlay.classList.remove('active');
  }
  
  function toggleSubmenu(submenuId, trigger) {
    const isActive = trigger.closest('.nav-item-with-submenu').classList.contains('active');
    
    closeAllSubmenus();
    
    if (!isActive) {
      trigger.closest('.nav-item-with-submenu').classList.add('active');
      
      // No mobile, não exibe overlay
      if (window.innerWidth > 768) {
        submenuOverlay.classList.add('active');
      }
    }
  }
  
  // Event listeners para os triggers do submenu
  submenuTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const submenuId = trigger.getAttribute('data-submenu');
      toggleSubmenu(submenuId, trigger);
    });
  });
  
  // Fechar submenu ao clicar no overlay (desktop)
  submenuOverlay.addEventListener('click', () => {
    closeAllSubmenus();
  });
  
  // Fechar submenu ao clicar fora (mobile)
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item-with-submenu')) {
      closeAllSubmenus();
    }
  });
  
  // Fechar submenu ao redimensionar a janela
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      submenuOverlay.classList.remove('active');
    }
  });
  
  // Fechar submenu ao clicar em um link do submenu
  document.querySelectorAll('.submenu-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeAllSubmenus();
      }
    });
  });
  
  return { closeAllSubmenus };
}

let submenuManager = null;

// Configuração do Menu Mobile
function setupMenuToggle() {
  const toggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (!toggle) return;

  // Função para fechar o menu
  function closeMenu() {
    mainNav.classList.remove('expanded');
    toggle.setAttribute('aria-expanded', 'false');
  }

  // Toggle do menu
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mainNav.classList.toggle('expanded');
    toggle.setAttribute('aria-expanded', mainNav.classList.contains('expanded'));
  });

  // Fechar menu ao clicar fora (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !e.target.closest('.main-nav') && 
        !e.target.closest('.menu-toggle') &&
        !e.target.closest('.submenu')) {
      closeMenu();
    }
  });

  // Fechar menu ao redimensionar para desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mainNav.classList.contains('expanded')) {
      closeMenu();
    }
  });
}

// Função para configurar navegação
function setupNavigation() {
  document.addEventListener("click", (e) => {
    // Navegação por botões com data-target
    const btn = e.target.closest(".nav-link[data-target]");
    if(btn) {
      e.preventDefault();
      showSection(btn.getAttribute('data-target'));
      return;
    }
    
    // Navegação para seções específicas
    const anchorBtn = e.target.closest(".nav-link[href^='index.html#']");
    if(anchorBtn) {
      e.preventDefault();
      const targetId = anchorBtn.getAttribute('href').split('#')[1];
      window.location.href = `index.html#${targetId}`;
      showSection(targetId);
    }
    
    // Botão de voltar
    const backBtn = e.target.closest(".back-btn");
    if(backBtn) {
      e.preventDefault();
      const targetId = backBtn.getAttribute('data-back');
      showSection(targetId);
    }
    
    // Links para disciplinas específicas
    const subjectBtn = e.target.closest("a[data-show]");
    if(subjectBtn) {
      e.preventDefault();
      const targetId = subjectBtn.getAttribute('data-show');
      showSection(targetId);
    }
  });
}

// Configurar alternância de visualização (lista/cards)
function setupViewToggle() {
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.view-toggle-btn');
    if (!toggleBtn) return;
    
    const viewType = toggleBtn.getAttribute('data-view');
    const section = toggleBtn.closest('.content-section');
    
    if (!section) return;
    
    // Encontrar os containers de visualização nesta seção
    const listContainer = section.querySelector('.file-list');
    const cardContainer = section.querySelector('.card-view');
    
    if (!listContainer || !cardContainer) return;
    
    // Ativar/desativar botões
    section.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    toggleBtn.classList.add('active');
    
    // Alternar visualizações
    if (viewType === 'list-view') {
      listContainer.classList.remove('hidden');
      cardContainer.classList.add('hidden');
    } else if (viewType === 'card-view') {
      listContainer.classList.add('hidden');
      cardContainer.classList.remove('hidden');
    }
  });
}

// Configurar botão de voltar ao topo
function setupBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;
  
  // Mostrar/ocultar botão ao rolar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Rolar para o topo ao clicar
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Função para mostrar notificação
function showNotification(message) {
  let notification = document.getElementById('share-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'share-notification';
    document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  notification.className = 'show';
  
  setTimeout(() => {
    notification.className = '';
  }, 3000);
}

// Função para compartilhar arquivo
function shareFile(fileName, fileLink) {
  const shareText = `Confira este material da Biblioteca Didática SRE Araguaína:\n\n${fileName}\n\nAcesse em: ${fileLink}`;
  
  if (navigator.share) {
    // Usar Web Share API se disponível (principalmente em dispositivos móveis)
    navigator.share({
      title: fileName,
      text: `Material da Biblioteca Didática SRE Araguaína: ${fileName}`,
      url: fileLink
    }).then(() => {
      showNotification('Compartilhado com sucesso!');
    }).catch(err => {
      console.log('Erro ao compartilhar:', err);
      // Fallback para cópia manual
      copyToClipboard(shareText);
    });
  } else {
    // Fallback para desktop - copiar para área de transferência
    copyToClipboard(shareText);
  }
}

// Função para copiar texto para área de transferência
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Link copiado para a área de transferência!');
  }).catch(err => {
    console.error('Erro ao copiar:', err);
    // Fallback para método antigo
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showNotification('Link copiado para a área de transferência!');
  });
}

/* ===== FUNÇÕES DE FAVORITOS ===== */

// Gerenciamento de favoritos
class FavoritesManager {
  constructor() {
    this.storageKey = 'bibliotecaFavoritos';
    this.favorites = this.loadFavorites();
  }

  loadFavorites() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Erro ao carregar favoritos:', e);
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
    } catch (e) {
      console.error('Erro ao salvar favoritos:', e);
    }
  }

  addFavorite(file) {
    // Verifica se já não está nos favoritos
    if (!this.isFavorite(file.id)) {
      const favorite = {
        ...file,
        addedAt: new Date().toISOString(),
        subject: this.getSubjectFromSection() || 'Geral'
      };
      this.favorites.push(favorite);
      this.saveFavorites();
      showNotification(`${file.name} adicionado aos favoritos!`);
      return true;
    }
    return false;
  }

  removeFavorite(fileId) {
    const index = this.favorites.findIndex(f => f.id === fileId);
    if (index !== -1) {
      const removed = this.favorites.splice(index, 1)[0];
      this.saveFavorites();
      showNotification(`${removed.name} removido dos favoritos!`);
      return true;
    }
    return false;
  }

  toggleFavorite(file) {
    if (this.isFavorite(file.id)) {
      this.removeFavorite(file.id);
      return false;
    } else {
      this.addFavorite(file);
      return true;
    }
  }

  isFavorite(fileId) {
    return this.favorites.some(f => f.id === fileId);
  }

  getAllFavorites() {
    return [...this.favorites].reverse(); // Mais recentes primeiro
  }

  getSubjectFromSection() {
    // Tenta determinar a disciplina atual baseada na seção ativa
    const activeSection = document.querySelector('.content-section:not(.hidden)');
    if (activeSection) {
      const sectionId = activeSection.id;
      // Mapeamento de seções para disciplinas
      if (sectionId === 'linguagens') {
        // Tenta identificar qual disciplina específica dentro de linguagens
        const subjectTitle = activeSection.querySelector('.subject-title');
        if (subjectTitle) {
          const titleText = subjectTitle.textContent.toLowerCase();
          if (titleText.includes('português') || titleText.includes('portuguesa')) return 'Língua Portuguesa';
          if (titleText.includes('inglês')) return 'Língua Inglesa';
          if (titleText.includes('espanhol')) return 'Espanhol';
          if (titleText.includes('libras')) return 'Libras';
          if (titleText.includes('artes')) return 'Artes';
          if (titleText.includes('física') && !titleText.includes('educação')) return 'Educação Física';
        }
        return 'Linguagens';
      }
      if (sectionId === 'matematica') return 'Matemática';
      if (sectionId === 'cienciasnaturais') return 'Ciências da Natureza';
      if (sectionId === 'humanas') return 'Ciências Humanas';
      if (sectionId === 'adaptadas') return 'Atividades Adaptadas';
    }
    return 'Geral';
  }

  clearFavorites() {
    if (this.favorites.length > 0 && confirm('Tem certeza que deseja remover todos os favoritos?')) {
      this.favorites = [];
      this.saveFavorites();
      showNotification('Todos os favoritos foram removidos!');
      return true;
    }
    return false;
  }
}

// Instância global do gerenciador de favoritos
const favoritesManager = new FavoritesManager();

// Função para criar botão de favorito
function createFavoriteButton(file) {
  const button = document.createElement('button');
  button.className = 'favorite-btn';
  button.setAttribute('aria-label', favoritesManager.isFavorite(file.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
  button.innerHTML = favoritesManager.isFavorite(file.id) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
  button.dataset.fileId = file.id;
  
  if (favoritesManager.isFavorite(file.id)) {
    button.classList.add('favorited');
  }
  
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowFavorite = favoritesManager.toggleFavorite(file);
    
    // Atualiza o ícone do botão
    button.innerHTML = isNowFavorite ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    if (isNowFavorite) {
      button.classList.add('favorited');
    } else {
      button.classList.remove('favorited');
    }
    button.setAttribute('aria-label', isNowFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    
    // Atualiza contador de favoritos
    updateFavoritesCount();
    
    // Se estiver na seção de favoritos, recarrega a lista
    if (document.getElementById('favoritos') && !document.getElementById('favoritos').classList.contains('hidden')) {
      loadFavorites();
    }
  });
  
  return button;
}

// Função para carregar e exibir favoritos na página principal
function loadFavorites() {
  const favoritesSection = document.getElementById('favoritos');
  if (!favoritesSection) return;
  
  const listEl = favoritesSection.querySelector('.file-list');
  const cardEl = favoritesSection.querySelector('.card-view');
  const emptyEl = favoritesSection.querySelector('.empty-state');
  const loadingEl = favoritesSection.querySelector('.loading-state');
  
  if (loadingEl) loadingEl.hidden = true;
  
  const favorites = favoritesManager.getAllFavorites();
  
  if (favorites.length === 0) {
    if (emptyEl) emptyEl.hidden = false;
    if (listEl) listEl.innerHTML = '';
    if (cardEl) cardEl.innerHTML = '';
    return;
  }
  
  if (emptyEl) emptyEl.hidden = true;
  
  // Renderizar em lista
  if (listEl) {
    listEl.innerHTML = '';
    favorites.forEach(file => {
      const icon = iconForMime(file.mimeType);
      const when = new Date(file.addedAt).toLocaleDateString("pt-BR");
      const link = file.webViewLink || file.webContentLink || `https://drive.google.com/file/d/${file.id}/view`;
      
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="title">
          <button class="favorite-btn favorited" data-fileid="${file.id}" style="margin-right: 10px; background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #ffcc00;"><i class="fas fa-star"></i></button>
          <a href="${link}" target="_blank" rel="noopener">${icon} ${file.name}</a>
          <div style="margin-left: auto; display: flex; gap: 10px;">
            <button class="share-btn" data-filename="${file.name}" data-link="${link}">
              <i class="fa fa-share-alt" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div class="meta">
          <span>Adicionado em ${when}</span>
          <span class="subject-badge">${file.subject || 'Geral'}</span>
        </div>
      `;
      listEl.appendChild(li);
    });
  }
  
  // Renderizar em cards
  if (cardEl) {
    cardEl.innerHTML = '';
    favorites.forEach(file => {
      const icon = iconForMime(file.mimeType);
      const when = new Date(file.addedAt).toLocaleDateString("pt-BR");
      const link = file.webViewLink || file.webContentLink || `https://drive.google.com/file/d/${file.id}/view`;
      
      const card = document.createElement('div');
      card.className = 'file-card';
      card.innerHTML = `
        <div class="file-card-header">
          <button class="favorite-btn favorited" data-fileid="${file.id}" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer; font-size: 1.5rem; color: #ffcc00; z-index: 2;"><i class="fas fa-star"></i></button>
          <div class="file-icon">${icon}</div>
        </div>
        <div class="file-name">${file.name}</div>
        <div class="file-meta">
          <div class="file-date">Adicionado em ${when}</div>
          <div class="subject-badge">${file.subject || 'Geral'}</div>
        </div>
        <div class="file-actions" style="display: flex; gap: 10px; margin-top: 15px; justify-content: center;">
          <a href="${link}" class="file-link" target="_blank" rel="noopener">Abrir</a>
          <button class="share-btn share-btn-card" data-filename="${file.name}" data-link="${link}">
            <i class="fa fa-share-alt" aria-hidden="true"></i>
          </button>
        </div>
      `;
      cardEl.appendChild(card);
    });
  }
  
  // Adicionar event listeners para os botões
  setupFavoritesEventListeners();
}

// Configurar event listeners para botões de favoritos
function setupFavoritesEventListeners() {
  // Botões de favorito na seção de favoritos
  document.querySelectorAll('.favorite-btn[data-fileid]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const fileId = btn.getAttribute('data-fileid');
      const file = favoritesManager.favorites.find(f => f.id === fileId);
      
      if (file) {
        const wasFavorite = favoritesManager.isFavorite(fileId);
        favoritesManager.toggleFavorite(file);
        
        // Atualiza o botão
        if (wasFavorite) {
          btn.innerHTML = '<i class="far fa-star"></i>';
          btn.classList.remove('favorited');
          btn.setAttribute('aria-label', 'Adicionar aos favoritos');
        } else {
          btn.innerHTML = '<i class="fas fa-star"></i>';
          btn.classList.add('favorited');
          btn.setAttribute('aria-label', 'Remover dos favoritos');
        }
        
        // Atualiza contador
        updateFavoritesCount();
        
        // Recarrega a lista se estiver na página de favoritos
        if (document.getElementById('favoritos') && !document.getElementById('favoritos').classList.contains('hidden')) {
          loadFavorites();
        }
      }
    });
  });
  
  // Botões de compartilhamento
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const fileName = btn.getAttribute('data-filename');
      const fileLink = btn.getAttribute('data-link');
      shareFile(fileName, fileLink);
    });
  });
}

// Função para configurar botão de limpar favoritos
function setupClearFavorites() {
  const clearBtn = document.querySelector('.clear-favorites-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (favoritesManager.clearFavorites()) {
        loadFavorites();
        updateFavoritesCount();
      }
    });
  }
}

// Função principal para carregar arquivos (ATUALIZADA COM FAVORITOS CORRIGIDA)
async function loadFiles(folderId, {listId, cardId, loadingId, emptyId, errorId, searchId}) {
  const listEl = document.getElementById(listId);
  const cardEl = document.getElementById(cardId);
  const loadingEl = document.getElementById(loadingId);
  const emptyEl = document.getElementById(emptyId);
  const errorEl = document.getElementById(errorId);
  const searchEl = document.getElementById(searchId);

  if(!folderId || folderId.startsWith("ID_PASTA_")) { 
    listEl.innerHTML = "<li>Pasta não configurada.</li>"; 
    cardEl.innerHTML = "<div class='file-card'>Pasta não configurada.</div>";
    loadingEl.hidden = true;
    emptyEl.hidden = true;
    return; 
  }

  // Mostra skeletons
  listEl.innerHTML = `
    <li class="skeleton-item"></li>
    <li class="skeleton-item"></li>
    <li class="skeleton-item"></li>
  `;
  cardEl.innerHTML = `
    <div class="file-card" style="min-height: 150px;"></div>
    <div class="file-card" style="min-height: 150px;"></div>
    <div class="file-card" style="min-height: 150px;"></div>
  `;
  loadingEl.hidden = false;
  emptyEl.hidden = true;
  errorEl.hidden = true;

  const fields = "files(id,name,mimeType,modifiedTime,webViewLink,webContentLink,iconLink)";
  const url = `https://www.googleapis.com/drive/v3/files?q='${encodeURIComponent(folderId)}'+in+parents+and+trashed=false&orderBy=modifiedTime%20desc&fields=${fields}&key=${encodeURIComponent(window.CONFIG.API_KEY)}`;

  try {
    const res = await fetch(url);
    if(!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const files = data.files || [];

    if(files.length === 0) {
      emptyEl.hidden = false;
      listEl.innerHTML = "";
      cardEl.innerHTML = "";
      return;
    }

    const render = (items, searchTerm = '') => {
      // Limpar resultados anteriores
      listEl.innerHTML = "";
      cardEl.innerHTML = "";
      
      // Renderizar lista
      for(const file of items) {
        const icon = iconForMime(file.mimeType);
        const when = new Date(file.modifiedTime).toLocaleDateString("pt-BR");
        const link = file.webViewLink || file.webContentLink || `https://drive.google.com/file/d/${file.id}/view`;
        
        // Criar botão de favorito
        const favoriteBtn = createFavoriteButton(file);
        
        // Adicionar à visualização em lista (estrela à esquerda do nome)
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="title" style="display: flex; align-items: center; gap: 10px;">
            <div class="favorite-btn-container" style="flex-shrink: 0;"></div>
            <a href="${link}" target="_blank" rel="noopener" style="flex-grow: 1;">${icon} ${file.name}</a>
            <button class="share-btn" data-filename="${file.name}" data-link="${link}" style="flex-shrink: 0;">
              <i class="fa fa-share-alt" aria-hidden="true"></i>
            </button>
          </div>
          <div class="meta">Atualizado em ${when}</div>
        `;
        
        // Adicionar botão de favorito
        const favContainer = li.querySelector('.favorite-btn-container');
        favContainer.appendChild(favoriteBtn);
        
        listEl.appendChild(li);
        
        // Adicionar botão de compartilhamento na visualização em cards (estrela no canto superior direito)
        const card = document.createElement("div");
        card.className = "file-card";
        card.style.position = "relative";
        card.innerHTML = `
          <div class="favorite-btn-container" style="position: absolute; top: 10px; right: 10px; z-index: 2;"></div>
          <div class="file-icon">${icon}</div>
          <div class="file-name">${file.name}</div>
          <div class="file-date">Atualizado em ${when}</div>
          <div style="display: flex; gap: 10px; margin-top: 10px; justify-content: center;">
            <a href="${link}" class="file-link" target="_blank" rel="noopener">Abrir</a>
            <button class="share-btn share-btn-card" data-filename="${file.name}" data-link="${link}">
              <i class="fa fa-share-alt" aria-hidden="true"></i> Compartilhar
            </button>
          </div>
        `;
        
        // Adicionar botão de favorito no card (clone porque o evento foi anexado ao botão original)
        const cardFavContainer = card.querySelector('.favorite-btn-container');
        const favoriteBtnClone = favoriteBtn.cloneNode(true);
        // Reanexar evento ao clone
        favoriteBtnClone.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isNowFavorite = favoritesManager.toggleFavorite(file);
          
          // Atualiza o ícone do botão
          favoriteBtnClone.innerHTML = isNowFavorite ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
          if (isNowFavorite) {
            favoriteBtnClone.classList.add('favorited');
          } else {
            favoriteBtnClone.classList.remove('favorited');
          }
          favoriteBtnClone.setAttribute('aria-label', isNowFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
          
          // Atualiza o botão original também
          favoriteBtn.innerHTML = favoriteBtnClone.innerHTML;
          if (isNowFavorite) {
            favoriteBtn.classList.add('favorited');
          } else {
            favoriteBtn.classList.remove('favorited');
          }
          
          // Atualiza contador
          updateFavoritesCount();
        });
        cardFavContainer.appendChild(favoriteBtnClone);
        
        cardEl.appendChild(card);
      }
      
      // Adicionar event listeners para os botões de compartilhamento
      document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const fileName = btn.getAttribute('data-filename');
          const fileLink = btn.getAttribute('data-link');
          shareFile(fileName, fileLink);
        });
      });
    };

    render(files);

    if(searchEl) {
      searchEl.addEventListener("input", () => {
        const q = searchEl.value.trim().toLowerCase();
        const filtered = files.filter(f => f.name.toLowerCase().includes(q));
        
        if(filtered.length === 0) {
          listEl.innerHTML = "<li>Nenhum resultado para a busca.</li>";
          cardEl.innerHTML = "<div class='file-card'>Nenhum resultado para a busca.</div>";
        } else {
          render(filtered, q);
        }
      });
    }
  } catch(err) {
    console.error(err);
    errorEl.hidden = false;
  } finally {
    loadingEl.hidden = true;
  }
}

// Função para atualizar contador de favoritos
function updateFavoritesCount() {
  const count = favoritesManager.getAllFavorites().length;
  const counterElements = document.querySelectorAll('.favorites-count');
  
  counterElements.forEach(el => {
    el.textContent = ` (${count})`;
    el.style.display = count > 0 ? 'inline' : 'none';
  });
  
  // Atualizar também na página de favoritos se estiver aberta
  try {
    if (window.favoritesPage && typeof window.favoritesPage.updateStats === 'function') {
      window.favoritesPage.updateStats();
    }
  } catch (e) {
    // Ignorar erro se a página de favoritos não estiver acessível
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  submenuManager = setupSubmenu();
  setupMenuToggle();
  setupNavigation();
  setupViewToggle();
  setupBackToTop();
  setupClearFavorites();
  
  // Verifica se está na página principal
  if(document.getElementById('list-portugues')) {
    const F = window.CONFIG.FOLDER_IDS;
    
    // Carrega arquivos das disciplinas de Linguagens
    loadFiles(F.portugues, {listId:"list-portugues", cardId:"card-portugues", loadingId:"loading-portugues", emptyId:"empty-portugues", errorId:"error-portugues", searchId:"search-portugues"});
    loadFiles(F.ingles, {listId:"list-ingles", cardId:"card-ingles", loadingId:"loading-ingles", emptyId:"empty-ingles", errorId:"error-ingles", searchId:"search-ingles"});
    loadFiles(F.espanhol, {listId:"list-espanhol", cardId:"card-espanhol", loadingId:"loading-espanhol", emptyId:"empty-espanhol", errorId:"error-espanhol", searchId:"search-espanhol"});
    loadFiles(F.libras, {listId:"list-libras", cardId:"card-libras", loadingId:"loading-libras", emptyId:"empty-libras", errorId:"error-libras", searchId:"search-libras"});
    loadFiles(F.artes, {listId:"list-artes", cardId:"card-artes", loadingId:"loading-artes", emptyId:"empty-artes", errorId:"error-artes", searchId:"search-artes"});
    loadFiles(F.edfisica, {listId:"list-edfisica", cardId:"card-edfisica", loadingId:"loading-edfisica", emptyId:"empty-edfisica", errorId:"error-edfisica", searchId:"search-edfisica"});
    
    // Carrega arquivos das demais áreas
    loadFiles(F.matematica, {listId:"list-matematica", cardId:"card-matematica", loadingId:"loading-matematica", emptyId:"empty-matematica", errorId:"error-matematica", searchId:"search-matematica"});
    loadFiles(F.biologia, {listId:"list-biologia", cardId:"card-biologia", loadingId:"loading-biologia", emptyId:"empty-biologia", errorId:"error-biologia", searchId:"search-biologia"});
    loadFiles(F.fisica, {listId:"list-fisica", cardId:"card-fisica", loadingId:"loading-fisica", emptyId:"empty-fisica", errorId:"error-fisica", searchId:"search-fisica"});
    loadFiles(F.quimica, {listId:"list-quimica", cardId:"card-quimica", loadingId:"loading-quimica", emptyId:"empty-quimica", errorId:"error-quimica", searchId:"search-quimica"});
    loadFiles(F.ciencias, {listId:"list-ciencias", cardId:"card-ciencias", loadingId:"loading-ciencias", emptyId:"empty-ciencias", errorId:"error-ciencias", searchId:"search-ciencias"});
    loadFiles(F.historia, {listId:"list-historia", cardId:"card-historia", loadingId:"loading-historia", emptyId:"empty-historia", errorId:"error-historia", searchId:"search-historia"});
    loadFiles(F.geografia, {listId:"list-geografia", cardId:"card-geografia", loadingId:"loading-geografia", emptyId:"empty-geografia", errorId:"error-geografia", searchId:"search-geografia"});
    loadFiles(F.filosofia, {listId:"list-filosofia", cardId:"card-filosofia", loadingId:"loading-filosofia", emptyId:"empty-filosofia", errorId:"error-filosofia", searchId:"search-filosofia"});
    loadFiles(F.sociologia, {listId:"list-sociologia", cardId:"card-sociologia", loadingId:"loading-sociologia", emptyId:"empty-sociologia", errorId:"error-sociologia", searchId:"search-sociologia"});

    // Carrega arquivos das atividades adaptadas
    loadFiles(F.adaptadasEF, {listId:"list-adaptadasEF", cardId:"card-adaptadasEF", loadingId:"loading-adaptadasEF", emptyId:"empty-adaptadasEF", errorId:"error-adaptadasEF", searchId:"search-adaptadasEF"});
    loadFiles(F.adaptadasEM, {listId:"list-adaptadasEM", cardId:"card-adaptadasEM", loadingId:"loading-adaptadasEM", emptyId:"empty-adaptadasEM", errorId:"error-adaptadasEM", searchId:"search-adaptadasEM"});

    // Mostra seção inicial ou a partir do hash da URL
    const hash = window.location.hash.substring(1);
    showSection(hash || 'inicio');
  }
  
  // Ativa link ativo na página Sobre Nós
  if(window.location.pathname.includes('sobre.html')) {
    const sobreLink = document.querySelector('.nav-link[href="sobre.html"]');
    if (sobreLink) {
      sobreLink.classList.add('active');
    }
  }
  
  // Inicializa contador de favoritos
  updateFavoritesCount();
});