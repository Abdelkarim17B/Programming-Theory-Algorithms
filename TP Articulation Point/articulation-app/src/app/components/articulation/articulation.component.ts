import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticulationService } from '../../services/articulation.service';

interface NodePosition {
  x: number;
  y: number;
}

@Component({
  selector: 'app-articulation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articulation.component.html',
  styleUrls: ['./articulation.component.css']
})
export class ArticulationComponent {
  vertices: number = 0;
  edges: number[][] = [];
  articulationPoints: number[] = [];
  nodePositions: NodePosition[] = [];
  
  svgWidth = 600;
  svgHeight = 400;
  nodeRadius = 20;

  constructor(private articulationService: ArticulationService) {}

  initializeNodes(): void {
    this.nodePositions = [];
    this.edges = [];
    
    if (this.vertices <= 0) return;

    const centerX = this.svgWidth / 2;
    const centerY = this.svgHeight / 2;
    const radius = Math.min(this.svgWidth, this.svgHeight) / 3;

    for (let i = 0; i < this.vertices; i++) {
      const angle = (i * 2 * Math.PI) / this.vertices;
      this.nodePositions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }
  }

  addEdge(u: number, v: number): void {
    if (u >= 0 && u < this.vertices && v >= 0 && v < this.vertices && u !== v) {
      console.log(`Adding edge between ${u} and ${v}`);
      this.edges.push([u, v]);
    } else {
      alert('Invalid node numbers. Please check the input values.');
    }
  }

  findArticulationPoints(): void {
    const graph = { vertices: this.vertices, edges: this.edges };

    this.articulationService.getArticulationPoints(graph).subscribe(
      response => {
        this.articulationPoints = response.articulation_points;
        console.log("Articulation points received from backend:", this.articulationPoints);
      },
      error => {
        console.error("Error communicating with backend:", error);
      }
    );
  }

  isArticulationPoint(nodeIndex: number): boolean {
    return this.articulationPoints.includes(nodeIndex);
  }
}