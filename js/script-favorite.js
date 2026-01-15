// Se showNotification não estiver disponível, crie uma versão simples
if (typeof showNotification === 'undefined') {
  window.showNotification = function(message) {
    alert(message); // Fallback simples
  };
}

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

  addFavorite(file, subject = null) { // ADICIONE O PARÂMETRO subject
    // Verifica se já não está nos favoritos
    if (!this.isFavorite(file.id)) {
      const favorite = {
        ...file,
        addedAt: new Date().toISOString(),
        subject: subject || this.getSubjectFromCurrentSection() || 'Geral' // Use o subject passado como parâmetro
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

  toggleFavorite(file, subject = null) { // ADICIONE O PARÂMETRO subject
    if (this.isFavorite(file.id)) {
      this.removeFavorite(file.id);
      return false;
    } else {
      this.addFavorite(file, subject); // Passe o subject para addFavorite
      return true;
    }
  }

  isFavorite(fileId) {
    return this.favorites.some(f => f.id === fileId);
  }

  getAllFavorites() {
    return [...this.favorites].reverse(); // Mais recentes primeiro
  }

  getSubjectFromCurrentSection() {
    // Tenta determinar a disciplina atual baseada na seção ativa
    const activeSection = document.querySelector('.content-section:not(.hidden)');
    if (activeSection) {
      const sectionId = activeSection.id;
      
      // Mapeamento direto das seções para disciplinas
      const sectionToSubject = {
        // Linguagens
        'portugues': 'Língua Portuguesa',
        'ingles': 'Língua Inglesa',
        'espanhol': 'Espanhol',
        'libras': 'Libras',
        'artes': 'Artes',
        'edfisica': 'Educação Física',
        
        // Matemática
        'matematica-disciplina': 'Matemática',
        
        // Ciências da Natureza
        'biologia': 'Biologia',
        'fisica': 'Física',
        'quimica': 'Química',
        'ciencias': 'Ciências',
        
        // Ciências Humanas
        'historia': 'História',
        'geografia': 'Geografia',
        'filosofia': 'Filosofia',
        'sociologia': 'Sociologia',
        
        // Atividades Adaptadas
        'adaptadasEF': 'Ensino Fundamental',
        'adaptadasEM': 'Ensino Médio'
      };
      
      return sectionToSubject[sectionId] || this.getSubjectFromSectionTitle(activeSection);
    }
    return 'Geral';
  }

  getSubjectFromSectionTitle(section) {
    // Tenta extrair a disciplina do título da seção
    const titleElement = section.querySelector('h2');
    if (titleElement) {
      const titleText = titleElement.textContent.trim();
      
      // Mapeamento de títulos para disciplinas
      const titleMap = {
        'Língua Portuguesa': 'Língua Portuguesa',
        'Português': 'Língua Portuguesa',
        'Língua Inglesa': 'Língua Inglesa',
        'Inglês': 'Língua Inglesa',
        'Espanhol': 'Espanhol',
        'Libras': 'Libras',
        'Artes': 'Artes',
        'Educação Física': 'Educação Física',
        'Matemática': 'Matemática',
        'Biologia': 'Biologia',
        'Física': 'Física',
        'Química': 'Química',
        'Ciências': 'Ciências',
        'História': 'História',
        'Geografia': 'Geografia',
        'Filosofia': 'Filosofia',
        'Sociologia': 'Sociologia',
        'Ensino Fundamental': 'Ensino Fundamental',
        'Ensino Médio': 'Ensino Médio'
      };
      
      for (const [key, value] of Object.entries(titleMap)) {
        if (titleText.includes(key)) {
          return value;
        }
      }
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

// Função para criar botão de favorito (ATUALIZADA)
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
    
    // Determina a disciplina atual
    const currentSubject = favoritesManager.getSubjectFromCurrentSection();
    
    const isNowFavorite = favoritesManager.toggleFavorite(file, currentSubject); // Passa o subject
    
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

// Função principal para carregar arquivos (ATUALIZADA - adicionar subject aos arquivos)
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

    // Determina a disciplina baseada na seção atual
    const currentSectionId = document.querySelector('.content-section:not(.hidden)')?.id;
    const sectionToSubjectMap = {
      // Linguagens
      'portugues': 'Língua Portuguesa',
      'ingles': 'Língua Inglesa',
      'espanhol': 'Espanhol',
      'libras': 'Libras',
      'artes': 'Artes',
      'edfisica': 'Educação Física',
      'matematica-disciplina': 'Matemática',
      'biologia': 'Biologia',
      'fisica': 'Física',
      'quimica': 'Química',
      'ciencias': 'Ciências',
      'historia': 'História',
      'geografia': 'Geografia',
      'filosofia': 'Filosofia',
      'sociologia': 'Sociologia',
      'adaptadasEF': 'Ensino Fundamental',
      'adaptadasEM': 'Ensino Médio'
    };
    
    const currentSubject = sectionToSubjectMap[currentSectionId] || 'Geral';

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
        
        // Adicionar botão de favorito no card
        const cardFavContainer = card.querySelector('.favorite-btn-container');
        const favoriteBtnClone = favoriteBtn.cloneNode(true);
        
        // Reanexar evento ao clone com o subject correto
        favoriteBtnClone.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const isNowFavorite = favoritesManager.toggleFavorite(file, currentSubject); // Passa o subject
          
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

// Adicione esta função para reparar favoritos existentes
function repairExistingFavorites() {
  try {
    const stored = localStorage.getItem('bibliotecaFavoritos');
    if (!stored) return;
    
    const favorites = JSON.parse(stored);
    let needsUpdate = false;
    
    // Mapeamento de IDs de arquivo para disciplinas (baseado nas pastas)
    // Você pode adicionar mais mapeamentos conforme necessário
    const fileIdToSubject = {
      // Exemplo: '1oCNLcON1a7WAtNcxPgQCpYz1G5YwghZZ': 'Língua Portuguesa',
      // Seria ideal se você tivesse uma forma de associar file.id à pasta de origem
    };
    
    favorites.forEach(favorite => {
      if (!favorite.subject || favorite.subject === 'undefined' || favorite.subject === 'Geral') {
        // Tentar determinar a disciplina pelo nome da seção original
        if (favorite.section) {
          const sectionMap = {
            'portugues': 'Língua Portuguesa',
            'ingles': 'Língua Inglesa',
            'espanhol': 'Espanhol',
            'libras': 'Libras',
            'artes': 'Artes',
            'edfisica': 'Educação Física',
            'matematica-disciplina': 'Matemática',
            'matematica': 'Matemática',
            'biologia': 'Biologia',
            'fisica': 'Física',
            'quimica': 'Química',
            'ciencias': 'Ciências',
            'historia': 'História',
            'geografia': 'Geografia',
            'filosofia': 'Filosofia',
            'sociologia': 'Sociologia',
            'adaptadasEF': 'Ensino Fundamental',
            'adaptadasEM': 'Ensino Médio'
          };
          
          favorite.subject = sectionMap[favorite.section] || 'Geral';
          needsUpdate = true;
        }
      }
    });
    
    if (needsUpdate) {
      localStorage.setItem('bibliotecaFavoritos', JSON.stringify(favorites));
      console.log('Favoritos reparados com sucesso!');
    }
  } catch (e) {
    console.error('Erro ao reparar favoritos:', e);
  }
}

// Adicione esta chamada no final do DOMContentLoaded:
document.addEventListener("DOMContentLoaded", () => {
  // ... código existente ...
  
  // Reparar favoritos existentes
  repairExistingFavorites();
  
  // ... resto do código ...
});