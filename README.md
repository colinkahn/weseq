# Weseq

This is a demo project combining a Go backend with a TypeScript and React frontend.
The application provides interactive controls that users can adjust, with
changes automatically synchronized across all connected clients via WebSockets.

https://github.com/user-attachments/assets/e87b408a-b8d8-48cd-a602-ea5dbc4efc48

## Running the Project

Install the required dependencies:

```
npm install
npm run go:download
```

Start the development servers by running `npm run dev`. This launches:
- React development server at `http://localhost:3000`
- Go backend server at `http://localhost:8080`

## Type Generation

This project uses [tygo](https://github.com/gzuidhof/tygo) to generate TypeScript type definitions from Go structs.

For convenience, the generated types are committed in `/src/generated/types.ts`. If you need to regenerate the types:
1. Install tygo: `npm run go:install:tygo`
2. Generate types: `npm run generate-types`

Note: You may need to update your PATH to include the Go binary directory:

```
export PATH=${PATH}:`go env GOPATH`/bin
```

## Storybook

The UI is built using pure components.

Launch Storybook: `npm run storybook`
