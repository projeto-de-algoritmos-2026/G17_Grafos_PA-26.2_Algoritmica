let cy;
let cyGabarito;
let arestasSelecionadas = [];

async function carregarJogo() {
    const urlParams = new URLSearchParams(window.location.search);
    const nivelDificuldade = urlParams.get('dificuldade') || 'facil';

    const resposta = await fetch(`http://127.0.0.1:8000/api/grafo?dificuldade=${nivelDificuldade}`);
    const elementos = await resposta.json();

    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: elementos,
        style: [
            { selector: 'node', style: { 'background-color': '#666', 'label': 'data(id)', 'color': '#fff', 'text-valign': 'center', 'width': 40, 'height': 40 } },
            { selector: 'edge', style: { 'width': 3, 'line-color': '#ccc', 'label': 'data(weight)', 'font-size': '16px', 'text-rotation': 'autorotate' } },
            { selector: 'node.selecionado', style: {'background-color': '#28a745', 'transition-property': 'background-color', 'transition-duration': '0.3s'} },
            { selector: 'edge.selecionado', style: { 'line-color': '#007bff', 'width': 6, 'transition-property': 'line-color, width', 'transition-duration': '0.3s' } },
            { selector: 'node.gabarito', style: { 'background-color': '#ffc107', 'transition-property': 'background-color', 'transition-duration': '0.3s' } },
            { selector: 'edge.gabarito', style: { 'line-color': '#ffc107', 'width': 8, 'transition-property': 'line-color, width', 'transition-duration': '0.5s' } }
        ],
        layout: { name: 'preset', fit: false },
        userZoomingEnabled: false,
        userPanningEnabled: false,
        autoungrabify: true,
        boxSelectionEnabled: false
    });

    cyGabarito = cytoscape({
        container: document.getElementById('cy-gabarito'),
        elements: JSON.parse(JSON.stringify(elementos)),
        style: [
            { selector: 'node', style: { 'background-color': '#666', 'label': 'data(id)', 'color': '#fff', 'text-valign': 'center', 'width': 40, 'height': 40 } },
            { selector: 'edge', style: { 'width': 3, 'line-color': '#ccc', 'label': 'data(weight)', 'font-size': '16px', 'text-rotation': 'autorotate' } },
            { selector: 'node.gabarito', style: { 'background-color': '#ffc107', 'border-width': 4, 'border-color': '#d39e00', 'transition-property': 'background-color, border-width', 'transition-duration': '0.4s' } },
            { selector: 'edge.gabarito', style: { 'line-color': '#ffc107', 'width': 8, 'transition-property': 'line-color, width', 'transition-duration': '0.4s' } }
        ],
        layout: { name: 'preset', fit: false },
        userZoomingEnabled: false,
        userPanningEnabled: false,
        autoungrabify: true,
        boxSelectionEnabled: false
    });

    cyGabarito.ready(() => { cyGabarito.fit(cyGabarito.elements(), 40); cyGabarito.center(); });

    cy.ready(() => {
        cy.resize();
        cy.fit(cy.elements(), 40);
        cy.center();
    });

    cy.on('tap', 'edge', function(evt){
        let arestaClicada = evt.target;
        let idDaAresta = arestaClicada.id();
        let indexAresta = arestasSelecionadas.indexOf(idDaAresta);

        if (indexAresta === -1) {
            arestaClicada.addClass('selecionado');
            arestasSelecionadas.push(idDaAresta);

            arestaClicada.source().addClass('selecionado');
            arestaClicada.target().addClass('selecionado');
        } else {
            arestaClicada.removeClass('selecionado');
            arestasSelecionadas.splice(indexAresta, 1);

            atualizarCoresDosNos();
        }

        let nosTotais = cy.nodes().length;
        document.getElementById('caminho-texto').innerText = `Arestas selecionadas: ${arestasSelecionadas.length} / ${nosTotais - 1}`;
    });

    limparCaminho();
}

function atualizarCoresDosNos() {
    cy.nodes().removeClass('selecionado');
    arestasSelecionadas.forEach(id => {
        let aresta = cy.getElementById(id);
        aresta.source().addClass('selecionado');
        aresta.target().addClass('selecionado');
    });
}

function limparCaminho() {
    arestasSelecionadas = [];
    cy.nodes().removeClass('selecionado');
    cy.edges().removeClass('selecionado');

    document.getElementById('caixa-gabarito').style.display = 'none';
    cyGabarito.nodes().removeClass('gabarito');
    cyGabarito.edges().removeClass('gabarito');

    let nosTotais = cy.nodes().length;
    document.getElementById('caminho-texto').innerText = `Arestas selecionadas: 0 / ${nosTotais - 1}`;
    document.getElementById('resultado').innerText = "";

    cy.resize();
    cy.fit(cy.elements(), 40);
    cy.center();
    document.getElementById('btn-reiniciar').style.display = 'none';
    document.getElementById('btn-enviar').style.display = 'inline-block';
    document.getElementById('btn-limpar').style.display = 'inline-block';
}

function resetarJogo() {
    limparCaminho();
    carregarJogo();
}

async function enviarPalpite() {
    let nosTotais = cy.nodes().length;

    if (arestasSelecionadas.length !== nosTotais - 1) {
        alert(`Para formar uma Árvore Geradora, você precisa selecionar exatamente ${nosTotais - 1} arestas!`);
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const nivelDificuldade = urlParams.get('dificuldade') || 'facil';

    const resposta = await fetch("http://127.0.0.1:8000/api/kruskal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            arestas: arestasSelecionadas, // Envia o array de IDs de arestas
            dificuldade: nivelDificuldade
        })
    });

    const resultado = await resposta.json();
    document.getElementById('resultado').innerText = `Score: ${resultado.score}% - ${resultado.mensagem}`;

    if(resultado.arestas_otimas) {
        document.getElementById('caixa-gabarito').style.display = 'block';

        cyGabarito.resize();
        cyGabarito.fit(cyGabarito.elements(), 40);
        cyGabarito.center();

        cy.resize();
        cy.fit(cy.elements(), 40);
        cy.center();

        animarGabarito(resultado.arestas_otimas);

        document.getElementById('btn-reiniciar').style.display = 'inline-block';
        document.getElementById('btn-enviar').style.display = 'none';
        document.getElementById('btn-limpar').style.display = 'none';
    }
}

function animarGabarito(arestasOtimas) {
    cyGabarito.nodes().removeClass('gabarito');
    cyGabarito.edges().removeClass('gabarito');
    let passo = 0;

    function proximoPasso() {
        if (passo < arestasOtimas.length) {
            let idDaAresta = arestasOtimas[passo];

            let aresta = cyGabarito.getElementById(idDaAresta);
            aresta.addClass('gabarito');

            aresta.source().addClass('gabarito');
            aresta.target().addClass('gabarito');

            passo++;
            setTimeout(proximoPasso, 800);
        }
    }
    proximoPasso();
}

carregarJogo();