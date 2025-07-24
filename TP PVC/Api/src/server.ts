import express, { Request, Response } from 'express';
import { performance } from 'perf_hooks';
import cors from 'cors';

interface TSPInput {
  distances: number[][];
  start_city: number;
}

interface TSPResult {
  cycle: number[];
  cost: number;
  elapsed: string;
}

class TravelingSalesmanProblem {
  private distances: number[][];
  private n: number;
  private startCity: number;

  constructor(input: TSPInput) {
    this.distances = input.distances;
    this.n = input.distances.length;
    this.startCity = input.start_city;
  }

  solveExact(): TSPResult {
    const start = performance.now();

    const memo = new Map<string, { cost: number, path: number[] }>();
    
    const solve = (currentCity: number, remainingCities: Set<number>): { cost: number, path: number[] } => {
      if (remainingCities.size === 0) {
        return {
          cost: this.distances[currentCity][this.startCity],
          path: [currentCity, this.startCity]
        };
      }

      const key = `${currentCity}-${Array.from(remainingCities).sort().join(',')}`;
      
      if (memo.has(key)) return memo.get(key)!;

      let minCost = Infinity;
      let bestPath: number[] = [];

      for (const nextCity of remainingCities) {
        const remaining = new Set(remainingCities);
        remaining.delete(nextCity);

        const subResult = solve(nextCity, remaining);
        const totalCost = this.distances[currentCity][nextCity] + subResult.cost;

        if (totalCost < minCost) {
          minCost = totalCost;
          bestPath = [currentCity, ...subResult.path];
        }
      }

      const result = { cost: minCost, path: bestPath };
      memo.set(key, result);
      return result;
    };

    const initialCities = new Set(
      Array.from({ length: this.n }, (_, i) => i)
        .filter(city => city !== this.startCity)
    );

    const solution = solve(this.startCity, initialCities);
    
    const end = performance.now();
    return {
      cycle: solution.path,
      cost: solution.cost,
      elapsed: `${(end - start).toFixed(4)}ms`
    };
  }

  solveHeuristic(): TSPResult {
    const start = performance.now();

    const visited = new Array(this.n).fill(false);
    const cycle: number[] = [this.startCity];
    visited[this.startCity] = true;
    let currentCity = this.startCity;
    let totalCost = 0;

    for (let i = 0; i < this.n - 1; i++) {
      let nearestCity = -1;
      let minDistance = Infinity;

      for (let j = 0; j < this.n; j++) {
        if (!visited[j] && this.distances[currentCity][j] < minDistance) {
          nearestCity = j;
          minDistance = this.distances[currentCity][j];
        }
      }

      if (nearestCity !== -1) {
        cycle.push(nearestCity);
        visited[nearestCity] = true;
        totalCost += minDistance;
        currentCity = nearestCity;
      }
    }

    totalCost += this.distances[currentCity][this.startCity];
    cycle.push(this.startCity);

    const end = performance.now();
    return {
      cycle,
      cost: totalCost,
      elapsed: `${(end - start).toFixed(4)}ms`
    };
  }
}

const app = express();
app.use(cors({
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());

app.post('/solve-tsp', (req: Request, res: Response) => {
  try {
    const { distances, start_city }: TSPInput = req.body;
    
    const tsp = new TravelingSalesmanProblem({ distances, start_city });
    
    const result = {
      exact: tsp.solveExact(),
      heuristic: tsp.solveHeuristic()
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;