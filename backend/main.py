from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Set

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str = None
    targetHandle: str = None
    type: str = None
    animated: bool = None
    markerEnd: Dict[str, Any] = None

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the pipeline forms a directed acyclic graph (DAG)
    using DFS with cycle detection
    """
    graph = {}
    node_ids = {node.id for node in nodes}
    
    for node in nodes:
        graph[node.id] = []
    
    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            graph[edge.source].append(edge.target)
    
    state = {node_id: 0 for node_id in node_ids}
    
    def has_cycle_dfs(node_id: str) -> bool:
        if state[node_id] == 1:
            return True
        if state[node_id] == 2:
            return False
        
        state[node_id] = 1
        
        for neighbor in graph[node_id]:
            if has_cycle_dfs(neighbor):
                return True
        
        state[node_id] = 2
        return False
    
    for node_id in node_ids:
        if state[node_id] == 0:
            if has_cycle_dfs(node_id):
                return False
    
    return True

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    """
    Parse and analyze a pipeline with nodes and edges
    Returns: {num_nodes: int, num_edges: int, is_dag: bool}
    """
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag_check = is_dag(pipeline.nodes, pipeline.edges)
    
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag_check
    }
