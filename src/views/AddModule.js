"use client"

import { useState } from "react"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Upload, Download, Code, BookOpen, GraduationCap, Calendar, Layers, Award, FileSpreadsheet } from "lucide-react"

export default function AddModule() {
  const [formData, setFormData] = useState({
    moduleCode: "",
    moduleName: "",
    moduleType: "",
    year: "",
    semester: "",
    ntaLevel: "",
    creditValue: "15",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log("File selected:", file.name)
    }
  }

  return (
    <div className="max-w-[800px] mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Add New Module</h1>
        </div>
        <p className="text-gray-500 text-sm mt-2">Enter the module details below or use bulk upload.</p>
      </div>

      <Card className="p-6">
        <div className="border-2 border-dashed rounded-lg p-8 mb-8">
          <div className="flex flex-col items-center justify-center text-center">
            <FileSpreadsheet className="h-12 w-12 text-gray-400 mb-4" />
            <Button variant="outline" className="mb-2 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Choose CSV File
            </Button>
            <p className="text-sm text-gray-500 mb-2">Upload multiple modules using a CSV file</p>
            <button className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
              <Download className="h-4 w-4" />
              Download CSV Template
            </button>
            <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
          </div>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 uppercase">OR ADD SINGLE MODULE</span>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="moduleCode" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Module Code
              </Label>
              <div className="relative">
                <Input
                  id="moduleCode"
                  name="moduleCode"
                  value={formData.moduleCode}
                  onChange={handleChange}
                  placeholder="Enter module code"
                  required
                  className="pl-8"
                />
                <Code className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="moduleName" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Module Name
              </Label>
              <div className="relative">
                <Input
                  id="moduleName"
                  name="moduleName"
                  value={formData.moduleName}
                  onChange={handleChange}
                  placeholder="Enter module name"
                  required
                  className="pl-8"
                />
                <BookOpen className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="moduleType" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Module Type
            </Label>
            <Select onValueChange={(value) => handleSelectChange("moduleType", value)} value={formData.moduleType}>
              <SelectTrigger className="pl-8 relative">
                <Layers className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <SelectValue placeholder="Select module type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="elective">Elective</SelectItem>
                <SelectItem value="optional">Optional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="year" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Year
              </Label>
              <div className="relative">
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Enter year"
                  className="pl-8"
                />
                <Calendar className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="semester" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Semester
              </Label>
              <Select onValueChange={(value) => handleSelectChange("semester", value)} value={formData.semester}>
                <SelectTrigger className="pl-8 relative">
                  <Calendar className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ntaLevel" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                NTA Level
              </Label>
              <div className="relative">
                <Input
                  id="ntaLevel"
                  name="ntaLevel"
                  type="number"
                  value={formData.ntaLevel}
                  onChange={handleChange}
                  placeholder="Enter NTA level"
                  className="pl-8"
                />
                <GraduationCap className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="creditValue" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Credit Value
              </Label>
              <div className="relative">
                <Input
                  id="creditValue"
                  name="creditValue"
                  type="number"
                  value={formData.creditValue}
                  onChange={handleChange}
                  placeholder="Enter credit value"
                  className="pl-8"
                />
                <Award className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
            Add Module
          </Button>
        </form>
      </Card>
    </div>
  )
}

