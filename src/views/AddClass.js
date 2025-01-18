'use client'

import { useState } from 'react'
import { Card } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { 
  Upload, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Calendar,
  Plus,
  Download
} from 'lucide-react'
import '../styles/AddClass.css'

function AddClass() {
  const [formData, setFormData] = useState({
    program: '',
    className: '',
    capacity: '',
    academicYear: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log('File selected:', file.name)
    }
  }

  return (
    <div className="add-class-container">
      <Card className="add-class-card">
        <h2 className="form-title">
          <Plus className="title-icon" size={24} />
          Add New Class
        </h2>
        <form onSubmit={handleSubmit} className="class-form">
          <div className="form-grid">
            <div className="form-group">
              <Label htmlFor="program" className="label-with-icon">
                <GraduationCap className="label-icon" size={16} />
                Program (required)
              </Label>
              <Select 
                required 
                onValueChange={(value) => setFormData({...formData, program: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {/* Programs will be populated from API */}
                </SelectContent>
              </Select>
            </div>

            <div className="form-group">
              <Label htmlFor="className" className="label-with-icon">
                <BookOpen className="label-icon" size={16} />
                Class Name (required)
              </Label>
              <Input
                id="className"
                required
                placeholder="Enter class name"
                value={formData.className}
                onChange={(e) => setFormData({...formData, className: e.target.value})}
              />
            </div>

            <div className="form-group">
              <Label htmlFor="capacity" className="label-with-icon">
                <Users className="label-icon" size={16} />
                Class Capacity (required)
              </Label>
              <Input
                id="capacity"
                type="number"
                required
                min="1"
                placeholder="Enter class capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              />
            </div>

            <div className="form-group">
              <Label htmlFor="academicYear" className="label-with-icon">
                <Calendar className="label-icon" size={16} />
                Academic Year (required)
              </Label>
              <Input
                id="academicYear"
                required
                placeholder="Enter academic year"
                value={formData.academicYear}
                onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
              />
            </div>
          </div>

          <div className="button-container">
            <Button type="submit" className="submit-button">
              <Plus size={16} className="button-icon" />
              Add Class
            </Button>
          </div>
        </form>

        <div className="divider">
          <div className="divider-line">
            <span className="divider-text">Or</span>
          </div>
        </div>

        <div className="csv-section">
          <div className="csv-header">
            <Label className="csv-title">
              <Upload size={16} className="label-icon" />
              Upload CSV File
            </Label>
            <Button 
              variant="outline" 
              size="sm"
              className="example-button"
              onClick={() => {
                console.log('Downloading example CSV...')
              }}
            >
              <Download size={16} className="button-icon" />
              Download Example CSV
            </Button>
          </div>
          <div className="upload-container">
            <label className="upload-area">
              <div className="upload-content">
                <Upload className="upload-icon" />
                <p className="upload-text">
                  <span className="upload-bold">Click to upload</span> or drag and drop
                </p>
                <p className="upload-hint">CSV file only</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".csv"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AddClass
