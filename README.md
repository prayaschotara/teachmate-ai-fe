# 👨‍💼 TeachMate AI - Admin Portal

> Modern admin dashboard for educators and administrators

A comprehensive admin portal built with React, TypeScript, and Material-UI that provides educators and administrators with powerful tools to manage content, students, assessments, and analytics.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [State Management](#state-management)
- [UI Components](#ui-components)
- [Form Handling](#form-handling)
- [Routing](#routing)
- [Environment Variables](#environment-variables)

## ✨ Features

### For Administrators
- 📊 **Comprehensive Dashboard** - Overview of platform metrics and analytics
- 👥 **User Management** - Manage students, parents, and educators
- 📚 **Content Management** - Upload, organize, and manage educational content
- 📝 **Assessment Management** - Create, edit, and monitor assessments
- 📈 **Analytics & Reports** - Detailed performance analytics and insights
- 🎯 **Class Management** - Organize students into classes and grades
- 🔔 **Notifications** - Send announcements and updates
- ⚙️ **System Settings** - Configure platform settings

### For Educators
- 📄 **PDF Upload & Processing** - Upload educational materials
- 🤖 **AI-Powered Content Generation** - Leverage AI agents for content creation
- ✅ **Assessment Builder** - Create custom assessments with various question types
- 📊 **Student Performance Tracking** - Monitor individual and class performance
- 📅 **Schedule Management** - Plan and schedule assessments
- 💬 **Communication Tools** - Interact with students and parents

### Common Features
- 🔐 **Secure Authentication** - Role-based access control
- 🎨 **Material Design UI** - Clean, professional interface
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Theme Support** - Light and dark mode
- 🔔 **Real-time Notifications** - Toast notifications for user feedback
- ⚡ **Fast Performance** - Optimized with Vite and React Query

## 🛠️ Tech Stack

### Core
- **Framework:** React 19.2
- **Language:** TypeScript 5.9
- **Build Tool:** Vite 7.2
- **Package Manager:** npm

### UI Framework
- **Component Library:** Material-UI (MUI) 7.3
  - @mui/material
  - @mui/icons-material
  - @mui/system
- **Styling:** Emotion (@emotion/react, @emotion/styled)
- **Utility:** clsx 2.1

### State & Data Management
- **State Management:** Zustand 5.0
- **Data Fetching:** TanStack Query (React Query) 5.90
- **Cookies:** react-cookie 8.0

### Forms & Validation
- **Form Management:** Formik 2.4
- **Validation:** Yup 1.7

### Routing & Navigation
- **Router:** React Router DOM 7.9

### UI Enhancements
- **Icons:** Lucide React 0.553
- **Notifications:** react-hot-toast 2.6

### Development Tools
- **Linting:** ESLint 9.39
- **TypeScript ESLint:** typescript-eslint 8.46
- **React Plugins:**
  - eslint-plugin-react-hooks 5.2
  - eslint-plugin-react-refresh 0.4
- **CSS Processing:** 
  - Tailwind CSS 3.4
  - Autoprefixer 10.4

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Navigate to the admin portal directory**
```bash
cd teachmate-ai-fe
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root:
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=TeachMate AI Admin
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
teachmate-ai-fe/
├── src/
│   ├── assets/                    # Static assets
│   │   └── images/
│   │
│   ├── components/                # Reusable components
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Loader.tsx
│   │   ├── forms/
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   └── FormTextarea.tsx
│   │   └── charts/
│   │       ├── BarChart.tsx
│   │       ├── LineChart.tsx
│   │       └── PieChart.tsx
│   │
│   ├── pages/                     # Page components
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── students/
│   │   │   ├── StudentList.tsx
│   │   │   ├── StudentDetail.tsx
│   │   │   └── AddStudent.tsx
│   │   ├── content/
│   │   │   ├── ContentList.tsx
│   │   │   ├── UploadContent.tsx
│   │   │   └── ContentDetail.tsx
│   │   ├── assessments/
│   │   │   ├── AssessmentList.tsx
│   │   │   ├── CreateAssessment.tsx
│   │   │   └── AssessmentDetail.tsx
│   │   ├── analytics/
│   │   │   ├── PerformanceAnalytics.tsx
│   │   │   └── Reports.tsx
│   │   └── settings/
│   │       └── Settings.tsx
│   │
│   ├── stores/                    # Zustand stores
│   │   ├── authStore.ts          # Authentication state
│   │   ├── themeStore.ts         # Theme preferences
│   │   └── uiStore.ts            # UI state (sidebar, modals)
│   │
│   ├── services/                  # API service layer
│   │   ├── authService.ts
│   │   ├── studentService.ts
│   │   ├── contentService.ts
│   │   ├── assessmentService.ts
│   │   └── analyticsService.ts
│   │
│   ├── lib/                       # Core utilities
│   │   ├── api.ts                # Axios instance & interceptors
│   │   └── queryClient.ts        # React Query configuration
│   │
│   ├── routes/                    # Route configuration
│   │   ├── AppRoutes.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── usePermissions.ts
│   │
│   ├── utils/                     # Helper functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   │
│   ├── examples/                  # Example components/pages
│   │
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Application entry
│   ├── App.css                    # Global styles
│   └── index.css                  # Tailwind imports
│
├── src-temp/                      # Temporary/backup files
├── public/                        # Public assets
│   ├── logo.jpg
│   └── vite.svg
│
├── index.html                     # HTML template
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind config
├── postcss.config.js             # PostCSS config
├── eslint.config.js              # ESLint config
└── package.json
```

## 🎯 Key Features

### Material-UI Integration

**Using MUI Components**
```typescript
import { Button, TextField, Card, CardContent } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const MyComponent = () => (
  <Card>
    <CardContent>
      <TextField label="Name" variant="outlined" fullWidth />
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
      >
        Add Item
      </Button>
    </CardContent>
  </Card>
);
```

**Custom Theme**
```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
});

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### Form Handling with Formik & Yup

**Form Example**
```typescript
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@mui/material';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  class: Yup.string().required('Class is required'),
});

const AddStudentForm = () => (
  <Formik
    initialValues={{ name: '', email: '', class: '' }}
    validationSchema={validationSchema}
    onSubmit={(values) => {
      console.log(values);
    }}
  >
    {({ errors, touched }) => (
      <Form>
        <Field
          as={TextField}
          name="name"
          label="Name"
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
          fullWidth
        />
        <Field
          as={TextField}
          name="email"
          label="Email"
          type="email"
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
          fullWidth
        />
        <button type="submit">Submit</button>
      </Form>
    )}
  </Formik>
);
```

### State Management with Zustand

**Auth Store**
```typescript
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  
  login: async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.token);
    set({ 
      user: response.user, 
      token: response.token, 
      isAuthenticated: true 
    });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));
```

**UI Store**
```typescript
interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  modalOpen: false,
  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}));
```

### Data Fetching with React Query

**Fetching Data**
```typescript
import { useQuery } from '@tanstack/react-query';
import { getStudents } from '../services/studentService';

const StudentList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <TableContainer>
      {/* Render students */}
    </TableContainer>
  );
};
```

**Mutations**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStudent } from '../services/studentService';

const AddStudent = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add student');
    }
  });

  const handleSubmit = (values) => {
    mutation.mutate(values);
  };
};
```

### Cookie Management

```typescript
import { useCookies } from 'react-cookie';

const MyComponent = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['auth_token']);

  const handleLogin = (token: string) => {
    setCookie('auth_token', token, { 
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: true,
      sameSite: 'strict'
    });
  };

  const handleLogout = () => {
    removeCookie('auth_token');
  };
};
```

## 🎨 UI Components

### Material-UI Components Used

- **Layout:** Container, Grid, Box, Stack
- **Inputs:** TextField, Select, Checkbox, Radio, Switch
- **Data Display:** Table, Card, Chip, Avatar, Badge
- **Feedback:** Alert, Snackbar, Dialog, CircularProgress
- **Navigation:** Drawer, AppBar, Tabs, Breadcrumbs
- **Surfaces:** Paper, Accordion, Card
- **Utils:** Portal, Modal, Popover, Tooltip

### Custom Components

**Data Table Component**
```typescript
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper 
} from '@mui/material';

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  onRowClick?: (row: T) => void;
}

const DataTable = <T,>({ columns, data, onRowClick }: DataTableProps<T>) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col.id}>{col.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow 
            key={index} 
            onClick={() => onRowClick?.(row)}
            hover
          >
            {columns.map((col) => (
              <TableCell key={col.id}>
                {col.render ? col.render(row) : row[col.field]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
```

## 🛣️ Routing

### Route Configuration

```typescript
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />

    {/* Protected Admin Routes */}
    <Route element={<ProtectedRoute allowedRoles={['admin', 'educator']} />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<StudentList />} />
      <Route path="/students/:id" element={<StudentDetail />} />
      <Route path="/content" element={<ContentList />} />
      <Route path="/content/upload" element={<UploadContent />} />
      <Route path="/assessments" element={<AssessmentList />} />
      <Route path="/assessments/create" element={<CreateAssessment />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
```

## 🔐 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | `http://localhost:3000` |
| `VITE_APP_NAME` | Application name | No | `TeachMate AI Admin` |

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server (Vite)

# Build
npm run build            # Build for production (TypeScript + Vite)

# Preview
npm run preview          # Preview production build

# Linting
npm run lint             # Run ESLint
```

## 🎨 Styling Approaches

### Material-UI Styling
```typescript
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));
```

### Emotion CSS
```typescript
import { css } from '@emotion/react';

const styles = css`
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

<div css={styles}>Content</div>
```

### Tailwind CSS
```typescript
<div className="p-4 bg-gray-100 rounded-lg">
  Content
</div>
```

## 🧪 Testing

### Type Checking
```bash
npm run build  # TypeScript compilation will catch type errors
```

### Linting
```bash
npm run lint   # Check for code quality issues
```

## 📱 Responsive Design

Material-UI provides built-in responsive utilities:

```typescript
import { useMediaQuery, useTheme } from '@mui/material';

const MyComponent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box sx={{
      padding: { xs: 1, sm: 2, md: 3 },
      fontSize: { xs: '14px', sm: '16px', md: '18px' }
    }}>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </Box>
  );
};
```

## 🔧 Configuration Files

### Vite Config
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### TypeScript Config
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  }
}
```

## 🐛 Common Issues

### Port Already in Use
Change the port in `vite.config.ts` or kill the process using port 5173

### API Connection Failed
Verify `VITE_API_URL` in `.env` and ensure backend is running

### Material-UI Theme Issues
Ensure `ThemeProvider` wraps your app component

### Build Errors
Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 🤝 Contributing

1. Follow Material-UI design guidelines
2. Use TypeScript for type safety
3. Implement proper form validation with Yup
4. Ensure responsive design
5. Test on multiple browsers
6. Update documentation

## 📄 License

ISC License

---

Built with ❤️ using React, TypeScript, and Material-UI
