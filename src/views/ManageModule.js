"use client"

import { useState } from "react"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  MoreHorizontal,
  ChevronDown,
  Layers,
  Calendar,
  Award,
  Code,
  BookOpen,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import '../styles/ManageModule.css'

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
  // Add more sample modules as needed
]

export default function ManageModules() {
  const [modules, setModules] = useState(initialModules)
  const [selectedModules, setSelectedModules] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterYear, setFilterYear] = useState("")

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedModules(modules.map((module) => module.id))
    } else {
      setSelectedModules([])
    }
  }

  const handleSelect = (id) => {
    if (selectedModules.includes(id)) {
      setSelectedModules(selectedModules.filter((moduleId) => moduleId !== id))
    } else {
      setSelectedModules([...selectedModules, id])
    }
  }

  const handleBulkDelete = () => {
    setModules(modules.filter((module) => !selectedModules.includes(module.id)))
    setSelectedModules([])
  }

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
          <Layers className="h-6 w-6" />
          Manage Modules
        </h1>
        <Button className="bg-black hover:bg-gray-800">+ Add New Module</Button>
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

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox checked={selectedModules.length === modules.length} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>NTA Level</TableHead>
              <TableHead>Credit Value</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModules.map((module) => (
              <TableRow key={module.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedModules.includes(module.id)}
                    onCheckedChange={() => handleSelect(module.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{module.code}</TableCell>
                <TableCell>{module.name}</TableCell>
                <TableCell>{module.type}</TableCell>
                <TableCell>{module.year}</TableCell>
                <TableCell>{module.semester}</TableCell>
                <TableCell>{module.ntaLevel}</TableCell>
                <TableCell>{module.creditValue}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {selectedModules.length} of {modules.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button variant="outline" className="flex items-center gap-2" disabled={selectedModules.length === 0}>
              <Edit2 className="h-4 w-4" />
              Bulk Edit
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={handleBulkDelete}
              disabled={selectedModules.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Bulk Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

