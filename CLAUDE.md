# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production (runs TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint with max 0 warnings
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run preview` - Preview production build

## Testing (Vitest)

- Tests are configured with Vitest but no test commands are defined in package.json
- Test setup file: `src/test/setup.ts`
- Coverage configured with v8 provider

## Architecture Overview

This is a React-based aquarium AR visualization application built with:

- **Frontend**: React 18 + TypeScript + Vite
- **3D Graphics**: Three.js with React Three Fiber ecosystem (@react-three/fiber, @react-three/drei)
- **XR Support**: @react-three/xr for WebXR functionality
- **UI Components**: shadcn/ui with Radix UI primitives and Tailwind CSS
- **State Management**: Local React state (no global state manager like Zustand is actively used)

### Key Components Structure

- `src/components/aquarium/scenes/BasicScene.tsx` - Main application scene with Canvas
- `src/components/aquarium/models/` - 3D model components (Tank, PlaceholderObject)
- `src/components/aquarium/controls/` - UI controls and interaction components
- `src/components/aquarium/object/` - Object management components
- `src/types/aquarium.ts` - Core type definitions for aquarium objects

### State Management Pattern

The application uses local React state extensively:
- Tank dimensions managed in BasicScene
- Object placement and transforms managed with arrays of positioned objects
- Mesh references stored in state for transform controls
- Selection state for object manipulation

### 3D Object System

Objects are defined by `AquariumObject` interface and placed as `PlaceholderObject` components with:
- Position, rotation, and scale transforms
- Interactive selection and manipulation via ObjectTransformControls
- Support for different object types: 'plant', 'stone', 'wood', 'model'

### Key Features

- Interactive 3D aquarium tank visualization
- Object placement and transformation (G/R/S hotkeys for translate/rotate/scale)
- Model uploading and management
- Camera controls and scene manipulation
- Help system with keyboard shortcuts

## Configuration

- **Path Aliases**: `@/*` maps to `./src/*`
- **Server**: Configured to run on host: true, port 3000
- **Node Version**: Specified as 18.20.7 via Volta
- **TypeScript**: Strict mode enabled with path aliases configured

## Development Notes

- Import paths use `@/` alias for src directory references
- Japanese comments and UI text throughout the codebase
- 3D models expected in gLTF format
- WebXR requires HTTPS in production (automatically handled in dev)