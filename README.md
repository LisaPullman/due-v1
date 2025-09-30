# Due - Task Management CLI

A simple command-line application for managing tasks with due dates. Never miss a deadline again!

## Installation

1. Clone this repository:
```bash
git clone https://github.com/LisaPullman/due-v1.git
cd due-v1
```

2. Make the script executable (Unix/Linux/Mac):
```bash
chmod +x index.js
```

3. Optional: Create a global command by linking or copying to your PATH:
```bash
# Option 1: Create a symlink (recommended)
sudo ln -s $(pwd)/index.js /usr/local/bin/due

# Option 2: Or run directly with node
alias due='node /path/to/due-v1/index.js'
```

## Usage

### Add a new task
```bash
node index.js add "Task description" "due-date"
# or if you set up the global command:
due add "Task description" "due-date"
```

### List tasks
```bash
# Show pending tasks only
node index.js list

# Show all tasks (including completed)
node index.js list --all
```

### Complete a task
```bash
node index.js complete "task description or partial match"
```

### Remove a task
```bash
node index.js remove "task description or partial match"
```

### Show overdue tasks
```bash
node index.js overdue
```

### Get help
```bash
node index.js help
```

## Examples

```bash
# Add tasks with different date formats
node index.js add "Buy groceries" "2024-01-15"
node index.js add "Submit report" "01/20/2024"
node index.js add "Call dentist" "2024-02-01"

# List all pending tasks (sorted by due date)
node index.js list

# Check what's overdue
node index.js overdue

# Complete a task
node index.js complete "Buy groceries"

# Remove a task you no longer need
node index.js remove "old task"

# See all tasks including completed ones
node index.js list --all
```

## Features

- ✅ Add tasks with due dates
- ✅ List tasks sorted by due date
- ✅ Mark tasks as completed
- ✅ Remove tasks
- ✅ Show overdue tasks with days past due
- ✅ Support multiple date formats (YYYY-MM-DD, MM/DD/YYYY)
- ✅ Persistent storage in JSON format
- ✅ Visual indicators for task status (pending, completed, overdue)
- ✅ Smart task matching (partial description matching)

## Data Storage

Tasks are stored in a JSON file at `~/.due-tasks.json`. The file is automatically created when you add your first task.

## Requirements

- Node.js 14.0.0 or higher

## License

MIT License - see [LICENSE](LICENSE) file for details.
