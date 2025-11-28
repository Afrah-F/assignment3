# 1-Technical Documentation – Assignment 3  
**Student:** Afrah Mohammed  
**Project:** Personal Portfolio Web Application  
**Course:** Web Development  

---

# 2. Introduction

This documentation explains the architecture, features, logic, and technical aspects of my personal portfolio website created for **Assignment 3 – Advanced Functionality**.  
The project builds on Assignments 1 and 2, and includes the following advanced features:

- External API integration (GitHub API)
- Complex JavaScript logic (filtering, searching, sorting, validation)
- State management using `localStorage`
- Improved project structure
- Performance optimizations

---



**Why this structure?**
- Makes the project organized and easier to maintain  
- Separates CSS/JS files from main HTML  
- Keeps images inside `assets/images`  
- Stores documentation files where instructors expect them  

---

# 3. Application Architecture

The website is a **front‑end only static application**, meaning:

- **HTML** handles structure  
- **CSS** handles styling/theme  
- **JavaScript** handles:
  - API calls
  - UI updates
  - State management
  - Form validation
  - Animations and UI behaviors  

There is **no backend** — everything runs in the browser.

---

# 4. Main Features Explained

## 4.1 Name Gate (First Visit Pop-up)

**Goal:** Create a personalized greeting based on the user's name.

**How it works:**
- When the site loads, it checks:
  ```js
  localStorage.getItem('username')
  ```
- If no username exists:
  - A modal pops up asking for the user’s name.
- After submission:
  - The name is saved in `localStorage`
  - A greeting ("Good morning, ___") updates immediately
  - A user chip appears in the header

**State stored:**
```js
localStorage.setItem('username', name)
```

---

## 4.2 Theme Toggle (Dark / Light Mode)

**Goal:** Remember the user's theme preference.

**How it works:**
- A button toggles a `.dark-mode` class on the root `<html>` element.
- CSS variables inside `:root` change colors automatically.
- The choice is stored using:
  ```js
  localStorage.setItem('theme', 'dark')
  ```
- On next visit, the theme loads automatically.

---

## 4.3 GitHub API Integration

**Goal:** Fetch and display the user’s latest GitHub repositories dynamically.

**API Endpoint Used:**
```
https://api.github.com/users/Afrah-F/repos?sort=updated&per_page=3
```

**How it works:**
1. Show a loading spinner
2. Send a fetch request:
   ```js
   const res = await fetch(REPOS_URL)
   ```
3. If successful:
   - Display repo cards:
     - Repository name  
     - Language  
     - Updated date  
     - Description  
     - GitHub link
4. If there is an error (404, network issue):
   - An error message appears

**Error handling example:**
```js
if (!res.ok) throw new Error("Network or API error");
```

---

## 4.4 Projects Section (Filter + Search + Sort)

**Goal:** Allow visitors to find projects easily.

### Data Source:
```js
const projects = [
  { title:'CLUBZONE Platform', category:'Web', ... },
  ...
]
```

### Features:
- **Filter by category**
- **Live search**
- **Sort by date or alphabetically**

### Steps during rendering:
1. Filter projects  
2. Apply search  
3. Apply sort  
4. Loop and generate cards dynamically  

Example rendering logic:
```js
projects.filter(match).sort(compare).forEach(p => createCard(p))
```

---

## 4.5 Contact Form Validation

**Goal:** Prevent invalid submissions.

### Validation Rules:
- Name cannot be empty  
- Email required  
- Email must be valid  
- Message must be at least 10 characters  

Email validation:
```js
const re = /.../
re.test(email)
```

On success:
- Show a spinner  
- Display success message  
- Reset form  

---

## 4.6 Back-to-Top Button

Appears when user scrolls down:
```js
window.scrollY > 200
```

Smooth scroll:
```js
window.scrollTo({ top: 0, behavior: "smooth" })
```

---

# 5. State Management Summary

| Feature | Where Stored | Method |
|--------|--------------|--------|
| Username | localStorage | setItem/getItem |
| Theme | localStorage | toggle + save |
| Projects Filter | JS variable | activeFilter |
| Search Query | JS variable | query |
| Sort Type | JS variable | sortBy |

---

# 6. Performance Enhancements

### ✔ Smaller images  
Placed in `assets/images`.

### ✔ Lazy loading
```html
<img loading="lazy">
```

### ✔ Optimized JavaScript  
- One render() function handles all project UI updates  
- Events only added once  
- Controlled API calls  

### ✔ Clean folder structure  
Helps GitHub Pages load faster.

---

# 7. Challenges and Solutions

| Challenge | Solution |
|----------|----------|
| Wrong folder structure | Reorganized assets, docs, css, js |
| GitHub API stuck on loading | Added missing function call + fixed conditions |
| Images not appearing | Updated image paths |
| HTML paths incorrect | Re-linked CSS and JS with correct directories |
| Understanding async API | Used AI explanations + testing |

---

# 8. Conclusion

The final version of this portfolio successfully demonstrates:

- Advanced JS logic  
- Proper API usage  
- Clean UI/UX  
- Dynamic content  
- State management  
- Debugging skills  
- Responsible AI usage  

It meets all Assignment 3 requirements and provides a strong foundation for future enhancements.


