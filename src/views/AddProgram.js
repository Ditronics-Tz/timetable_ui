"use client"

import { useState } from 'react'
import { Card } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { BookOpen, Building2, GraduationCap } from "lucide-react"

export default function AddProgramPage() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-2">Add New Program</h1>
      <p className="text-gray-500 mb-8">Enter the program details below to create a new program.</p>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Program Name <span className="text-red-500">*</span>
          </Label>
          <Input placeholder="Enter program name" />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Department <span className="text-red-500">*</span>
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

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            NTA Level
          </Label>
          <Input placeholder="Enter NTA level (optional)" />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Level <span className="text-red-500">*</span>
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

        <Button className="w-full bg-black text-white hover:bg-black/90">
          Add Program
        </Button>
      </div>
    </Card>
  )
}

