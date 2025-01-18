'use client'

import { useState, useEffect } from 'react'
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Pagination } from "../components/ui/pagination"
import { Slider } from "../components/ui/slider"
import { Label } from "../components/ui/label"
import { Search, Filter, Download } from 'lucide-react'
import '../styles/ViewClass.css'

export default function ViewClass() {
  const [selectedProgram, setSelectedProgram] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [capacityRange, setCapacityRange] = useState([0, 350])
  const [academicYear, setAcademicYear] = useState('')
  const [classes, setClasses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const filteredClasses = classes.filter(cls => 
    (selectedProgram === '' || cls.program === selectedProgram) &&
    (searchTerm === '' || cls.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (cls.capacity >= capacityRange[0] && cls.capacity <= capacityRange[1]) &&
    (academicYear === '' || cls.academicYear === academicYear)
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentClasses = filteredClasses.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const clearFilters = () => {
    setSelectedProgram('')
    setSearchTerm('')
    setCapacityRange([0, 350])
    setAcademicYear('')
    setCurrentPage(1)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedProgram, searchTerm, capacityRange, academicYear])

  return (
    <div className="view-class-container">
      <Card className="view-class-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">View Classes</h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export Data
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <Label htmlFor="program-select">Program</Label>
            <Select 
              id="program-select"
              value={selectedProgram}
              onValueChange={setSelectedProgram}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                {/* Programs will be populated from API */}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="search-input">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                id="search-input"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div>
            <Label>Capacity Range</Label>
            <Slider
              min={0}
              max={350}
              step={1}
              value={capacityRange}
              onValueChange={setCapacityRange}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{capacityRange[0]}</span>
              <span>{capacityRange[1]}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="academic-year-select">Academic Year</Label>
            <Select 
              id="academic-year-select"
              value={academicYear}
              onValueChange={setAcademicYear}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <Button 
            onClick={clearFilters}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Clear Filters
          </Button>
          <p className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredClasses.length)} of {filteredClasses.length} classes
          </p>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program</TableHead>
              <TableHead>Class Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Academic Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentClasses.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>{cls.program}</TableCell>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.capacity}</TableCell>
                <TableCell>{cls.academicYear}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredClasses.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No classes found matching the current filters.
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalCount={filteredClasses.length}
            pageSize={itemsPerPage}
            onPageChange={paginate}
          />
        </div>
      </Card>
    </div>
  )
}

