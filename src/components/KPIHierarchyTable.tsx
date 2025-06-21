import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
  ExpandedState,
} from '@tanstack/react-table';
import { KPITableProps, FlattenedKPINode, KPIMetrics } from '../types/kpi';
import { flattenKPIData, formatNumber, getRowTypeColor } from '../utils/dataTransform';

const KPIHierarchyTable: React.FC<KPITableProps> = ({ 
  initialData, 
  defaultExpanded = false 
}) => {
  const [expanded, setExpanded] = useState<ExpandedState>(
    defaultExpanded ? { '0': true } : {}
  );

  const flattenedData = useMemo(() => {
    return flattenKPIData(initialData);
  }, [initialData]);

  const columns = useMemo<ColumnDef<FlattenedKPINode>[]>(() => [
    {
      id: 'name',
      header: 'Đơn vị',
      accessorKey: 'name',
      size: 300,
      minSize: 200,
      maxSize: 500,
      cell: ({ row, getValue }) => {
        const value = getValue() as string;
        const canExpand = row.getCanExpand();
        const isExpanded = row.getIsExpanded();
        
        return (
          <div 
            style={{ 
              paddingLeft: `${row.depth * 24}px`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {canExpand ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#3b82f6',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px'
                }}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            ) : (
              <span style={{ 
                width: '20px', 
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '12px'
              }}>
                •
              </span>
            )}
            <span style={{ 
              fontWeight: row.depth === 0 ? 'bold' : 'normal',
              fontSize: row.depth === 0 ? '14px' : '13px'
            }}>
              {value}
            </span>
          </div>
        );
      },
    },
    {
      id: 'du_no_tieu_dung',
      header: 'Dư nợ tiêu dùng',
      accessorFn: (row) => row.kpis.du_no_tieu_dung,
      size: 140,
      minSize: 100,
      maxSize: 200,
      cell: ({ getValue }) => (
        <div style={{ textAlign: 'right', fontFamily: 'monospace' }}>
          {formatNumber(getValue() as number)}
        </div>
      ),
    },
    {
      id: 'du_no_mua_nha',
      header: 'Dư nợ mua nhà',
      accessorFn: (row) => row.kpis.du_no_mua_nha,
      size: 140,
      minSize: 100,
      maxSize: 200,
      cell: ({ getValue }) => (
        <div style={{ textAlign: 'right', fontFamily: 'monospace' }}>
          {formatNumber(getValue() as number)}
        </div>
      ),
    },
    {
      id: 'casa',
      header: 'CASA',
      accessorFn: (row) => row.kpis.casa,
      size: 120,
      minSize: 80,
      maxSize: 180,
      cell: ({ getValue }) => (
        <div style={{ textAlign: 'right', fontFamily: 'monospace' }}>
          {formatNumber(getValue() as number)}
        </div>
      ),
    },
    {
      id: 'co_ky_han',
      header: 'Có kỳ hạn',
      accessorFn: (row) => row.kpis.co_ky_han,
      size: 120,
      minSize: 80,
      maxSize: 180,
      cell: ({ getValue }) => (
        <div style={{ textAlign: 'right', fontFamily: 'monospace' }}>
          {formatNumber(getValue() as number)}
        </div>
      ),
    },
    {
      id: 'loi_nhuan_toi',
      header: 'Lợi nhuận tối',
      accessorFn: (row) => row.kpis.loi_nhuan_toi,
      size: 130,
      minSize: 90,
      maxSize: 190,
      cell: ({ getValue }) => (
        <div style={{ textAlign: 'right', fontFamily: 'monospace' }}>
          {formatNumber(getValue() as number)}
        </div>
      ),
    },
    {
      id: 'no_xau',
      header: 'Nợ xấu',
      accessorFn: (row) => row.kpis.no_xau,
      size: 100,
      minSize: 70,
      maxSize: 150,
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return (
          <div style={{ 
            textAlign: 'right', 
            fontFamily: 'monospace',
            color: value > 0 ? '#dc2626' : '#16a34a',
            fontWeight: value > 0 ? 'bold' : 'normal'
          }}>
            {formatNumber(value)}
          </div>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data: flattenedData,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subRows,
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    defaultColumn: {
      minSize: 80,
      maxSize: 300,
      size: 120,
    },
  });

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e293b'
        }}>
          Bảng KPI Phân cấp Ngân hàng
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          color: '#64748b',
          fontSize: '14px'
        }}>
          Dữ liệu KPI theo cấu trúc tổ chức - Có thể mở rộng và thay đổi kích thước cột
        </p>
      </div>

      <div style={{ 
        flex: 1,
        overflow: 'auto',
        backgroundColor: 'white',
        margin: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <table style={{ 
          width: table.getCenterTotalSize(),
          borderCollapse: 'collapse',
          fontSize: '13px'
        }}>
          <thead style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#f1f5f9',
            zIndex: 10
          }}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: 'relative',
                      padding: '12px 8px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '2px solid #d1d5db',
                      borderRight: '1px solid #e5e7eb',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          height: '100%',
                          width: '4px',
                          backgroundColor: header.column.getIsResizing() ? '#3b82f6' : 'transparent',
                          cursor: 'col-resize',
                          userSelect: 'none',
                          touchAction: 'none',
                        }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id}
                style={{
                  backgroundColor: getRowTypeColor(row.original.type),
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                      padding: '8px',
                      borderRight: '1px solid #f1f5f9',
                      verticalAlign: 'middle'
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        padding: '16px 20px',
        backgroundColor: 'white',
        borderTop: '1px solid #e2e8f0',
        fontSize: '12px',
        color: '#64748b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          Tổng số hàng: {table.getRowModel().rows.length} | 
          Đã mở rộng: {Object.keys(expanded).length} nút
        </div>
        <div>
          Kéo cạnh cột để thay đổi kích thước | Nhấp vào ▶ để mở rộng
        </div>
      </div>
    </div>
  );
};

export default KPIHierarchyTable;