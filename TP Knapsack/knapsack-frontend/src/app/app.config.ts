import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { KnapsackSolverComponent } from './components/knapsack-solver/knapsack-solver.component';

export const routes = [
  { path: '', component: KnapsackSolverComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch())
  ]
};