export interface Item {
    id: number;
    weight: number;
    value: number;
  }
  
  export interface KnapsackRequest {
    items: Item[];
    capacity: number;
  }
  

  export interface AlgorithmDetails {
    name: string;
    timeComplexity: string;
    spaceComplexity: string;
    description: string;
  }
  
  export interface KnapsackResponse {
    maxValue: number;
    selectedItems: number[];
    totalWeight: number;
    algorithmDetails: AlgorithmDetails;
  }