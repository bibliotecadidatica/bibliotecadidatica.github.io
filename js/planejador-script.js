// Variáveis globais
let aulas = [];
let aulaCounter = 1;
let etapaCounter = {};

// Configuração inicial
document.addEventListener('DOMContentLoaded', function() {
    carregarConfiguracoes();
    inicializarEventListeners();
    atualizarResumo();
    carregarRascunhos();
});

// Carregar configurações salvas
function carregarConfiguracoes() {
    const config = JSON.parse(localStorage.getItem('planejador_config') || '{}');
    
    if (config.disciplina) {
        document.getElementById('disciplina').value = config.disciplina;
    }
    if (config.turma) {
        document.getElementById('turma').value = config.turma;
    }
    if (config.tema) {
        document.getElementById('tema').value = config.tema;
    }
    if (config.duracao) {
        document.getElementById('duracao').value = config.duracao;
    }
    if (config.competencias) {
        document.getElementById('competencias').value = config.competencias;
    }
    
    // Carregar aulas salvas
    const aulasSalvas = JSON.parse(localStorage.getItem('planejador_aulas') || '[]');
    if (aulasSalvas.length > 0) {
        aulasSalvas.forEach(aulaData => {
            adicionarAulaComDados(aulaData);
        });
    }
}

// Salvar configurações
function salvarConfiguracoes() {
    const config = {
        disciplina: document.getElementById('disciplina').value,
        turma: document.getElementById('turma').value,
        tema: document.getElementById('tema').value,
        duracao: document.getElementById('duracao').value,
        competencias: document.getElementById('competencias').value
    };
    
    localStorage.setItem('planejador_config', JSON.stringify(config));
}

// Inicializar event listeners
function inicializarEventListeners() {
    // Campos de configuração
    const camposConfig = ['disciplina', 'turma', 'tema', 'duracao', 'competencias'];
    camposConfig.forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            salvarConfiguracoes();
            atualizarResumo();
        });
    });
    
    // Botão nova aula
    document.getElementById('btn-nova-aula').addEventListener('click', adicionarNovaAula);
    
    // Botões de exportação
    document.getElementById('btn-export-docx').addEventListener('click', exportarParaDOCX);
    document.getElementById('btn-export-pdf').addEventListener('click', exportarParaPDF);
    document.getElementById('btn-imprimir').addEventListener('click', () => window.print());
    
    // Botões de rascunho
    document.getElementById('btn-salvar-rascunho').addEventListener('click', mostrarModalRascunhos);
    document.getElementById('btn-carregar-rascunho').addEventListener('click', mostrarModalRascunhos);
    document.getElementById('btn-salvar-como').addEventListener('click', salvarComoRascunho);
    
    // Fechar modal
    document.querySelector('.btn-close-modal').addEventListener('click', () => {
        document.getElementById('modal-rascunhos').classList.add('hidden');
    });
    
    // Fechar modal ao clicar fora
    document.getElementById('modal-rascunhos').addEventListener('click', (e) => {
        if (e.target.id === 'modal-rascunhos') {
            e.target.classList.add('hidden');
        }
    });
}

// Atualizar resumo
function atualizarResumo() {
    document.getElementById('summary-disciplina').textContent = 
        document.getElementById('disciplina').value || 'Não definida';
    
    document.getElementById('summary-turma').textContent = 
        document.getElementById('turma').value || 'Não definida';
    
    document.getElementById('summary-tema').textContent = 
        document.getElementById('tema').value || 'Não definido';
    
    document.getElementById('summary-duracao').textContent = 
        document.getElementById('duracao').value || '0';
}

// Adicionar nova aula
function adicionarNovaAula() {
    const aulaId = aulaCounter++;
    etapaCounter[aulaId] = 1;
    
    const template = document.getElementById('aula-template').cloneNode(true);
    template.classList.remove('hidden');
    template.removeAttribute('id');
    template.querySelector('.aula-numero').textContent = aulas.length + 1;
    
    // Adicionar eventos aos botões
    template.querySelector('.btn-remove-aula').addEventListener('click', function() {
        removerAula(aulaId);
    });
    
    template.querySelector('.btn-move-up').addEventListener('click', function() {
        moverAulaParaCima(aulaId);
    });
    
    template.querySelector('.btn-move-down').addEventListener('click', function() {
        moverAulaParaBaixo(aulaId);
    });
    
    template.querySelector('.btn-add-etapa').addEventListener('click', function() {
        adicionarEtapa(aulaId);
    });
    
    // Adicionar primeira etapa
    adicionarEtapa(aulaId, template);
    
    // Adicionar ao DOM
    const container = document.getElementById('aulas-container');
    const emptyState = document.getElementById('empty-state');
    
    if (emptyState) {
        emptyState.classList.add('hidden');
    }
    
    container.appendChild(template);
    
    // Salvar referência da aula
    aulas.push({
        id: aulaId,
        element: template,
        numero: aulas.length + 1
    });
    
    // Salvar no localStorage
    salvarAulasNoLocalStorage();
    
    // Atualizar números das aulas
    atualizarNumeracaoAulas();
}

// Adicionar aula com dados (para carregamento)
function adicionarAulaComDados(aulaData) {
    const aulaId = aulaCounter++;
    etapaCounter[aulaId] = aulaData.etapas ? aulaData.etapas.length + 1 : 1;
    
    const template = document.getElementById('aula-template').cloneNode(true);
    template.classList.remove('hidden');
    template.removeAttribute('id');
    template.querySelector('.aula-numero').textContent = aulas.length + 1;
    
    // Preencher dados da aula
    if (aulaData.titulo) {
        template.querySelector('.aula-titulo-input').value = aulaData.titulo;
    }
    if (aulaData.duracao) {
        template.querySelector('.aula-duracao').value = aulaData.duracao;
    }
    if (aulaData.data) {
        template.querySelector('.aula-data').value = aulaData.data;
    }
    if (aulaData.objetivos) {
        template.querySelector('.aula-objetivos').value = aulaData.objetivos;
    }
    if (aulaData.recursos) {
        template.querySelector('.aula-recursos').value = aulaData.recursos;
    }
    if (aulaData.avaliacao) {
        template.querySelector('.aula-avaliacao').value = aulaData.avaliacao;
    }
    if (aulaData.observacoes) {
        template.querySelector('.aula-observacoes').value = aulaData.observacoes;
    }
    
    // Adicionar eventos
    template.querySelector('.btn-remove-aula').addEventListener('click', function() {
        removerAula(aulaId);
    });
    
    template.querySelector('.btn-move-up').addEventListener('click', function() {
        moverAulaParaCima(aulaId);
    });
    
    template.querySelector('.btn-move-down').addEventListener('click', function() {
        moverAulaParaBaixo(aulaId);
    });
    
    template.querySelector('.btn-add-etapa').addEventListener('click', function() {
        adicionarEtapa(aulaId);
    });
    
    // Adicionar etapas
    if (aulaData.etapas && aulaData.etapas.length > 0) {
        aulaData.etapas.forEach((etapa, index) => {
            adicionarEtapa(aulaId, template, etapa, index + 1);
        });
    } else {
        adicionarEtapa(aulaId, template);
    }
    
    // Adicionar ao DOM
    const container = document.getElementById('aulas-container');
    const emptyState = document.getElementById('empty-state');
    
    if (emptyState) {
        emptyState.classList.add('hidden');
    }
    
    container.appendChild(template);
    
    // Salvar referência
    aulas.push({
        id: aulaId,
        element: template,
        numero: aulas.length + 1
    });
}

// Adicionar etapa
function adicionarEtapa(aulaId, aulaElement = null, etapaData = null, numeroEtapa = null) {
    const aula = aulas.find(a => a.id === aulaId);
    if (!aula) return;
    
    const aulaElem = aulaElement || aula.element;
    const etapasContainer = aulaElem.querySelector('.etapas-container');
    const etapaNumero = numeroEtapa || etapaCounter[aulaId]++;
    
    // Criar nova etapa
    const etapaDiv = document.createElement('div');
    etapaDiv.className = 'etapa';
    etapaDiv.innerHTML = `
        <div class="etapa-header">
            <span class="etapa-numero">${etapaNumero}</span>
            <input type="text" class="etapa-titulo" placeholder="Título da etapa" 
                   value="${etapaData?.titulo || ''}">
            <span class="etapa-tempo">(${etapaData?.tempo || '00'} min)</span>
        </div>
        <textarea class="etapa-descricao" placeholder="Descreva esta etapa da aula...">${etapaData?.descricao || ''}</textarea>
        <button class="btn-small btn-remove-etapa">Remover</button>
    `;
    
    // Evento para remover etapa
    etapaDiv.querySelector('.btn-remove-etapa').addEventListener('click', function() {
        etapaDiv.remove();
        salvarAulasNoLocalStorage();
    });
    
    // Evento para atualizar tempo
    const tempoInput = etapaDiv.querySelector('.etapa-tempo');
    etapaDiv.querySelector('.etapa-titulo').addEventListener('input', salvarAulasNoLocalStorage);
    etapaDiv.querySelector('.etapa-descricao').addEventListener('input', salvarAulasNoLocalStorage);
    
    etapasContainer.appendChild(etapaDiv);
    salvarAulasNoLocalStorage();
}

// Remover aula
function removerAula(aulaId) {
    if (!confirm('Tem certeza que deseja remover esta aula?')) return;
    
    const index = aulas.findIndex(a => a.id === aulaId);
    if (index === -1) return;
    
    aulas[index].element.remove();
    aulas.splice(index, 1);
    
    delete etapaCounter[aulaId];
    
    // Atualizar números
    atualizarNumeracaoAulas();
    
    // Verificar se não há mais aulas
    if (aulas.length === 0) {
        document.getElementById('empty-state').classList.remove('hidden');
    }
    
    salvarAulasNoLocalStorage();
}

// Mover aula para cima
function moverAulaParaCima(aulaId) {
    const index = aulas.findIndex(a => a.id === aulaId);
    if (index <= 0) return;
    
    // Trocar posição no array
    [aulas[index], aulas[index - 1]] = [aulas[index - 1], aulas[index]];
    
    // Trocar posição no DOM
    const container = document.getElementById('aulas-container');
    if (index > 0) {
        container.insertBefore(aulas[index].element, aulas[index - 1].element);
    }
    
    atualizarNumeracaoAulas();
    salvarAulasNoLocalStorage();
}

// Mover aula para baixo
function moverAulaParaBaixo(aulaId) {
    const index = aulas.findIndex(a => a.id === aulaId);
    if (index === -1 || index >= aulas.length - 1) return;
    
    // Trocar posição no array
    [aulas[index], aulas[index + 1]] = [aulas[index + 1], aulas[index]];
    
    // Trocar posição no DOM
    const container = document.getElementById('aulas-container');
    if (index < aulas.length - 1) {
        const nextElement = aulas[index + 1].element.nextElementSibling;
        if (nextElement) {
            container.insertBefore(aulas[index].element, nextElement);
        } else {
            container.appendChild(aulas[index].element);
        }
    }
    
    atualizarNumeracaoAulas();
    salvarAulasNoLocalStorage();
}

// Atualizar numeração das aulas
function atualizarNumeracaoAulas() {
    aulas.forEach((aula, index) => {
        aula.numero = index + 1;
        aula.element.querySelector('.aula-numero').textContent = index + 1;
        
        // Atualizar numeração das etapas
        const etapas = aula.element.querySelectorAll('.etapa');
        etapas.forEach((etapa, etapaIndex) => {
            etapa.querySelector('.etapa-numero').textContent = etapaIndex + 1;
        });
    });
}

// Salvar aulas no localStorage
function salvarAulasNoLocalStorage() {
    const aulasData = aulas.map(aula => {
        const element = aula.element;
        return {
            id: aula.id,
            titulo: element.querySelector('.aula-titulo-input').value,
            duracao: element.querySelector('.aula-duracao').value,
            data: element.querySelector('.aula-data').value,
            objetivos: element.querySelector('.aula-objetivos').value,
            recursos: element.querySelector('.aula-recursos').value,
            avaliacao: element.querySelector('.aula-avaliacao').value,
            observacoes: element.querySelector('.aula-observacoes').value,
            etapas: Array.from(element.querySelectorAll('.etapa')).map(etapa => ({
                titulo: etapa.querySelector('.etapa-titulo').value,
                descricao: etapa.querySelector('.etapa-descricao').value
            }))
        };
    });
    
    localStorage.setItem('planejador_aulas', JSON.stringify(aulasData));
}

// Mostrar modal de rascunhos
function mostrarModalRascunhos() {
    carregarRascunhos();
    document.getElementById('modal-rascunhos').classList.remove('hidden');
}

// Carregar rascunhos salvos
function carregarRascunhos() {
    const rascunhos = JSON.parse(localStorage.getItem('planejador_rascunhos') || '[]');
    const lista = document.getElementById('rascunhos-list');
    
    lista.innerHTML = '';
    
    if (rascunhos.length === 0) {
        lista.innerHTML = '<div class="empty-rascunhos">Nenhum rascunho salvo</div>';
        return;
    }
    
    rascunhos.forEach((rascunho, index) => {
        const item = document.createElement('div');
        item.className = 'rascunho-item';
        item.innerHTML = `
            <div class="rascunho-info">
                <h5>${rascunho.nome}</h5>
                <p>${rascunho.disciplina} • ${rascunho.turma} • ${rascunho.aulas} aulas</p>
                <small>Salvo em: ${new Date(rascunho.data).toLocaleDateString()}</small>
            </div>
            <div class="rascunho-actions">
                <button class="btn-small btn-carregar-rascunho" data-index="${index}">
                    <i class="fas fa-folder-open"></i>
                </button>
                <button class="btn-small btn-excluir-rascunho" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        lista.appendChild(item);
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.btn-carregar-rascunho').forEach(btn => {
        btn.addEventListener('click', function() {
            carregarRascunho(this.dataset.index);
        });
    });
    
    document.querySelectorAll('.btn-excluir-rascunho').forEach(btn => {
        btn.addEventListener('click', function() {
            excluirRascunho(this.dataset.index);
        });
    });
}

// Salvar como rascunho
function salvarComoRascunho() {
    const nome = document.getElementById('nome-rascunho').value.trim();
    if (!nome) {
        alert('Por favor, digite um nome para o rascunho.');
        return;
    }
    
    // Coletar dados do planejamento atual
    const dadosPlanejamento = {
        nome: nome,
        data: new Date().toISOString(),
        disciplina: document.getElementById('disciplina').value,
        turma: document.getElementById('turma').value,
        tema: document.getElementById('tema').value,
        duracao: document.getElementById('duracao').value,
        competencias: document.getElementById('competencias').value,
        aulas: coletarDadosAulas()
    };
    
    // Salvar no localStorage
    let rascunhos = JSON.parse(localStorage.getItem('planejador_rascunhos') || '[]');
    rascunhos.push(dadosPlanejamento);
    localStorage.setItem('planejador_rascunhos', JSON.stringify(rascunhos));
    
    // Atualizar lista
    carregarRascunhos();
    
    // Limpar campo
    document.getElementById('nome-rascunho').value = '';
    
    alert('Rascunho salvo com sucesso!');
}

// Coletar dados das aulas
function coletarDadosAulas() {
    return aulas.map(aula => {
        const element = aula.element;
        return {
            titulo: element.querySelector('.aula-titulo-input').value,
            duracao: element.querySelector('.aula-duracao').value,
            data: element.querySelector('.aula-data').value,
            objetivos: element.querySelector('.aula-objetivos').value,
            recursos: element.querySelector('.aula-recursos').value,
            avaliacao: element.querySelector('.aula-avaliacao').value,
            observacoes: element.querySelector('.aula-observacoes').value,
            etapas: Array.from(element.querySelectorAll('.etapa')).map(etapa => ({
                titulo: etapa.querySelector('.etapa-titulo').value,
                descricao: etapa.querySelector('.etapa-descricao').value
            }))
        };
    });
}

// Carregar rascunho
function carregarRascunho(index) {
    if (!confirm('Carregar este rascunho? O planejamento atual será perdido.')) return;
    
    const rascunhos = JSON.parse(localStorage.getItem('planejador_rascunhos') || '[]');
    const rascunho = rascunhos[index];
    
    if (!rascunho) return;
    
    // Limpar aulas atuais
    aulas.forEach(aula => aula.element.remove());
    aulas = [];
    aulaCounter = 1;
    etapaCounter = {};
    
    // Carregar configurações
    document.getElementById('disciplina').value = rascunho.disciplina;
    document.getElementById('turma').value = rascunho.turma;
    document.getElementById('tema').value = rascunho.tema;
    document.getElementById('duracao').value = rascunho.duracao;
    document.getElementById('competencias').value = rascunho.competencias;
    
    // Carregar aulas
    if (rascunho.aulas && rascunho.aulas.length > 0) {
        rascunho.aulas.forEach(aulaData => {
            adicionarAulaComDados(aulaData);
        });
    }
    
    salvarConfiguracoes();
    atualizarResumo();
    
    // Fechar modal
    document.getElementById('modal-rascunhos').classList.add('hidden');
    
    alert('Rascunho carregado com sucesso!');
}

// Excluir rascunho
function excluirRascunho(index) {
    if (!confirm('Tem certeza que deseja excluir este rascunho?')) return;
    
    let rascunhos = JSON.parse(localStorage.getItem('planejador_rascunhos') || '[]');
    rascunhos.splice(index, 1);
    localStorage.setItem('planejador_rascunhos', JSON.stringify(rascunhos));
    
    carregarRascunhos();
}

// Exportar para DOCX
async function exportarParaDOCX() {
    if (aulas.length === 0) {
        alert('Adicione pelo menos uma aula para exportar.');
        return;
    }
    
    try {
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell } = window.docx;
        
        // Criar documento
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    // Cabeçalho
                    new Paragraph({
                        text: "PLANEJAMENTO DE AULAS - SRE ARAGUAÍNA",
                        heading: HeadingLevel.TITLE,
                        spacing: { after: 200 }
                    }),
                    
                    // Informações gerais
                    new Paragraph({
                        text: "INFORMAÇÕES GERAIS",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 100 }
                    }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Disciplina: ", bold: true }),
                            new TextRun({ text: document.getElementById('disciplina').value || 'Não informada' })
                        ],
                        spacing: { after: 20 }
                    }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Turma/Série: ", bold: true }),
                            new TextRun({ text: document.getElementById('turma').value || 'Não informada' })
                        ],
                        spacing: { after: 20 }
                    }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Tema: ", bold: true }),
                            new TextRun({ text: document.getElementById('tema').value || 'Não informado' })
                        ],
                        spacing: { after: 20 }
                    }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Duração: ", bold: true }),
                            new TextRun({ text: (document.getElementById('duracao').value || '0') + ' aulas' })
                        ],
                        spacing: { after: 20 }
                    }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Competências da BNCC: ", bold: true }),
                        ],
                        spacing: { after: 10 }
                    }),
                    
                    new Paragraph({
                        text: document.getElementById('competencias').value || 'Não informadas',
                        spacing: { after: 200 }
                    }),
                    
                    // Aulas
                    new Paragraph({
                        text: "SEQUÊNCIA DIDÁTICA",
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 200, after: 100 }
                    })
                ]
            }]
        });
        
        // Adicionar cada aula
        aulas.forEach((aula, index) => {
            const element = aula.element;
            
            // Título da aula
            doc.addSection({
                properties: {},
                children: [
                    new Paragraph({
                        text: `AULA ${index + 1}: ${element.querySelector('.aula-titulo-input').value || 'Sem título'}`,
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 100 }
                    }),
                    
                    // Informações básicas
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Duração: ", bold: true }),
                            new TextRun({ text: element.querySelector('.aula-duracao').value || 'Não informada' }),
                            new TextRun({ text: "   |   Data: ", bold: true }),
                            new TextRun({ text: element.querySelector('.aula-data').value || 'Não informada' })
                        ],
                        spacing: { after: 50 }
                    }),
                    
                    // Objetivos
                    new Paragraph({
                        text: "OBJETIVOS DE APRENDIZAGEM",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 100, after: 50 }
                    }),
                    
                    new Paragraph({
                        text: element.querySelector('.aula-objetivos').value || 'Não informados',
                        spacing: { after: 100 }
                    }),
                    
                    // Recursos
                    new Paragraph({
                        text: "RECURSOS MATERIAIS",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 100, after: 50 }
                    }),
                    
                    new Paragraph({
                        text: element.querySelector('.aula-recursos').value || 'Não informados',
                        spacing: { after: 100 }
                    }),
                    
                    // Desenvolvimento
                    new Paragraph({
                        text: "DESENVOLVIMENTO DA AULA",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 100, after: 50 }
                    })
                ]
            });
            
            // Etapas da aula
            const etapas = element.querySelectorAll('.etapa');
            etapas.forEach((etapa, etapaIndex) => {
                doc.addSection({
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({ text: `Etapa ${etapaIndex + 1}: `, bold: true }),
                                new TextRun({ text: etapa.querySelector('.etapa-titulo').value || 'Sem título' })
                            ],
                            spacing: { before: 50, after: 20 }
                        }),
                        
                        new Paragraph({
                            text: etapa.querySelector('.etapa-descricao').value || 'Sem descrição',
                            spacing: { after: 50 }
                        })
                    ]
                });
            });
            
            // Avaliação
            doc.addSection({
                properties: {},
                children: [
                    new Paragraph({
                        text: "AVALIAÇÃO",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 100, after: 50 }
                    }),
                    
                    new Paragraph({
                        text: element.querySelector('.aula-avaliacao').value || 'Não informada',
                        spacing: { after: 100 }
                    }),
                    
                    // Observações
                    new Paragraph({
                        text: "OBSERVAÇÕES/ADAPTAÇÕES",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 100, after: 50 }
                    }),
                    
                    new Paragraph({
                        text: element.querySelector('.aula-observacoes').value || 'Não informadas',
                        spacing: { after: 200 }
                    })
                ]
            });
        });
        
        // Gerar e baixar documento
        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Planejamento_Aulas_${document.getElementById('tema').value || 'SRE'}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Erro ao exportar DOCX:', error);
        alert('Erro ao exportar documento. Verifique o console para mais detalhes.');
    }
}

// Exportar para PDF
function exportarParaPDF() {
    if (aulas.length === 0) {
        alert('Adicione pelo menos uma aula para exportar.');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        let yPos = 20;
        const margin = 20;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - 2 * margin;
        
        // Cabeçalho
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text("PLANEJAMENTO DE AULAS - SRE ARAGUAÍNA", pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("Currículo, Formação e Avaliação", pageWidth / 2, yPos, { align: 'center' });
        yPos += 20;
        
        // Informações gerais
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("INFORMAÇÕES GERAIS", margin, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const infos = [
            `Disciplina: ${document.getElementById('disciplina').value || 'Não informada'}`,
            `Turma/Série: ${document.getElementById('turma').value || 'Não informada'}`,
            `Tema: ${document.getElementById('tema').value || 'Não informado'}`,
            `Duração: ${document.getElementById('duracao').value || '0'} aulas`
        ];
        
        infos.forEach(info => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(info, margin, yPos);
            yPos += 7;
        });
        
        // Competências
        yPos += 5;
        doc.setFont('helvetica', 'bold');
        doc.text("Competências da BNCC:", margin, yPos);
        yPos += 7;
        
        doc.setFont('helvetica', 'normal');
        const competencias = doc.splitTextToSize(
            document.getElementById('competencias').value || 'Não informadas',
            contentWidth
        );
        
        competencias.forEach(line => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, margin, yPos);
            yPos += 7;
        });
        
        // Aulas
        aulas.forEach((aula, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            } else {
                yPos += 15;
            }
            
            const element = aula.element;
            
            // Título da aula
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            const aulaTitle = `AULA ${index + 1}: ${element.querySelector('.aula-titulo-input').value || 'Sem título'}`;
            doc.text(aulaTitle, margin, yPos);
            yPos += 10;
            
            // Informações básicas
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const aulaInfo = `Duração: ${element.querySelector('.aula-duracao').value || 'Não informada'} | Data: ${element.querySelector('.aula-data').value || 'Não informada'}`;
            doc.text(aulaInfo, margin, yPos);
            yPos += 10;
            
            // Seções da aula
            const secoes = [
                { titulo: "OBJETIVOS DE APRENDIZAGEM", conteudo: element.querySelector('.aula-objetivos').value },
                { titulo: "RECURSOS MATERIAIS", conteudo: element.querySelector('.aula-recursos').value },
                { titulo: "AVALIAÇÃO", conteudo: element.querySelector('.aula-avaliacao').value },
                { titulo: "OBSERVAÇÕES/ADAPTAÇÕES", conteudo: element.querySelector('.aula-observacoes').value }
            ];
            
            secoes.forEach(secao => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                } else {
                    yPos += 5;
                }
                
                doc.setFont('helvetica', 'bold');
                doc.text(secao.titulo + ":", margin, yPos);
                yPos += 7;
                
                if (secao.conteudo) {
                    doc.setFont('helvetica', 'normal');
                    const lines = doc.splitTextToSize(secao.conteudo, contentWidth);
                    
                    lines.forEach(line => {
                        if (yPos > 270) {
                            doc.addPage();
                            yPos = 20;
                        }
                        doc.text(line, margin, yPos);
                        yPos += 7;
                    });
                } else {
                    doc.setFont('helvetica', 'italic');
                    doc.text("Não informado", margin, yPos);
                    yPos += 7;
                }
            });
            
            // Etapas
            const etapas = element.querySelectorAll('.etapa');
            if (etapas.length > 0) {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                } else {
                    yPos += 5;
                }
                
                doc.setFont('helvetica', 'bold');
                doc.text("DESENVOLVIMENTO DA AULA:", margin, yPos);
                yPos += 10;
                
                etapas.forEach((etapa, etapaIndex) => {
                    if (yPos > 250) {
                        doc.addPage();
                        yPos = 20;
                    }
                    
                    doc.setFont('helvetica', 'bold');
                    doc.text(`Etapa ${etapaIndex + 1}: ${etapa.querySelector('.etapa-titulo').value || 'Sem título'}`, margin, yPos);
                    yPos += 7;
                    
                    const descricao = etapa.querySelector('.etapa-descricao').value;
                    if (descricao) {
                        doc.setFont('helvetica', 'normal');
                        const lines = doc.splitTextToSize(descricao, contentWidth);
                        
                        lines.forEach(line => {
                            if (yPos > 270) {
                                doc.addPage();
                                yPos = 20;
                            }
                            doc.text(line, margin, yPos);
                            yPos += 7;
                        });
                    } else {
                        doc.setFont('helvetica', 'italic');
                        doc.text("Sem descrição", margin, yPos);
                        yPos += 7;
                    }
                    
                    yPos += 5;
                });
            }
        });
        
        // Salvar PDF
        doc.save(`Planejamento_Aulas_${document.getElementById('tema').value || 'SRE'}.pdf`);
        
    } catch (error) {
        console.error('Erro ao exportar PDF:', error);
        alert('Erro ao exportar PDF. Verifique o console para mais detalhes.');
    }
}