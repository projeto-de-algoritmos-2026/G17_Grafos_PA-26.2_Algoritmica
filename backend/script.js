let cy;
let cyGabarito;
let caminhoSelecionado = [];
        
        async function carregarJogo() {
            const urlParams = new URLSearchParams(window.location.search);
            const nivelDificuldade = urlParams.get('dificuldade') || 'facil';

            const resposta = await fetch("http://127.0.0.1:8000/api/grafo?dificuldade=${nivelDificuldade}");
            const dados = await resposta.json();
            let nosDoGrafo =[];
            if (nivelDificuldade === 'dificil') {
                nosDoGrafo = [
                    { data: { id: 'A' }, position: { x: 50, y: 200 } },
                    { data: { id: 'B' }, position: { x: 200, y: 100 } },
                    { data: { id: 'C' }, position: { x: 200, y: 300 } },
                    { data: { id: 'E' }, position: { x: 350, y: 100 } }, // Nó extra
                    { data: { id: 'F' }, position: { x: 350, y: 300 } }, // Nó extra
                    { data: { id: 'D' }, position: { x: 500, y: 200 } }  // Destino continua sendo D
                ];

            } else {
                nosDoGrafo = [
                    { data: { id: 'A' }, position: { x: 80, y: 200 } },
                    { data: { id: 'B' }, position: { x: 250, y: 100 } },
                    { data: { id: 'C' }, position: { x: 250, y: 300 } },
                    { data: { id: 'D' }, position: { x: 500, y: 200 } }
                ];
            }
            const elementos = {
                nodes: nosDoGrafo,
                edges: dados.edges
            };

            cy = cytoscape({
                container: document.getElementById('cy'),
                elements: elementos,
                style: [
                    { selector: 'node', style: { 'background-color': '#666', 'label': 'data(id)', 'color': '#fff', 'text-valign': 'center', 'width': 40, 'height': 40 } },
                    { selector: 'edge', style: { 'width': 3, 'line-color': '#ccc', 'label': 'data(weight)', 'font-size': '16px', 'text-rotation': 'autorotate' } },
    
                    { selector: 'node.selecionado', style: {'background-color': '#28a745', 'transition-property': 'background-color', 'transition-duration': '0.3s'} },
                    { selector: 'edge.selecionado', style: { 'line-color': '#007bff', 'width': 6, 'transition-property': 'line-color, width', 'transition-duration': '0.5s' } },
                    { selector: 'node.gabarito', style: { 'background-color': '#ffc107', 'transition-property': 'background-color', 'transition-duration': '0.3s' } },
                    { selector: 'edge.gabarito', style: { 'line-color': '#ffc107', 'width': 8, 'transition-property': 'line-color, width', 'transition-duration': '0.5s' } }
                ],
                layout: {
                    name: 'preset',
                    fit: false
                },

                userZoomingEnabled: false, //impede zoom in e zoom out
                userPanningEnabled: false, //impede arrastar a tela
                autoungrabify: true, //impede arrastar os nós
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

            cy.ready(() => { cy.fit(cy.elements(), 40); cy.center(); });
            cyGabarito.ready(() => { cyGabarito.fit(cyGabarito.elements(), 40); cyGabarito.center(); });

            cy.ready(() => {
                cy.resize();
                cy.fit(cy.elements(), 40);
                cy.center();
            });

            cy.on('tap', 'node', function(evt){
                let noClicado = evt.target;
                let idDoNo = noClicado.id();
                let indexNo = caminhoSelecionado.indexOf(idDoNo);

                if (indexNo === -1) {
                    if (caminhoSelecionado.length > 0) {
                        let ultimoNo = caminhoSelecionado[caminhoSelecionado.length - 1];
                        let aresta = cy.edges(`[source = "${ultimoNo}"][target = "${idDoNo}"], [source = "${idDoNo}"][target = "${ultimoNo}"]`);
                        aresta.addClass('selecionado');
                    }
                    caminhoSelecionado.push(idDoNo);
                    noClicado.addClass('selecionado');
                }
                else{ //apaga tudo que vem depois do nó clicado
                    for(let i = indexNo; i < caminhoSelecionado.length; i++){
                        let idParaRemover = caminhoSelecionado[i];
                        cy.getElementById(idParaRemover).removeClass('selecionado');

                        if (i > 0) {
                            let idAnterior = caminhoSelecionado[i - 1];
                            let arestaParaRemover = cy.edges(`[source = "${idAnterior}"][target = "${idParaRemover}"], [source = "${idParaRemover}"][target = "${idAnterior}"]`);
                            arestaParaRemover.removeClass('selecionado');
                        }
                    }

                    caminhoSelecionado = caminhoSelecionado.slice(0, indexNo); //mantém apenas os nós até o nó clicado
                }

                if  (caminhoSelecionado.length > 0){
                    document.getElementById('caminho-texto').innerText = caminhoSelecionado.join(" ➔ ");
                } else {
                    document.getElementById('caminho-texto').innerText = "Nenhum nó selecionado";
                }
            });
        }

        function limparSelecao() {
            caminhoSelecionado = [];
            cy.nodes().removeClass('selecionado');
            cy.edges().removeClass('selecionado');
            document.getElementById('caixa-gabarito').style.display = 'none';

            document.getElementById('caminho-texto').innerText = "Nenhum nó selecionado";
            document.getElementById('resultado').innerText = "";

            cy.resize();
            cy.fit(cy.elements(), 40);
            cy.center();
            document.getElementById('btn-reiniciar').style.display = 'none';
            document.getElementById('btn-enviar').style.display = 'inline-block';
            document.getElementById('btn-limpar').style.display = 'inline-block';
        }

        function resetarJogo() {
            limparSelecao();
            carregarJogo();
        }

        async function enviarPalpite() {
            if (caminhoSelecionado.length < 2 || caminhoSelecionado[0] !== "A" 
            || caminhoSelecionado[caminhoSelecionado.length - 1] !== "D") {
                alert("O caminho deve começar em A e terminar em D!");
                return;
            }

            const resposta = await fetch("http://127.0.0.1:8000/api/dijkstra", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caminho: caminhoSelecionado })
            });

            const resultado = await resposta.json();
            document.getElementById('resultado').innerText = `Score: ${resultado.score}% - ${resultado.mensagem}`;

            //roda animacao do gabarito
            if(resultado.caminho_otimo) {
                document.getElementById('caixa-gabarito').style.display = 'block';

                cyGabarito.resize();
                cyGabarito.fit(cyGabarito.elements(), 40);
                cyGabarito.center();

                cy.resize();
                cy.fit(cy.elements(), 40);
                cy.center();

                animarGabarito(resultado.caminho_otimo);

                document.getElementById('btn-reiniciar').style.display = 'inline-block';
                document.getElementById('btn-enviar').style.display = 'none';
                document.getElementById('btn-limpar').style.display = 'none';
            }
        }

        function animarGabarito(caminhoOtimo) {
            cyGabarito.nodes().removeClass('gabarito');
            cyGabarito.edges().removeClass('gabarito');
            let passo = 0;

            function proximoPasso() {
                if (passo < caminhoOtimo.length) {
                    let idDoNo = caminhoOtimo[passo];
                    
                    let no = cyGabarito.getElementById(idDoNo);
                    no.addClass('gabarito'); //colore o nó

                    if(passo > 0) {
                        let idAnterior = caminhoOtimo[passo - 1];
                        let aresta = cyGabarito.edges(`[source = "${idAnterior}"][target = "${idDoNo}"], [source = "${idDoNo}"][target = "${idAnterior}"]`);
                        aresta.addClass('gabarito'); //colore a aresta
                    }
                    passo++;
                    setTimeout(proximoPasso, 800); //a cada 0,8segs roda o proximo passo
                }
            }
            proximoPasso();
        }
        carregarJogo();