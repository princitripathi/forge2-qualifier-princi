\# Architecture



\## Agent Roles



\### OpenClaw (The Hands)

\- Coding agent connected to Slack via Socket Mode

\- Model: google/gemini-2.5-flash

\- Workspace: \~/forge2-kanban

\- Receives coding tasks from #agent-coder channel

\- Writes and runs code, reports back



\### Hermes (The Brain)

\- Orchestrator agent

\- Plans tasks, manages memory, runs skills

\- Communicates in #sprint-main channel



\## Slack Channel Scheme

\- #sprint-main — Human posts goals, Hermes plans and responds

\- #agent-coder — Hermes assigns tasks, OpenClaw codes and reports

\- #agent-log — Raw agent activity and autonomous run output



\## Model Routing

\- OpenClaw → google/gemini-2.5-flash (fast, free, good at coding)

\- Hermes → google/gemini-2.5-flash (large context for planning)



\## Stack

\- Backend: Laravel (PHP), SQLite

\- Frontend: React + Vite

\- Agents: OpenClaw + Hermes

\- Channel: Slack (Socket Mode)

\- Models: Google Gemini 2.5 Flash (free)



