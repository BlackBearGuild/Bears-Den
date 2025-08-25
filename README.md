# FamilyHub - Family Management App

A comprehensive, mobile-first family management application built with Next.js 14, featuring calendar events, markdown notes, task management, and dark mode support.

## 🚀 Features

### 📱 Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices with desktop support
- **Touch-Friendly Interface**: Large tap targets and intuitive navigation
- **Progressive Web App Ready**: Can be installed on mobile devices

### 🏠 Landing Page
- **Recent Updates**: View latest activities across all modules
- **Quick Note**: Sticky note area for jotting down thoughts
- **Quick Access**: Direct navigation to all app sections

### 📅 Calendar Management
- **Event Creation**: Add events with time, location, and descriptions
- **Color Coding**: Organize events with customizable colors
- **Notifications**: Browser notifications for upcoming events
- **Monthly View**: Interactive calendar with event indicators
- **Event Management**: Edit, delete, and reschedule events

### 📝 Markdown Notes
- **Rich Text Support**: Full markdown editing with syntax highlighting
- **Folder Hierarchy**: Organize notes in nested folders
- **Note Linking**: Link between notes using `[[Note Title]]` syntax
- **Privacy Controls**: Mark notes as private or shared with family
- **Search Functionality**: Find notes by title or content
- **Live Preview**: Toggle between edit and preview modes

### ✅ Task Management
- **Multiple Lists**: Create and manage multiple task lists
- **Grocery List**: Special grocery list with category organization
- **Priority Levels**: Set task priorities (low, medium, high)
- **Due Dates**: Add due dates and assign tasks to family members
- **Progress Tracking**: Visual progress indicators for each list
- **Completion States**: Separate pending and completed task views

### 🌙 Dark Mode
- **Theme Toggle**: Switch between light, dark, and system themes
- **Persistent Settings**: Theme preferences saved across sessions
- **System Integration**: Automatically follows system theme preferences

### ⚙️ Settings & Customization
- **Profile Management**: Set display name and email
- **Notification Settings**: Customize notification preferences
- **Privacy Controls**: Manage sharing and privacy settings
- **Data Management**: Export/import app data and clear storage
- **Usage Statistics**: View counts of notes, tasks, and events

## 🛠️ Technology Stack

### Core Framework
- **Next.js 14**: React framework with App Router
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Beautiful icons
- **next-themes**: Dark mode support

### Features & Libraries
- **react-markdown**: Markdown parsing and rendering
- **remark-gfm**: GitHub Flavored Markdown support
- **rehype-highlight**: Syntax highlighting for code blocks
- **date-fns**: Date manipulation and formatting
- **uuid**: Unique identifier generation

### Storage & State
- **localStorage**: Client-side data persistence
- **React Context**: Global state management for themes

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── calendar/          # Calendar page
│   ├── notes/             # Notes page  
│   ├── settings/          # Settings page
│   ├── tasks/             # Tasks page
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── app-header.tsx     # Header with navigation
│   ├── app-shell.tsx      # Main app layout
│   ├── calendar-page.tsx  # Calendar functionality
│   ├── home-page.tsx      # Landing page
│   ├── notes-page.tsx     # Notes with markdown
│   ├── settings-page.tsx  # App settings
│   ├── tasks-page.tsx     # Task management
│   └── theme-provider.tsx # Theme context provider
├── lib/                   # Utility functions
│   ├── env-config.ts      # Environment configuration
│   └── utils.ts           # Shared utilities
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun runtime
- Modern web browser with localStorage support

### Installation

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Start development server**:
   ```bash
   bun dev
   ```

3. **Access the application**:
   - Open [http://localhost:3000](http://localhost:3000)
   - The app will run on mobile and desktop browsers

### Building for Production

```bash
# Build the application
bun run build

# Start production server
bun start
```

## 📱 Usage Guide

### Getting Started
1. **Home Page**: Start here to see recent updates and use the quick note
2. **Navigation**: Use the mobile menu (hamburger) or desktop sidebar
3. **Dark Mode**: Toggle using the sun/moon icon in the header

### Creating Content
- **Calendar Events**: Go to Calendar → Add Event → Fill details and save
- **Notes**: Go to Notes → Create folder (optional) → Add Note → Write in markdown
- **Tasks**: Go to Tasks → Select/Create list → Add Task → Set priority/due date

### Advanced Features
- **Link Notes**: Use `[[Note Title]]` syntax to create clickable links between notes
- **Organize**: Create folder hierarchies for notes and multiple lists for tasks
- **Share**: Mark notes as shared or private using the privacy toggle
- **Export Data**: Go to Settings → Data Management → Export for backup

## 🎨 Customization

### Themes
- **Light Mode**: Clean, bright interface for daytime use
- **Dark Mode**: Easy on the eyes for low-light environments  
- **System**: Automatically matches your device's theme preference

### Settings
- **Notifications**: Enable/disable desktop and sound notifications
- **Privacy**: Control default sharing settings for new notes
- **Appearance**: Customize default view and compact mode

## 💾 Data Management

### Local Storage
- All data is stored locally in your browser
- No server or cloud storage required
- Data persists across browser sessions

### Export/Import
- **Export**: Backup all your data as JSON file
- **Import**: Restore data from exported JSON
- **Clear**: Reset app to initial state (use with caution)

## 📝 Development Notes

### Key Features Implemented
- Mobile-first responsive design with desktop optimization
- Full CRUD operations for events, notes, and tasks
- Markdown rendering with syntax highlighting
- Inter-note linking system
- Folder hierarchy for notes organization
- Multiple task lists with grocery list specialization
- Dark mode with system integration
- Local data persistence
- Export/import functionality

### Browser Compatibility
- Modern browsers with ES2020+ support
- localStorage API required
- Notification API for desktop alerts (optional)
- Service Worker ready for PWA features

## 🚀 Future Enhancements

Potential features for future development:
- Real-time family collaboration
- Cloud synchronization
- Calendar integrations (Google, Outlook)
- File attachments for notes
- Recurring events and tasks
- Mobile app with native notifications
- Offline support with Service Worker
- Advanced search with filters
- Task dependencies and sub-tasks
- Note templates and snippets

## 📄 License

This project is built as a family management solution with modern web technologies. Feel free to customize and extend based on your family's needs.