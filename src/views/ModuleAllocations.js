"use client"

import { useState, useCallback } from "react"
import { Plus, Upload, Download, User, BookOpen, School } from "lucide-react"
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import '../styles/ModuleAllocation.css'

export default function ModuleAllocation() {
  const [selectedClasses, setSelectedClasses] = useState([])
  const [selectedStaff, setSelectedStaff] = useState([])
  const [selectedModules, setSelectedModules] = useState([])
  const [allocations, setAllocations] = useState([])
  const [dragActive, setDragActive] = useState(false)

  // Mock data - replace with your actual data
  const mockStaff = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ]

  const mockModules = [
    { id: 1, name: "Mathematics 101", programs: [1] },
    { id: 2, name: "Physics 101", programs: [1] },
  ]

  const mockClasses = [
    { id: 1, name: "Class A", programId: 1, program: "Science Program" },
    { id: 2, name: "Class B", programId: 2, program: "Arts Program" },
  ]

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (files) => {
    const file = files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target.result
        const rows = text.split('\n').map(row => row.split(','))
        // Process CSV data here
        console.log("Processed CSV:", rows)
      }
      reader.readAsText(file)
    }
  }

  const downloadExampleCSV = () => {
    const headers = ["Class", "Module", "Staff"]
    const exampleData = ["Class A,Mathematics 101,John Doe"]
    const csv = [headers.join(','), exampleData].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'module_allocation_template.csv'
    a.click()
  }

  const handleClassSelect = (classItem) => {
    if (!selectedClasses.find((c) => c.id === classItem.id)) {
      setSelectedClasses([...selectedClasses, classItem])
    }
  }

  const handleStaffSelect = (staff) => {
    if (!selectedStaff.find((s) => s.id === staff.id)) {
      setSelectedStaff([...selectedStaff, staff])
    }
  }

  const handleModuleSelect = (module) => {
    if (!selectedModules.find((m) => m.id === module.id)) {
      setSelectedModules([...selectedModules, module])
    }
  }

  const handleAddAllocation = () => {
    if (selectedClasses.length && selectedModules.length && selectedStaff.length) {
      const newAllocation = {
        id: Date.now(),
        classes: selectedClasses,
        modules: selectedModules,
        staff: selectedStaff,
      }
      setAllocations([...allocations, newAllocation])
      // Clear selections
      setSelectedClasses([])
      setSelectedModules([])
      setSelectedStaff([])
    }
  }

  return (
    <div className="module-allocation-container">
      <div className="allocation-grid">
        {/* Left Column - Module Allocation */}
        <Card className="allocation-card">
          <div className="card-header">
            <h1 className="card-title">Module Allocation</h1>
            <p className="card-description">Assign modules to classes and staff members</p>
          </div>

          {/* CSV Upload Section */}
          <div className="csv-section">
            <div className="csv-buttons">
              <Button
                variant="outline"
                className="upload-button"
                onClick={() => document.getElementById("csv-upload").click()}
              >
                <Upload className="button-icon" />
                Upload CSV File
              </Button>
              <Button variant="outline" className="download-button" onClick={downloadExampleCSV}>
                <Download className="button-icon" />
                Download Example CSV
              </Button>
            </div>

            <div
              className={`upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="csv-upload"
                className="hidden"
                accept=".csv"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="upload-content">
                <Upload className="upload-icon" />
                <p className="upload-text">Click to upload or drag and drop</p>
                <p className="upload-subtext">CSV file only</p>
              </div>
            </div>
          </div>

          <div className="selection-section">
            {/* Selection components... */}
            {/* Class Selection */}
            <div className="selection-group">
              <label className="selection-label">
                Classes <span className="required">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="selection-button">
                    Select classes
                    <School className="button-icon" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="selection-content">
                  <Command>
                    <CommandInput placeholder="Search classes..." />
                    <CommandList>
                      <CommandEmpty>No classes found.</CommandEmpty>
                      <CommandGroup>
                        {mockClasses.map((classItem) => (
                          <CommandItem key={classItem.id} onSelect={() => handleClassSelect(classItem)}>
                            <School className="item-icon" />
                            {classItem.name} - {classItem.program}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Similar structure for Module and Staff selection... */}
          </div>
        </Card>

        {/* Right Column - Current Allocations */}
        <Card className="allocation-card">
          <h2 className="allocations-title">Current Allocations</h2>
          <div className="allocations-empty">
            No allocations added yet. Create an allocation using the form or upload a CSV file.
          </div>
          <Button
            className="add-allocation-button"
            onClick={handleAddAllocation}
            disabled={!selectedClasses.length || !selectedModules.length || !selectedStaff.length}
          >
            <Plus className="button-icon" />
            Add Allocation
          </Button>
        </Card>
      </div>
    </div>
  )
}
