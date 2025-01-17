'use client'

import React from "react";
import Navbar from "../components/Navbar";
import Layout from "../components/Layout";
import { flexRender, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table"
import { ArrowUpDown, Plus, MoreHorizontal, Calendar, Download, Upload } from 'lucide-react'
import { Switch } from "../components/ui/switch"
import { Checkbox } from "../components/ui/checkbox"
import '../styles/ManageRooms.css'

export default function RoomManagement() {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [dateRange] = React.useState("Jan 16, 2025 - Jan 23, 2025")
  const [data] = React.useState([]) // Empty array for now, will be populated by service

  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
      },
      {
        accessorKey: "roomName",
        header: "Room Name",
      },
      {
        accessorKey: "roomType",
        header: "Type",
        cell: ({ row }) => (
          <span className="room-type">
            {row.getValue("roomType")}
          </span>
        ),
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
        cell: ({ row }) => (
          <div className="status-cell">
            <span className={`status-badge ${row.getValue("status")}`}>
              {row.getValue("status")}
            </span>
            <Switch
              checked={row.getValue("status") === "active"}
              className="status-switch"
            />
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: () => <MoreHorizontal className="h-4 w-4" />,
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="app-container">
      <Navbar />
      <div className="view-rooms-container">
        <div className="header">
          <h1>Manage Rooms</h1>
          <p className="subtitle">Manage and organize your rooms efficiently.</p>
        </div>

        <div className="filters">
          <div className="search-bar">
            <input
              placeholder="Filter rooms..."
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <button className="filter-button">
              Filter by...
              <ArrowUpDown className="h-4 w-4" />
            </button>
            <button className="filter-button">
              Filter by...
              <ArrowUpDown className="h-4 w-4" />
            </button>
            <button className="date-filter">
              <Calendar className="h-4 w-4" />
              {dateRange}
            </button>
          </div>
          <div className="columns-filter">
            Columns
            <ArrowUpDown className="h-4 w-4" />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="footer">
          <div className="selection-info">
            {Object.keys(rowSelection).length} of {data.length} row(s) selected.
          </div>
          <div className="pagination">
            <button 
              className="pagination-button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button 
              className="pagination-button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
          <div className="actions">
            <button className="action-button">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="action-button">
              <Upload className="h-4 w-4" />
              Bulk Update
            </button>
            <button className="add-room-button">
              <Plus className="h-4 w-4" />
              Add Room
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
