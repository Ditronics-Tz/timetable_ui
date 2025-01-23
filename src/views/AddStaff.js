"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { User, CreditCard, Mail, Phone, UserCircle, Briefcase, Building } from "lucide-react"
import '../styles/AddStaff.css'

// Sample departments data
const departments = [
  { id: 1, name: "Computer Science" },
  { id: 2, name: "Mathematics" },
  { id: 3, name: "Physics" },
  { id: 4, name: "Biology" },
]

export default function AddStaff() {
  const [formData, setFormData] = useState({
    name: "",
    rfidId: "",
    email: "",
    phoneNumber: "",
    staffType: "",
    staffTitle: "",
    department: "",
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
    // Clear error when user selects an option
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Staff Name is required"
    if (!formData.staffType) newErrors.staffType = "Staff Type is required"
    if (!formData.department) newErrors.department = "Department is required"

    // Basic email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log("Form submitted:", formData)
      // Reset form after successful submission
      setFormData({
        name: "",
        rfidId: "",
        email: "",
        phoneNumber: "",
        staffType: "",
        staffTitle: "",
        department: "",
      })
    }
  }

  return (
    <div className="add-staff-container">
      <Card className="add-staff-card">
        <h2 className="add-staff-title">
          <User className="form-icon" size={24} />
          Add New Staff
        </h2>
        
        <form onSubmit={handleSubmit} className="add-staff-form">
          <div className="form-group">
            <Label className="form-label">
              <User className="form-icon" size={16} />
              Staff Name
              <span className="required-field">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter staff name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="form-group">
            <Label className="form-label">
              <CreditCard className="form-icon" size={16} />
              RFID ID
            </Label>
            <Input
              id="rfidId"
              name="rfidId"
              value={formData.rfidId}
              onChange={handleChange}
              placeholder="Enter RFID ID (optional)"
            />
          </div>

          <div className="form-group">
            <Label className="form-label">
              <Mail className="form-icon" size={16} />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email (optional)"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="form-group">
            <Label className="form-label">
              <Phone className="form-icon" size={16} />
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number (optional)"
            />
          </div>

          <div className="form-group">
            <Label className="form-label">
              <UserCircle className="form-icon" size={16} />
              Staff Type
              <span className="required-field">*</span>
            </Label>
            <Select
              name="staffType"
              value={formData.staffType}
              onValueChange={(value) => handleSelectChange("staffType", value)}
            >
              <SelectTrigger className={errors.staffType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select staff type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
            {errors.staffType && <p className="text-red-500 text-sm mt-1">{errors.staffType}</p>}
          </div>

          <div className="form-group">
            <Label className="form-label">
              <Briefcase className="form-icon" size={16} />
              Staff Title
            </Label>
            <Input
              id="staffTitle"
              name="staffTitle"
              value={formData.staffTitle}
              onChange={handleChange}
              placeholder="Enter staff title (optional)"
            />
          </div>

          <div className="form-group">
            <Label className="form-label">
              <Building className="form-icon" size={16} />
              Department
              <span className="required-field">*</span>
            </Label>
            <Select
              name="department"
              value={formData.department}
              onValueChange={(value) => handleSelectChange("department", value)}
            >
              <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>

          <div className="submit-button">
            <Button type="submit" className="w-full bg-black hover:bg-gray-800">
              Add Staff
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

