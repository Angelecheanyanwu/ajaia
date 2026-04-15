# Ajaia LLC - AI-Native Full Stack Developer Assignment

AI-Native Full Stack Developer Assignment

Candidate: Angel Echeanyanwu ([somtoecheanyanwu@gmail.com](mailto:somtoecheanyanwu@gmail.com))

Time remaining: 100:42

# AI-Native Full Stack Developer Assignment

## Objective

This assignment is designed to test how you handle a realistic product-engineering problem with ambiguous scope, multiple surfaces, and tight delivery constraints. We want to see how you prioritize, what you build, how you communicate tradeoffs, and how you use AI tools without outsourcing judgment.

## Time Limit

Please spend no more than 4-6 hours on this assignment.

If you reach the time limit, stop and submit what you have. A focused, well-reasoned partial solution is better than an overextended build.

## Scenario

Ajaia is exploring internal productivity tools that help teams move faster on shared work. For this exercise, assume you have been asked to build a lightweight collaborative document editor inspired by Google Docs.

The goal is not to recreate Google Docs completely. The goal is to ship the strongest working version you can within the timebox while showing sound product judgment, full stack capability, and clear prioritization.

Your app should demonstrate how you think about document creation, editing, file handling, sharing, and usability in a real product environment.

## Tasks

Build a small full stack application that includes the following core capabilities:

### 1. Document Creation and Editing

Users should be able to:

- Create a new document
- Rename a document
- Edit document content in a browser
- Save and reopen documents

The editing experience should support basic rich-text formatting such as:

- Bold
- Italic
- Underline
- Headings or text size variation
- Bulleted or numbered lists

You do not need to match Google Docs exactly, but the editing flow should feel usable and coherent.

### 2. File Upload

Allow a user to upload at least one file into the product workflow. You may choose the exact behavior, but it should be product-relevant. Examples include:

- Uploading a `.txt`, `.md`, or `.docx` file and turning it into a new editable document
- Uploading an attachment that is associated with a document
- Importing content from a file into an existing draft

If you limit supported file types, state that clearly in the UI and README.

### 3. Sharing

Implement a simple sharing model so that one user can share a document with another. This does not need to be enterprise-grade access control, but it should demonstrate clear intent and working logic.

At minimum, include:

- A document owner
- A way to grant another user access
- A visible distinction between owned and shared documents

You may simulate users with seeded accounts, mocked auth, or a lightweight login flow if that keeps the scope reasonable.

### 4. Persistence

Persist documents and sharing data so that:

- Documents remain available after refresh
- Formatting or structure is preserved in a reasonable way
- Shared access behavior can be demonstrated

You may use any practical storage approach for this scope, including SQLite, Postgres, Supabase, or a local file-based store if well documented.

### 5. Product and Engineering Quality

Include enough engineering quality to show how you work in practice. At minimum, include:

- Clear setup and run instructions
- A working deployment reviewers can access via your preferred deployment path
- Basic validation and error handling
- At least one meaningful automated test
- A short architecture note explaining what you prioritized and why

## AI-Native Workflow Note

Because this is an AI-forward role, include a short note explaining:

- Which AI tools you used
- Where AI materially sped up your work
- What AI-generated output you changed or rejected
- How you verified correctness, UX quality, and implementation reliability

We are evaluating practical AI usage, not volume of AI usage.