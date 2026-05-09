# PageForge Studio

PageForge Studio is an offline drag-and-drop website builder built with HTML, CSS, and vanilla JavaScript. It lets you assemble landing pages visually, edit block content and styles in a live inspector, save projects locally in the browser, and export a clean standalone HTML website without any backend or build step.

## Features

- Offline-first workflow that runs by opening `index.html` directly
- Drag-and-drop builder canvas for arranging sections visually
- Inspector-based editing for headings, paragraphs, buttons, images, hero blocks, cards, navbar, footer, contact forms, dividers, and spacers
- Page templates for portfolio, business landing, and product website starting points
- Local browser save and load using `localStorage`
- Standalone export that bundles export-only HTML, CSS, and JavaScript
- Exported websites include responsive sections, grouped card grids, smooth scrolling, mobile navigation, and frontend-only contact form behavior

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

## Folder Structure

```text
pageforge-studio/
├── index.html
├── README.md
├── LICENSE
├── .gitignore
├── assets/
│   └── logo.svg
├── css/
│   └── style.css
└── js/
    ├── app.js
    ├── dragdrop.js
    ├── editor.js
    ├── exporter.js
    ├── storage.js
    └── templates.js
```

## How To Run

1. Download or clone the repository.
2. Open the `pageforge-studio` folder.
3. Double-click `index.html`, or open it directly in a modern browser.
4. No package install, local server, or build process is required.

## How To Use

1. Open `index.html`.
2. Drag elements from the left sidebar into the canvas.
3. Click any element to edit its content and styling in the inspector.
4. Use the preview controls to switch between desktop, tablet, and mobile canvas sizes.
5. Save your work locally with the `Save` button.
6. Export the page with `Export HTML` to download a standalone website file.

## Export Feature

PageForge Studio exports a single self-contained HTML file designed to open offline. The exported output removes editor-only wrappers, keeps the website-facing classes, applies export-only styling, and includes lightweight JavaScript for interactive behavior such as:

- smooth scrolling for navigation links
- mobile navbar toggle
- section reveal animation
- button and card hover states
- frontend-only contact form success messaging

The exported HTML does not require a backend. Contact forms are presentational and client-side only.

## Screenshots

Add screenshots here before or after publishing the repository.

- Builder interface screenshot
- Template preview screenshot
- Exported website screenshot

Example markdown:

```md
![Builder UI](assets/Screenshot%202026-05-09%20105337.png)
![Template Preview](assets/Screenshot%202026-05-09%20105322.png)
```

## Roadmap

- Add more ready-made website templates
- Add richer layout controls for sections and grids
- Support reusable block presets
- Add import and export of project JSON
- Improve animation and theme customization options
- Add undo and redo history

## Author

**Vinod Prabhashvara**  
Ethical Hacker, Security Pentester, Hardware & IoT Pentester, PLC Developer, Frontend Developer

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
