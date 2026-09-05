let cy;
        let caminhoSelecionado = [];
        
        async function carregarJogo() {
            const resposta = await fetch("http://127.0.0.1:8000/api/grafo");
            const dados = await resposta.json();
            const elementos = {
                nodes: [
                    { data: { id: 'A' }, position: { x: 80, y: 200 } },
                    { data: { id: 'B' }, position: { x: 250, y: 100 } },
                    { data: { id: 'C' }, position: { x: 250, y: 300 } },
                    { data: { id: 'D' }, position: { x: 500, y: 200 } }
                ],
                edges: dados.edges
            };

            cy = cytoscape({
                container: document.getElementById('cy'),
                elements: elementos,
                style: [
                    { selector: 'node', style: { 'background-color': '#666', 'label': 'data(id)', 'color': '#fff', 'text-valign': 'center', 'width': 40, 'height': 40 } },
                    { selector: 'edge', style: { 'width': 3, 'line-color': '#ccc', 'label': 'data(weight)', 'font-size': '16px', 'text-rotation': 'autorotate' } },
    
                    { selector: 'node.selecionado', style: {'background-color': '#28a745', 'transition-property': 'background-color', 'transition-duration': '0.3s'} },
                    { selector: 'edge.selecionado', style: { 'line-color': '#007bff', 'width': 6, 'transition-property': 'line-color, width', 'transition-duration': '0.5s' } }
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

            document.getElementById('caminho-texto').innerText = "Nenhum nó selecionado";
            document.getElementById('resultado').innerText = "";
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
        }

        carregarJogo();