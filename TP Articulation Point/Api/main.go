package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Graph struct {
	Vertices int      `json:"vertices"`
	Edges    [][2]int `json:"edges"`
}

type Response struct {
	ArticulationPoints []int `json:"articulation_points"`
}

func main() {
	http.HandleFunc("/articulation-points", articulationHandler)
	fmt.Println("Server started at http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

func enableCors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func articulationHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	var graph Graph
	if err := json.NewDecoder(r.Body).Decode(&graph); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	points := findArticulationPoints(graph.Vertices, graph.Edges)
	fmt.Println("Calculated articulation points:", points)

	response := Response{ArticulationPoints: points}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func findArticulationPoints(vertices int, edges [][2]int) []int {
	fmt.Printf("Algorithm started")
	graph := make([][]int, vertices)
	for _, edge := range edges {
		u, v := edge[0], edge[1]
		graph[u] = append(graph[u], v)
		graph[v] = append(graph[v], u)
	}

	visited := make([]bool, vertices)
	discovery := make([]int, vertices)
	low := make([]int, vertices)
	parent := make([]int, vertices)
	for i := 0; i < vertices; i++ {
		discovery[i] = -1
		low[i] = -1
		parent[i] = -1
	}
	var articulationPoints []int
	time := 0

	fmt.Println("Graph adjacency list:")
	for i, adj := range graph {
		fmt.Printf("Node %d: %v\n", i, adj)
	}

	for i := 0; i < vertices; i++ {
		if !visited[i] {
			fmt.Printf("Starting DFS at node %d\n", i)
			dfs(i, &time, visited, discovery, low, parent, &articulationPoints, graph)
		}
	}
	return articulationPoints
}

func dfs(u int, time *int, visited []bool, discovery, low, parent []int, articulationPoints *[]int, graph [][]int) {
	visited[u] = true
	*time++
	discovery[u] = *time
	low[u] = *time
	children := 0
	fmt.Printf("Visiting node %d, discovery time: %d, low: %d\n", u, discovery[u], low[u])
	for _, v := range graph[u] {
		if !visited[v] {
			children++
			parent[v] = u
			fmt.Printf("Exploring edge %d-%d\n", u, v)
			dfs(v, time, visited, discovery, low, parent, articulationPoints, graph)
			low[u] = min(low[u], low[v])

			if parent[u] == -1 && children > 1 {
				fmt.Printf("Node %d is an articulation point (root with multiple children)\n", u)
				*articulationPoints = append(*articulationPoints, u)
			}
			if parent[u] != -1 && low[v] >= discovery[u] {
				fmt.Printf("Node %d is an articulation point (low[%d] >= discovery[%d])\n", u, v, u)
				*articulationPoints = append(*articulationPoints, u)
			}
		} else if v != parent[u] {
			low[u] = min(low[u], discovery[v])
		}
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
