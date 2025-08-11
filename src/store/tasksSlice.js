import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

// Task status constants
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
}

// Task priority constants
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

// Initial state
const initialState = {
  tasks: [],
  filter: {
    status: 'all',
    priority: 'all',
    search: ''
  },
  sort: {
    field: 'createdAt',
    direction: 'desc'
  }
}

// Tasks slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Add a new task
    addTask: (state, action) => {
      const newTask = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description || '',
        status: action.payload.status || TASK_STATUS.TODO,
        priority: action.payload.priority || TASK_PRIORITY.MEDIUM,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      state.tasks.push(newTask)
    },

    // Update an existing task
    updateTask: (state, action) => {
      const { id, updates } = action.payload
      const taskIndex = state.tasks.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
    },

    // Delete a task
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
    },

    // Toggle task status between todo, in-progress, and completed
    toggleTaskStatus: (state, action) => {
      const taskIndex = state.tasks.findIndex(task => task.id === action.payload)
      if (taskIndex !== -1) {
        const currentStatus = state.tasks[taskIndex].status
        let newStatus
        
        switch (currentStatus) {
          case TASK_STATUS.TODO:
            newStatus = TASK_STATUS.IN_PROGRESS
            break
          case TASK_STATUS.IN_PROGRESS:
            newStatus = TASK_STATUS.COMPLETED
            break
          case TASK_STATUS.COMPLETED:
            newStatus = TASK_STATUS.TODO
            break
          default:
            newStatus = TASK_STATUS.TODO
        }
        
        state.tasks[taskIndex].status = newStatus
        state.tasks[taskIndex].updatedAt = new Date().toISOString()
      }
    },

    // Set filter criteria
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload }
    },

    // Set sort criteria
    setSort: (state, action) => {
      state.sort = { ...state.sort, ...action.payload }
    },

    // Clear all completed tasks
    clearCompletedTasks: (state) => {
      state.tasks = state.tasks.filter(task => task.status !== TASK_STATUS.COMPLETED)
    },

    // Reset all filters
    resetFilters: (state) => {
      state.filter = {
        status: 'all',
        priority: 'all',
        search: ''
      }
    }
  }
})

// Export actions
export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  setFilter,
  setSort,
  clearCompletedTasks,
  resetFilters
} = tasksSlice.actions

// Selectors
export const selectAllTasks = (state) => state.tasks.tasks
export const selectTaskById = (state, taskId) => 
  state.tasks.tasks.find(task => task.id === taskId)
export const selectFilter = (state) => state.tasks.filter
export const selectSort = (state) => state.tasks.sort

// Filtered and sorted tasks selector
export const selectFilteredTasks = (state) => {
  const { tasks, filter, sort } = state.tasks
  
  let filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filter.status !== 'all' && task.status !== filter.status) {
      return false
    }
    
    // Filter by priority
    if (filter.priority !== 'all' && task.priority !== filter.priority) {
      return false
    }
    
    // Filter by search term
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase()
      return (
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      )
    }
    
    return true
  })
  
  // Sort tasks
  filteredTasks.sort((a, b) => {
    let aValue = a[sort.field]
    let bValue = b[sort.field]
    
    // Handle priority sorting
    if (sort.field === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 }
      aValue = priorityOrder[a.priority]
      bValue = priorityOrder[b.priority]
    }
    
    // Handle date sorting
    if (sort.field === 'createdAt' || sort.field === 'updatedAt') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }
    
    if (sort.direction === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
  
  return filteredTasks
}

// Task statistics selector
export const selectTaskStats = (state) => {
  const tasks = state.tasks.tasks
  return {
    total: tasks.length,
    todo: tasks.filter(task => task.status === TASK_STATUS.TODO).length,
    inProgress: tasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS).length,
    completed: tasks.filter(task => task.status === TASK_STATUS.COMPLETED).length,
    highPriority: tasks.filter(task => task.priority === TASK_PRIORITY.HIGH).length
  }
}

export default tasksSlice.reducer

