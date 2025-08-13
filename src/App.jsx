import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectTaskStats } from './store/tasksSlice'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskFilters from './components/TaskFilters'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckSquare, 
  Plus, 
  Filter, 
  BarChart3, 
  Zap,
  Target,
  TrendingUp
} from 'lucide-react'
import './App.css'

function App() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const stats = useSelector(selectTaskStats)

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-sm text-gray-600">Advanced Task Tracker</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                <Target className="h-3 w-3" />
                {completionRate}% Complete
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms and Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Tasks</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
                
                {stats.total > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{stats.completed}/{stats.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Task Form */}
            {showAddForm && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <TaskForm />
              </div>
            )}

            {/* Filters */}
            {showFilters && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <TaskFilters />
              </div>
            )}

            {/* Productivity Tips */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-900">Productivity Tip</h3>
                </div>
                <p className="text-sm text-gray-700">
                  Break large tasks into smaller, manageable chunks. Use high priority for urgent items and keep your task list focused.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Task List */}
          <div className="lg:col-span-2">
            <TaskList />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>Built by Saheed with Redux Toolkit & React</span>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 TaskFlow. Boost your productivity.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
