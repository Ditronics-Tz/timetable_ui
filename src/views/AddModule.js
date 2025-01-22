"use client"

import React, { useState } from 'react';
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { FileText, BookOpen, Calendar, GraduationCap, Award } from 'lucide-react';
import '../styles/AddModule.css';

const AddModule = () => {
  const [moduleData, setModuleData] = useState({
    module_code: '',
    module_name: '',
    module_type: '',
    year: '',
    semester: '',
    nta_level: '',
    credit_value: '15'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModuleData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setModuleData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      console.log("CSV file selected:", file);
    } else {
      alert("Please upload a valid CSV file");
    }
  };

  return (
    <div className="add-module-container">
      <Card className="add-module-card">
        <div className="header">
          <h1>Add New Module</h1>
          <p>Enter the module details below or use bulk upload.</p>
        </div>

        <div className="upload-section">
          <FileText className="upload-icon" size={48} />
          <input
            type="file"
            accept=".csv"
            id="csvFile"
            onChange={handleFileUpload}
            className="file-input"
          />
          <Button variant="outline" className="file-label" onClick={() => document.getElementById('csvFile').click()}>
            Choose CSV File
          </Button>
          <p>Upload multiple modules using a CSV file</p>
          <Button variant="link" className="template-link">
            Download CSV Template
          </Button>
        </div>

        <div className="separator">
          <span>OR ADD SINGLE MODULE</span>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="module-form">
          <div className="form-row">
            <div className="form-group">
              <Label>
                <FileText className="input-icon" size={16} />
                Module Code
              </Label>
              <Input
                name="module_code"
                value={moduleData.module_code}
                onChange={handleChange}
                placeholder="Enter module code"
              />
            </div>

            <div className="form-group">
              <Label>
                <BookOpen className="input-icon" size={16} />
                Module Name
              </Label>
              <Input
                name="module_name"
                value={moduleData.module_name}
                onChange={handleChange}
                placeholder="Enter module name"
              />
            </div>
          </div>

          <div className="form-group">
            <Label>Module Type</Label>
            <Select onValueChange={(value) => handleSelectChange("module_type", value)} value={moduleData.module_type}>
              <SelectTrigger>
                <SelectValue placeholder="Select module type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="elective">Elective</SelectItem>
                <SelectItem value="optional">Optional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <Label>
                <Calendar className="input-icon" size={16} />
                Year
              </Label>
              <Input
                type="number"
                name="year"
                value={moduleData.year}
                onChange={handleChange}
                placeholder="Enter year"
              />
            </div>

            <div className="form-group">
              <Label>
                <Calendar className="input-icon" size={16} />
                Semester
              </Label>
              <Select onValueChange={(value) => handleSelectChange("semester", value)} value={moduleData.semester}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <Label>
                <GraduationCap className="input-icon" size={16} />
                NTA Level
              </Label>
              <Input
                type="number"
                name="nta_level"
                value={moduleData.nta_level}
                onChange={handleChange}
                placeholder="Enter NTA level"
              />
            </div>

            <div className="form-group">
              <Label>
                <Award className="input-icon" size={16} />
                Credit Value
              </Label>
              <Input
                type="number"
                name="credit_value"
                value={moduleData.credit_value}
                onChange={handleChange}
                placeholder="Enter credit value"
              />
            </div>
          </div>

          <Button type="submit" className="submit-button">
            Add Module
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddModule;

