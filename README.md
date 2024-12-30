# Weseq

This is a demo project using Go and TypeScript + React.

The app displays a set of controls that can be adjusted by the user. These
updates are broadcast via WebSockets to all other connected clients.

https://github.com/user-attachments/assets/e87b408a-b8d8-48cd-a602-ea5dbc4efc48

## Running the project

First run install dependencies via `npm run install`. This will download both
Node and Go dependencies.

Next run `npm run dev`. This will start the React development server on
`http://localhost:3000` and the Go server on `http://localhost:8080`.

## Generating types

This project uses [tygo](https://github.com/gzuidhof/tygo) to generate
TypeScript types from Go structs.

I have checked in the `/src/generated/types.ts` file to simplify getting things
running for others. If you want to build the types yourself you'd first install
tygo using `npm run install-tygo`. Then generate types using `npm run
generate-types`.

## Running storybook

The UI is built as pure components, including the page layout itself. Layouts
contextualize other components allowing for domain-agnostic visual adjustments
to sub-components work together.

To start storybook run `npm run storybook`.
