from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from algorithms.dijkstra import calcular_score_dijkstra
from graphs.templatesGrafos import GRAFO_FACIL, GRAFO_DIFICIL
algoritmica = FastAPI()

algoritmica.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials = True,
)

class Palpite(BaseModel):
    caminho: list[str]
    dificuldade: str = "facil"

@algoritmica.get("/api/grafo")
def pegar_grafo(dificuldade: str = "facil", jogoEscolhido: str = "dijkstra"):
    if dificuldade == "dificil":
        return GRAFO_DIFICIL
    return GRAFO_FACIL

@algoritmica.post("/api/dijkstra")
def validar_dijkstra(palpite: Palpite):
    grafo_atual = GRAFO_DIFICIL if palpite.dificuldade == "dificil" else GRAFO_FACIL
    resultado = calcular_score_dijkstra(grafo_atual, palpite.caminho)
    return resultado