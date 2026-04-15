# Architecture Note

## Prioritization & Rationale

For this 4-6 hour assignment, I prioritized a **strong core editing experience** and a **demonstrable sharing model** over shallow feature breadth.

### 1. Choice of Editor (Tiptap)
I chose Tiptap because it is "headless" and highly extensible. This allowed me to build a premium, custom UI for the toolbar while ensuring the output is structured JSON, which is much more reliable for persistence than raw HTML.

### 2. Persistence Model
I used **Prisma with SQLite** for its simplicity and local-first nature. It provides a robust relational model to handle the many-to-many relationship between Users and Documents (Sharing), which is critical for fulfilling the "owner vs shared" requirement.

### 3. Simulated Authentication
I implemented a lightweight **NextAuth (v5)** flow with a credentials provider. 
- **Decision**: Auto-create users on login. 
- **Why**: Reviewers shouldn't have to go through a complex registration process. By allowing any email to act as an account, I made it easy to demonstrate the sharing feature (Login as A, Share with B, Login as B).

### 4. Component-Based Design
The frontend is split into reusable components (`Editor`, `Navbar`, `DocumentCard`). This ensures maintainability and allowed for a consistent "premium" aesthetic across the app.

## Tradeoffs

- **Real-time Collaboration**: I deprioritized real-time cursor syncing (Hocuspocus/WebSockets) to focus on a stable single-user editing and sharing flow within the timebox.
- **Complex Permissions**: I used a simple "Owner" vs "Shared" model. I deprioritized granular (Read-only vs Edit) permissions to ensure the core sharing intent was fully functional.
- **File Parsing**: For file uploads, I implemented basic text extraction. Robust `.docx` parsing was deprioritized in favor of seamless `.md` and `.txt` support.
