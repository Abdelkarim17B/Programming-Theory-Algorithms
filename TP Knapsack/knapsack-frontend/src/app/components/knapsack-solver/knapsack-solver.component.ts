import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KnapsackService } from '../../services/knapsack.service';
import { Item, KnapsackRequest, KnapsackResponse } from '../../models/knapsack.model';

@Component({
  selector: 'app-knapsack-solver',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-8 max-w-2xl bg-gray-100 rounded-lg shadow-lg">
      <h1 class="text-4xl font-extrabold mb-8 text-center text-gray-900">Solveur de Sac à Dos</h1>
      
      <div class="mb-8">
        <label class="block mb-3 text-lg font-semibold text-gray-700">Capacité maximale:</label>
        <input
          type="number"
          [(ngModel)]="capacity"
          class="border border-gray-400 p-4 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent"
          min="1"
        />
      </div>

      <div class="mb-8">
        <h2 class="text-3xl font-bold mb-6 text-gray-900">Objets</h2>
        <div *ngFor="let item of items; let i = index" class="flex gap-4 mb-6 items-center">
          <input
            type="number"
            [(ngModel)]="item.weight"
            placeholder="Poids"
            class="border border-gray-400 p-4 rounded-lg w-1/2 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent"
            min="1"
          />
          <input
            type="number"
            [(ngModel)]="item.value"
            placeholder="Valeur"
            class="border border-gray-400 p-4 rounded-lg w-1/2 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent"
            min="1"
          />
          <button
            (click)="removeItem(i)"
            class="bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500"
          >
            Supprimer
          </button>
        </div>
        <button
          (click)="addItem()"
          class="bg-blue-600 text-white px-8 py-4 rounded-lg mt-6 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          Ajouter un objet
        </button>
      </div>

      <button
        (click)="solve()"
        class="bg-green-600 text-white px-8 py-4 rounded-lg w-full font-bold text-xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500"
        [disabled]="!isValid()"
      >
        Résoudre
      </button>

      <div *ngIf="solution" class="mt-10 p-8 border border-gray-400 rounded-lg shadow-lg bg-white">
        <h2 class="text-3xl font-bold mb-6 text-gray-900">Solution:</h2>
        <p class="text-xl mb-4">Valeur maximale: <span class="font-bold text-green-800">{{ solution.maxValue }}</span></p>
        <p class="text-xl mb-6">Poids total: <span class="font-bold text-blue-800">{{ solution.totalWeight }}</span></p>
        
        <h3 class="text-2xl font-semibold mb-4 text-gray-900">Objets sélectionnés:</h3>
        <ul class="list-disc list-inside pl-5">
          <li *ngFor="let index of solution.selectedItems" class="text-lg mb-3">
            <span class="font-bold text-gray-900">Objet {{ index + 1 }}:</span> 
            <span class="text-gray-700">Poids = <span class="font-bold text-blue-800">{{ items[index].weight }}</span>, 
            Valeur = <span class="font-bold text-green-800">{{ items[index].value }}</span></span>
          </li>
        </ul>

        
        <div class="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 class="text-2xl font-semibold mb-4 text-gray-900">Détails de l'Algorithme:</h3>
          <p class="text-lg mb-2"><strong>Complexité Temporelle:</strong> O (n.W)</p>
          <p class="text-lg mb-2"><strong>gain:</strong> 123</p>
        </div>
      </div>
    </div>
  `
})
export class KnapsackSolverComponent {
  items: Item[] = [];
  capacity: number = 0;
  solution: KnapsackResponse | null = null;

  constructor(private knapsackService: KnapsackService) {
    this.addItem(); 
  }

  addItem() {
    this.items.push({
      id: this.items.length,
      weight: 0,
      value: 0
    });
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.items = this.items.map((item, idx) => ({
      ...item,
      id: idx
    }));
  }

  isValid(): boolean {
    return (
      this.capacity > 0 &&
      this.items.length > 0 &&
      this.items.every(item => item.weight > 0 && item.value > 0)
    );
  }

  solve() {
    if (!this.isValid()) return;

    const request: KnapsackRequest = {
      items: this.items,
      capacity: this.capacity
    };

    this.knapsackService.solveKnapsack(request).subscribe({
      next: (response) => {
        this.solution = response;
      },
      error: (error) => {
        console.error('Error solving knapsack:', error);
        alert('Une erreur est survenue lors de la résolution du problème.');
      }
    });
  }
}
