"use client"

import { useState } from "react"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Search, Eye } from "lucide-react"
import '../styles/ViewStaff.css'



export default function StaffView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [staffList, setStaffList] = useState([])
  const [selectedStaff, setSelectedStaff] = useState(null)

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="view-staff-container">
      <Card className="view-staff-card">
        <div className="view-staff-header">
          <h2 className="text-2xl font-bold">View Staff</h2>
        </div>
        
        <div className="view-staff-search">
          <div className="search-container">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search staff by name, email, or department..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
        </div>

        <div className="view-staff-table-container">
          <Table className="staff-table">
            <TableHeader>
              <TableRow>
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
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{staff.staffType}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedStaff(staff)}>
                          <span className="sr-only">View details</span>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Staff Details</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="flex items-center justify-center">
                            <Avatar className="h-24 w-24">
                              <AvatarImage src={staff.imageUrl} alt={staff.name} />
                              <AvatarFallback>
                                {staff.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-right font-bold">Name:</span>
                            <span className="col-span-3">{staff.name}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-right font-bold">Email:</span>
                            <span className="col-span-3">{staff.email}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-right font-bold">Department:</span>
                            <span className="col-span-3">{staff.department}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-right font-bold">Staff Type:</span>
                            <span className="col-span-3">
                              <Badge variant="outline">{staff.staffType}</Badge>
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-right font-bold">Phone:</span>
                            <span className="col-span-3">{staff.phone}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="text-right font-bold">Office:</span>
                            <span className="col-span-3">{staff.office}</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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

        <div className="view-staff-footer">
          <p className="text-sm text-gray-500">
            Showing {filteredStaff.length} of {staffList.length} staff members
          </p>
        </div>
      </Card>
    </div>
  )
}

