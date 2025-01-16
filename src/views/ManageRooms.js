'use client'

import * as React from "react"
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table"
import { ArrowUpDown } from 'lucide-react'
import '../styles/ManageRooms.css'

// Sample data
const data = [
  {
    id: "1",
    roomName: "Main Lecture Hall",
    roomType: "lecture-hall",
    capacity: 200,
    buildingName: "Science Building",
    roomNumber: "SB-101",
    status: "active",
  },
  {
    id: "2",
    roomName: "Computer Lab A",
    roomType: "laboratory",
    capacity: 30,
    buildingName: "Technology Center",
    roomNumber: "TC-201",
    status: "active",
  },
]

export default function RoomManagement() {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns = [
    {
      accessorKey: "roomName",
      header: "Room Name",
    },
    {
      accessorKey: "roomType",
      header: "Room Type",
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
    },
    {
      accessorKey: "buildingName",
      header: "Building",
    },
    {
      accessorKey: "roomNumber",
      header: "Room Number",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="container">
      <h1>Room Management</h1>
      <table className="table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.column.columnDef.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {cell.getValue()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
