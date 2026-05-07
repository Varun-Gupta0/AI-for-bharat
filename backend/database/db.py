"""
Persistent Database Layer (SQLite) - NyayaLens Judicial Archive

This module replaces the temporary in-memory store with a persistent SQLite database.
It handles storage and retrieval of judicial proceedings, AI extractions, and verification statuses.
"""

import sqlite3
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional

from models.schema import CaseAnalysis, ActionItem

logger = logging.getLogger(__name__)

DB_PATH = "nyayalens_archive.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the SQLite database with required tables."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # ── CASES TABLE ─────────────────────────────────────────────────────────
    # Stores the core judicial proceeding record
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cases (
            file_id TEXT PRIMARY KEY,
            tracking_id TEXT UNIQUE,
            court TEXT,
            order_date TEXT,
            summary TEXT,
            citizen_explanation TEXT,
            risk_level TEXT,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            raw_analysis_json TEXT -- Full CaseAnalysis object
        )
    ''')
    
    # ── ACTIONS TABLE ───────────────────────────────────────────────────────
    # Stores extracted directives for granular tracking and search
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            file_id TEXT,
            action TEXT,
            department TEXT,
            deadline TEXT,
            risk_level TEXT,
            status TEXT DEFAULT 'pending',
            source_text TEXT,
            page INTEGER,
            FOREIGN KEY (file_id) REFERENCES cases (file_id)
        )
    ''')
    
    conn.commit()
    conn.close()
    logger.info("Judicial Archive Database initialized successfully.")

# ─── CORE STORAGE FUNCTIONS ──────────────────────────────────────────────────

def save_raw_case(file_id: str, case_data: CaseAnalysis):
    """Save the initial AI analysis results."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    raw_json = case_data.json()
    
    # Insert or Replace case metadata
    cursor.execute('''
        INSERT OR REPLACE INTO cases 
        (file_id, court, order_date, summary, citizen_explanation, risk_level, status, raw_analysis_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ''', (
        file_id,
        case_data.court,
        case_data.order_date,
        case_data.case_summary,
        case_data.citizen_explanation,
        case_data.actions[0].risk_level if case_data.actions else "LOW",
        "pending",
        raw_json
    ))
    
    # Clear old actions if any and insert new ones
    cursor.execute('DELETE FROM actions WHERE file_id = ?', (file_id,))
    
    for action in case_data.actions:
        cursor.execute('''
            INSERT INTO actions (file_id, action, department, deadline, risk_level, status, source_text, page)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            file_id,
            action.action,
            action.department,
            action.deadline,
            action.risk_level,
            "pending",
            action.source_text,
            action.page
        ))
        
    conn.commit()
    conn.close()

def save_verified_actions(file_id: str, actions: list[ActionItem], tracking_id: str = None):
    """Update a case to 'verified' status and store the human-approved actions."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Update Case Status and Tracking ID
    cursor.execute('''
        UPDATE cases 
        SET status = 'verified', 
            tracking_id = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE file_id = ?
    ''', (tracking_id, file_id))
    
    # Update Actions status
    # In a real system we might replace them or mark specific ones as approved/edited
    # For now, we clear and save the "verified" set
    cursor.execute('DELETE FROM actions WHERE file_id = ?', (file_id,))
    for action in actions:
        cursor.execute('''
            INSERT INTO actions (file_id, action, department, deadline, risk_level, status, source_text, page)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            file_id,
            action.verified_action or action.action,
            action.department,
            action.verified_deadline or action.deadline,
            action.risk_level,
            "verified",
            action.source_text,
            action.page
        ))
        
    conn.commit()
    conn.close()

# ─── RETRIEVAL FUNCTIONS ─────────────────────────────────────────────────────

def get_raw_case(file_id: str) -> Optional[CaseAnalysis]:
    """Retrieve the full CaseAnalysis object for a given file_id."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT raw_analysis_json FROM cases WHERE file_id = ?', (file_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return CaseAnalysis.parse_raw(row['raw_analysis_json'])
    return None

def get_case_by_tracking_id(tracking_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a verified case by its public tracking ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cases WHERE tracking_id = ?', (tracking_id,))
    case_row = cursor.fetchone()
    
    if not case_row:
        conn.close()
        return None
        
    cursor.execute('SELECT * FROM actions WHERE file_id = ?', (case_row['file_id'],))
    actions = [dict(a) for a in cursor.fetchall()]
    
    res = dict(case_row)
    res['verified_actions'] = actions
    conn.close()
    return res

def get_verified_cases() -> Dict[str, list]:
    """Returns all verified cases for the Case Archive."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cases WHERE status = "verified" ORDER BY updated_at DESC')
    cases = cursor.fetchall()
    
    result = {}
    for case in cases:
        file_id = case['file_id']
        cursor.execute('SELECT * FROM actions WHERE file_id = ?', (file_id,))
        actions = [dict(a) for a in cursor.fetchall()]
        
        # Format to match existing frontend expectations
        result[file_id] = {
            "file_id": file_id,
            "tracking_id": case['tracking_id'],
            "summary": case['summary'],
            "citizen_explanation": case['citizen_explanation'],
            "verified_actions": actions,
            "status": case['status'],
            "timestamp": case['updated_at']
        }
    
    conn.close()
    return result

def search_archive(query: str) -> List[Dict[str, Any]]:
    """Search cases by tracking ID, summary, or department."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    q = f"%{query}%"
    cursor.execute('''
        SELECT DISTINCT c.* FROM cases c
        LEFT JOIN actions a ON c.file_id = a.file_id
        WHERE c.tracking_id LIKE ? 
           OR c.summary LIKE ? 
           OR a.department LIKE ?
        ORDER BY c.updated_at DESC
    ''', (q, q, q))
    
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_recent_proceedings(limit: int = 5) -> List[Dict[str, Any]]:
    """Fetch the most recently updated cases."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cases ORDER BY updated_at DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]
