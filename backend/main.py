from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define data models for the pipeline
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
    # Build adjacency list from edges
    graph = {}
    node_ids = {node.id for node in nodes}
    
    # Initialize graph with all nodes
    for node in nodes:
        graph[node.id] = []
    
    # Add edges to graph
    for edge in edges:
        # Only add edge if both source and target nodes exist
        if edge.source in node_ids and edge.target in node_ids:
            graph[edge.source].append(edge.target)
    
    # DFS-based cycle detection
    # States: 0 = unvisited, 1 = visiting, 2 = visited
    state = {node_id: 0 for node_id in node_ids}
    
    def has_cycle_dfs(node_id: str) -> bool:
        if state[node_id] == 1:  # Currently visiting - cycle detected
            return True
        if state[node_id] == 2:  # Already visited
            return False
        
        state[node_id] = 1  # Mark as visiting
        
        # Check all neighbors
        for neighbor in graph[node_id]:
            if has_cycle_dfs(neighbor):
                return True
        
        state[node_id] = 2  # Mark as visited
        return False
    
    # Check for cycles starting from each unvisited node
    for node_id in node_ids:
        if state[node_id] == 0:
            if has_cycle_dfs(node_id):
                return False  # Cycle found, not a DAG
    
    return True  # No cycles found, it's a DAG

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
    
    # Log the analysis for debugging
    print(f"Pipeline Analysis:")
    print(f"  - Nodes: {num_nodes}")
    print(f"  - Edges: {num_edges}")
    print(f"  - Is DAG: {dag_check}")
    
    # Log node and edge details
    for node in pipeline.nodes:
        print(f"  Node {node.id}: type={node.type}")
    
    for edge in pipeline.edges:
        print(f"  Edge {edge.id}: {edge.source} -> {edge.target}")
    
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag_check
    }
