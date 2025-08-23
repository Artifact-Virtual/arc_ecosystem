
export interface RoadmapItem {
  phase: string;
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Planned';
}

export interface TokenomicsData {
    name: string;
    value: number;
}
