# Echo Support App

A modern, AI-powered customer support platform built with a monorepo architecture. Echo provides embeddable chat widgets, real-time conversations, and intelligent support capabilities powered by AI agents.

## 🎯 Overview

Echo Support App is a comprehensive customer support solution that enables businesses to provide instant support to their customers through an embeddable widget. It features AI-powered responses, conversation management, file handling, and multi-organization support.

## ✨ Key Features

- **🤖 AI-Powered Support**: Intelligent responses using Google AI with RAG (Retrieval-Augmented Generation)
- **💬 Real-time Conversations**: Live chat support with WebSocket-based real-time updates
- **🎨 Customizable Widget**: Fully customizable chat widget that can be embedded on any website
- **📊 Conversation Management**: Track, manage, and resolve customer conversations
- **📁 File Management**: Upload and manage support files and knowledge base documents
- **🔐 Multi-tenancy**: Complete organization-based isolation with Clerk authentication
- **💳 Billing Integration**: Subscription management with webhook support
- **🎯 Integrations**: Extensible integration system for third-party services
- **📱 Responsive Design**: Modern UI built with shadcn/ui components

## 🏗️ Architecture

This project is a **Turborepo** monorepo consisting of three main applications and several shared packages:

### Applications

#### 1. **Web App** (`apps/web`)
The main dashboard application for managing support operations.

- **Framework**: Next.js 15 with React 19
- **Port**: 3000
- **Features**:
  - Authentication and organization management (Clerk)
  - Conversation inbox and management
  - Widget customization interface
  - File and knowledge base management
  - Billing and subscription handling
  - Third-party integrations (VAPI, etc.)
  - Analytics and reporting

#### 2. **Widget App** (`apps/widget`)
The customer-facing chat widget application.

- **Framework**: Next.js 15 with React 19
- **Port**: 3001
- **Features**:
  - Real-time chat interface
  - AI-powered responses
  - File uploads
  - Session management
  - Custom branding per organization

#### 3. **Embed Script** (`apps/embed`)
A lightweight vanilla JavaScript embed script for integrating the widget into any website.

- **Framework**: Vite (Vanilla TypeScript)
- **Port**: 3002
- **Features**:
  - Simple script tag integration
  - Configurable positioning (bottom-right/bottom-left)
  - Floating action button
  - Responsive iframe loading
  - Zero dependencies

### Packages

#### `@workspace/backend`
Convex-based backend with serverless functions.

- **Features**:
  - Database schema and queries
  - AI agent implementation with Google AI
  - RAG-based knowledge retrieval
  - Webhook handlers (Clerk subscriptions)
  - Real-time data synchronization
  - File storage management

#### `@workspace/ui`
Shared UI component library built with shadcn/ui.

- **Components**: 40+ pre-built, accessible components
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: Lucide React icons

#### `@workspace/math`
Shared utility package for mathematical operations.

#### `@workspace/typescript-config`
Shared TypeScript configurations for consistent type checking.

#### `@workspace/eslint-config`
Shared ESLint configurations for code quality.

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Jotai** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Convex** - Real-time backend platform
- **Clerk** - Authentication and user management
- **Google AI (Gemini)** - AI-powered responses
- **Convex RAG** - Retrieval-Augmented Generation
- **Svix** - Webhook handling

### Development Tools
- **Turborepo** - Monorepo build system
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vite** - Fast build tool for embed script

## 📋 Prerequisites

- **Node.js** >= 20
- **pnpm** 10.4.1 or higher

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd echo-support-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create `.env.local` files in the respective apps with the required environment variables:
- Clerk API keys
- Convex deployment URL
- Google AI API keys

4. Set up the Convex backend:
```bash
cd packages/backend
pnpm setup
```

### Development

Start all applications in development mode:
```bash
pnpm dev
```

This will start:
- Web app: http://localhost:3000
- Widget app: http://localhost:3001
- Embed script: http://localhost:3002

### Build

Build all applications for production:
```bash
pnpm build
```

### Linting

Run ESLint across all packages:
```bash
pnpm lint
```

### Code Formatting

Format code with Prettier:
```bash
pnpm format
```

## 📦 Package Scripts

### Root Commands
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm lint` - Lint all packages
- `pnpm format` - Format all code with Prettier

### Individual App Commands
- `pnpm --filter web dev` - Run only the web app
- `pnpm --filter widget dev` - Run only the widget app
- `pnpm --filter embed dev` - Run only the embed script

## 🎨 Widget Integration

To integrate the Echo widget into your website:

```html
<script
  src="https://your-domain.com/embed.js"
  data-organization-id="your-org-id"
  data-position="bottom-right"
></script>
```

### Configuration Options

- `data-organization-id` (required): Your organization ID
- `data-position` (optional): Widget position - `bottom-right` or `bottom-left` (default: `bottom-right`)

### JavaScript API

The embed script exposes a global API:

```javascript
// Show the widget
window.EchoWidget.show();

// Hide the widget
window.EchoWidget.hide();

// Reinitialize with new config
window.EchoWidget.init({
  organizationId: 'new-org-id',
  position: 'bottom-left'
});

// Destroy the widget
window.EchoWidget.destroy();
```

## 🗄️ Database Schema

The application uses Convex with the following main tables:

- **subscriptions**: Organization subscription status
- **widgetSettings**: Customizable widget configurations
- **conversations**: Support conversation threads
- **contactSessions**: Customer session information
- **users**: User profiles

## 🔐 Authentication & Authorization

- **Clerk** for authentication
- Organization-based multi-tenancy
- Role-based access control
- Webhook integration for subscription updates

## 🤖 AI Features

- **Google Gemini AI** for intelligent responses
- **RAG (Retrieval-Augmented Generation)** for context-aware answers
- Knowledge base integration
- Conversation history awareness

## 📝 Adding UI Components

To add shadcn/ui components to your app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components are automatically placed in `packages/ui/src/components` and can be imported as:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## 🌐 Deployment

Each application can be deployed independently:

- **Web & Widget Apps**: Deploy to Vercel, Netlify, or any Next.js-compatible platform
- **Embed Script**: Deploy to any static hosting (CDN recommended)
- **Backend**: Automatically deployed through Convex

---

Built with ❤️ using modern web technologies
