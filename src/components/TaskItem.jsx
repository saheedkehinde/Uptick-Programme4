import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteTask, toggleTaskStatus, TASK_STATUS, TASK_PRIORITY } from '../store/tasksSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Edit3, 
  Trash2, 
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'
import TaskForm from './TaskForm'

const TaskItem = ({ task }) => {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)

  const handleToggleStatus = () => {
    dispatch(toggleTaskStatus(task.id))
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id))
    }
  }

  const getStatusIcon = () => {
    switch (task.status) {
      case TASK_STATUS.COMPLETED:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case TASK_STATUS.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = () => {
    const statusConfig = {
      [TASK_STATUS.TODO]: { label: 'To Do', variant: 'secondary' },
      [TASK_STATUS.IN_PROGRESS]: { label: 'In Progress', variant: 'default' },
      [TASK_STATUS.COMPLETED]: { label: 'Completed', variant: 'success' }
    }
    
    const config = statusConfig[task.status]
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  const getPriorityIcon = () => {
    switch (task.priority) {
      case TASK_PRIORITY.HIGH:
        return <ArrowUp className="h-4 w-4 text-red-500" />
      case TASK_PRIORITY.LOW:
        return <ArrowDown className="h-4 w-4 text-green-500" />
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />
    }
  }

  const getPriorityBadge = () => {
    const priorityConfig = {
      [TASK_PRIORITY.HIGH]: { label: 'High', className: 'bg-red-100 text-red-800 border-red-200' },
      [TASK_PRIORITY.MEDIUM]: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      [TASK_PRIORITY.LOW]: { label: 'Low', className: 'bg-green-100 text-green-800 border-green-200' }
    }
    
    const config = priorityConfig[task.priority]
    return (
      <Badge variant="outline" className={`text-xs ${config.className}`}>
        <span className="flex items-center gap-1">
          {getPriorityIcon()}
          {config.label}
        </span>
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isEditing) {
    return (
      <TaskForm 
        task={task} 
        onCancel={() => setIsEditing(false)} 
      />
    )
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      task.status === TASK_STATUS.COMPLETED ? 'opacity-75' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleStatus}
            className="p-1 h-auto hover:bg-transparent"
          >
            {getStatusIcon()}
          </Button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={`font-medium text-base leading-tight ${
                task.status === TASK_STATUS.COMPLETED 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="p-1 h-auto text-gray-500 hover:text-blue-600"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="p-1 h-auto text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {task.description && (
              <p className={`text-sm mb-3 ${
                task.status === TASK_STATUS.COMPLETED 
                  ? 'text-gray-400' 
                  : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusBadge()}
                {getPriorityBadge()}
              </div>
              
              <div className="text-xs text-gray-500">
                Created {formatDate(task.createdAt)}
                {task.updatedAt !== task.createdAt && (
                  <span className="ml-1">• Updated {formatDate(task.updatedAt)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskItem

