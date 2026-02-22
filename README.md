# 🏗️Roomify

Roomify is an AI-powered interior visualization web app that converts 2D floor plans into rendered 3D-style top-down images.

## What This Project Does

- Upload a floor-plan image (JPG/PNG).
- Generate a rendered design view using Puter AI image generation.
- Compare before/after with an interactive slider.
- Save and load projects through a Puter Worker API.
- Host project images on Puter Hosting.
- Authenticate users with Puter Auth.

## Tech Stack

### Frontend

- React 19
- React Router 7
- TypeScript
- Vite
- Lucide React
- react-compare-slider

### Backend / Services

- Puter SDK (`@heyputer/puter.js`)
- Puter Auth (sign in/out, current user)
- Puter Workers (project API)
- Puter KV (project metadata)
- Puter FS (uploaded image storage)
- Puter Hosting (public image URLs)
- Puter AI (`txt2img` with `gemini-2.5-flash-image-preview`)

## Repository Highlights

- `app/routes/home.tsx`: Landing, upload entry, projects list.
- `app/routes/visualizer.$id.tsx`: Render view, compare slider, export action.
- `components/Upload.tsx`: Upload UX and FileReader flow.
- `lib/ai.action.ts`: AI generation + URL-to-data URL conversion.
- `lib/puter.action.ts`: Auth and project CRUD calls through worker endpoints.
- `lib/puter.hosting.ts`: Hosting setup and image upload logic.
- `lib/puter.worker.js`: Worker endpoints for save/list/get project operations.

## Environment Setup

Create a `.env` file:

```bash
VITE_PUTER_WORKER_URL=<your_worker_base_url>
```

Install and run:

```bash
npm install
npm run dev
```

Build and typecheck:

```bash
npm run typecheck
npm run build
npm run start
```

## API Endpoints (Worker)

Configured in `lib/puter.worker.js`:

- `POST /api/projects/save`
- `GET /api/projects/list`
- `GET /api/projects/get?id=<projectId>`

## Project Flow (High Level)

1. User signs in with Puter Auth.
2. User uploads a floor plan in `Upload`.
3. App creates project metadata and navigates to visualizer route.
4. Visualizer calls AI generation from `lib/ai.action.ts`.
5. Output images are uploaded/served through Puter Hosting.
6. Project state is persisted via Worker + KV.
7. User compares, exports, and revisits saved projects.

## AI-Generated Interactive Diagrams

### 1) System Architecture Map

```mermaid
flowchart LR
  U[User]
  H[Home Route]
  V[Visualizer Route]
  UP[Upload Component]
  AI[AI Engine]
  W[Worker API]
  KV[KV Store]
  FS[File Storage]
  HOST[Public Hosting]
  AUTH[Auth Service]

  U --> H
  H --> UP
  UP --> V
  H --> AUTH
  V --> AUTH
  V --> AI
  V --> W
  W --> KV
  V --> FS
  FS --> HOST

  classDef client fill:#E8F1FF,stroke:#2F6FEB,stroke-width:1.5px,color:#0A3069;
  classDef service fill:#EAFBF2,stroke:#1A7F37,stroke-width:1.5px,color:#0F5132;
  classDef storage fill:#FFF8E6,stroke:#9A6700,stroke-width:1.5px,color:#7A4B00;

  class U,H,V,UP client;
  class AI,W,AUTH service;
  class KV,FS,HOST storage;
```

### 2) End-to-End Render Sequence

```mermaid
sequenceDiagram
  participant User
  participant App as React App
  participant Upload as Upload
  participant Viz as Visualizer
  participant A as AI Action
  participant Host as Hosting Layer
  participant Worker as Worker API

  User->>Upload: Select floor-plan file
  Upload->>App: onComplete(base64)
  App->>Worker: createProject(sourceImage)
  Worker-->>App: project saved (id)
  App->>Viz: navigate(/visualizer/:id)
  Viz->>A: generate3DView(sourceImage)
  A-->>Viz: renderedImage (data URL)
  Viz->>Host: upload source + render
  Viz->>Worker: save updated project
  Worker-->>Viz: persisted project
  Viz-->>User: before/after compare + export
```

### 3) Visualizer State Machine

```mermaid
stateDiagram-v2
  [*] --> LoadingProject
  LoadingProject --> ReadyWithSource: project fetched
  ReadyWithSource --> Rendering: no rendered image
  ReadyWithSource --> ReadyWithRender: rendered image exists
  Rendering --> SavingResult: AI render success
  SavingResult --> ReadyWithRender: save success
  Rendering --> Error: AI failure
  Error --> Rendering: retry
  ReadyWithRender --> Exporting: user clicks export
  Exporting --> ReadyWithRender
  ReadyWithRender --> [*]
```

### 4) Worker Data Lifecycle

```mermaid
flowchart TD
  SAVE[POST /api/projects/save] --> AUTH1{Auth OK?}
  AUTH1 -- No --> E1[401]
  AUTH1 -- Yes --> VALID{Payload valid?}
  VALID -- No --> E2[400]
  VALID -- Yes --> UPSERT[kv.set roomify_project_<id>]
  UPSERT --> R1[200 Saved]

  LIST[GET /api/projects/list] --> AUTH2{Auth OK?}
  AUTH2 -- No --> E3[401]
  AUTH2 -- Yes --> READALL[kv.list roomify_project_]
  READALL --> R2[200 Projects]

  GET[GET /api/projects/get?id] --> AUTH3{Auth OK?}
  AUTH3 -- No --> E4[401]
  AUTH3 -- Yes --> HASID{ID provided?}
  HASID -- No --> E5[400]
  HASID -- Yes --> READONE[kv.get roomify_project_<id>]
  READONE --> FOUND{Project found?}
  FOUND -- No --> E6[404]
  FOUND -- Yes --> R3[200 Project]
```

## Notes

- AI generation prompt is defined in `lib/constants.ts` (`ROOMIFY_RENDER_PROMPT`).
- Hosted URL suffix validation uses `.puter.site`.
- App currently relies on Puter services for auth, storage, and inference.
