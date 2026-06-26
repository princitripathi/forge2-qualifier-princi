# Forge2 Qualifier — Princi Tripathi

## Project: Trello-style Kanban Board

A Kanban board built using AI agents (OpenClaw + Hermes) via Slack.

## Live URL
https://forge2-qualifier-princi.vercel.app

## Agent Setup
- **OpenClaw** (Hands): google/gemini-2.5-flash via Slack Socket Mode
- **Hermes** (Brain): Orchestrator agent in #sprint-main
- **Slack Bot**: forge2-bot (evidence in /evidence folder)

## Stack
- Frontend: React + Vite
- Backend: Laravel (PHP) + SQLite
- Agents: OpenClaw + Hermes
- Model: Google Gemini 2.5 Flash

## Run Instructions

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```