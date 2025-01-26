"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Switch } from "../components/ui/switch"
import { Trash2, Edit, Plus, Save, Key, Calendar, CheckSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { Checkbox } from "../components/ui/checkbox"
import "../styles/Settings.css"

export default function SettingsPage() {
  const [coordinators, setCoordinators] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      department: "Computer Science",
      role: "Department Coordinator",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      department: "Electrical Engineering",
      role: "Exam Coordinator",
    },
  ])

  const [roles, setRoles] = useState([
    { id: 1, name: "Department Coordinator", permissions: ["manage_timetables", "view_reports"] },
    { id: 2, name: "Exam Coordinator", permissions: ["manage_exams", "view_reports"] },
  ])

  const [newCoordinator, setNewCoordinator] = useState({ name: "", email: "", department: "", role: "" })
  const [newRole, setNewRole] = useState({ name: "", permissions: [] })
  const [generatedTimetables, setGeneratedTimetables] = useState([
    { id: 1, name: "Fall 2023 Class Schedule", type: "Class", department: "Computer Science" },
    { id: 2, name: "Spring 2024 Exam Schedule", type: "Exam", department: "All Departments" },
  ])

  const [systemSettings, setSystemSettings] = useState({
    academicYear: "2023-2024",
    semester: "1",
    maintenanceMode: false,
    emailNotifications: true,
    dataRetentionPeriod: "1 year",
  })

  const handleAddCoordinator = () => {
    setCoordinators([...coordinators, { ...newCoordinator, id: coordinators.length + 1 }])
    setNewCoordinator({ name: "", email: "", department: "", role: "" })
  }

  const handleAddRole = () => {
    setRoles([...roles, { ...newRole, id: roles.length + 1 }])
    setNewRole({ name: "", permissions: [] })
  }

  const handleDeleteCoordinator = (id) => {
    setCoordinators(coordinators.filter((coord) => coord.id !== id))
  }

  const handleDeleteRole = (id) => {
    setRoles(roles.filter((role) => role.id !== id))
  }

  const handleDeleteTimetable = (id) => {
    setGeneratedTimetables(generatedTimetables.filter((timetable) => timetable.id !== id))
  }

  const handleChangePassword = (coordinatorId, newPassword) => {
    console.log(`Changing password for coordinator ${coordinatorId} to ${newPassword}`)
  }

  const handleUpdateSystemSettings = (newSettings) => {
    setSystemSettings({ ...systemSettings, ...newSettings })
  }

  return (
    <div className="settings-page">
      <div className="settings-content">
        <h1 className="settings-header text-3xl font-bold">SACAS Admin Settings</h1>

        <Tabs defaultValue="coordinators" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="coordinators">Manage Coordinators</TabsTrigger>
            <TabsTrigger value="roles">Manage Roles</TabsTrigger>
            <TabsTrigger value="timetables">Manage Timetables</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="coordinators" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Coordinator</CardTitle>
                <CardDescription>Create a new coordinator account</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newCoordinator.name}
                        onChange={(e) => setNewCoordinator({ ...newCoordinator, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCoordinator.email}
                        onChange={(e) => setNewCoordinator({ ...newCoordinator, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={newCoordinator.department}
                        onValueChange={(value) => setNewCoordinator({ ...newCoordinator, department: value })}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newCoordinator.role}
                        onValueChange={(value) => setNewCoordinator({ ...newCoordinator, role: value })}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.name}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleAddCoordinator}>
                    <Plus className="mr-2 h-4 w-4" /> Add Coordinator
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Coordinators</CardTitle>
                <CardDescription>Manage and edit coordinator accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coordinators.map((coordinator) => (
                      <TableRow key={coordinator.id}>
                        <TableCell>{coordinator.name}</TableCell>
                        <TableCell>{coordinator.email}</TableCell>
                        <TableCell>{coordinator.department}</TableCell>
                        <TableCell>{coordinator.role}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCoordinator(coordinator.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Key className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                                <DialogDescription>Set a new password for {coordinator.name}</DialogDescription>
                              </DialogHeader>
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault()
                                  const formData = new FormData(e.currentTarget)
                                  const newPassword = formData.get("newPassword")
                                  handleChangePassword(coordinator.id, newPassword)
                                }}
                              >
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" name="newPassword" type="password" required />
                                  </div>
                                  <Button type="submit">Change Password</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Role</CardTitle>
                <CardDescription>Create a new role with specific permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleName">Role Name</Label>
                    <Input
                      id="roleName"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {["manage_timetables", "manage_exams", "view_reports", "edit_settings"].map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission}
                            checked={newRole.permissions.includes(permission)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewRole({ ...newRole, permissions: [...newRole.permissions, permission] })
                              } else {
                                setNewRole({
                                  ...newRole,
                                  permissions: newRole.permissions.filter((p) => p !== permission),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={permission}>{permission.replace("_", " ")}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleAddRole}>
                    <Plus className="mr-2 h-4 w-4" /> Add Role
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Roles</CardTitle>
                <CardDescription>Manage and edit roles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>{role.name}</TableCell>
                        <TableCell>{role.permissions.join(", ")}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(role.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timetables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generated Timetables</CardTitle>
                <CardDescription>Manage and delete generated timetables</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedTimetables.map((timetable) => (
                      <TableRow key={timetable.id}>
                        <TableCell>{timetable.name}</TableCell>
                        <TableCell>{timetable.type}</TableCell>
                        <TableCell>{timetable.department}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the timetable and remove it
                                  from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteTimetable(timetable.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure global settings for SACAS</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Current Academic Year</Label>
                    <Select
                      value={systemSettings.academicYear}
                      onValueChange={(value) => handleUpdateSystemSettings({ academicYear: value })}
                    >
                      <SelectTrigger id="academicYear">
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Current Semester</Label>
                    <Select
                      value={systemSettings.semester}
                      onValueChange={(value) => handleUpdateSystemSettings({ semester: value })}
                    >
                      <SelectTrigger id="semester">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semester 1</SelectItem>
                        <SelectItem value="2">Semester 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maintenanceMode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => handleUpdateSystemSettings({ maintenanceMode: checked })}
                    />
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={systemSettings.emailNotifications}
                      onCheckedChange={(checked) => handleUpdateSystemSettings({ emailNotifications: checked })}
                    />
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataRetentionPeriod">Data Retention Period</Label>
                    <Select
                      value={systemSettings.dataRetentionPeriod}
                      onValueChange={(value) => handleUpdateSystemSettings({ dataRetentionPeriod: value })}
                    >
                      <SelectTrigger id="dataRetentionPeriod">
                        <SelectValue placeholder="Select data retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6 months">6 months</SelectItem>
                        <SelectItem value="1 year">1 year</SelectItem>
                        <SelectItem value="2 years">2 years</SelectItem>
                        <SelectItem value="5 years">5 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => console.log("Saving system settings:", systemSettings)}>
                    <Save className="mr-2 h-4 w-4" /> Save Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 