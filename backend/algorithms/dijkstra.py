import heapq

def calcular_score_dijkstra(grafo_json, caminho_usuario):
    #JSON para uma adjacência simples
    #Ex: {'A': {'B': 5, 'C': 2}, 'B': {'D': 4}, ...}
    adjacencias = {}
    for no in grafo_json["nodes"]:
        adjacencias[no["data"]["id"]] = {}
        
    for aresta in grafo_json["edges"]:
        origem = aresta["data"]["source"]
        destino = aresta["data"]["target"]
        peso = aresta["data"]["weight"]

        adjacencias[origem][destino] = peso
        adjacencias[destino][origem] = peso



    no_inicio = caminho_usuario[0]
    no_destino = caminho_usuario[-1]


    #calcula o custo do caminho escolhido
    custo_usuario = 0
    caminho_valido = True
    
    for i in range(len(caminho_usuario) - 1):
        atual = caminho_usuario[i]
        proximo = caminho_usuario[i+1]
        
        if proximo in adjacencias[atual]:
            custo_usuario += adjacencias[atual][proximo]
        else:
            caminho_valido = False #caminho sem aresta conectando
            break

    if not caminho_valido:
        return {"mensagem": "Caminho inválido! Você selecionou nós que não estão conectados.", "score": 0}

    #Gabarito com Dijkstra
    #fila de prioridade (heapq) para explorar sempre o caminho mais barato primeiro
    distancias = {no: float('inf') for no in adjacencias}
    predecessores = {no: None for no in adjacencias}
    distancias[no_inicio] = 0
    fila_prioridade = [(0, no_inicio)]
    
    while fila_prioridade:
        custo_atual, no_atual = heapq.heappop(fila_prioridade)
        
        if custo_atual > distancias[no_atual]:
            continue
            
        if no_atual == no_destino:
            break #achou o menor caminho
            
        for vizinho, peso in adjacencias[no_atual].items():
            novo_custo = custo_atual + peso
            if novo_custo < distancias[vizinho]:
                distancias[vizinho] = novo_custo
                predecessores[vizinho] = no_atual
                heapq.heappush(fila_prioridade, (novo_custo, vizinho))

    custo_otimo = distancias[no_destino]

    caminho_otimo = []
    passo_atual = no_destino
    while passo_atual is not None:
        caminho_otimo.insert(0, passo_atual)
        passo_atual = predecessores.get(passo_atual)
        

    #compara os dois e calcula a % de acerto
    if custo_usuario == custo_otimo:
        score = 100
        mensagem = f"Perfeito! Você achou o caminho ótimo. Custo total: {custo_usuario}"
    else:
        #fórmula da %: custo ótimo / custo do usuário
        score = int((custo_otimo / custo_usuario) * 100)
        mensagem = f"Seu caminho custou {custo_usuario}, mas existia um caminho mais barato (Custo: {custo_otimo})."

    return {
        "mensagem": mensagem,
        "score": score,
        "caminho_otimo": caminho_otimo
    }