import { useSelector } from 'react-redux'
import { selectFilteredTasks, selectTaskStats } from '../store/tasksSlice'
import TaskItem from './TaskItem'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Circle, AlertTriangle } from 'lucide-react'

const TaskList = () => {
  const tasks = useSelector(selectFilteredTasks)
  const stats = useSelector(selectTaskStats)

  if (tasks.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No tasks found
              </h3>
              <p className="text-gray-500">
                Create your first task to get started with your productivity journey.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Task Statistics */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-700">To Do</div>
                <div className="text-lg font-bold text-gray-900">{stats.todo}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium text-gray-700">In Progress</div>
                <div className="text-lg font-bold text-blue-600">{stats.inProgress}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-sm font-medium text-gray-700">Completed</div>
                <div className="text-lg font-bold text-green-600">{stats.completed}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <div className="text-sm font-medium text-gray-700">High Priority</div>
                <div className="text-lg font-bold text-red-600">{stats.highPriority}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Tasks ({tasks.length})
        </h2>
        <Badge variant="outline" className="text-sm">
          {stats.total} total tasks
        </Badge>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

export default TaskList

