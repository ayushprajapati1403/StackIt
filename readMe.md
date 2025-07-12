## Team Name- Stack Sorcerers
## Problem Statement
### StackIt – A Minimal Q&A Forum Platform

StackIt is a clean and minimal question-and-answer platform that supports collaborative learning and structured knowledge sharing. It is designed to be simple, user-friendly, and focused on the core experience of asking and answering questions within a community.

---

##  Tech Stack

- **Frontend:** React.js (Tailwind CSS + Framer Motion + ShadCN UI)
- **Backend:** Express.js (Node.js)
- **Database:** PostgreSQL (via Prisma ORM)
- **AI Integration:** Gemini API for automatic tag suggestion

---

##  Problem Statement

Long-form technical Q&A platforms often become cluttered and difficult to navigate. StackIt aims to provide a focused, structured, and engaging experience for developers and learners by keeping the interface minimal and interactions straightforward.

---

## User Roles

| Role   | Permissions |
|--------|-------------|
| Guest  | View all questions and answers |
| User   | Register, log in, post questions and answers, vote |
| Admin  | Moderate content, ban users, send platform-wide messages, download reports |

---

##  Core Features

### 1. Ask a Question
- Title (short, descriptive)
- Description (rich text editor with bold, italic, lists, links, image upload, text alignment)
- Tags (auto-suggested using OpenAI + multi-select input)

### 2. Answering
- Rich text answers using same editor
- Only logged-in users can post answers

### 3. Voting & Accepting
- Upvote/downvote answers
- Question owners can mark one answer as accepted

### 4. Tagging System
- Relevant tags are required for every question
- Tag suggestions powered by OpenAI based on title/description

### 5. Notification System
- Bell icon in navbar
- Dropdown for:
  - New answer to your question
  - Comments on your answers
  - Mentions with @username
- Unread count indicator

### 6. Admin Features
- Ban users
- Moderate inappropriate content
- Broadcast system-wide alerts
- Download user activity and feedback reports

---

##  Tag Suggestion Feature (AI-Driven)

StackIt uses the **Gemini API** model to intelligently suggest relevant tags for each new question.  
Users get 3–5 auto-suggested tags based on their input.

###  How it works:
- Question title & description are sent to the backend
- Express backend sends this to OpenAI API
- Returns relevant tags to be displayed in the frontend as suggestions

---


## Team Members

### Ayush Prajapati
- prajapatiayush1403@gmail.com

### Tamanna Farkiwala
- farkiwalatamanna@gmail.com

### Prisha Dave
- daveprisha03@gmail.com


##  Installation Instructions

### 1. Clone the Repository
```bash
- git clone https://github.com/yourusername/stackit.git
- cd stackit

---







