import React from 'react';
import { Spinner } from './Spinner';

/**
 * Column definition — key is optional (will use accessor string as key if omitted).
 * accessor can be a string (field name) or a render function.
 */
export interface Column<T> {
  key?: string;
  header: string;
  accessor?: string | keyof T | ((row: T) => React.ReactNode);
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading,
  emptyMessage = 'No data available.',
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!data.length) {
    return (
      <div className="p-12 text-center text-gray-500 text-sm">{emptyMessage}</div>
    );
  }

  const getCellValue = (row: T, col: Column<T>): React.ReactNode => {
    if (col.render) return col.render(row);
    if (typeof col.accessor === 'function') return col.accessor(row);
    if (typeof col.accessor === 'string') return row[col.accessor];
    if (col.key) return row[col.key];
    return null;
  };

  const getColKey = (col: Column<T>, i: number): string =>
    col.key ?? (typeof col.accessor === 'string' ? String(col.accessor) : String(i));

  return (
    <div className="overflow-x-auto w-full rounded-lg border border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col, i) => (
              <th
                key={getColKey(col, i)}
                className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((row, i) => (
            <tr
              key={i}
              className={`hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col, j) => (
                <td key={getColKey(col, j)} className="px-4 py-3 text-sm text-gray-900">
                  {getCellValue(row, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
