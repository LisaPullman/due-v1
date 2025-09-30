#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.env.HOME || process.env.USERPROFILE || __dirname, '.due-tasks.json');

class DueManager {
  constructor() {
    this.tasks = this.loadTasks();
  }

  loadTasks() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading tasks:', error.message);
    }
    return [];
  }

  saveTasks() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.tasks, null, 2));
    } catch (error) {
      console.error('Error saving tasks:', error.message);
    }
  }

  addTask(description, dueDate) {
    const task = {
      id: Date.now().toString(),
      description,
      dueDate: new Date(dueDate),
      completed: false,
      createdAt: new Date()
    };

    if (isNaN(task.dueDate.getTime())) {
      throw new Error('Invalid due date format. Please use YYYY-MM-DD or MM/DD/YYYY format.');
    }

    this.tasks.push(task);
    this.saveTasks();
    console.log(`✓ Added task: "${description}" due ${this.formatDate(task.dueDate)}`);
  }

  listTasks(showCompleted = false) {
    let tasksToShow = showCompleted ? this.tasks : this.tasks.filter(task => !task.completed);
    
    if (tasksToShow.length === 0) {
      console.log('No tasks found.');
      return;
    }

    // Sort by due date
    tasksToShow.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    console.log('\n📋 Tasks:');
    console.log('─'.repeat(50));

    tasksToShow.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const isOverdue = dueDate < new Date() && !task.completed;
      const status = task.completed ? '✓' : (isOverdue ? '⚠️' : '○');
      const dueDateStr = this.formatDate(dueDate);
      
      console.log(`${status} ${task.description}`);
      console.log(`   Due: ${dueDateStr}${isOverdue ? ' (OVERDUE)' : ''}`);
      console.log('');
    });
  }

  completeTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId || t.description.toLowerCase().includes(taskId.toLowerCase()));
    
    if (!task) {
      throw new Error('Task not found. Use "due list" to see available tasks.');
    }

    task.completed = true;
    task.completedAt = new Date();
    this.saveTasks();
    console.log(`✓ Completed task: "${task.description}"`);
  }

  removeTask(taskId) {
    const index = this.tasks.findIndex(t => t.id === taskId || t.description.toLowerCase().includes(taskId.toLowerCase()));
    
    if (index === -1) {
      throw new Error('Task not found. Use "due list" to see available tasks.');
    }

    const removedTask = this.tasks.splice(index, 1)[0];
    this.saveTasks();
    console.log(`🗑️  Removed task: "${removedTask.description}"`);
  }

  showOverdue() {
    const overdueTasks = this.tasks.filter(task => {
      return new Date(task.dueDate) < new Date() && !task.completed;
    });

    if (overdueTasks.length === 0) {
      console.log('🎉 No overdue tasks!');
      return;
    }

    console.log('\n⚠️  Overdue Tasks:');
    console.log('─'.repeat(50));

    overdueTasks.forEach(task => {
      const daysPast = Math.floor((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24));
      console.log(`⚠️  ${task.description}`);
      console.log(`   Due: ${this.formatDate(new Date(task.dueDate))} (${daysPast} days ago)`);
      console.log('');
    });
  }

  formatDate(date) {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  showHelp() {
    console.log(`
📅 Due - Task Management CLI

Usage:
  due add "<task>" "<due-date>"     Add a new task with due date
  due list                          List all pending tasks
  due list --all                    List all tasks (including completed)
  due complete <task-id>            Mark a task as completed
  due remove <task-id>              Remove a task
  due overdue                       Show overdue tasks
  due help                          Show this help message

Examples:
  due add "Buy groceries" "2024-01-15"
  due add "Submit report" "01/20/2024"
  due complete "Buy groceries"
  due remove "old task"

Date formats supported: YYYY-MM-DD, MM/DD/YYYY
`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const dueManager = new DueManager();

  try {
    switch (command) {
      case 'add':
        if (args.length < 3) {
          throw new Error('Please provide both task description and due date.');
        }
        dueManager.addTask(args[1], args[2]);
        break;

      case 'list':
        const showAll = args.includes('--all');
        dueManager.listTasks(showAll);
        break;

      case 'complete':
        if (args.length < 2) {
          throw new Error('Please provide task ID or description to complete.');
        }
        dueManager.completeTask(args[1]);
        break;

      case 'remove':
        if (args.length < 2) {
          throw new Error('Please provide task ID or description to remove.');
        }
        dueManager.removeTask(args[1]);
        break;

      case 'overdue':
        dueManager.showOverdue();
        break;

      case 'help':
      case '--help':
      case '-h':
        dueManager.showHelp();
        break;

      default:
        if (!command) {
          dueManager.showHelp();
        } else {
          console.error(`Unknown command: ${command}`);
          console.log('Use "due help" to see available commands.');
          process.exit(1);
        }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = DueManager;