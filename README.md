# Next rendering optimisation (with React Query)

This repo is testing component re-rendering options using React Query on Next.js.

## Assumptions

Each page is mapped to a backend endpoint to retrieve the data from. Each endpoint instructs the page what to show and how. This means that we cannot assume the content of the page **a priori**. Each module could be shown on any page, more than once. This means that only once we get the data from the backend the page knows whicH UI sections to load and how to render them.

## Options

Two options are being tested:

- props-from-the-top: fetches the data with `useQuery` at the top of the page, and passes the entire object down the DOM tree
- props-from-the-side: fetches the data at the top to inform the layout, then each section access its data independently via `useQuery`

## Notes

- Use "tracked queries" by default (see `notifyOnChangeProps` on https://tanstack.com/query/v4/docs/reference/useQuery)
- Transform the data with the selector to map the portion of data to the relevant props needed by the component
- Create a hook that uses `useQuery` to provide the props. This hooks accepts a transformer in input to map the data to props

## What to test

1. Test the `useQuery` from the module without passing any promise (or falling back on the default one)
2. Test the 'enables' property on the subsequent `useQuery`
3. Test the re-rendering

## Notes

- if any prperty of the query changes, it will call the fetcher/promise
- enables

## Templates

Run the following command

```
npx create-next-app@latest --src-dir --no-experimental-app --use-npm --eslint --ts --import-alias '@/*'
```

```json
{
  "name": "name",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@next/font": "^13.1.6",
    "@tanstack/react-query": "^4.24.4",
    "@tanstack/react-query-devtools": "^4.24.4",
    "next": "^13.1.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^18.11.18",
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "eslint": "^8.33.0",
    "eslint-config-next": "^13.1.6",
    "typescript": "^4.9.5"
  }
}
```

## Page Lifecycle

### Server Side

- **CustomApp.getInitialProps**
- Home.getServerSideProps
- **CustomApp**
- Home

### Client Side

- **CustomApp**
- Home

## React Query

### API

- https://tanstack.com/query/v4/docs/react/reference/useQuery
- https://tanstack.com/query/v4/docs/react/reference/QueryClient

### Concepts

- https://tanstack.com/query/v4/docs/react/guides/query-keys
- https://tanstack.com/query/v4/docs/react/guides/query-functions

## Other References

- React Query Tracking: https://tkdodo.eu/blog/react-query-render-optimizations
