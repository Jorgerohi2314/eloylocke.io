# Guía de Instalación - Eloy Locke

Este proyecto es una web moderna y "premium" diseñada para alojar la guía de instalación y descarga de tu ROM.

## 🚀 Inicio Rápido

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Ejecutar localmente**:
    ```bash
    npm run dev
    ```

3.  **Construir para producción**:
    ```bash
    npm run build
    ```

## 🛠 Personalización

### Editar Enlaces
Para insertar los enlaces de descarga reales, edita el archivo `index.html`.
Busca las secciones comentadas o las clases `link-placeholder` y `btn-download`.

*   **Emuladores**: Línea ~65
*   **Descarga ROM**: Línea ~85

### Cambiar Imágenes
Reemplaza `public/hero.png` con tu propia imagen si lo deseas.

## 📦 Despliegue en GitHub Pages

1.  Sube este código a tu repositorio en GitHub.
2.  Ve a **Settings** > **Pages**.
3.  En **Build and deployment**, selecciona **GitHub Actions** (si usas un workflow) o **Deploy from a branch** (si subes la carpeta `dist` manualmente, aunque se recomienda usar Actions para Vite).

### Opción Recomendada: GitHub Actions
Crea un archivo `.github/workflows/deploy.yml` con el siguiente contenido para desplegar automáticamente al hacer push:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```
