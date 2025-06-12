# Role-Based File Management System

This document describes the implementation of role-based file management for StudyFlow, where different user types (editors and participants) have different interfaces for managing files.

## Overview

The system implements two distinct user roles with different capabilities:

### 1. **Editors (Teachers/Instructors)**

- Can upload and manage additional files for lectures and tasks
- Can view all student submissions and reports
- Can grade student submissions
- Can delete uploaded files from the server

### 2. **Participants (Students)**

- Can view additional files uploaded by teachers
- Can upload their own assignment reports/submissions
- Can download and view files provided by teachers
- Cannot modify lecture/task files uploaded by teachers

## Components

### EditorFileManager

**Location:** `frontend/src/components/EditorFileManager/`

A comprehensive file management component for teachers that provides:

- File upload functionality with drag-and-drop interface
- Server-side file deletion capabilities
- Real-time file management with loading states
- File type validation and size display
- Success/error messaging
- Visual distinction between new and uploaded files

**Props:**

- `type`: "task" or "lecture"
- `itemId`: ID of the task or lecture
- `existingFiles`: Array of currently attached files
- `onFilesUpdate`: Callback function to refresh file list

### StudentFileViewer

**Location:** `frontend/src/components/StudentFileViewer/`

A read-only file viewing component for students that provides:

- Clean grid layout of available files
- File type icons and metadata display
- View and download actions for each file
- Empty state when no files are available
- Responsive design for mobile devices

**Props:**

- `files`: Array of files to display
- `type`: "task" or "lecture" for context

### StudentSubmission

**Location:** `frontend/src/components/StudentSubmission/`

A specialized component for students to submit assignment reports:

- File upload for assignment submissions
- Submission history and status tracking
- Integration with the grading system
- Only visible to participants (students)

## Implementation Details

### Role Detection

The system determines user roles by checking if the current user is in the `editors` array of the class:

```javascript
const isUserEditor = classResponse.data.editors?.some(
  (editor) => editor.user.id === currentUserId
);
setIsEditor(isUserEditor);
```

### File Management Workflow

#### For Editors:

1. **Upload**: Use EditorFileManager to select and upload files
2. **Management**: Files are automatically linked to tasks/lectures
3. **Deletion**: Server-side deletion with database cleanup
4. **Viewing**: Access to all student submissions via Reports tab

#### For Participants:

1. **Viewing**: Use StudentFileViewer to see teacher-provided files
2. **Submission**: Use StudentSubmission to upload assignment reports
3. **Access**: Download and view teacher-provided materials

### File Lifecycle

1. **Creation**: Files uploaded via edit pages during task/lecture creation
2. **Additional Files**: Editors can add more files using EditorFileManager
3. **Student Access**: Participants view files through StudentFileViewer
4. **Submissions**: Students upload reports via StudentSubmission
5. **Grading**: Editors review submissions in Reports tab

## Integration Points

### TaskPage.js

- Conditionally renders EditorFileManager or StudentFileViewer
- Hides StudentSubmission for editors
- Implements role-based file refresh functionality

### LecturePage.js

- Similar conditional rendering for lecture files
- Quick file access in sidebar for all users
- Role-based main content area

### Database Schema

The system uses existing database models:

- `File`: Stores file metadata and Azure URLs
- `TaskFilesList`/`LectureFilesList`: Links files to tasks/lectures
- `ReportsList`: Manages student submissions

## API Endpoints

### File Management

- `POST /api/files/upload`: Upload files to Azure Storage
- `DELETE /api/files/:fileId`: Delete files from server
- `POST /api/tasks/:taskId/files`: Link files to tasks
- `POST /api/lectures/:lectureId/files`: Link files to lectures

### Submissions

- `POST /api/reports`: Create student submissions
- `GET /api/reports/task/:taskId`: Get task submissions
- `PUT /api/reports/:reportId`: Update submission grades

## Security Considerations

1. **Role Verification**: Server-side validation ensures only editors can manage files
2. **File Access**: Azure Storage URLs provide secure file access
3. **Cascade Deletion**: Database constraints ensure proper cleanup
4. **Input Validation**: File type and size restrictions on upload

## User Experience

### For Teachers:

- Dedicated file management interface with clear visual feedback
- Separate areas for content files vs. student submissions
- Batch operations and real-time status updates

### For Students:

- Clean, focused interface for viewing materials
- Separate submission area for assignment uploads
- Clear distinction between teacher materials and own submissions

## Future Enhancements

1. **File Versioning**: Track file revision history
2. **Collaborative Features**: Shared file editing capabilities
3. **Advanced Permissions**: Fine-grained access controls
4. **Analytics**: File access and engagement tracking
5. **Bulk Operations**: Mass file upload/download features
