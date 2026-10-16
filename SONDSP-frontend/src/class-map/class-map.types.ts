export interface ClassMapFilter {
  strandId?: number;
  period?: string;
}

export interface DistributionItem {
  level: string;
  quantity: number;
  percentual: number;
}

export interface EvolutionComparativeItem {
  level: string;
  before: number;
  after: number;
}

export interface DomainPercentageItem {
  name: string;
  expectedQuantity: number;
  total: number;
  percentual: number;
}

export interface ClassMap {
  schoolId: number | null;
  schoolName: string | null;
  schoolClassId: number;
  schoolClassName: string;
  domainPercentage: DomainPercentageItem[];
  distribution: DistributionItem[];
  evolutionComparative: EvolutionComparativeItem[];
}