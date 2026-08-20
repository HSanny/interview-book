# Interview Handbook

A living, expandable preparation handbook for Software Engineering, ML/AI Engineering, Research Engineering, ML Systems, and technical generalist interviews.

## What is included

- Searchable, expandable coding-pattern lessons
- Recognition signals, solution methods, complexity, representative questions, and engineering scenarios
- System design, ML systems, retrieval, resume-defense, project, company, Exa, and technology-risk chapters
- Browser-saved campaign checklist and working notes
- Responsive book-like layout and social preview card

## Edit the content

The handbook content and chapter structure live in `app/page.tsx`. Visual styling lives in `app/globals.css`. Edit either file, commit the change, and redeploy.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build

```bash
npm run build
```

Personal progress and notes are stored in the visitor's browser and are not committed to the repository.

## GitHub Pages

Every push to `main` automatically builds and publishes the handbook through the workflow in `.github/workflows/pages.yml`.
