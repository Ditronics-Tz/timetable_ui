'use client'

import { Card } from "../components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar } from 'react-calendar'
import { Building2, GraduationCap, Users, BarChart2, Clock, BookOpen, FileText } from 'lucide-react'
import { Button } from "../components/ui/button"
import Navbar from '../components/Navbar'
import 'react-calendar/dist/Calendar.css'
import '../styles/Calendar.css'

const usageData = [
  { day: 'Mon', usage: 12 },
  { day: 'Tue', usage: 15 },
  { day: 'Wed', usage: 18 },
  { day: 'Thu', usage: 14 },
  { day: 'Fri', usage: 17 }
]

const activities = [
  {
    id: 1,
    title: 'Room 301 Schedule Updated',
    description: 'Changed Tuesday morning slot',
    time: '2 hours ago',
    icon: Clock,
  },
  {
    id: 2,
    title: 'New Class Added',
    description: 'Introduction to Computer Science',
    time: '4 hours ago',
    icon: BookOpen,
  },
  {
    id: 3,
    title: 'Room Maintenance',
    description: 'Room 205 under maintenance',
    time: '1 day ago',
    icon: Building2,
  },
]

const quickActions = [
  { label: 'Create New Timetable', icon: Clock },
  { label: 'Manage Rooms', icon: Building2 },
  { label: 'View Class Lists', icon: Users },
  { label: 'Generate Reports', icon: FileText },
]

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#f8f9ff]">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <div className="p-8 ml-[250px]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-[#28282B]">Dashboard</h1>
            <Button className="bg-[#28282B] hover:bg-[#1a1a1a] text-white">
              + Add New Timetable
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Rooms"
              value="128"
              change="+2 from last month"
              icon={<Building2 className="w-5 h-5" />}
            />
            <StatsCard
              title="Active Courses"
              value="245"
              change="+24.2% from last semester"
              icon={<GraduationCap className="w-5 h-5" />}
              changeColor="text-green-500"
            />
            <StatsCard
              title="Total Students"
              value="3,427"
              change="+1.12% from last year"
              icon={<Users className="w-5 h-5" />}
              changeColor="text-green-500"
            />
            <StatsCard
              title="Room Utilization"
              value="82%"
              change="-4% from last week"
              icon={<BarChart2 className="w-5 h-5" />}
              changeColor="text-red-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#28282B]">Room Usage Analytics</h2>
                  <p className="text-sm text-gray-500">Room utilization over the past week</p>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#28282B]">Schedule Overview</h2>
                <p className="text-sm text-gray-500">Manage upcoming classes and events</p>
              </div>
              <Calendar 
                className="border-0 w-full" 
                tileClassName="text-sm"
                formatShortWeekday={(locale, date) => 
                  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
                }
              />
            </Card>

            <Card className="p-6 bg-white shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#28282B]">Recent Activities</h2>
                <p className="text-sm text-gray-500">Latest updates and changes</p>
              </div>
              <div className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <activity.icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#28282B]">{activity.title}</h3>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#28282B]">Quick Actions</h2>
                <p className="text-sm text-gray-500">Common tasks and operations</p>
              </div>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <QuickActionButton key={action.label} label={action.label} Icon={action.icon} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, change, icon, changeColor = 'text-gray-500' }) {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-[#28282B]">{value}</p>
          <p className={`text-xs mt-2 ${changeColor}`}>{change}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  )
}

function QuickActionButton({ label, Icon }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-[#28282B] transition-colors">
      <Icon className="w-5 h-5 text-gray-500" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

