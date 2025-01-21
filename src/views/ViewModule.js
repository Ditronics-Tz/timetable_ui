"use client"

import { useState } from "react"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Layers, 
  Calendar, 
  Award, 
  Code, 
  BookOpen 
} from 'lucide-react'

// Sample module data
const initialModules = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Programming",
    type: "Core",
    year: 2023,
    semester: 1,
    ntaLevel: 6,
    creditValue: 15,
  },
  { id: 2, code: "MA201", name: "Linear Algebra", type: "Core", year: 2023, semester: 2, ntaLevel: 6, creditValue: 15 },
  {
    id: 3,
    code: "EN301",
    name: "Advanced Writing",
    type: "Elective",
    year: 2024,
    semester: 1,
    ntaLevel: 7,
    creditValue: 10,
  },
  { id: 4, code: "PH202", name: "Modern Physics", type: "Core", year: 2023, semester: 2, ntaLevel: 6, creditValue: 20 },
  {
    id: 5,
    code: "CS305",
    name: "Database Systems",
    type: "Core",
    year: 2024,
    semester: 1,
    ntaLevel: 7,
    creditValue: 15,
  },
]

export default function ViewModules() {
  const [modules] = useState(initialModules)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterYear, setFilterYear] = useState("")

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredModules = modules.filter(
    (module) =>
      (module.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "" || module.type === filterType) &&
      (filterYear === "" || module.year.toString() === filterYear),
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Eye className="h-6 w-6" />
          View Modules
        </h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Modules
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search modules..." value={searchTerm} onChange={handleSearch} className="pl-10" />
            </div>
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{filterType || "Filter by Type"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Core">Core</SelectItem>
              <SelectItem value="Elective">Elective</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{filterYear || "Filter by Year"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>NTA Level</TableHead>
              <TableHead>Credit Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModules.map((module) => (
              <TableRow key={module.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <Code className="h-4 w-4 text-gray-400" />
                  {module.code}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  {module.name}
                </TableCell>
                <TableCell>{module.type}</TableCell>
                <TableCell>{module.year}</TableCell>
                <TableCell>{module.semester}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-400" />
                  {module.ntaLevel}
                </TableCell>
                <TableCell>{module.creditValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredModules.length === 0 && (
          <div className="text-center py-4 text-gray-500">No modules found matching your search criteria.</div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredModules.length} of {modules.length} modules
        </div>
      </Card>
    </div>
  )
}

