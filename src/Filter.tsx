import React from 'react'

import './index.css'

import { Column } from '@tanstack/react-table'
import { DebouncedInput } from './DebouncedInput'
import { STATUSES } from './App'

export function Filter({
    column,
  }: {
    column: Column<any, unknown>
  }) {  
    const columnFilterValue = column.getFilterValue()
  
    return column.id === 'status' ? (
      <div>
        <div className="flex space-x-2">
        <select name="status" id="status-select" value={(columnFilterValue ?? '') as string} onChange={(e) => column.setFilterValue(e.target.value)}>
          <option value=''>Choose</option>
          {STATUSES.map((value: any) => (
            <option value={value} key={value}>{value}</option>
          ))}
        </select>
        </div>
        <div className="h-1" />
      </div>
    ) : (
      <>
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? '') as string}
          onChange={value => column.setFilterValue(value)}
          placeholder={`Search by ${column.id}`}
          className="w-36 border shadow rounded"
        />
        <div className="h-1" />
      </>
    )
  }