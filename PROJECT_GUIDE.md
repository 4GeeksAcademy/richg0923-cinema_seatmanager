# Our Cinema Seat Program

This guide explains the project in simple words. Think of the program like a paper map of a movie theater: every little number in the map tells us whether a seat is free or taken.

## How We Built the Seat Program

1. **We chose the size of the room.** The program uses 8 rows and 10 seats in each row. That makes 80 seats altogether.
2. **We made a seat map.** The map is a list of rows, and every row is another list of seats. A `0` means a seat is free. A `1` means someone has taken it.
3. **We made a way to start an empty room.** `initializeSeating()` makes all 80 seats free at first.
4. **We made a way to print the room.** `displaySeating()` writes row and column numbers in the terminal. It prints `L` for a free seat and `X` for a taken seat.
5. **We made a way to reserve a seat.** `reserveSeat()` checks that the row and column are whole numbers inside the room. Then it checks whether the seat is already taken. It returns a message and changes a free seat from `0` to `1`.
6. **We made a way to count seats.** `countSeats()` counts the taken seats, then works out how many are still free.
7. **We made a way to find two seats together.** `findAdjacentSeats()` looks across each row, from left to right, and checks for two free seats side by side. It returns the first pair it finds, using row and column numbers that start at 1. It returns `null` when it cannot find a pair. It only looks; it does not reserve the seats.
8. **We tried the functions.** At the bottom of `main.ts`, the program reserves row 2, seat 5, tries to reserve it a second time, prints the room and counts, and looks for a pair of free seats. The second try shows that a taken seat cannot be reserved again.
9. **We checked the TypeScript.** `npm run typecheck` asks TypeScript to look for certain code mistakes without starting the website.

## What Each File and Folder Does

### At the top level

- **`index.html`** is the web page's starting frame. It holds the cinema title, screening details, seat map area, seat counts, and buttons. It loads `src/main.ts`.
- **`learn.json`** holds short project facts, such as the project name, languages, and difficulty. It is information for the learning template, not the seat map.
- **`package.json`** is the project's instruction and shopping list. It names commands such as `npm run start` for the website, `npm run console` for the terminal demo, and `npm run typecheck` for checking TypeScript. It also names the tools the project needs.
- **`package-lock.json`** is an automatically made, detailed list of the exact tool versions npm installed. It helps another computer install matching versions.
- **`tsconfig.json`** tells TypeScript which rules to use when it checks code. For example, strict mode asks TypeScript to be careful about types.
- **`vite.config.ts`** sets up Vite, the tool that serves the website while we work. It also turns on Tailwind CSS and sets the website's port.
- **`README.md`** is the original English starter-template guide. It explains how to install the tools and run the website.
- **`README.es.md`** is the Spanish version of that starter-template guide.
- **`PROJECT_GUIDE.md`** is this simple explanation of the cinema program and project files.
- **`.gitignore`** tells Git which things not to save in the project's change history, such as downloaded tools and built website files.

### The `src/` folder

This is short for "source." It holds the code that makes the project work.

- **`src/main.ts`** has the TypeScript program. It holds the seat map functions, draws clickable seats in the browser, updates the counts, and shows reservation messages. When you use `npm run console`, it runs example room scenarios and prints their results in the terminal.
- **`src/style.css`** is the style sheet. Right now it loads Tailwind CSS, a tool that can help style a webpage.
- **`src/vite-env.d.ts`** gives TypeScript a small note about Vite's browser tools, so TypeScript understands them.
- **`src/screening.json`** keeps the screening name, date, time, and room in JSON lists. The TypeScript program reads those details to fill in the page.

### The `public/` folder

Files in this folder can be used by the webpage as pictures and other ready-to-use items.

- **`public/rigo-baby.jpg`** is the picture used by the starter "Hello Rigo" card.

### The `.devcontainer/` folder

These are instructions for preparing a ready-to-use coding computer in a development container.

- **`.devcontainer/devcontainer.json`** chooses the computer image, installs project packages after setup, and asks the editor to open the website when its port is ready.

### The `.vscode/` folder

This folder keeps settings for Visual Studio Code, the editor used for this project.

- **`.vscode/settings.json`** says not to save file changes automatically.

### Other folders

- **`node_modules/`** contains the tools downloaded for this project. It is made by npm and is usually not edited by hand.
- **`dist/`** is where Vite puts the finished website after a build. It may not exist until a build is made.
- **`.git/`** is Git's hidden notebook of project history. Git uses it to remember changes; it is not part of the website.

## How to Try It

- To see the current starter webpage, run `npm run start` and open the local address Vite prints, usually `http://localhost:5173`.
- To see the seat reservation examples in the terminal, run `npm run console`.
- To check the TypeScript, run `npm run typecheck`.

The web page and the terminal are two different places. Use the browser page to click seats, find adjacent seats, and see live counts. Use the terminal command to run the example scenarios.