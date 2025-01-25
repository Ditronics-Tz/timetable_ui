"use client"

import { useState } from 'react'
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Search, Eye } from "lucide-react"

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
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-2">View Programs</h1>
      <p className="text-gray-500 mb-8">View and manage all programs.</p>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search programs..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>

        <Table>
          <TableHeader>
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
              <TableRow key={program.id}>
                <TableCell>{program.name}</TableCell>
                <TableCell>{program.department}</TableCell>
                <TableCell>{program.ntaLevel}</TableCell>
                <TableCell>{program.level}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No programs found matching your search criteria.
          </div>
        )}
      </div>
    </Card>
  )
}
