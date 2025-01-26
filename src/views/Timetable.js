"use client"

import { useState } from "react"
import { Building2, GraduationCap, BookOpen, Calendar, Clock, FileText, School, Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Progress } from "../components/ui/progress"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import "../styles/Timetable.css"

export default function TimetableGenerator() {
  const [generatingTimetable, setGeneratingTimetable] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  const handleGenerateTimetable = (type) => {
    setGeneratingTimetable(true)
    setGenerationProgress(0)

    // Simulating timetable generation process
    const interval = setInterval(() => {
      setGenerationProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          setGeneratingTimetable(false)
          return 100
        }
        return prevProgress + 10
      })
    }, 500)
  }

  return (
    <div className="timetable-page">
      <div className="timetable-content">
        <h1 className="timetable-header text-3xl font-bold">SACAS TIMETABLE GENERATOR</h1>

        <Tabs defaultValue="class" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="class">Class Timetable</TabsTrigger>
            <TabsTrigger value="exam">Exam Schedule</TabsTrigger>
            <TabsTrigger value="supplementary">Supplementary Exams</TabsTrigger>
          </TabsList>

          <TabsContent value="class" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Class Timetable</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="2">Semester 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Generate for</Label>
                  <RadioGroup defaultValue="university">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="university" id="university" />
                      <Label htmlFor="university">Whole University</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="department" id="department" />
                      <Label htmlFor="department">Specific Department</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Department (if applicable)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="ee">Electrical Engineering</SelectItem>
                      <SelectItem value="me">Mechanical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleGenerateTimetable("class")} disabled={generatingTimetable}>
                  {generatingTimetable ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Generate Class Timetable
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exam" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Exam Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Exam Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mid">Mid Semester</SelectItem>
                        <SelectItem value="end">End Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="2">Semester 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Generate for</Label>
                  <RadioGroup defaultValue="university">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="university" id="exam-university" />
                      <Label htmlFor="exam-university">Whole University</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="department" id="exam-department" />
                      <Label htmlFor="exam-department">Specific Department</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Department (if applicable)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="ee">Electrical Engineering</SelectItem>
                      <SelectItem value="me">Mechanical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleGenerateTimetable("exam")} disabled={generatingTimetable}>
                  {generatingTimetable ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Exam Schedule
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supplementary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Supplementary Exam Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-24">2023-24</SelectItem>
                        <SelectItem value="2024-25">2024-25</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="2">Semester 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Generate for</Label>
                  <RadioGroup defaultValue="university">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="university" id="supp-university" />
                      <Label htmlFor="supp-university">Whole University</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="department" id="supp-department" />
                      <Label htmlFor="supp-department">Specific Department</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>Department (if applicable)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="ee">Electrical Engineering</SelectItem>
                      <SelectItem value="me">Mechanical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleGenerateTimetable("supplementary")} disabled={generatingTimetable}>
                  {generatingTimetable ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <School className="mr-2 h-4 w-4" />
                      Generate Supplementary Exam Schedule
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {generatingTimetable && (
          <Card>
            <CardHeader>
              <CardTitle>Generation Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={generationProgress} className="w-full" />
              <p className="text-center mt-2">{generationProgress}% Complete</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
