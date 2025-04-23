# Simple Todo List Chrome Extension

A lightweight and user-friendly Chrome extension for managing your daily tasks with a clean and intuitive interface.

## Features

- Add, edit, and delete tasks
- Set start and due dates for tasks
- Sort tasks by start date or due date
- Persistent storage using Chrome's storage API
- Clean and modern user interface
- Responsive design that works well in the Chrome extension popup

## Project Structure

```
Simple_ToDo_List/
├── popup.html          # Main extension popup interface
├── popup.css           # Styles for the popup interface
├── popup.js            # Core functionality and task management
├── manifest.json       # Chrome extension configuration
├── generate_icons.py   # Script to generate extension icons
└── icons/              # Directory containing extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files

## Usage

1. Click the extension icon in your Chrome toolbar to open the todo list
2. To add a task:
   - Enter the task description in the input field
   - Optionally set start and due dates
   - Click the "+" button or press Enter
3. To edit a task:
   - Click on the task text to edit
   - Press Enter to save changes
4. To delete a task:
   - Click the delete button next to the task
5. To sort tasks:
   - Use the dropdown menu to sort by start date or due date

## Development

### Icon Generation

The extension includes a Python script to generate icons in different sizes. To generate new icons:

1. Ensure you have Python installed with the Pillow library
2. Run the script:
   ```bash
   python generate_icons.py
   ```

### Customization

- Modify `popup.css` to change the appearance
- Edit `popup.js` to add new features or modify existing functionality
- Update `manifest.json` for extension metadata changes

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.