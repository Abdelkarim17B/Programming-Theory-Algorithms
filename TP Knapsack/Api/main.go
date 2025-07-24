package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type Item struct {
    ID     int `json:"id"`
    Weight int `json:"weight"`
    Value  int `json:"value"`
}

type KnapsackRequest struct {
    Items      []Item `json:"items"`
    Capacity   int    `json:"capacity"`
}

type KnapsackResponse struct {
    MaxValue         int      `json:"maxValue"`
    SelectedItems    []int    `json:"selectedItems"`
    TotalWeight      int      `json:"totalWeight"`
    AlgorithmDetails struct {
        Name            string `json:"name"`
        TimeComplexity  string `json:"timeComplexity"`
        SpaceComplexity string `json:"spaceComplexity"`
        Description     string `json:"description"`
    } `json:"algorithmDetails"`
}

func KnapsackSolver(items []Item, W int) (int, []int) {
    n := len(items)
    P := make([][]int, n+1)
    for i := range P {
        P[i] = make([]int, W+1)
    }
    for i := 1; i <= n; i++ {
        for j := 0; j <= W; j++ {
            if j < items[i-1].Weight {
                P[i][j] = P[i-1][j]
            } else {
                if P[i-1][j] > P[i-1][j-items[i-1].Weight]+items[i-1].Value {
                    P[i][j] = P[i-1][j]
                } else {
                    P[i][j] = P[i-1][j-items[i-1].Weight] + items[i-1].Value
                }
            }
        }
    }
    selected := make([]int, 0)
    w := W
    for i := n; i > 0; i-- {
        if P[i][w] != P[i-1][w] {
            selected = append(selected, i-1)
            w -= items[i-1].Weight
        }
    }
    return P[n][W], selected
}

func solveKnapsackHandler(w http.ResponseWriter, r *http.Request) {
    enableCors(w)
    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }

    var request KnapsackRequest
    if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    maxValue, selected := KnapsackSolver(request.Items, request.Capacity)
   
    totalWeight := 0
    for _, idx := range selected {
        totalWeight += request.Items[idx].Weight
    }

    response := KnapsackResponse{
        MaxValue:      maxValue,
        SelectedItems: selected,
        TotalWeight:   totalWeight,
        AlgorithmDetails: struct {
            Name            string `json:"name"`
            TimeComplexity  string `json:"timeComplexity"`
            SpaceComplexity string `json:"spaceComplexity"`
            Description     string `json:"description"`
        }{
            Name:            "Dynamic Programming Knapsack",
            TimeComplexity:  "O(n * W)",
            SpaceComplexity: "O(n * W)",
            Description:     "Algorithme de programmation dynamique pour maximiser la valeur totale avec une contrainte de poids",
        },
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}

func enableCors(w http.ResponseWriter) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func main() {
    http.HandleFunc("/api/solve", solveKnapsackHandler)
    fmt.Println("Server started at http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}