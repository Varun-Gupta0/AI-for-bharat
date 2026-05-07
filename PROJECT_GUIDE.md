# Project Development Guide

## Core Idea

This system converts court judgment PDFs into structured, verified, and actionable case insights.

---

## Development Approach

We build in layers:

### Layer 1: Core Pipeline

PDF → Text → AI Extraction → Structured Output

### Layer 2: Intelligence

* Deadline calculation
* Risk scoring
* Action classification

### Layer 3: Verification

* Human approval system
* Editable outputs

### Layer 4: Delivery

* API endpoints
* UI integration

---

## Build Order

1. PDF Upload
2. Text Extraction
3. AI Extraction (JSON output)
4. Processing Logic (risk, deadlines)
5. Verification API
6. Cases API

---

## Key Principles

* Keep it simple
* Focus on working pipeline
* Avoid over-engineering
* Ensure explainability
* Human-in-the-loop is mandatory

---

## AI Expectations

AI should:

* Return structured JSON
* Extract only relevant legal information
* Avoid hallucinations
* Provide confidence levels

---

## Output Format Example

{
"case_summary": "...",
"actions": [
{
"action": "...",
"department": "...",
"deadline": "...",
"risk": "HIGH"
}
]
}

---

## Goal

Build a reliable system that turns legal complexity into clear, actionable decisions.
chec