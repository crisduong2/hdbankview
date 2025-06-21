import React from 'react';
import KPIHierarchyTable from './components/KPIHierarchyTable';
import { KPINode } from './types/kpi';
import kpiData from '../KPI Tree for Bank.json';

function App() {
  // Transform the JSON data to match our KPINode interface
  const transformedData: KPINode[] = [kpiData as KPINode];

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <KPIHierarchyTable 
        initialData={transformedData}
        defaultExpanded={false}
      />
    </div>
  );
}

export default App;