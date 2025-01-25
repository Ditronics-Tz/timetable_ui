"use client"

import { useState } from "react"
import { Search, Trash2, User, BookOpen, School, Eye } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Badge } from "../components/ui/badge"
import { Card } from "../components/ui/card"
import '../styles/ViewAllocations.css'

export default function ViewAllocations() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewedAllocation, setViewedAllocation] = useState(null)

  // Mock data - replace with your actual data
  const mockAllocations = [
    {
      id: 1,
      staff: { id: 1, name: "John Doe" },
      classes: [
        { id: 1, name: "Class A" },
        { id: 2, name: "Class B" },
      ],
      modules: [
        { id: 1, name: "Mathematics 101" },
        { id: 2, name: "Physics 101" },
      ],
    },
    {
      id: 2,
      staff: { id: 2, name: "Jane Smith" },
      classes: [{ id: 3, name: "Class C" }],
      modules: [{ id: 3, name: "Chemistry 101" }],
    },
  ]

  const [allocations, setAllocations] = useState(mockAllocations)

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  const handleDelete = (allocationId) => {
    setAllocations((prev) => prev.filter((allocation) => allocation.id !== allocationId))
  }

  const filteredAllocations = allocations.filter((allocation) =>
    allocation.staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="allocations-container">
      <Card className="allocations-card">
        <div className="header-section">
          <div className="header-content">
            <h1 className="page-title">View Allocations</h1>
            <p className="page-description">Search and manage module allocations</p>
          </div>
          <div className="search-container">
            <Search className="search-icon" />
            <Input
              placeholder="Search by staff name..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Modules</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAllocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="empty-message">
                    No allocations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAllocations.map((allocation) => (
                  <TableRow key={allocation.id}>
                    <TableCell>
                      <div className="staff-info">
                        <User className="staff-icon" />
                        <span>{allocation.staff.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="badge-container">
                        {allocation.classes.map((cls) => (
                          <Badge key={cls.id} variant="secondary" className="badge">
                            <School className="badge-icon" />
                            {cls.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="badge-container">
                        {allocation.modules.map((module) => (
                          <Badge key={module.id} variant="secondary" className="badge">
                            <BookOpen className="badge-icon" />
                            {module.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="actions-container">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="view-button"
                              onClick={() => setViewedAllocation(allocation)}
                            >
                              <Eye className="action-icon" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Allocation Details</DialogTitle>
                              <DialogDescription>
                                Detailed information about the allocation
                              </DialogDescription>
                            </DialogHeader>
                            {viewedAllocation && (
                              <div className="dialog-section">
                                <div>
                                  <h3 className="section-title">Staff</h3>
                                  <p className="section-content">{viewedAllocation.staff.name}</p>
                                </div>
                                <div>
                                  <h3 className="section-title">Classes</h3>
                                  <ul>
                                    {viewedAllocation.classes.map((cls) => (
                                      <li key={cls.id} className="list-item">
                                        {cls.name}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h3 className="section-title">Modules</h3>
                                  <ul>
                                    {viewedAllocation.modules.map((module) => (
                                      <li key={module.id} className="list-item">
                                        {module.name}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="delete-button"
                            >
                              <Trash2 className="action-icon" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="alert-dialog-content">
                            <AlertDialogHeader className="alert-dialog-header">
                              <AlertDialogTitle className="alert-dialog-title">
                                Delete Allocation
                              </AlertDialogTitle>
                              <AlertDialogDescription className="alert-dialog-description">
                                Are you sure you want to delete this allocation? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="alert-dialog-footer">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="delete-action"
                                onClick={() => handleDelete(allocation.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
