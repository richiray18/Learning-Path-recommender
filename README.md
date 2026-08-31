# 🎓 MENTORA

> An AI-powered personalized learning platform that helps students discover what to learn, track their progress, identify skill gaps, and follow an adaptive learning path.

## 📌 Overview

Learning Path Recommender is a full-stack intelligent learning platform designed to help students build personalized and structured learning journeys.

Instead of following the same learning roadmap as everyone else, the platform analyzes a learner's:

- Current skills
- Learning goals
- Assessment performance
- Course progress
- Interests
- Skill gaps

and uses this information to recommend relevant courses, skills, and learning paths.

The platform also provides an AI-powered tutor and adaptive recommendations that evolve as the learner progresses.

---

## ✨ Key Features

### 🧠 Personalized Learning Paths
Generate learning paths based on the learner's current knowledge, goals, and skill gaps.

### 🎯 Skill Assessment
Evaluate existing knowledge through assessments and identify areas that need improvement.

### 📚 Course Recommendations
Recommend relevant courses based on skills, interests, goals, and progress.

### 🗺️ Adaptive Roadmap
Visualize the recommended learning journey with prerequisites and milestones.

### 🤖 AI Tutor
Interact with an AI-powered tutor for explanations, guidance, and learning assistance.

### 📊 Progress Tracking
Track learning progress, completed courses, acquired skills, and milestones.

### 🧩 Skill Gap Analysis
Identify the difference between the learner's current skill set and their target skills.

### 🎯 Goal Management
Create and manage learning goals and receive recommendations aligned with those goals.

### 🏆 Achievements
Track milestones and achievements to encourage consistent learning.

### 💬 Feedback System
Collect learner feedback to improve the learning experience and recommendations.

### 👤 User Profile
Maintain a personalized learner profile containing skills, goals, progress, and preferences.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       Frontend      │
                    │   React + TypeScript│
                    │        + Vite       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │       FastAPI       │
                    │       Python        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │ PostgreSQL  │  │   Gemini AI  │  │   Services  │
       │  Database   │  │     API      │  │ & Algorithms│
       └─────────────┘  └─────────────┘  └─────────────┘
