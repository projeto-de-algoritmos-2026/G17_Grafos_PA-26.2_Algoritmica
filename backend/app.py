from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from algorithms.dijkstra import calcular_score_dijkstra
algoritmica = FastAPI()

algoritmica.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GRAFO_ESTATICO = {
    "nodes": [
        {"data": {"id": "A"}}, {"data": {"id": "B"}},
        {"data": {"id": "C"}}, {"data": {"id": "D"}}
    ],
    "edges": [
        {"data": {"id": "AB", "source": "A", "target": "B", "weight": 5}},
        {"data": {"id": "AC", "source": "A", "target": "C", "weight": 2}},
        {"data": {"id": "CB", "source": "C", "target": "B", "weight": 1}},
        {"data": {"id": "BD", "source": "B", "target": "D", "weight": 4}},
        {"data": {"id": "CD", "source": "C", "target": "D", "weight": 8}}
        ]
}
class Palpite(BaseModel):
    caminho: list[str]

@algoritmica.get("/api/grafo")
def pegar_grafo():
    return GRAFO_ESTATICO

@algoritmica.post("/api/dijkstra")
def validar_dijkstra(palpite: Palpite):
    resultado = calcular_score_dijkstra(GRAFO_ESTATICO, palpite.caminho)
    return resultado