import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTask, updateTask, TASK_STATUS, TASK_PRIORITY } from '../store/tasksSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit3, X } from 'lucide-react'

const TaskForm = ({ task = null, onCancel = null }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || TASK_STATUS.TODO,
    priority: task?.priority || TASK_PRIORITY.MEDIUM
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      return
    }

    if (task) {
      // Update existing task
      dispatch(updateTask({
        id: task.id,
        updates: formData
      }))
      if (onCancel) onCancel()
    } else {
      // Add new task
      dispatch(addTask(formData))
      setFormData({
        title: '',
        description: '',
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM
      })
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          {task ? (
            <>
              <Edit3 className="h-5 w-5 text-blue-600" />
              Edit Task
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 text-green-600" />
              Add New Task
            </>
          )}
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Task title *"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="text-base"
              required
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Task description (optional)"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TASK_STATUS.TODO}>To Do</SelectItem>
                  <SelectItem value={TASK_STATUS.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TASK_STATUS.COMPLETED}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TASK_PRIORITY.LOW}>Low Priority</SelectItem>
                  <SelectItem value={TASK_PRIORITY.MEDIUM}>Medium Priority</SelectItem>
                  <SelectItem value={TASK_PRIORITY.HIGH}>High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!formData.title.trim()}
          >
            {task ? 'Update Task' : 'Add Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default TaskForm

