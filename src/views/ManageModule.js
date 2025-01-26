'use client'

import { useState } from 'react'
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Upload, Download, Plus, User, BookOpen, School } from 'lucide-react'
import '../styles/ManageModule.css'

export default function ModuleAllocation() {
  const [files, setFiles] = useState([])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    handleFiles(files)
  }

  const handleFiles = (files) => {
    // Handle file upload logic here
  }

  const downloadExampleCSV = () => {
    // Download CSV logic here
  }

  const handleAddAllocation = () => {
    // Add allocation logic here
  }

  return (
    <div className="manage-modules-container">
      <Card className="manage-modules-card">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Module Allocation</h1>
            <p className="text-gray-600">Assign modules to classes and staff members</p>
          </div>
          <Button 
            variant="outline" 
            className="text-gray-700 hover:bg-gray-50 border border-gray-200"
            onClick={downloadExampleCSV}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Example CSV
          </Button>
        </div>

        <div 
          className="upload-container"
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
          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
          <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">CSV file only</p>
        </div>

        <div className="filters-container">
          <div>
            <label className="block">
              Classes <span className="text-red-500">*</span>
            </label>
            <Button variant="outline" className="w-full justify-between bg-white border-gray-200">
              Select classes
              <School className="h-4 w-4 ml-2 text-gray-500" />
            </Button>
          </div>

          <div>
            <label className="block">
              Modules <span className="text-red-500">*</span>
            </label>
            <Button variant="outline" className="w-full justify-between bg-white border-gray-200">
              Select modules
              <BookOpen className="h-4 w-4 ml-2 text-gray-500" />
            </Button>
          </div>

          <div>
            <label className="block">
              Staff <span className="text-red-500">*</span>
            </label>
            <Button variant="outline" className="w-full justify-between bg-white border-gray-200">
              Select staff members
              <User className="h-4 w-4 ml-2 text-gray-500" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="manage-modules-card">
        <div className="current-allocations-header">
          <h2 className="current-allocations-title">Current Allocations</h2>
          <Button 
            variant="secondary"
            className="add-allocation-button"
            onClick={handleAddAllocation}
          >
            <Plus className="h-4 w-4" />
            Add Allocation
          </Button>
        </div>
        <p className="empty-state">
          No allocations added yet. Create an allocation using the form or upload a CSV file.
        </p>
      </Card>
    </div>
  )
}
