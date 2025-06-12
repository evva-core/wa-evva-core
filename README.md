# EvvaCore Frontend

A modern, enterprise-grade host management interface built with Angular 19, Tailwind CSS, and real-time WebSocket communication.

## 🚀 Features

### Core Functionality
- **Dashboard**: Real-time overview of infrastructure with metrics, gauges, and activity feeds
- **Host Management**: Complete CRUD operations for hosts with filtering, search, and detailed views
- **Project Management**: Git repository management with automated synchronization
- **Real-time Communication**: WebSocket integration for live updates and notifications

### Technical Highlights
- **Angular 19**: Latest Angular framework with standalone components
- **Tailwind CSS**: Modern utility-first CSS framework for responsive design
- **TypeScript**: Full type safety and enhanced developer experience
- **Axios**: HTTP client with retry logic and interceptors
- **RxJS**: Reactive programming for state management and data flow
- **WebSocket**: Real-time bidirectional communication

## 🏗️ Architecture

### Project Structure
```
src/
├── app/
│   ├── core/                 # Core services and models
│   │   ├── models/          # TypeScript interfaces
│   │   ├── services/        # HTTP and business logic services
│   │   └── stores/          # State management stores
│   ├── features/            # Feature modules
│   │   ├── dashboard/       # Dashboard components
│   │   ├── hosts/          # Host management components
│   │   └── projects/       # Project management components
│   ├── layout/             # Layout components
│   │   ├── header/         # Application header
│   │   └── sidebar/        # Navigation sidebar
│   └── shared/             # Shared components
│       └── notification-toast/  # Toast notifications
├── environments/           # Environment configurations
└── styles.css            # Global styles
```

### Key Components

#### Services
- **HttpService**: Base HTTP client with Axios integration
- **WebSocketService**: Real-time communication management
- **HostService**: Host-specific API operations
- **ProjectService**: Project and Git operations
- **DashboardService**: Dashboard data and metrics
- **AuthService**: Authentication and authorization
- **NotificationService**: Toast notification management

#### Stores
- **HostStore**: Host state management with filtering and selection
- **ProjectStore**: Project state with sync status tracking
- **DashboardStore**: Dashboard metrics and activity management

#### Components
- **Dashboard**: Metrics overview with gauges and activity feeds
- **HostsList**: Paginated host listing with filters
- **HostDetail**: Detailed host information and system metrics
- **ProjectsList**: Git repository management interface
- **Header**: Navigation and connection status
- **Sidebar**: Hierarchical navigation menu

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd evvacore-frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Development Server
The application will be available at `http://localhost:4200`

### Build for Production
```bash
# Create production build
npm run build

# Build files will be in dist/ directory
```

## 🔧 Configuration

### Environment Variables
Configure the following in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  wsUrl: 'ws://localhost:8000/ws',
  appName: 'EvvaCore',
  version: '1.0.0'
};
```

### API Integration
The application expects the following API endpoints:

#### Hosts
- `GET /api/hosts` - List hosts with filtering
- `GET /api/hosts/:id` - Get host details
- `POST /api/hosts` - Create new host
- `PUT /api/hosts/:id` - Update host
- `DELETE /api/hosts/:id` - Delete host

#### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `POST /api/projects/:id/clone` - Clone repository
- `POST /api/projects/:id/pull` - Pull changes
- `POST /api/projects/:id/push` - Push changes

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activities` - Get recent activities

### WebSocket Events
The application listens for the following WebSocket events:
- `host_status_update` - Host status changes
- `project_sync_update` - Project synchronization updates
- `system_alert` - System alerts and notifications

## 🎨 UI/UX Features

### Design System
- **Enterprise-grade interface** with professional styling
- **Responsive design** that works on desktop, tablet, and mobile
- **Consistent color scheme** with semantic color usage
- **Intuitive navigation** with breadcrumbs and clear hierarchy
- **Accessibility** considerations with proper ARIA labels

### Interactive Elements
- **Real-time status indicators** with color coding
- **Progress bars** for system metrics (CPU, memory, disk)
- **Toast notifications** for user feedback
- **Modal dialogs** for forms and confirmations
- **Dropdown menus** for actions and filters
- **Search and filtering** capabilities

### Data Visualization
- **Gauge charts** for host status overview
- **Progress indicators** for resource usage
- **Status badges** with semantic colors
- **Activity timeline** with timestamps
- **Tabular data** with sorting and pagination

## 🔐 Security Features

### Authentication
- JWT token management with automatic refresh
- Secure token storage in localStorage
- HTTP interceptors for automatic token attachment
- Automatic logout on token expiration

### Authorization
- Role-based access control ready
- Permission checking utilities
- Protected routes (ready for implementation)

### Security Best Practices
- XSS protection through Angular's built-in sanitization
- CSRF protection ready for implementation
- Secure HTTP headers configuration
- Input validation and sanitization

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptive Features
- Collapsible sidebar on mobile
- Responsive tables with horizontal scroll
- Touch-friendly interface elements
- Optimized layouts for different screen sizes

## 🧪 Testing

### Test Coverage
- Component unit tests (ready for implementation)
- Service integration tests (ready for implementation)
- E2E testing setup (ready for implementation)

### Manual Testing Completed
✅ All pages and components tested
✅ Responsive design validated
✅ Navigation and routing verified
✅ Forms and modals tested
✅ WebSocket integration validated

## 🚀 Deployment

### Production Build
```bash
npm run build --prod
```

### Deployment Options
- **Static hosting**: Netlify, Vercel, AWS S3
- **Container deployment**: Docker with nginx
- **CDN integration**: CloudFront, CloudFlare

### Environment Setup
1. Configure production API endpoints
2. Set up SSL certificates
3. Configure CORS on backend
4. Set up monitoring and logging

## 📊 Performance

### Optimization Features
- **Lazy loading** for feature modules
- **OnPush change detection** for performance
- **Tree shaking** for smaller bundle sizes
- **Efficient state management** with RxJS
- **Optimized images** and assets

### Bundle Analysis
- Main bundle optimized for fast loading
- Vendor chunks separated for caching
- Dynamic imports for code splitting

## 🔄 State Management

### Architecture
- **Reactive stores** using RxJS BehaviorSubject
- **Immutable state updates** for predictability
- **Computed selectors** for derived data
- **Action-based updates** for maintainability

### Store Features
- **Host management** with filtering and selection
- **Project synchronization** status tracking
- **Dashboard metrics** with real-time updates
- **Error handling** and loading states

## 🌐 Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- Core functionality works on all modern browsers
- Enhanced features for browsers with full support
- Graceful degradation for older browsers

## 📝 API Documentation

### Expected Backend Integration
The frontend is designed to work with a RESTful API that provides:
- CRUD operations for hosts and projects
- Real-time updates via WebSocket
- Authentication and authorization
- File upload capabilities
- Bulk operations support

### Mock Data
The application includes comprehensive mock data for development and testing:
- 6 sample hosts with various configurations
- 4 sample projects with different statuses
- Dashboard metrics and activities
- System health data

## 🤝 Contributing

### Development Guidelines
- Follow Angular style guide
- Use TypeScript strict mode
- Implement responsive design patterns
- Write comprehensive tests
- Document new features

### Code Quality
- ESLint configuration for code consistency
- Prettier for code formatting
- Husky for pre-commit hooks (ready for setup)
- Conventional commits for changelog generation

## 📄 License

This project is under proteced the AGPL-3.0 license

## 🆘 Support

For technical support or questions:
- Check the troubleshooting section
- Review the API documentation
- Contact the development team

---

**EvvaCore Frontend v1.0.0** - Built with ❤️ using Angular 19 and Tailwind CSS

