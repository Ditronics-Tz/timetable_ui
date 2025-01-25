"use client"

import { useState } from 'react'
import { Card } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { BookOpen, Building2, GraduationCap, Upload, Download } from "lucide-react"
import '../styles/AddProgram.css'

export default function AddProgramPage() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      alert("Please upload a CSV file");
    }
  };

  const handleDownloadTemplate = () => {
    // Add logic to download CSV template
  };

  return (
    <div className="add-program-container">
      <Card className="add-program-card">
        <h1 className="text-2xl font-bold mb-2">Add New Program</h1>
        <p className="text-gray-500 mb-8">Enter the program details below to create a new program.</p>

        <div className="space-y-6">
          <div className="input-container">
            <Label className="label-with-icon">
              <BookOpen className="w-5 h-5" />
              Program Name <span className="required-indicator">*</span>
            </Label>
            <Input placeholder="Enter program name" />
          </div>

          <div className="input-container">
            <Label className="label-with-icon">
              <Building2 className="w-5 h-5" />
              Department <span className="required-indicator">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs">Computer Science</SelectItem>
                <SelectItem value="eng">Engineering</SelectItem>
                <SelectItem value="bus">Business</SelectItem>
                <SelectItem value="arts">Arts & Sciences</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="input-container">
            <Label className="label-with-icon">
              <GraduationCap className="w-5 h-5" />
              NTA Level
            </Label>
            <Input placeholder="Enter NTA level (optional)" />
          </div>

          <div className="input-container">
            <Label className="label-with-icon">
              <GraduationCap className="w-5 h-5" />
              Level <span className="required-indicator">*</span>
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select program level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diploma">Diploma</SelectItem>
                <SelectItem value="degree">Degree</SelectItem>
                <SelectItem value="vocational">Vocational Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="separator">
            <span className="separator-text">OR</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <Upload className="w-4 h-4" />
              Upload CSV File
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleDownloadTemplate}
            >
              <Download className="w-4 h-4" />
              Download Example CSV
            </Button>
          </div>

          <div className="csv-upload-container">
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="upload-area">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg text-gray-600">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mt-1">CSV file only</p>
            </div>
          </div>

          <Button className="submit-button bg-black text-white hover:bg-black/90">
            Add Program
          </Button>
        </div>
      </Card>
    </div>
  )
}

