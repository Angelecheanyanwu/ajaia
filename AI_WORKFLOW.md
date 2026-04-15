# AI-Native Workflow Note

## AI Tools Used
- **Cursor/Antigravity**: For core implementation, boilerplate generation, and refactoring.
- **Prisma Generator**: For schema-to-client mapping.

## Where AI Speeded Up My Work
- **Boilerplate**: AI significantly reduced the time spent setting up NextAuth v5 and Prisma initializers.
- **Styling**: Generating complex Tailwind class combinations for the "premium" glassmorphic look was much faster with AI assistance.
- **Component Drafting**: AI helped scaffold the Tiptap toolbar logic and the responsive dashboard layout in minutes.

## Output Changed or Rejected
- **Sharing Logic**: AI initially suggested a simple "Public/Private" toggle. I rejected this and insisted on a User-to-User email-based sharing model to better demonstrate product judgment and full-stack capability.
- **Editor Content**: AI suggested storing content as raw HTML. I changed this to TipTap's JSON format to ensure better structured data handling and easier future enhancements (like mentions or tasks).

## Verification & Reliability
- **Manual Flow Testing**: I verified the sharing logic by simulating multi-user flows (User A shares with User B).
- **TypeScript**: Used strict type checking to catch common errors in the API routes.
- **Automated Logic Check**: Created a standalone test script to verify the document-user relationship logic.
