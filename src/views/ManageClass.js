'use client'

import { useState } from 'react'
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Checkbox } from "../components/ui/checkbox"
import { Calendar } from "../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { ChevronDown, CalendarIcon, Download, Plus, Settings2, Trash2, MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import '../styles/ManageClass.css'

export default function ClassManagement() {
  const [classes, setClasses] = useState([])
  const [selectedClasses, setSelectedClasses] = useState([])
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7))
  })

  const handleDelete = (id) => {
    setClasses(classes.filter(cls => cls.id !== id))
    setSelectedClasses(selectedClasses.filter(selectedId => selectedId !== id))
  }

  const handleBulkDelete = () => {
    setClasses(classes.filter(cls => !selectedClasses.includes(cls.id)))
    setSelectedClasses([])
  }

  return (
    <div className="manage-class-container">
      <Card className="manage-class-card">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manage Classes</h1>
          <p className="text-gray-500">Manage and organize your classes efficiently.</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Input 
              placeholder="Filter classes..." 
              className="max-w-sm"
            />
            
            <Select>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  Filter by...
                  <ChevronDown className="h-4 w-4" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="program">Program</SelectItem>
                <SelectItem value="capacity">Capacity</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  Filter by...
                  <ChevronDown className="h-4 w-4" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academicYear">Academic Year</SelectItem>
                <SelectItem value="stream">Stream</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" className="ml-auto">
              <Settings2 className="mr-2 h-4 w-4" />
              Columns
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedClasses.length === classes.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedClasses(classes.map(cls => cls.id))
                        } else {
                          setSelectedClasses([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Stream</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No classes found. Click "Add Class" to create a new class.
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedClasses.includes(cls.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedClasses([...selectedClasses, cls.id])
                            } else {
                              setSelectedClasses(selectedClasses.filter(id => id !== cls.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.program}</TableCell>
                      <TableCell>{cls.capacity}</TableCell>
                      <TableCell>{cls.academicYear}</TableCell>
                      <TableCell>{cls.stream}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${cls.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {cls.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(cls.id)}>
                              Copy class ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(cls.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {selectedClasses.length} of {classes.length} row(s) selected.
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                Bulk Update
              </Button>
              <Button 
                variant="destructive" 
                className="flex items-center gap-2" 
                onClick={handleBulkDelete} 
                disabled={selectedClasses.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                Bulk Delete
              </Button>
              <Button className="flex items-center gap-2 bg-black hover:bg-gray-800">
                <Plus className="h-4 w-4" />
                Add Class
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

