class UnionFind:

    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}

    def find(self, item):
        if self.parent[item] == item:
            return item
        self.parent[item] = self.find(self.parent[item])
        return self.parent[item]

    def union(self, x, y):
        xroot = self.find(x)
        yroot = self.find(y)

        if xroot == yroot:
            return False

        if self.rank[xroot] < self.rank[yroot]:
            self.parent[xroot] = yroot
        elif self.rank[xroot] > self.rank[yroot]:
            self.parent[yroot] = xroot
        else:
            self.parent[yroot] = xroot
            self.rank[xroot] += 1

        return True


def calcular_score_kruskal(grafo_json, arestas_usuario):
    vertices = [no["data"]["id"] for no in grafo_json["nodes"]]
    todas_arestas = []
    mapa_arestas = {}

    for aresta in grafo_json["edges"]:
        dados = aresta["data"]
        obj_aresta = {
            "id": dados.get("id"),
            "origem": dados["source"],
            "destino": dados["target"],
            "peso": dados["weight"]
        }
        todas_arestas.append(obj_aresta)
        mapa_arestas[dados.get("id")] = obj_aresta

    numero_vertices = len(vertices)


    if len(arestas_usuario) != numero_vertices - 1:
        return {
            "mensagem": f"Inválido! Uma Árvore Geradora para {numero_vertices} nós deve ter exatamente {numero_vertices - 1} arestas.",
            "score": 0
        }

    custo_usuario = 0
    uf_usuario = UnionFind(vertices)

    for id_aresta in arestas_usuario:
        if id_aresta not in mapa_arestas:
            return {"mensagem": "Erro: Aresta inválida selecionada.", "score": 0}

        aresta = mapa_arestas[id_aresta]
        custo_usuario += aresta["peso"]

        if not uf_usuario.union(aresta["origem"], aresta["destino"]):
            return {
                "mensagem": "Caminho inválido! Você fechou um ciclo (loop) entre os nós.",
                "score": 0
            }

    todas_arestas.sort(key=lambda x: x["peso"])

    uf_gabarito = UnionFind(vertices)
    custo_otimo = 0
    arestas_otimas = []

    for aresta in todas_arestas:
        if uf_gabarito.union(aresta["origem"], aresta["destino"]):
            custo_otimo += aresta["peso"]
            arestas_otimas.append(aresta["id"])

            if len(arestas_otimas) == numero_vertices - 1:
                break

    if custo_usuario == custo_otimo:
        score = 100
        mensagem = f"Perfeito! Você encontrou a Árvore Geradora Mínima. Custo total: {custo_usuario}"
    else:
        score = int((custo_otimo / custo_usuario) * 100)
        mensagem = f"Sua árvore custou {custo_usuario}, mas existia uma configuração mais barata (Custo: {custo_otimo})."

    return {
        "mensagem": mensagem,
        "score": score,
        "arestas_otimas": arestas_otimas
    }