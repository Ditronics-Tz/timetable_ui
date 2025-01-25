"use client"

import { useState } from 'react'
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Search, Eye } from "lucide-react"
import '../styles/ViewProgram.css'

export default function ViewProgram() {
  const [searchTerm, setSearchTerm] = useState("")
  const [programs, setPrograms] = useState([])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="view-program-container">
      <Card className="view-program-card">
        <h1 className="text-2xl font-bold mb-2">View Programs</h1>
        <p className="text-gray-500 mb-8">View and manage all programs.</p>

        <div className="space-y-4">
          <div className="view-search-container">
            <Search className="view-search-icon" />
            <Input
              placeholder="Search programs..."
              value={searchTerm}
              onChange={handleSearch}
              className="view-search-input"
            />
          </div>

          <div className="view-table-container">
            <Table className="view-table">
              <TableHeader className="view-table-header">
                <TableRow>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>NTA Level</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.map((program) => (
                  <TableRow key={program.id} className="view-table-row">
                    <TableCell className="view-table-cell">{program.name}</TableCell>
                    <TableCell className="view-table-cell">{program.department}</TableCell>
                    <TableCell className="view-table-cell">{program.ntaLevel}</TableCell>
                    <TableCell className="view-table-cell">{program.level}</TableCell>
                    <TableCell className="view-table-cell">
                      <div className="view-action-buttons">
                        <Button variant="ghost" size="icon" className="view-action-button">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredPrograms.length === 0 && (
              <div className="view-empty-state">
                No programs found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
