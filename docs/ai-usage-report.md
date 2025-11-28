
# AI Usage Report – Assignment 3

**Student:** Afrah Mohammed  
**Course:** Web Development  
**Assignment:** Assignment 3 – Advanced Functionality  
**Project:** Personal Portfolio Web Application

---

## 1. Overview

For this assignment I used AI tools as a **coding assistant, debugging helper, and documentation helper**.  
The goal was not to let AI write the whole project, but to speed up my work, get explanations, and improve the quality of my JavaScript and project structure.

The main AI tool I used was **ChatGPT**.

---

## 2. AI Tools Used

- **ChatGPT (OpenAI)**
  - Helped with planning features that match the assignment requirements.
  - Generated and refactored JavaScript code.
  - Suggested improvements to HTML/CSS structure.
  - Helped write this AI usage report and technical documentation outline.

---

## 3. How I Used AI During Development

### 3.1 GitHub API Integration

- **Prompt (summary):**  
  I asked ChatGPT to help me integrate the GitHub REST API to show my latest repositories on my portfolio page and to handle loading states and errors.
- **AI Output (summary):**  
  ChatGPT gave me an `async` function using `fetch()` to call  
  `https://api.github.com/users/<username>/repos`, loop over the response, and render cards for each repository with name, language, date, and link.
- **My Edits:**
  - Replaced the placeholder username with my real username `Afrah-F`.
  - Changed the number of repositories and the text in the UI.
  - Matched the HTML structure and CSS classes to my existing design.
  - Fixed logic so the function is called on `DOMContentLoaded` and so the spinner hides correctly.
- **What I learned:**
  - How to structure an async API call with proper error handling.
  - How to use `Array.forEach` to create DOM elements dynamically.
  - How to respond to different HTTP status codes (e.g., 404 vs generic network error).

---

### 3.2 State Management and Complex Logic

**Features:**

- Name gate (first-visit dialog) with `localStorage`.
- Theme toggle (light/dark) with `localStorage`.
- Project list with **filter + search + sort**.
- Contact form with **multi-step validation**.

**How AI helped:**

- I asked ChatGPT to:
  - Review my existing code from Assignment 2.
  - Suggest a cleaner way to manage state for:
    - current filter (`activeFilter`)
    - search query (`query`)
    - sort option (`sortBy`)
  - Help design a `render()` function that combines all logic.

**My edits:**

- I renamed variables and tweaked the logic to fit my own data structure.
- I adjusted the filters to match my categories (`Web`, `Data`, `Presentation`).
- I changed the validation messages and rules (e.g., minimum message length of 10 characters).
- I tested the code in the browser and fixed small bugs (wrong paths, missing IDs, etc.).

**What I learned:**

- How to separate **data** (project array) from **UI logic** (render function).
- How to use `localStorage` in a safe way (checking for saved values first).
- How to chain several conditions together to create “complex logic” that still reads clearly.

---

### 3.3 Project Structure and Repository Organization

- **Prompt (summary):**  
  I asked ChatGPT how to organize my files to match the assignment requirements (`/css`, `/js`, `/assets/images`, `/docs`).
- **AI Output (summary):**  
  A suggested folder structure and explanations for how to update file paths in `index.html` and `script.js`.
- **My edits and actions:**
  - Created the required folders in GitHub.
  - Moved images into `assets/images`.
  - Updated all `src` and `href` attributes and tested if everything loaded correctly.
- **What I learned:**
  - How relative paths work in a static website.
  - How GitHub treats files vs folders (and how to fix a wrong `docs` file that should be a directory).

---

### 3.4 Documentation Support

- **ai-usage-report.md**  
  I used ChatGPT to help me structure this report: headings, sections, and wording.  
  I then read through the text, edited some sentences, and made sure it matches what I actually did.
- **technical-documentation.md**  
  I asked for an outline describing my architecture, features, and state management. I adapted it to my own project and updated the details manually.

---

## 4. Challenges When Using AI

- **Understanding vs. Copying:**  
  Sometimes the AI suggestions were longer or more complex than I needed. I had to slow down, read the code, and make sure I understood it instead of just pasting it.
- **Path and environment issues:**  
  Some of the AI examples assumed different file structures. I had to debug broken image paths and script imports by checking the browser console.
- **API errors and loading states:**  
  At first, the GitHub section stayed on “Loading…”. With help from ChatGPT and my own testing, I realized the function was not being called and some conditions were wrong.

---

## 5. Learning Outcomes

Using AI in this assignment helped me:

1. **Write cleaner JavaScript code**  
   - Better separation between data, logic, and DOM updates.
   - Practice with `async/await` and error handling.

2. **Improve my problem-solving skills**  
   - I learned to read error messages, check the browser console, and test the API directly in the browser.
   - I used AI as a guide, but I still had to debug and adapt the code myself.

3. **Understand state management in the browser**  
   - How to store theme and username in `localStorage`.
   - How to have UI components respond to state changes.

4. **Think about ethical AI usage**  
   - I made sure to **edit and understand** all AI-generated code before using it.
   - I am transparent about where AI helped me (in this report).
   - The final project reflects my own decisions, structure, and understanding.

---

## 6. Summary

AI tools, especially ChatGPT, were an important part of my workflow for **Assignment 3**.  
They helped me:

- Plan features that match the rubric,
- Implement an external API integration (GitHub),
- Handle more advanced logic and validation,
- Organize my project structure,
- And document my work clearly.

However, I did not rely on AI blindly. I tested all code, made custom changes, and made sure I could explain every main part of the application in my own words.
