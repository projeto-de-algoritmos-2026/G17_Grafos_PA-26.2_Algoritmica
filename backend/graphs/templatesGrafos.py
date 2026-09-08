GRAFO_FACIL = {
    "nodes": [
        {"data": {"id": "S"}, "position": {"x": 80, "y": 200}},
        {"data": {"id": "A"}, "position": {"x": 250, "y": 100}},
        {"data": {"id": "B"}, "position": {"x": 250, "y": 300}},
        {"data": {"id": "C"}, "position": {"x": 400, "y": 100}},
        {"data": {"id": "D"}, "position": {"x": 400, "y": 300}},
        {"data": {"id": "T"}, "position": {"x": 550, "y": 200}}
    ],
    "edges": [ #                   raiz          destino       peso
        {"data": {"id": "SA", "source": "S", "target": "A", "weight": 2}},
        {"data": {"id": "SB", "source": "S", "target": "B", "weight": 4}},
        {"data": {"id": "AC", "source": "A", "target": "C", "weight": 3}},
        {"data": {"id": "AB", "source": "A", "target": "B", "weight": 1}},
        {"data": {"id": "BD", "source": "B", "target": "D", "weight": 2}},
        {"data": {"id": "CD", "source": "C", "target": "D", "weight": 1}},
        {"data": {"id": "CT", "source": "C", "target": "T", "weight": 5}},
        {"data": {"id": "DT", "source": "D", "target": "T", "weight": 3}}
    ]
}

GRAFO_DIFICIL = {
    "nodes" : [
        {"data": {"id": "S"}, "position": {"x": 50, "y": 200}},
        {"data": {"id": "A"}, "position": {"x": 150, "y": 50}},
        {"data": {"id": "B"}, "position": {"x": 150, "y": 200}},
        {"data": {"id": "C"}, "position": {"x": 150, "y": 350}},
        {"data": {"id": "D"}, "position": {"x": 250, "y": 50}},
        {"data": {"id": "E"}, "position": {"x": 250, "y": 200}},
        {"data": {"id": "F"}, "position": {"x": 250, "y": 350}},
        {"data": {"id": "G"}, "position": {"x": 350, "y": 125}},
        {"data": {"id": "H"}, "position": {"x": 350, "y": 275}},
        {"data": {"id": "T"}, "position": {"x": 450, "y": 200}}
    ],
    "edges": [
        {"data": {"id": "S-A", "source": "S", "target": "A", "weight": 4}},
        {"data": {"id": "S-B", "source": "S", "target": "B", "weight": 2}},
        {"data": {"id": "S-C", "source": "S", "target": "C", "weight": 3}},
        {"data": {"id": "A-D", "source": "A", "target": "D", "weight": 2}},
        {"data": {"id": "B-A", "source": "B", "target": "A", "weight": 1}},
        {"data": {"id": "B-E", "source": "B", "target": "E", "weight": 4}},
        {"data": {"id": "C-F", "source": "C", "target": "F", "weight": 2}},
        {"data": {"id": "D-G", "source": "D", "target": "G", "weight": 3}},
        {"data": {"id": "E-D", "source": "E", "target": "D", "weight": 1}},
        {"data": {"id": "E-G", "source": "E", "target": "G", "weight": 2}},
        {"data": {"id": "E-H", "source": "E", "target": "H", "weight": 3}},
        {"data": {"id": "F-E", "source": "F", "target": "E", "weight": 2}},
        {"data": {"id": "F-H", "source": "F", "target": "H", "weight": 4}},
        {"data": {"id": "G-T", "source": "G", "target": "T", "weight": 2}},
        {"data": {"id": "H-T", "source": "H", "target": "T", "weight": 1}}
    ]
}