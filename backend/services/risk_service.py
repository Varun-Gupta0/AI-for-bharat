"""
Risk Service – Step 4

Processing logic to enhance AI extraction output.
It normalizes deadlines, calculates days remaining, and assigns risk & priority levels.
"""

import logging
from datetime import datetime
from dateutil import parser
from typing import Optional

from models.schema import CaseAnalysis, ActionItem

logger = logging.getLogger(__name__)

def normalize_date(deadline_str: Optional[str]) -> Optional[datetime]:
    """
    Safely convert a date string to a datetime object.
    Returns None if the string is empty or cannot be parsed.
    """
    if not deadline_str:
        return None
    
    try:
        # fuzzy=True allows it to ignore extra words around the date
        parsed_date = parser.parse(deadline_str, fuzzy=True)
        return parsed_date
    except Exception as e:
        logger.debug(f"Could not parse deadline string '{deadline_str}': {e}")
        return None


def calculate_days_remaining(target_date: Optional[datetime]) -> Optional[int]:
    """
    Calculate the integer number of days remaining from today to the target_date.
    Returns None if target_date is None.
    """
    if target_date is None:
        return None
        
    delta = target_date.date() - datetime.now().date()
    return delta.days


def assign_risk(days_remaining: Optional[int]) -> str:
    """
    Determine risk level based on the number of days remaining.
    Rules:
      ≤ 3 days → HIGH
      4–7 days → MEDIUM
      > 7 days → LOW
      null     → UNKNOWN
    """
    if days_remaining is None:
        return "UNKNOWN"
        
    if days_remaining <= 3:
        return "HIGH"
    elif days_remaining <= 7:
        return "MEDIUM"
    else:
        return "LOW"


def assign_priority(risk: str, confidence: float) -> str:
    """
    Determine the overall priority for an action.
    Rules:
      HIGH risk + high confidence (>= 0.8) → CRITICAL
      MEDIUM risk                          → IMPORTANT
      LOW risk or low confidence HIGH risk → NORMAL
    """
    if risk == "HIGH" and confidence >= 0.8:
        return "CRITICAL"
    elif risk == "MEDIUM":
        return "IMPORTANT"
    elif risk == "HIGH": # High risk but low confidence
        return "IMPORTANT" 
    else:
        return "NORMAL"


def process_case_analysis(analysis: CaseAnalysis) -> CaseAnalysis:
    """
    Enhance the parsed CaseAnalysis object by calculating missing 
    intelligence fields for each action item.
    """
    highest_risk = "LOW"
    min_days = None

    for action in analysis.actions:
        # 1. Normalize the deadline date
        dt = normalize_date(action.deadline)
        
        # 2. Calculate days remaining
        days_rem = calculate_days_remaining(dt)
        action.days_remaining = days_rem
        
        # 3. Assign Risk Level
        risk = assign_risk(days_rem)
        action.risk_level = risk
        
        if risk == "HIGH":
            highest_risk = "HIGH"
        elif risk == "MEDIUM" and highest_risk != "HIGH":
            highest_risk = "MEDIUM"

        if days_rem is not None:
            if min_days is None or days_rem < min_days:
                min_days = days_rem
        
        # 4. Assign Priority
        priority = assign_priority(risk, action.confidence)
        action.priority = priority

    # Generate UX urgency message based on the risk engine's assessment
    if highest_risk == "HIGH":
        days_str = f"within {min_days} days" if min_days is not None else "shortly"
        analysis.urgency_message = f"Immediate action is required {days_str} to avoid contempt of court or adverse consequences."
    elif highest_risk == "MEDIUM":
        analysis.urgency_message = "Action must be taken soon to ensure full compliance with the court's directives."
    else:
        analysis.urgency_message = "Monitor the situation and complete the required actions within the stipulated timeline."
        
    return analysis
