# UI Component Library

A comprehensive component library for the Screen Recording MVP built with shadcn/ui and Next.js 15.

## 📁 Component Organization

```
components/
├── ui/              # Shadcn UI components (design system primitives)
├── common/          # Reusable app components
├── features/        # Feature-specific components
└── layouts/         # Page layout components
```

## 🎨 Shadcn UI Components

All shadcn/ui components are installed and available:

- **Forms**: Button, Input, Label, Form, Select, Textarea, Checkbox, Radio, Switch, Slider
- **Layout**: Card, Dialog, Dropdown Menu, Table, Tabs
- **Feedback**: Sonner (Toast notifications)

### Usage Example

```tsx
import { Button, Input, Card } from '@/components/ui';

export function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </Card>
  );
}
```

## 🔧 Common Components

### LoadingSpinner

A customizable loading spinner with multiple sizes and accessibility support.

```tsx
import { LoadingSpinner } from '@/components/common';

<LoadingSpinner size="md" label="Loading data..." />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `className`: Additional CSS classes
- `label`: Loading message (default: 'Loading...')

---

### ErrorMessage

Display error or warning messages with optional dismiss functionality.

```tsx
import { ErrorMessage } from '@/components/common';

<ErrorMessage
  title="Upload Failed"
  message="The file size exceeds the maximum limit."
  variant="error"
  onDismiss={() => console.log('Dismissed')}
/>
```

**Props:**
- `title`: Error title (default: 'Error')
- `message`: Error description (required)
- `variant`: 'error' | 'warning' (default: 'error')
- `onDismiss`: Optional dismiss callback

---

### EmptyState

Show a friendly empty state with optional action button.

```tsx
import { EmptyState } from '@/components/common';

<EmptyState
  icon="inbox"
  title="No videos yet"
  description="Start by recording your first video"
  action={{ label: 'Record Video', onClick: () => {} }}
/>
```

**Props:**
- `icon`: 'inbox' | 'file' | 'search' | React.ReactNode
- `title`: Main heading (required)
- `description`: Supporting text
- `action`: { label: string, onClick: () => void }

---

### ConfirmDialog

A confirmation dialog with support for destructive actions.

```tsx
import { ConfirmDialog } from '@/components/common';

<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Delete Video"
  description="This action cannot be undone."
  variant="destructive"
  confirmLabel="Delete"
  onConfirm={handleDelete}
/>
```

**Props:**
- `open`: Dialog open state (required)
- `onOpenChange`: State setter (required)
- `title`: Dialog title (required)
- `description`: Supporting text
- `variant`: 'default' | 'destructive'
- `confirmLabel`: Confirm button text (default: 'Confirm')
- `cancelLabel`: Cancel button text (default: 'Cancel')
- `loading`: Show loading state

---

### PageHeader

A consistent page header with title, description, and optional actions.

```tsx
import { PageHeader } from '@/components/common';
import { Button } from '@/components/ui';

<PageHeader
  title="My Videos"
  description="Manage and share your recordings"
  action={<Button>Upload Video</Button>}
/>
```

**Props:**
- `title`: Page title (required)
- `description`: Page description
- `action`: Action button or element
- `backButton`: Back navigation button

---

### DataTable

A fully-featured data table with loading and empty states.

```tsx
import { DataTable, type Column } from '@/components/common';

const columns: Column<Video>[] = [
  { key: 'title', header: 'Title' },
  { key: 'views', header: 'Views', accessor: (row) => row.views.toLocaleString() },
  { key: 'created', header: 'Created', accessor: (row) => formatDate(row.createdAt) },
];

<DataTable
  data={videos}
  columns={columns}
  loading={isLoading}
  emptyMessage="No videos found"
  onRowClick={(video) => console.log(video)}
/>
```

**Props:**
- `data`: Array of data objects (required)
- `columns`: Column configuration (required)
- `loading`: Show loading state
- `emptyMessage`: Message when no data
- `onRowClick`: Row click handler

---

## 📐 Layout Components

### MainLayout

A consistent layout wrapper for all pages.

```tsx
import { MainLayout } from '@/components/layouts';

<MainLayout
  header={<Navigation />}
  sidebar={<Sidebar />}
  footer={<Footer />}
>
  <YourPageContent />
</MainLayout>
```

**Props:**
- `children`: Page content (required)
- `header`: Header element
- `sidebar`: Sidebar element
- `footer`: Footer element

---

## ✅ Best Practices

All components follow these practices:

✓ **TypeScript interfaces** for all props  
✓ **Default props** for optional parameters  
✓ **Accessibility** with ARIA labels and semantic HTML  
✓ **Error handling** with proper error boundaries  
✓ **Consistent styling** using Tailwind CSS  
✓ **Loading states** for async operations  

## 🚀 Quick Start

1. Import from organized paths:

```tsx
// UI primitives
import { Button, Card } from '@/components/ui';

// Common components
import { LoadingSpinner, DataTable } from '@/components/common';

// Layouts
import { MainLayout } from '@/components/layouts';
```

2. Use with TypeScript for auto-completion and type safety
3. Customize with className prop when needed
4. Follow accessibility guidelines (ARIA labels, keyboard navigation)

## 📦 Dependencies

- **Next.js 15** - React framework
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Radix UI** - Unstyled accessible components
- **lucide-react** - Icon library
- **TypeScript** - Type safety
