"use client"

import { useState } from 'react'
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Building2, User, Phone, Mail, Upload, Download } from "lucide-react"
import '../styles/AddDepartment.css'

export default function AddDepartment() {
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentDescription: '',
    hodName: '',
    hodPhone: '',
    hodEmail: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle CSV upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target.result
        const [headers, ...rows] = text.split('\n')
        if (rows.length > 0) {
          const [name, description, hod, phone, email] = rows[0].split(',')
          setFormData({
            departmentName: name || '',
            departmentDescription: description || '',
            hodName: hod || '',
            hodPhone: phone || '',
            hodEmail: email || ''
          })
        }
      }
      reader.readAsText(file)
    }
  }

  // Handle example CSV download
  const handleDownloadExample = () => {
    const headers = ["Department Name", "Description", "HOD Name", "HOD Phone", "HOD Email"]
    const exampleData = ["Computer Science", "CS Department", "Dr. John Doe", "1234567890", "john@example.com"]
    const csv = [headers.join(','), exampleData.join(',')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'department_template.csv'
    a.click()
  }

  return (
    <div className="add-department-container">
      <Card className="add-department-card">
        <h2 className="add-department-title">Add New Department</h2>
        
        {/* CSV Upload Section */}
        <div className="csv-section">
          <div className="csv-buttons">
            <div className="upload-button-container">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('csv-upload').click()}
                className="upload-button"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload CSV File
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={handleDownloadExample}
              className="download-button"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Example CSV
            </Button>
          </div>
          <div className="upload-area">
            <div className="upload-placeholder">
              <Upload className="h-12 w-12 text-gray-400" />
              <p className="text-gray-500 mt-2">Click to upload or drag and drop</p>
              <p className="text-gray-400 text-sm">CSV file only</p>
            </div>
          </div>
        </div>

        <div className="separator">OR</div>

        <form onSubmit={handleSubmit} className="add-department-form">
          <div className="form-group">
            <Label htmlFor="departmentName" className="required-field">
              Department Name
            </Label>
            <div className="input-container">
              <Building2 className="input-icon" />
              <Input
                id="departmentName"
                name="departmentName"
                placeholder="Enter department name"
                value={formData.departmentName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <Label htmlFor="departmentDescription">
              Department Description
            </Label>
            <Textarea
              id="departmentDescription"
              name="departmentDescription"
              placeholder="Enter department description"
              value={formData.departmentDescription}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>

          <div className="form-group">
            <Label htmlFor="hodName">
              Head of Department
            </Label>
            <div className="input-container">
              <User className="input-icon" />
              <Input
                id="hodName"
                name="hodName"
                placeholder="Enter HOD name"
                value={formData.hodName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <Label htmlFor="hodPhone">
                HOD Phone Number
              </Label>
              <div className="input-container">
                <Phone className="input-icon" />
                <Input
                  id="hodPhone"
                  name="hodPhone"
                  placeholder="Enter HOD phone number"
                  value={formData.hodPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group flex-1">
              <Label htmlFor="hodEmail">
                HOD Email
              </Label>
              <div className="input-container">
                <Mail className="input-icon" />
                <Input
                  id="hodEmail"
                  name="hodEmail"
                  type="email"
                  placeholder="Enter HOD email"
                  value={formData.hodEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="button-container">
            <Button
              type="submit"
              className="submit-button"
            >
              Add Department
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
