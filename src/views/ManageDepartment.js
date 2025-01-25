"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card } from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { Search, MoreHorizontal, Download, Upload, Trash2, Edit, FileDown, FileUp } from "lucide-react"
import '../styles/ManageDepartment.css'

export default function ManageDepartments() {
  // Sample data - replace with your actual data
  const [departments, setDepartments] = useState([
    {
      dept_id: 1,
      dept_name: "Computer Science",
      dept_descr: "Computer Science Department",
      hod: "Dr. John Doe",
      hod_phone: "1234567890",
      hod_email: "john@example.com",
    },
  ])

  const [selectedDepts, setSelectedDepts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Handle bulk selection
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDepts(departments.map((dept) => dept.dept_id))
    } else {
      setSelectedDepts([])
    }
  }

  const handleSelectOne = (deptId, checked) => {
    if (checked) {
      setSelectedDepts([...selectedDepts, deptId])
    } else {
      setSelectedDepts(selectedDepts.filter((id) => id !== deptId))
    }
  }

  // Bulk operations
  const handleBulkDelete = () => {
    const remainingDepts = departments.filter((dept) => !selectedDepts.includes(dept.dept_id))
    setDepartments(remainingDepts)
    setSelectedDepts([])
  }

  // Export to CSV
  const handleExport = () => {
    const headers = ["Department Name", "Description", "HOD", "Phone", "Email"]
    const csvData = departments.map((dept) =>
      [dept.dept_name, dept.dept_descr, dept.hod, dept.hod_phone, dept.hod_email].join(",")
    )

    const csv = [headers.join(","), ...csvData].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "departments.csv"
    a.click()
  }

  // Import from CSV
  const handleImport = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        const rows = text.split("\n")
        const newDepts = rows.slice(1).map((row, index) => {
          const [dept_name, dept_descr, hod, hod_phone, hod_email] = row.split(",")
          return {
            dept_id: departments.length + index + 1,
            dept_name,
            dept_descr,
            hod,
            hod_phone,
            hod_email,
          }
        })
        setDepartments([...departments, ...newDepts])
      }
      reader.readAsText(file)
    }
  }

  // Filter departments based on search
  const filteredDepartments = departments.filter(
    (dept) =>
      dept.dept_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.hod.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="manage-dept-container">
      <Card className="manage-dept-card">
        <div className="header-section">
          <div>
            <h1 className="page-title">Manage Departments</h1>
            <p className="page-description">Manage and organize department information</p>
          </div>
          <div className="header-buttons">
            <Button variant="outline" onClick={handleExport} className="export-button">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
            <div className="import-container">
              <Input type="file" accept=".csv" onChange={handleImport} className="hidden" id="csv-upload" />
              <Button variant="outline" onClick={() => document.getElementById("csv-upload")?.click()} className="import-button">
                <FileUp className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>

        <div className="actions-section">
          <div className="bulk-actions">
            {selectedDepts.length > 0 && (
              <>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="delete-button">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
                <Button variant="outline" size="sm" className="edit-button">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Selected
                </Button>
              </>
            )}
          </div>
          <div className="search-container">
            <Search className="search-icon" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={selectedDepts.length === departments.length} 
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Department Name</TableHead>
                <TableHead>Head of Department</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((dept) => (
                <TableRow key={dept.dept_id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDepts.includes(dept.dept_id)}
                      onCheckedChange={(checked) => handleSelectOne(dept.dept_id, checked)}
                    />
                  </TableCell>
                  <TableCell>{dept.dept_name}</TableCell>
                  <TableCell>{dept.hod}</TableCell>
                  <TableCell>{dept.hod_phone}</TableCell>
                  <TableCell>{dept.hod_email}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDepartments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="empty-message">
                    No departments found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
