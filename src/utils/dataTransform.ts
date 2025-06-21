import { KPINode, FlattenedKPINode } from '../types/kpi';

export function flattenKPIData(
  nodes: KPINode[],
  depth = 0,
  parentId?: string
): FlattenedKPINode[] {
  const result: FlattenedKPINode[] = [];

  nodes.forEach((node, index) => {
    const id = parentId ? `${parentId}-${index}` : `${index}`;
    
    const flattenedNode: FlattenedKPINode = {
      ...node,
      id,
      depth,
      parentId,
      subRows: node.children ? flattenKPIData(node.children, depth + 1, id) : undefined
    };

    result.push(flattenedNode);
  });

  return result;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value);
}

export function getRowTypeColor(type: string): string {
  switch (type) {
    case 'employee':
      return '#f0f9ff'; // Light blue
    case 'branch':
      return '#f0fdf4'; // Light green
    case 'region':
      return '#fefce8'; // Light yellow
    case 'node':
    default:
      return '#ffffff'; // White
  }
}