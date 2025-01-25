"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card } from "../components/ui/card"
import { Search, Eye, FileDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import '../styles/ViewDepartment.css'

export default function ViewDepartments() {
  const [departments] = useState([
    {
      dept_id: 1,
      dept_name: "Computer Science",
      dept_descr: "Computer Science Department",
      hod: "Dr. John Doe",
      hod_phone: "1234567890",
      hod_email: "john@example.com",
    },
    {
      dept_id: 2,
      dept_name: "Mathematics",
      dept_descr: "Mathematics Department",
      hod: "Dr. Jane Smith",
      hod_phone: "0987654321",
      hod_email: "jane@example.com",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDept, setSelectedDept] = useState(null)

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

  // Filter departments based on search
  const filteredDepartments = departments.filter(
    (dept) =>
      dept.dept_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.hod.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="view-dept-container">
      <Card className="view-dept-card">
        <div className="header-section">
          <div>
            <h1 className="page-title">View Departments</h1>
            <p className="page-description">View all department information</p>
          </div>
          <div className="header-buttons">
            <Button variant="outline" onClick={handleExport} className="export-button">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="search-section">
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
                  <TableCell className="font-medium">{dept.dept_name}</TableCell>
                  <TableCell>{dept.hod}</TableCell>
                  <TableCell>{dept.hod_phone}</TableCell>
                  <TableCell>{dept.hod_email}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedDept(dept)}
                      className="view-button"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDepartments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="empty-message">
                    No departments found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={selectedDept !== null} onOpenChange={() => setSelectedDept(null)}>
          <DialogContent className="dialog-content">
            <DialogHeader>
              <DialogTitle>Department Details</DialogTitle>
            </DialogHeader>
            {selectedDept && (
              <div className="dialog-grid">
                <div className="detail-section">
                  <h3 className="detail-title">Department Name</h3>
                  <p className="detail-text">{selectedDept.dept_name}</p>
                </div>
                <div className="detail-section">
                  <h3 className="detail-title">Description</h3>
                  <p className="detail-text">{selectedDept.dept_descr}</p>
                </div>
                <div className="detail-section">
                  <h3 className="detail-title">Head of Department</h3>
                  <p className="detail-text">{selectedDept.hod}</p>
                </div>
                <div className="detail-section">
                  <h3 className="detail-title">Contact Information</h3>
                  <p className="detail-text">Phone: {selectedDept.hod_phone}</p>
                  <p className="detail-text">Email: {selectedDept.hod_email}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}
