# Setup

## .vscode

### settings.json

```json
{
  "editor.wordWrap": "on",
  "editor.formatOnPaste": false,
  "editor.formatOnSave": true,

  "typescript.preferences.importModuleSpecifier": "non-relative",

  "terminal.integrated.persistentSessionReviveProcess": "never",
  "terminal.integrated.enablePersistentSessions": false,

  "files.associations": {
    "*.css": "tailwindcss"
  },

  "tailwindCSS.experimental.configFile": "frontend/src/styles/styles.css",

  "workbench.iconTheme": "material-icon-theme",
  "material-icon-theme.activeIconPack": "angular",
  "material-icon-theme.files.associations": {},
  "material-icon-theme.folders.associations": {
    "Endpoints": "controller",
    "Properties": "private",
    "Domain": "dump",
    "Infrastructure": "tools",

    "interceptors": "middleware"
  }
}
```

### terminals.json

- [Terminals Manager](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-terminals)
- [Integrated Terminal colors](https://code.visualstudio.com/api/references/theme-color?color-formats#integrated-terminal-colors)

```json
{
  "autorun": true,
  "autokill": true,
  "terminals": [
    {
      "name": "database",
      "icon": "database",
      "color": "terminal.ansiBrightBlue",
      "commands": [
        "docker-compose -f docker-compose.dev.yml up postgres pgadmin4",
        "docker-compose -f docker-compose.dev.yml down postgres pgadmin4"
      ],
      "execute": false,
      "shellPath": "C:\\Program Files\\Git\\bin\\bash.exe"
    },
    {
      "name": "backend",
      "icon": "server",
      "color": "terminal.ansiGreen",
      "commands": [
        "cd backend/src/Api",
        "dotnet watch --no-hot-reload --environment Development --launch-profile Development"
      ],
      "execute": false,
      "shellPath": "C:\\Program Files\\Git\\bin\\bash.exe"
    },
    {
      "name": "backend cli",
      "icon": "terminal",
      "color": "terminal.ansiMagenta",
      "commands": ["cd backend"],
      "shellPath": "C:\\Program Files\\Git\\bin\\bash.exe"
    },
    {
      "name": "frontend",
      "icon": "globe",
      "color": "terminal.ansiCyan",
      "commands": ["cd frontend", "npm start"],
      "execute": false,
      "shellPath": "C:\\Program Files\\Git\\bin\\bash.exe"
    },
    {
      "name": "frontend cli",
      "icon": "terminal",
      "color": "terminal.ansiYellow",
      "commands": ["cd frontend"],
      "shellPath": "C:\\Program Files\\Git\\bin\\bash.exe"
    },
    {
      "name": "root",
      "icon": "file-directory",
      "color": "terminal.ansiBlue",
      "shellPath": "C:\\Program Files\\Git\\bin\\bash.exe"
    }
  ]
}
```
