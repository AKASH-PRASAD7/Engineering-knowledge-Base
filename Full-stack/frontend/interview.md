# Frontend (React & Next.js) Interview Cheatsheet

---

## ⚛️ React & State Management

### 1. Higher-Order Components (HOC) vs. Custom Hooks
*   **HOC (Higher-Order Component):** A pattern where a function takes a component and returns a new enhanced component.
    ```jsx
    const withAuth = (WrappedComponent) => {
      return (props) => {
        const isAuthenticated = checkAuth();
        return isAuthenticated ? <WrappedComponent {...props} /> : <Login />;
      };
    };
    ```
*   **Custom Hooks:** A function starting with `use` that allows you to reuse stateful logic without changing your component hierarchy.
    ```jsx
    const useAuth = () => {
      const [user, setUser] = useState(null);
      // Auth logic here...
      return user;
    };
    ```
*   **Comparison:** Custom Hooks have largely replaced HOCs because they avoid wrapper hell, are easier to compose, and don't pollute props.

---

### 2. `useRef` vs. `useState`
*   **`useRef`:** Returns a mutable ref object (`{ current: value }`) that persists across renders. **Changing its value does NOT trigger a re-render.**
*   **`useState`:** Returns a stateful value and a updater function. **Changing state triggers a re-render.**

#### Common `useRef` Use Cases:
1.  **Accessing DOM elements directly:**
    ```jsx
    const inputRef = useRef(null);
    useEffect(() => inputRef.current.focus(), []);
    return <input ref={inputRef} />;
    ```
2.  **Storing mutable values (e.g., timer IDs, previous state):**
    ```jsx
    const timerRef = useRef(null);
    const startTimer = () => {
      timerRef.current = setInterval(() => console.log("tick"), 1000);
    };
    const stopTimer = () => clearInterval(timerRef.current);
    ```

---

### 3. Memory Leaks in React
A memory leak occurs when an application retains references to objects that are no longer needed, preventing JavaScript's garbage collector from freeing that memory.

#### How to find memory leaks:
1.  Open **Chrome DevTools** -> **Memory** tab.
2.  Take a heap snapshot, perform actions (like mounting/unmounting a component), and take another snapshot.
3.  Compare the snapshots to see if objects (like detached DOM elements or uncleaned objects) are still retained in memory.

#### Common Causes & Fixes:
*   **Uncleaned Timers (`setInterval`/`setTimeout`):**
    ```javascript
    useEffect(() => {
      const interval = setInterval(() => console.log("tick"), 1000);
      return () => clearInterval(interval); // ✅ CLEANUP
    }, []);
    ```
*   **Unremoved Event Listeners:**
    ```javascript
    useEffect(() => {
      const handleResize = () => console.log(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize); // ✅ CLEANUP
    }, []);
    ```
*   **Uncancelled Network Requests (updating state on unmounted component):**
    ```javascript
    useEffect(() => {
      const controller = new AbortController();
      fetch('/api/data', { signal: controller.signal })
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => { if (err.name !== 'AbortError') console.error(err); });
      
      return () => controller.abort(); // ✅ CANCEL ON UNMOUNT
    }, []);
    ```

---

### 4. React Performance Optimization
*   **`React.memo`:** A higher-order component that skips re-rendering a component if its props haven't changed.
*   **`useMemo`:** Memoizes the *result of a calculation* so it doesn't run on every render unless dependencies change.
*   **`useCallback`:** Memoizes a *function definition* to prevent recreation on every render (useful when passing functions to memoized child components).
*   **Windowing/Virtualization:** Only rendering rows currently visible in the viewport (using libraries like `react-window` or `react-virtualized`) for long lists.

---

## 🌐 Next.js & Rendering Strategies

### 1. CSR vs. SSR vs. SSG vs. ISR
| Strategy | Full Name | When is HTML Generated? | Best For |
| :--- | :--- | :--- | :--- |
| **CSR** | Client-Side Rendering | On the client (browser) using JS | Dashboards, private/dynamic pages |
| **SSR** | Server-Side Rendering | On the server **per request** | Highly dynamic public pages (e.g. feed) |
| **SSG** | Static Site Generation | On the server **at build time** | Static content (blogs, marketing pages) |
| **ISR** | Incremental Static Regeneration | Re-generated in background **at intervals** | Semi-dynamic public pages (e.g. e-commerce) |

---

### 2. React Server Components (RSC) vs. Client Components (Next.js App Router)
*   **Server Components (Default):**
    *   Rendered on the server.
    *   Zero client-side JavaScript overhead.
    *   Can fetch data directly from databases/services using async/await.
    *   *Cannot* use hooks (`useState`, `useEffect`), browser APIs, or event listeners.
*   **Client Components (marked with `'use client'`):**
    *   Pre-rendered on the server, then hydrated on the client.
    *   Can use state, effects, hooks, and event listeners.
    *   *Rule of thumb:* Keep Server Components as high up the tree as possible; only use Client Components for interactive leaf nodes (buttons, search inputs, forms).

---

## 🌐 Web & Browser Fundamentals

### 1. CORS (Cross-Origin Resource Sharing)
*   A browser security mechanism that restricts a web page from making requests to a different domain (origin) than the one that served it.
*   **Preflight Request:** The browser sends an `OPTIONS` request first to check if the server allows the actual request (e.g., `POST`, `PUT`) and headers.
*   **Fix:** Configure the backend to return the `Access-Control-Allow-Origin: <origin>` header matching the frontend URL.

### 2. Critical Rendering Path
The steps the browser takes to convert HTML, CSS, and JS into pixels on the screen:
1.  **DOM (Document Object Model):** Parse HTML and build tree.
2.  **CSSOM (CSS Object Model):** Parse CSS and build style rules tree.
3.  **Render Tree:** Combine DOM and CSSOM (ignoring hidden nodes like `display: none`).
4.  **Layout (Reflow):** Calculate the exact geometry, size, and position of each visible node.
5.  **Paint (Repaint):** Convert layout nodes into actual pixels on the screen (colors, borders, text).
6.  **Composite:** Layer elements together on the screen (especially when using CSS transitions/transformations).

