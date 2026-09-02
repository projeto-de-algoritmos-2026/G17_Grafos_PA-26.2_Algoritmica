# G17_grafos_PA-26.2
*Módulo da disciplina*: Grafos
--- 
## Alunos
| Matrícula | Aluno                            |
|-----------|----------------------------------|
| 251013660 | Matheus Moretti Soares           |
| 251019771 | Daniel Filipe Borges de Oliveira |
---
## Sobre
O Algoritmica é uma **ferramenta educacional interativa** desenvolvida para ensinar algoritmos de grafos na prática, no formato de minigames. O usuário interage com uma interface visual, selecionando nós e caminhos, e o sistema avalia suas escolhas comparando-as com a solução ótima gerada pelos algoritmos clássicos.

### 🛠️ Tecnologias e Bibliotecas Utilizadas
Para garantir um desenvolvimento ágil focado na lógica estrutural, adotamos a seguinte stack:

**Back-end (Motor de Algoritmos):**
*   **FastAPI:** Framework web em Python utilizado para construir a API RESTful. Ele é o responsável por criar as rotas de comunicação que recebem as tentativas do jogador e devolvem o resultado (score) calculado pelos algoritmos.
*   **Uvicorn:** Servidor web ASGI de alta performance. Atua como o "motor" que roda a aplicação FastAPI no ambiente local.
*   **Pydantic:** Utilizado nativamente pelo FastAPI para validação e tipagem de dados estruturados. Garante que as respostas em JSON enviadas pelo front-end (como a sequência de nós) cheguem perfeitamente formatadas para o Python.

**Front-end (Interface Visual):**
*   **Cytoscape.js:** Biblioteca JavaScript Open-Source especializada em renderização e interação de grafos na web. É responsável por desenhar a malha de nós e arestas esteticamente na tela, além de gerenciar todos os eventos de clique e mudança de cor conforme o usuário joga.

---
## Instalação

Siga o passo a passo abaixo para rodar a aplicação no seu ambiente local.

**1. Clone o repositório:**
```bash
git clone [https://github.com/projeto-de-algoritmos-2026/G17_grafos_PA-26.2]