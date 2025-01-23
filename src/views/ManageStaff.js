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
import { Checkbox } from "../components/ui/checkbox"
import '../styles/ManageStaff.css'

// Sample staff data
const initialStaffData = [
 
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
    <div className="manage-staff-container">
      <div className="manage-staff-header">
        <div className="manage-staff-filters">
          <div className="manage-staff-search">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>

          <Select value={selectedDepartment} onValueChange={handleDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <span>Select Department</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStaffType} onValueChange={handleStaffTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <span>Select Staff Type</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="Administrative">Administrative</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="manage-staff-actions">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="default" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      <div className="manage-staff-table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedStaff.length === staffData.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStaff(staffData.map(staff => staff.id))
                    } else {
                      setSelectedStaff([])
                    }
                  }}
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
                  <Checkbox
                    checked={selectedStaff.includes(staff.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedStaff([...selectedStaff, staff.id])
                      } else {
                        setSelectedStaff(selectedStaff.filter(id => id !== staff.id))
                      }
                    }}
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

        {filteredStaff.length === 0 && (
          <div className="empty-state">
            No staff members found matching your search criteria.
          </div>
        )}
      </div>

      <div className="manage-staff-footer">
        <p className="text-sm text-gray-500">
          Showing {filteredStaff.length} of {staffData.length} staff members
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={selectedStaff.length === 0}
          >
            <Edit className="h-4 w-4" />
            Bulk Edit
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleBulkDelete}
            disabled={selectedStaff.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Bulk Delete
          </Button>
        </div>
      </div>

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

