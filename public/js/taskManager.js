// Task Manager JavaScript
export class TaskManager {
  constructor() {
    this.tasks = [];
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.loadTasks();
  }
  
  bindEvents() {
    // New Task Button
    const newTaskBtn = document.getElementById('newTaskBtn');
    if (newTaskBtn) {
      newTaskBtn.addEventListener('click', () => this.showTaskForm());
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.filterTasks(e.target.value));
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.applyFilter(e.target.dataset.filter));
    });
  }
  
  showTaskForm() {
    // Remove any existing modal
    const existingModal = document.getElementById('taskModal');
    if (existingModal) existingModal.remove();
    
    // Create modal
    const modalHTML = `
      <div id="taskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl p-6 w-full max-w-md animate-fade-in">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-800">Create New Task</h3>
            <button id="closeModal" class="text-gray-500 hover:text-gray-700 text-xl">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form id="taskForm">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                <input 
                  type="text" 
                  id="taskTitle" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What needs to be done?"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  id="taskDescription"
                  rows="3"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add details..."
                ></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input 
                    type="date" 
                    id="taskDueDate"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select 
                    id="taskPriority"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium" selected>Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select 
                  id="taskProject"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="website">Website Redesign</option>
                  <option value="mobile">Mobile App</option>
                  <option value="marketing">Marketing Campaign</option>
                </select>
              </div>
              
              <div class="flex gap-2 pt-2">
                <button type="button" id="cancelBtn" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  Create Task
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal event listeners
    document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
    document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
    document.getElementById('taskModal').addEventListener('click', (e) => {
      if (e.target.id === 'taskModal') this.closeModal();
    });
    
    // Form submission
    document.getElementById('taskForm').addEventListener('submit', (e) => this.createTask(e));
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('taskDueDate').min = today;
    
    // Focus on title input
    setTimeout(() => document.getElementById('taskTitle').focus(), 100);
  }
  
  closeModal() {
    const modal = document.getElementById('taskModal');
    if (modal) {
      modal.style.opacity = '0';
      modal.style.transform = 'scale(0.95)';
      setTimeout(() => modal.remove(), 300);
    }
  }
  
  createTask(e) {
    e.preventDefault();
    
    const taskData = {
      id: Date.now().toString(),
      title: document.getElementById('taskTitle').value,
      description: document.getElementById('taskDescription').value,
      dueDate: document.getElementById('taskDueDate').value,
      priority: document.getElementById('taskPriority').value,
      project: document.getElementById('taskProject').value,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    // Add to tasks array
    this.tasks.push(taskData);
    
    // Save to localStorage
    this.saveTasks();
    
    // Add to UI
    this.addTaskToUI(taskData);
    
    // Close modal
    this.closeModal();
    
    // Show success message
    this.showNotification('Task created successfully!', 'success');
    
    // Update stats
    this.updateStats();
  }
  
  addTaskToUI(task) {
    const taskList = document.querySelector('.task-list-container');
    if (!taskList) return;
    
    const taskHTML = `
      <div class="task-item bg-white rounded-xl border border-gray-200 p-4 mb-4 hover:shadow-md transition duration-200 fade-in">
        <!-- Task content similar to TaskItem.astro -->
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3">
            <button class="task-toggle w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mt-1" data-task-id="${task.id}">
            </button>
            
            <div class="flex-1">
              <h4 class="task-title font-medium text-gray-800">${task.title}</h4>
              <p class="task-description text-gray-500 text-sm mt-1">${task.description}</p>
              
              <div class="flex items-center space-x-4 mt-3">
                <div class="flex items-center">
                  <i class="far fa-calendar text-gray-400 mr-2"></i>
                  <span class="text-sm text-gray-600">${task.dueDate || 'No due date'}</span>
                </div>
                
                <div class="flex items-center">
                  <i class="fas fa-tag text-gray-400 mr-2"></i>
                  <span class="text-sm text-gray-600">${task.project}</span>
                </div>
                
                <div class="flex items-center">
                  <i class="fas fa-flag ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'} mr-2"></i>
                  <span class="priority-badge text-sm font-medium capitalize ${task.priority === 'high' ? 'text-red-600' : task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'}" data-priority="${task.priority}">
                    ${task.priority} Priority
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button class="favorite-btn w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500" data-task-id="${task.id}">
              <i class="far fa-star"></i>
            </button>
            <button class="edit-btn w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500" data-task-id="${task.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500" data-task-id="${task.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    taskList.insertAdjacentHTML('afterbegin', taskHTML);
    
    // Re-bind events for new task
    this.bindTaskEvents(document.querySelector(`[data-task-id="${task.id}"]`).closest('.task-item'));
  }
  
  bindTaskEvents(taskElement) {
    // Toggle completion
    taskElement.querySelector('.task-toggle').addEventListener('click', (e) => this.toggleTaskCompletion(e));
    
    // Favorite
    taskElement.querySelector('.favorite-btn').addEventListener('click', (e) => this.toggleFavorite(e));
    
    // Delete
    taskElement.querySelector('.delete-btn').addEventListener('click', (e) => this.deleteTask(e));
    
    // Edit
    taskElement.querySelector('.edit-btn').addEventListener('click', (e) => this.editTask(e));
  }
  
  toggleTaskCompletion(e) {
    const button = e.currentTarget;
    const taskId = button.dataset.taskId;
    const taskItem = button.closest('.task-item');
    const isCompleted = button.classList.contains('bg-blue-500');
    
    // Update task in array
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex].completed = !isCompleted;
      this.saveTasks();
    }
    
    // Toggle UI
    if (isCompleted) {
      button.classList.remove('bg-blue-500', 'border-blue-500');
      button.classList.add('border-gray-300');
      button.innerHTML = '';
      taskItem.querySelector('.task-title').classList.remove('text-gray-400', 'line-through');
    } else {
      button.classList.remove('border-gray-300');
      button.classList.add('bg-blue-500', 'border-blue-500');
      button.innerHTML = '<i class="fas fa-check text-white text-xs"></i>';
      taskItem.querySelector('.task-title').classList.add('text-gray-400', 'line-through');
    }
    
    this.updateStats();
  }
  
  toggleFavorite(e) {
    const button = e.currentTarget;
    const icon = button.querySelector('i');
    if (icon.classList.contains('far')) {
      icon.classList.remove('far');
      icon.classList.add('fas', 'text-yellow-500');
    } else {
      icon.classList.remove('fas', 'text-yellow-500');
      icon.classList.add('far');
    }
  }
  
  deleteTask(e) {
    const button = e.currentTarget;
    const taskId = button.dataset.taskId;
    const taskItem = button.closest('.task-item');
    
    if (confirm('Are you sure you want to delete this task?')) {
      // Remove from array
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.saveTasks();
      
      // Animate removal
      taskItem.style.opacity = '0';
      taskItem.style.transform = 'translateX(-20px)';
      
      setTimeout(() => {
        taskItem.remove();
        this.updateStats();
        this.showNotification('Task deleted successfully!', 'info');
      }, 300);
    }
  }
  
  editTask(e) {
    const button = e.currentTarget;
    const taskId = button.dataset.taskId;
    const taskItem = button.closest('.task-item');
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) return;
    
    const task = this.tasks[taskIndex];
    const newTitle = prompt('Edit task title:', task.title);
    
    if (newTitle && newTitle !== task.title) {
      task.title = newTitle;
      taskItem.querySelector('.task-title').textContent = newTitle;
      this.saveTasks();
      this.showNotification('Task updated successfully!', 'success');
    }
  }
  
  filterTasks(searchTerm) {
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(task => {
      const title = task.querySelector('.task-title').textContent.toLowerCase();
      const description = task.querySelector('.task-description').textContent.toLowerCase();
      
      if (title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())) {
        task.style.display = 'block';
      } else {
        task.style.display = 'none';
      }
    });
  }
  
  applyFilter(filterType) {
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(task => {
      const priority = task.querySelector('.priority-badge')?.dataset.priority;
      const isCompleted = task.querySelector('.task-toggle').classList.contains('bg-blue-500');
      
      switch(filterType) {
        case 'all':
          task.style.display = 'block';
          break;
        case 'high':
          task.style.display = priority === 'high' ? 'block' : 'none';
          break;
        case 'completed':
          task.style.display = isCompleted ? 'block' : 'none';
          break;
        case 'pending':
          task.style.display = !isCompleted ? 'block' : 'none';
          break;
      }
    });
  }
  
  loadTasks() {
    const savedTasks = localStorage.getItem('taskflow-tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
      // Render tasks to UI
      this.renderTasks();
    }
  }
  
  saveTasks() {
    localStorage.setItem('taskflow-tasks', JSON.stringify(this.tasks));
  }
  
  renderTasks() {
    const taskList = document.querySelector('.task-list-container');
    if (!taskList) return;
    
    // Clear existing tasks
    taskList.innerHTML = '';
    
    // Add each task
    this.tasks.forEach(task => {
      this.addTaskToUI(task);
    });
  }
  
  updateStats() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    // Update UI counters
    document.querySelectorAll('.total-tasks').forEach(el => el.textContent = totalTasks);
    document.querySelectorAll('.completed-tasks').forEach(el => el.textContent = completedTasks);
    document.querySelectorAll('.pending-tasks').forEach(el => el.textContent = pendingTasks);
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar-fill');
    if (progressBar && totalTasks > 0) {
      const progress = (completedTasks / totalTasks) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }
  
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotif = document.querySelector('.task-notification');
    if (existingNotif) existingNotif.remove();
    
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500'
    };
    
    const notifHTML = `
      <div class="task-notification fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
        <div class="flex items-center">
          <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-3"></i>
          <span>${message}</span>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', notifHTML);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      const notif = document.querySelector('.task-notification');
      if (notif) {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(20px)';
        setTimeout(() => notif.remove(), 300);
      }
    }, 3000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.taskManager = new TaskManager();
});