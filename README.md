# TaskFlow - Advanced Task Tracker

This document provides a comprehensive guide to setting up, running, and understanding the TaskFlow application. It covers local development setup, code structure, UI/UX design, and instructions for pushing the project to GitHub.




## 🚀 Local Setup and Installation

To get TaskFlow up and running on your local machine, follow these simple steps:

### 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Node.js**: TaskFlow is built with React, which requires Node.js. It's recommended to use the latest LTS (Long Term Support) version. You can download it from [nodejs.org](https://nodejs.org/).
*   **pnpm**: This project uses `pnpm` as its package manager, which is a fast and efficient alternative to `npm` or `yarn`. If you don't have `pnpm` installed, you can install it globally using `npm`:

    ```bash
    npm install -g pnpm
    ```

### 📦 Installation

1.  **Clone the repository (or extract the project files):**

    If you're cloning from GitHub, use the following command:

    ```bash
    git clone <your-github-repository-url>
    cd task-tracker
    ```

    If you received the project files as a compressed archive, extract them to your desired directory and navigate into it:

    ```bash
    cd path/to/task-tracker
    ```

2.  **Install dependencies:**

    Once inside the `task-tracker` project directory, install all the necessary dependencies using `pnpm`:

    ```bash
    pnpm install
    ```

    This command will install all the packages listed in `package.json`, including:
    *   `react`: The JavaScript library for building user interfaces.
    *   `react-dom`: Provides DOM-specific methods that can be used at the top-level of your app.
    *   `@reduxjs/toolkit`: The official, opinionated, batteries-included toolset for efficient Redux development. It simplifies state management and reduces boilerplate.
    *   `react-redux`: Official React bindings for Redux, allowing your React components to interact with the Redux store.
    *   `redux-persist`: Enables your Redux store to be saved to local storage and rehydrated on app startup, ensuring data persistence across sessions.

### ▶️ Running the Application

After installing the dependencies, you can start the development server:

```bash
pnpm run dev
```

This command will start the application in development mode, typically on `http://localhost:5173`. Open your web browser and navigate to this URL to see TaskFlow in action.

### 🛠️ Building for Production

To create an optimized production build of the application, run:

```bash
pnpm run build
```

This command will compile and minify your React application into the `dist` directory, ready for deployment.




## 💻 Code Structure and Redux Toolkit Implementation

TaskFlow is structured to be modular and maintainable, leveraging React for the UI and Redux Toolkit for robust state management.

### 📂 Project Structure

```
. 
├── public/
├── src/
│   ├── assets/             # Static assets like images, icons
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Generic UI elements (buttons, inputs, etc.)
│   │   ├── TaskForm.jsx    # Component for adding/editing tasks
│   │   ├── TaskItem.jsx    # Component for displaying a single task
│   │   ├── TaskList.jsx    # Component for displaying the list of tasks
│   │   └── TaskFilters.jsx # Component for filtering and sorting tasks
│   ├── store/              # Redux store configuration and slices
│   │   ├── store.js        # Redux store setup with Redux Persist
│   │   └── tasksSlice.js   # Redux Toolkit slice for task management
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Entry point of the React application
│   └── index.css           # Global styles
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── pnpm-lock.yaml          # pnpm lock file
└── README.md               # This documentation file
```

### 🧠 Redux Toolkit (RTK) Implementation

Redux Toolkit simplifies Redux development by providing utilities that reduce boilerplate and enforce best practices. TaskFlow utilizes RTK for managing its task-related state.

#### `src/store/tasksSlice.js`

This file defines the Redux slice for tasks. A "slice" in Redux Toolkit is a collection of Redux reducer logic and actions for a single feature in your app, typically defined together in a single file.

```javascript
import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push(action.payload);
    },
    updateTask: (state, action) => {
      const { id, title, description, status, priority } = action.payload;
      const existingTask = state.find(task => task.id === id);
      if (existingTask) {
        existingTask.title = title;
        existingTask.description = description;
        existingTask.status = status;
        existingTask.priority = priority;
        existingTask.updatedAt = new Date().toISOString(); // Update timestamp
      }
    },
    deleteTask: (state, action) => {
      return state.filter(task => task.id !== action.payload);
    },
    toggleTaskStatus: (state, action) => {
      const task = state.find(task => task.id === action.payload);
      if (task) {
        if (task.status === 'to-do') {
          task.status = 'in-progress';
        } else if (task.status === 'in-progress') {
          task.status = 'completed';
        } else {
          task.status = 'to-do';
        }
        task.updatedAt = new Date().toISOString(); // Update timestamp
      }
    },
    clearCompletedTasks: (state) => {
      return state.filter(task => task.status !== 'completed');
    },
  },
});

export const { addTask, updateTask, deleteTask, toggleTaskStatus, clearCompletedTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
```

*   **`createSlice`**: This function automatically generates action creators and action types based on the `name` and `reducers` you provide. It also creates a reducer function.
*   **`name: 'tasks'`**: This is the name of the slice, used as a prefix for the generated action types (e.g., `tasks/addTask`).
*   **`initialState: []`**: The initial state for this slice is an empty array, as we start with no tasks.
*   **`reducers`**: An object where keys are action names and values are reducer functions. RTK uses Immer internally, so you can write "mutating" logic directly inside reducers, and Immer will produce a new immutable state for you.
    *   `addTask`: Adds a new task to the state array.
    *   `updateTask`: Finds a task by `id` and updates its properties. It also updates the `updatedAt` timestamp.
    *   `deleteTask`: Removes a task from the state array based on its `id`.
    *   `toggleTaskStatus`: Cycles through `to-do`, `in-progress`, and `completed` statuses for a given task and updates its `updatedAt` timestamp.
    *   `clearCompletedTasks`: Filters out all tasks with `completed` status.
*   **`export const { ... } = tasksSlice.actions`**: Exports the generated action creators.
*   **`export default tasksSlice.reducer`**: Exports the reducer function generated by `createSlice`.

#### `src/store/store.js`

This file configures the Redux store, integrate the `tasksSlice` and `redux-persist` for local storage persistence.

```javascript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import tasksReducer from './tasksSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tasks'], // only tasks will be persisted
};

const rootReducer = combineReducers({
  tasks: tasksReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
```

*   **`configureStore`**: A RTK function that wraps the standard Redux `createStore` and provides sensible defaults, like including `redux-thunk` and Redux DevTools Extension support automatically.
*   **`combineReducers`**: Combines multiple slice reducers into a single root reducer.
*   **`redux-persist`**: A library that allows you to save your Redux store to persistent storage (like `localStorage`) and rehydrate it when the app starts.
    *   `persistConfig`: Configuration object for `redux-persist`.
        *   `key: 'root'`: The key for the storage object.
        *   `storage`: Specifies the storage engine (here, `localStorage`).
        *   `whitelist: ['tasks']`: An array of reducer keys that you want to persist. Only the `tasks` slice will be saved.
    *   `persistReducer`: A higher-order reducer that takes a `persistConfig` and a `rootReducer` to create a reducer that will persist its state.
*   **`persistor`**: The `persistor` object is used with `PersistGate` in your React application to delay rendering of your app's UI until your persisted state has been retrieved and saved to Redux.

#### `src/main.jsx`

This is the entry point of the React application where the Redux store and `redux-persist` are integrated with the React app.

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
```

*   **`Provider`**: A component from `react-redux` that makes the Redux store available to any nested components that need to access the Redux store.
*   **`PersistGate`**: A component from `redux-persist/integration/react` that delays the rendering of your app's UI until your persisted state has been rehydrated. The `loading={null}` prop means no loading indicator will be shown during rehydration.




## 🎨 UI Components and Design Choices

TaskFlow's user interface is designed to be intuitive, visually appealing, and highly functional. The application is built with a modular component-based architecture, making it easy to understand and extend.

### `src/App.jsx`

This is the main application component that orchestrates all other components. It sets up the overall layout and integrates the different sections of the TaskFlow application.

```javascript
import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilters from './components/TaskFilters';
import { useSelector } from 'react-redux';

function App() {
  const tasks = useSelector((state) => state.tasks);
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 sm:p-8">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8 lg:p-10 text-gray-800">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">TaskFlow <span className="text-blue-600">- Advanced Task Tracker</span></h1>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 p-5 rounded-lg shadow flex flex-col items-center">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Quick Stats</h2>
            <div className="text-4xl font-bold text-blue-600">{totalTasks}</div>
            <p className="text-blue-700">Total Tasks</p>
          </div>
          <div className="bg-green-100 p-5 rounded-lg shadow flex flex-col items-center">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Completed</h2>
            <div className="text-4xl font-bold text-green-600">{completedTasks}</div>
            <p className="text-green-700">{completionPercentage}% Completed</p>
          </div>
          <div className="bg-yellow-100 p-5 rounded-lg shadow flex flex-col items-center">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">In Progress</h2>
            <div className="text-4xl font-bold text-yellow-600">{tasks.filter(task => task.status === 'in-progress').length}</div>
            <p className="text-yellow-700">Tasks In Progress</p>
          </div>
        </div>

        {/* Add New Task Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Task</h2>
          <TaskForm />
        </div>

        {/* Filters & Sorting Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Filters & Sorting</h2>
          <TaskFilters />
        </div>

        {/* Task List Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Tasks</h2>
          <TaskList />
        </div>
      </div>
    </div>
  );
}

export default App;
```

*   **Layout**: The `App.jsx` component defines the main layout of the application. It uses a `min-h-screen` div with a `bg-gradient-to-br from-blue-500 to-purple-600` for a visually appealing background. The main content is centered within a `container mx-auto` with a white background, rounded corners, and shadow for a clean, modern look.
*   **Quick Stats**: Displays an overview of total tasks, completed tasks, and tasks in progress, providing immediate feedback to the user. Each stat is presented in a distinct color for easy readability.
*   **Sections**: The application is logically divided into sections for adding new tasks, filtering/sorting, and displaying the task list, each within its own card-like container (`bg-gray-50 p-6 rounded-lg shadow`).

### `src/components/TaskForm.jsx`

This component handles the creation and editing of tasks. It includes input fields for title, description, status, and priority.

### `src/components/TaskItem.jsx`

This component represents a single task in the list. It displays the task's title, description, status, and priority, along with options to edit or delete the task.

### `src/components/TaskList.jsx`

This component is responsible for rendering the list of tasks. It receives the filtered and sorted tasks from the Redux store and maps over them to render individual `TaskItem` components.

### `src/components/TaskFilters.jsx`

This component provides the user with options to filter and sort tasks based on various criteria such as status, priority, and search keywords.

### `src/index.css`

This file contains global CSS styles, including the color palette and typography. The design uses a clean, modern aesthetic with a focus on readability and user-friendliness. The color palette primarily consists of shades of blue, purple, green, and yellow, creating a vibrant yet professional look.

*   **Color Palette**: The primary colors are a gradient of blue and purple for the background, with various shades of blue, green, yellow, and red used for status indicators, priority badges, and statistics. This creates a cohesive and visually pleasing experience.
*   **Typography**: A clean and readable sans-serif font is used throughout the application to ensure clarity and ease of reading.
*   **Layout and Responsiveness**: The application uses a responsive design approach, ensuring that it looks good and functions well on various screen sizes, from mobile devices to large desktop monitors. This is achieved through the use of Tailwind CSS utility classes like `sm:p-8`, `md:grid-cols-3`, etc.
*   **User-Friendly Interface**: Icons and clear labels are used to make the interface intuitive. The forms are straightforward, and the filtering/sorting options are easily accessible, enhancing the overall user experience.




## ⬆️ Pushing to GitHub

Once you have the TaskFlow application running locally and are satisfied with it, you might want to push it to your GitHub repository to share it with others or for version control.

### 1. Create a New GitHub Repository

Go to [GitHub](https://github.com/) and log in to your account. Click on the `+` sign in the top right corner and select `New repository`. Give your repository a name (e.g., `taskflow-app`), an optional description, and choose whether it should be `Public` or `Private`. Do **not** initialize the repository with a README, .gitignore, or license, as we will be pushing our existing files.

### 2. Initialize Git in Your Project

Open your terminal or command prompt, navigate to your `task-tracker` project directory, and initialize a new Git repository:

```bash
cd path/to/task-tracker
git init
```

### 3. Add Your Files to the Repository

Add all the project files to the Git staging area:

```bash
git add .
```

### 4. Commit Your Changes

Commit the added files with a descriptive message:

```bash
git commit -m "Initial commit: TaskFlow application"
```

### 5. Link to Your GitHub Repository

Add the remote origin, linking your local repository to the one you created on GitHub. Replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPOSITORY_NAME>` with your actual GitHub username and repository name.

```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
```

### 6. Push Your Code to GitHub

Finally, push your local commits to the `main` branch of your GitHub repository:

```bash
git push -u origin main
```

If your default branch name is `master`, you might need to use `git push -u origin master` instead.

Your TaskFlow application code should now be visible on your GitHub repository!



