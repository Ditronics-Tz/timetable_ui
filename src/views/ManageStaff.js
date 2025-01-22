"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Search, Plus, Upload, Edit, Trash2, MoreHorizontal, Download, FileUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

// Sample staff data
const initialStaffData = [
  { id: 1, name: "John Doe", email: "john@example.com", department: "Computer Science", staffType: "Academic" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", department: "Mathematics", staffType: "Administrative" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", department: "Physics", staffType: "Technical" },
]

export default function ManageStaff() {
  const [staffData, setStaffData] = useState(initialStaffData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedStaffType, setSelectedStaffType] = useState("")
  const [editingStaff, setEditingStaff] = useState(null)
  const [bulkEditMode, setBulkEditMode] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState([])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleDepartmentFilter = (value) => {
    setSelectedDepartment(value)
  }

  const handleStaffTypeFilter = (value) => {
    setSelectedStaffType(value)
  }

  const filteredStaff = staffData.filter((staff) => {
    return (
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedDepartment === "" || staff.department === selectedDepartment) &&
      (selectedStaffType === "" || staff.staffType === selectedStaffType)
    )
  })

  const handleEdit = (staff) => {
    setEditingStaff({ ...staff })
  }

  const handleSaveEdit = () => {
    setStaffData(staffData.map((staff) => (staff.id === editingStaff.id ? editingStaff : staff)))
    setEditingStaff(null)
  }

  const handleDelete = (id) => {
    setStaffData(staffData.filter((staff) => staff.id !== id))
  }

  const handleBulkUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Here you would typically process the CSV file
      console.log("Uploading file:", file.name)
      // For demonstration, we'll just add a dummy entry
      setStaffData([
        ...staffData,
        {
          id: staffData.length + 1,
          name: "New Staff",
          email: "new@example.com",
          department: "New Department",
          staffType: "Academic",
        },
      ])
    }
  }

  const handleBulkEdit = () => {
    setBulkEditMode(true)
  }

  const handleBulkDelete = () => {
    setStaffData(staffData.filter((staff) => !selectedStaff.includes(staff.id)))
    setSelectedStaff([])
  }

  const toggleStaffSelection = (id) => {
    setSelectedStaff(
      selectedStaff.includes(id) ? selectedStaff.filter((staffId) => staffId !== id) : [...selectedStaff, id],
    )
  }

  const handleBulkEditSave = () => {
    // Here you would typically update the selected staff with the bulk edit changes
    console.log("Saving bulk edit for staff IDs:", selectedStaff)
    setBulkEditMode(false)
    setSelectedStaff([])
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Manage Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Select onValueChange={handleDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={handleStaffTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Staff Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Administrative">Administrative</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="space-x-2">
              <Button onClick={handleBulkEdit} disabled={selectedStaff.length === 0}>
                <Edit className="mr-2 h-4 w-4" /> Bulk Edit
              </Button>
              <Button onClick={handleBulkDelete} variant="destructive" disabled={selectedStaff.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" /> Bulk Delete
              </Button>
            </div>
            <div className="space-x-2">
              <Button as="label" htmlFor="csv-upload">
                <Upload className="mr-2 h-4 w-4" /> Bulk Upload
                <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleBulkUpload} />
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Staff
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    onChange={() => {
                      if (selectedStaff.length === filteredStaff.length) {
                        setSelectedStaff([])
                      } else {
                        setSelectedStaff(filteredStaff.map((staff) => staff.id))
                      }
                    }}
                    checked={selectedStaff.length === filteredStaff.length && filteredStaff.length > 0}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Staff Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedStaff.includes(staff.id)}
                      onChange={() => toggleStaffSelection(staff.id)}
                    />
                  </TableCell>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{staff.staffType}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(staff)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(staff.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Staff Dialog */}
      <Dialog open={editingStaff !== null} onOpenChange={() => setEditingStaff(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          {editingStaff && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveEdit()
              }}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Select
                    value={editingStaff.department}
                    onValueChange={(value) => setEditingStaff({ ...editingStaff, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-staff-type">Staff Type</Label>
                  <Select
                    value={editingStaff.staffType}
                    onValueChange={(value) => setEditingStaff({ ...editingStaff, staffType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Staff Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Administrative">Administrative</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingStaff(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Edit Dialog */}
      <Dialog open={bulkEditMode} onOpenChange={() => setBulkEditMode(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Edit Staff</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleBulkEditSave()
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="bulk-edit-department">Department</Label>
                <Select onValueChange={(value) => console.log("Bulk update department:", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bulk-edit-staff-type">Staff Type</Label>
                <Select onValueChange={(value) => console.log("Bulk update staff type:", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Staff Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setBulkEditMode(false)}>
                Cancel
              </Button>
              <Button type="submit">Apply Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

