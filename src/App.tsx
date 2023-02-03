import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useVirtual } from 'react-virtual';

import { makeData } from './makeData';
import { Filter } from './Filter';

export const STATUSES = ['Needs review', 'Incomplete', 'Changes requested', 'Pending approval', 'Approved']

export interface IDataRow {
  company: string,
  status: typeof STATUSES[number],
  creditLimit: number,
  terms: string,
  lastUpdate: string,
}

const defaultColumns: ColumnDef<IDataRow, any>[] = [
    {
      header: 'Company',
      accessorKey: 'company',
      enableColumnFilter: false,
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Credit limit',
      accessorKey: 'creditLimit',
      enableColumnFilter: false,
    },
    {
      header: 'Terms',
      accessorKey: 'terms',
      enableColumnFilter: false,
    },
    {
      header: 'Last update',
      accessorKey: 'lastUpdate',
      enableColumnFilter: false,
    },
  ];

function App() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ])
  const [columnVisibility, setColumnVisibility] = React.useState({})

  const [data] = React.useState<IDataRow[]>(() => makeData(50000))

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'company') {
      if (table.getState().sorting[0]?.id !== 'company') {
        table.setSorting([{ id: 'company', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  const companyColumn = table.getHeaderGroups()[0].headers.find((header) => header.id === 'company')?.column

  return (
    <div className="p-2">
      <div className="inline-block border border-black shadow rounded">
        {table.getAllLeafColumns().map(column => {
          return (
            <div key={column.id} className="px-1">
              <label>
                <input
                  {...{
                    type: 'checkbox',
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />{' '}
                {column.id}
              </label>
            </div>
          )
        })}
      </div>
      <div>
        {companyColumn && (
          <Filter column={companyColumn} />
        )}
      </div>
      <div className="h-2" />
      <div ref={tableContainerRef} className="container">
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => {
              return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            )})}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index] as Row<IDataRow>
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
