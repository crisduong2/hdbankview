export interface KPIMetrics {
  du_no_tieu_dung: number;
  du_no_mua_nha: number;
  casa: number;
  co_ky_han: number;
  loi_nhuan_toi: number;
  no_xau: number;
}

export interface KPINode {
  name: string;
  type: 'node' | 'employee' | 'branch' | 'region';
  children?: KPINode[];
  kpis: KPIMetrics;
}

export interface KPITableProps {
  initialData: KPINode[];
  defaultExpanded?: boolean;
}

export interface FlattenedKPINode extends KPINode {
  id: string;
  depth: number;
  parentId?: string;
  subRows?: FlattenedKPINode[];
}