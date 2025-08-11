import { useSelector, useDispatch } from 'react-redux'
import { setFilter, setSort, resetFilters, clearCompletedTasks, selectFilter, selectSort, TASK_STATUS, TASK_PRIORITY } from '../store/tasksSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, SortAsc, SortDesc, RotateCcw, Trash2 } from 'lucide-react'

const TaskFilters = () => {
  const dispatch = useDispatch()
  const filter = useSelector(selectFilter)
  const sort = useSelector(selectSort)

  const handleFilterChange = (field, value) => {
    dispatch(setFilter({ [field]: value }))
  }

  const handleSortChange = (field, direction) => {
    dispatch(setSort({ field, direction }))
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
  }

  const handleClearCompleted = () => {
    if (window.confirm('Are you sure you want to delete all completed tasks?')) {
      dispatch(clearCompletedTasks())
    }
  }

  const sortOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'title', label: 'Title' },
    { value: 'priority', label: 'Priority' }
  ]

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5 text-blue-600" />
          Filters & Sorting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={filter.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Status
            </label>
            <Select
              value={filter.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={TASK_STATUS.TODO}>To Do</SelectItem>
                <SelectItem value={TASK_STATUS.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={TASK_STATUS.COMPLETED}>Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Priority
            </label>
            <Select
              value={filter.priority}
              onValueChange={(value) => handleFilterChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value={TASK_PRIORITY.HIGH}>High Priority</SelectItem>
                <SelectItem value={TASK_PRIORITY.MEDIUM}>Medium Priority</SelectItem>
                <SelectItem value={TASK_PRIORITY.LOW}>Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sorting Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sort Field */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Sort by
            </label>
            <Select
              value={sort.field}
              onValueChange={(value) => handleSortChange(value, sort.direction)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Direction */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Order
            </label>
            <Select
              value={sort.direction}
              onValueChange={(value) => handleSortChange(sort.field, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Order..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">
                  <div className="flex items-center gap-2">
                    <SortDesc className="h-4 w-4" />
                    Descending
                  </div>
                </SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4" />
                    Ascending
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClearCompleted}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Clear Completed
          </Button>
        </div>

        {/* Active Filters Indicator */}
        {(filter.status !== 'all' || filter.priority !== 'all' || filter.search) && (
          <div className="pt-2 border-t">
            <div className="text-sm text-gray-600 mb-2">Active filters:</div>
            <div className="flex flex-wrap gap-2">
              {filter.status !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Status: {filter.status}
                </span>
              )}
              {filter.priority !== 'all' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Priority: {filter.priority}
                </span>
              )}
              {filter.search && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Search: "{filter.search}"
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TaskFilters

