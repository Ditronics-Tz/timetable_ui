"use client"

import { useState } from 'react'
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Checkbox } from "../components/ui/checkbox"
import { Search, Edit2, Trash2 } from "lucide-react"
import '../styles/ManageProgram.css'

export default function ManageProgram() {
  const [searchTerm, setSearchTerm] = useState("")
  const [programs, setPrograms] = useState([])
  const [selectedPrograms, setSelectedPrograms] = useState([])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleBulkDelete = () => {
    // Implement bulk delete logic
  }

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="manage-program-container">
      <Card className="manage-program-card">
        <h1 className="text-2xl font-bold mb-2">Manage Programs</h1>
        <p className="text-gray-500 mb-8">Manage and update program information.</p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="search-container">
              <Search className="search-icon" />
              <Input
                placeholder="Search programs..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={selectedPrograms.length === 0}
              className="delete-button"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>

          <div className="table-container">
            <Table className="table">
              <TableHeader className="table-header">
                <TableRow>
                  <TableHead className="checkbox-cell">
                    <Checkbox
                      checked={selectedPrograms.length === programs.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPrograms(programs.map(p => p.id))
                        } else {
                          setSelectedPrograms([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>NTA Level</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.map((program) => (
                  <TableRow key={program.id} className="table-row">
                    <TableCell className="checkbox-cell">
                      <Checkbox
                        checked={selectedPrograms.includes(program.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPrograms([...selectedPrograms, program.id])
                          } else {
                            setSelectedPrograms(selectedPrograms.filter(id => id !== program.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="table-cell">{program.name}</TableCell>
                    <TableCell className="table-cell">{program.department}</TableCell>
                    <TableCell className="table-cell">{program.ntaLevel}</TableCell>
                    <TableCell className="table-cell">{program.level}</TableCell>
                    <TableCell className="table-cell">
                      <div className="action-buttons">
                        <Button variant="ghost" size="icon" className="action-button">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="action-button">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredPrograms.length === 0 && (
              <div className="empty-state">
                No programs found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
