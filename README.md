# TravelTales Backend

This is the Node.js/Express backend for TravelTales Backend.
This project includes:

- JWT-based authentication (register / profile / login/ logout)
- Blog post CRUD with:
  - Image uploads (via `multipart/form-data`)
  - Search, filtering, sorting, pegination
  - Personal feed (posts by users you follow)
  - Edit / Delete your posted posts
- Like/dislike features
- Commenting
- Follow/unfollow each registered users

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
3. [Docker](#docker)
4. [API Reference](#api-reference)

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Optional: Docker & Docker Compose

---

## Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/W1867037-6COSC022C/traveltales-backend.git
   cd traveltales-backend

   ```

2. **Install dependencies**

   ```bash
   npm install

   ```

3. **Start the Application**
   ```bash
   npm start
   ```

## Docker

**A Dockerfile is included for containerization.**

1. **Build the image**

   ```bash
   docker build -t traveltales-backend-v1 .
   ```

## Api Reference

1. **Import openapi.yaml into a Swagger UI instance or view it through:**
   ```bash
   http://localhost:8081/docs
   ```
