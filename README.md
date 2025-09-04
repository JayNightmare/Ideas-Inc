# Software Idea Collection

A simple React app for collecting and sharing software ideas. Users can submit their ideas and share the app link with others.

## Features
- Submit software ideas via a form
- Share the app link using a share button (copies URL and shows a fade-up notification)
- Responsive and modern UI

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/JayNightmare/Ideas-Inc.git
   cd Ideas-Inc
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the development server:
```bash
npm start
```
The app will open at [http://localhost:3000](http://localhost:3000).

### Building for Production
To build the app for production:
```bash
npm run build
```
The optimized build will be in the `build/` directory.

### Deployment
This app is configured for deployment to GitHub Pages. To deploy:
```bash
npm run deploy
```

## Project Structure
```
├── public/
│   ├── index.html
│   └── blub.jpg
├── src/
│   ├── App.jsx
│   ├── index.jsx
│   ├── ShareButton.jsx
│   ├── SoftwareIdeaForm.jsx
│   └── styles.css
├── build/
│   └── ...
├── package.json
└── README.md
```

## License
This project is private and not licensed for redistribution.

## Author
JayNightmare
