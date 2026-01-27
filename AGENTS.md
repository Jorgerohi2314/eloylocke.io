# AGENTS.md

This file contains guidelines and commands for agentic coding agents working on this repository.

## Project Overview

This is a modern, premium website for hosting ROM installation guides and downloads. Built with Vite + vanilla JavaScript, featuring a dark theme with glassmorphism effects and smooth animations.

**Technology Stack:**
- Build Tool: Vite 5.x
- Language: Vanilla JavaScript (ES6+)
- Styling: CSS with custom properties
- Deployment: GitHub Pages (base path: `/eloylocke.io/`)

## Build & Development Commands

### Primary Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing
This project currently has no formal test framework. To manually test:
1. Run `npm run dev` and test interactions in browser
2. Build with `npm run build` and verify assets in `dist/`
3. Test deployment with `npm run preview`

### Linting & Code Quality
No linting tools are currently configured. Consider adding:
- ESLint for JavaScript standards
- Prettier for code formatting
- Stylelint for CSS validation

## Code Structure & Conventions

### File Organization
```
├── index.html          # Main HTML entry point (Spanish content)
├── main.js            # Main application JavaScript
├── style.css          # Global styles with CSS custom properties
├── src/               # Vite source files (legacy/example code)
│   ├── main.js
│   ├── counter.js
│   └── style.css
├── public/            # Static assets
└── dist/              # Build output (generated)
```

### JavaScript Conventions
- **ES6 Modules**: Use import/export syntax
- **Event Handling**: Use `addEventListener` with arrow functions
- **DOM Selection**: Prefer `querySelector`/`querySelectorAll`
- **Variable Naming**: camelCase for variables, PascalCase for classes
- **Comments**: Minimal, functional comments only
- **Error Handling**: Basic null checks for DOM elements

Example from `main.js`:
```javascript
// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId !== '#') {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});
```

### CSS Conventions
- **CSS Custom Properties**: Use `--prefix-name` for design tokens
- **BEM-like Naming**: Use kebab-case for class names (`.step-card`, `.glass-panel`)
- **Mobile-First**: Responsive design with media queries
- **Performance**: Use `transform` and `opacity` for animations
- **Theme**: Dark theme with purple/green accent colors

CSS Custom Properties Structure:
```css
:root {
    --bg-color: #0a0a0c;
    --surface-color: #16161a;
    --primary-color: #7f5af0;
    --secondary-color: #2cb67d;
    --text-main: #fffffe;
    --text-secondary: #94a1b2;
    --glass-bg: rgba(255, 255, 255, 0.03);
    --transition: all 0.3s ease;
}
```

### HTML Conventions
- **Language**: Spanish content (`lang="es"`)
- **Semantic HTML5**: Use appropriate tags (`<header>`, `<nav>`, `<main>`)
- **Accessibility**: Include alt text for images, proper link semantics
- **Performance**: Preload critical resources, use defer for non-critical scripts

## Key Features & Patterns

### User Selection Logic
The app includes user-specific download links with this pattern:
```javascript
const userLinks = {
    fran: "https://gofile.io/d/Xib0Ix",
    manu: "https://gofile.io/d/CVhuwy",
    mario: "https://gofile.io/d/xK4mjB",
    jorge: "https://gofile.io/d/SkIpoa"
};
```

### Animation System
Uses IntersectionObserver for scroll-triggered animations:
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);
```

## Deployment Configuration

### Vite Configuration
```javascript
export default defineConfig({
  base: '/eloylocke.io/',
})
```

### GitHub Pages
Project is configured for GitHub Pages deployment with base path `/eloylocke.io/`. The build output in `dist/` should be deployed to the `gh-pages` branch or main branch's `/` root.

## Development Guidelines

### Making Changes
1. **HTML Content**: Edit `index.html` directly for content changes
2. **Styles**: Modify `style.css` for visual changes
3. **Interactions**: Update `main.js` for JavaScript functionality
4. **Assets**: Place new images/files in `public/` directory

### Content Updates
- Download links are around line ~85 in `index.html`
- Emulator links around line ~65
- Hero image can be replaced at `public/hero.png` (if exists)

### Performance Considerations
- Use CSS transforms for animations
- Implement lazy loading for images
- Minimize DOM manipulation
- Use event delegation where appropriate

## Internationalization
- Primary language: Spanish (es)
- All content, UI text, and metadata should be in Spanish
- Date/time formats should use Spanish locale when applicable

## Browser Compatibility
- Target: Modern browsers (ES6+ support required)
- CSS features: Custom properties, backdrop-filter, intersection observer
- Consider polyfills for older browsers if needed