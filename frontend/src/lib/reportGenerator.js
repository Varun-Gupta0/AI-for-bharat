/**
 * NyayaLens Report Generator
 * Converts structured case JSON into professional reports for Judges and Citizens.
 */

export const generateReport = (data, role = "judge") => {
  const {
    file_id,
    summary,
    decision_summary,
    citizen_explanation,
    recommended_action,
    urgency_message,
    verified_actions = [],
    court = "State High Court",
    order_date = new Date().toLocaleDateString(),
    verified_by = "Officer John",
    verified_at = new Date().toLocaleString()
  } = data;

  const timestamp = new Date().toLocaleString();
  const primaryAction = verified_actions[0] || {};
  const riskLevel = primaryAction.risk_level || "MEDIUM";
  const mainDeadline = primaryAction.deadline || "TBD";

  // --- 1. PLAIN TEXT VERSION ---
  const generateText = () => {
    if (role === "judge") {
      return `
NYAYALENS – LEGAL INTELLIGENCE SYSTEM
======================================
OFFICIAL CASE DIRECTIVE
ID: ${file_id}
Generated: ${timestamp}

[1. CASE DETAILS]
Court: ${court}
Order Date: ${order_date}

[2. EXECUTIVE SUMMARY]
${decision_summary || summary}

[3. RISK & URGENCY]
Message: ${urgency_message || "Immediate compliance required."}
Risk Level: ${riskLevel}
Primary Deadline: ${mainDeadline}

[4. RECOMMENDED ACTION]
${recommended_action || "Ensure all departments are notified within 24 hours."}

[5. ACTION BREAKDOWN]
${verified_actions.map(a => `- ${a.action}\n  Dept: ${a.department}\n  Deadline: ${a.deadline}`).join('\n\n')}

[6. TIMELINE]
Judgment Issued -> Action Required -> Deadline (${mainDeadline}) -> ACTIVE

[7. VERIFICATION]
Verified By: ${verified_by}
Verified At: ${verified_at}
--------------------------------------
CONFIDENTIAL - GOVT USE ONLY
`.trim();
    } else {
      return `
YOUR CASE UPDATE
ID: ${file_id.substring(0, 8)}
Date: ${order_date}

SUMMARY:
${citizen_explanation || summary}

WHAT YOU NEED TO KNOW:
${urgency_message || "Your case is moving through the standard legal process."}

IMPORTANT DEADLINES:
${verified_actions.map(a => `- ${a.action} (${a.deadline})`).join('\n')}

NEED HELP?
Contact the legal aid cell at 1800-NYAYA-LENS.
`.trim();
    }
  };

  // --- 2. HTML VERSION ---
  const generateHTML = () => {
    if (role === "judge") {
      return `
<div style="font-family: 'Inter', sans-serif; color: #1a1c1e; max-width: 800px; margin: auto; padding: 40px; background: white;">
  <div style="border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
    <div>
      <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: -0.02em;">NyayaLens</h1>
      <p style="margin: 5px 0 0; font-size: 10px; font-weight: bold; opacity: 0.6; text-transform: uppercase;">Legal Intelligence System</p>
    </div>
    <div style="text-align: right; font-size: 10px; font-weight: bold; text-transform: uppercase;">
      <p style="margin: 0;">Case ID: ${file_id}</p>
      <p style="margin: 0;">Generated: ${timestamp}</p>
    </div>
  </div>

  <section style="margin-bottom: 30px;">
    <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Case Details</h3>
    <p style="font-size: 14px; margin: 5px 0;"><strong>Court:</strong> ${court}</p>
    <p style="font-size: 14px; margin: 5px 0;"><strong>Order Date:</strong> ${order_date}</p>
  </section>

  <section style="margin-bottom: 30px;">
    <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Decision Summary</h3>
    <p style="font-size: 16px; line-height: 1.6; font-style: italic; color: #333;">"${decision_summary || summary}"</p>
  </section>

  <section style="margin-bottom: 30px; background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
    <h3 style="font-size: 11px; text-transform: uppercase; color: #991b1b; margin: 0 0 10px;">Urgency & Risk Analysis</h3>
    <p style="font-size: 14px; margin: 0 0 10px;">${urgency_message || "Immediate action required for compliance."}</p>
    <p style="font-size: 12px; margin: 0;"><strong>Risk Level:</strong> ${riskLevel} | <strong>Deadline:</strong> ${mainDeadline}</p>
  </section>

  <section style="margin-bottom: 30px;">
    <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Actionable Directives</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <thead>
        <tr style="text-align: left; background: #f8fafc;">
          <th style="padding: 10px; border: 1px solid #e2e8f0;">Action Item</th>
          <th style="padding: 10px; border: 1px solid #e2e8f0;">Department</th>
          <th style="padding: 10px; border: 1px solid #e2e8f0;">Deadline</th>
        </tr>
      </thead>
      <tbody>
        ${verified_actions.map(a => `
          <tr>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${a.action}</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">${a.department}</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">${a.deadline}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </section>

  <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; font-size: 10px; color: #999; display: flex; justify-content: space-between;">
    <div>
      <p>Verified By: ${verified_by}</p>
      <p>Verified At: ${verified_at}</p>
    </div>
    <div style="text-align: right;">
      <p>© 2026 NyayaLens Protocol</p>
      <p>Official Record Copy</p>
    </div>
  </footer>
</div>
      `.trim();
    } else {
      return `
<div style="font-family: 'Inter', sans-serif; color: #1a1c1e; max-width: 600px; margin: auto; padding: 40px; background: white; border: 1px solid #e2e8f0; border-radius: 12px;">
  <h1 style="font-size: 24px; color: #2563eb; margin-bottom: 10px;">Your Case Update</h1>
  <p style="font-size: 12px; color: #64748b; margin-bottom: 30px;">ID: ${file_id.substring(0, 8)} | Date: ${order_date}</p>

  <div style="background: #eff6ff; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #1e40af; margin-bottom: 10px;">What this means for you</h2>
    <p style="font-size: 16px; line-height: 1.6; color: #1e3a8a;">${citizen_explanation || summary}</p>
  </div>

  <h2 style="font-size: 14px; text-transform: uppercase; color: #64748b; margin-bottom: 15px;">Important Next Steps</h2>
  <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px;">
    ${verified_actions.map(a => `
      <div style="display: flex; justify-content: space-between; padding: 15px; background: #f8fafc; border-radius: 8px;">
        <span style="font-size: 14px; font-weight: 500;">${a.action}</span>
        <span style="font-size: 12px; font-weight: bold; color: #ef4444;">${a.deadline}</span>
      </div>
    `).join('')}
  </div>

  <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b;">
    <p><strong>Need Help?</strong> If you don't understand these steps, call 1800-NYAYA-LENS for free assistance.</p>
  </div>
</div>
      `.trim();
    }
  };

  // --- 3. MARKDOWN VERSION ---
  const generateMarkdown = () => {
    if (role === "judge") {
      return `
# NyayaLens – Legal Intelligence System
**Case ID:** ${file_id}
**Generated on:** ${timestamp}

---

## 🏛️ Case Details
- **Court:** ${court}
- **Order Date:** ${order_date}

## 📄 Decision Summary
> ${decision_summary || summary}

## 🚨 Urgency & Risk
**Message:** ${urgency_message || "Action Required"}
**Deadline:** ${mainDeadline}
**Risk Level:** ${riskLevel}

## ✅ Recommended Action
${recommended_action || "Proceed with verification."}

## 📋 Action Breakdown
| Action | Department | Deadline | Status |
| :--- | :--- | :--- | :--- |
${verified_actions.map(a => `| ${a.action} | ${a.department} | ${a.deadline} | ACTIVE |`).join('\n')}

## 🕒 Timeline
Judgment Issued → Action Required → Deadline (${mainDeadline}) → ACTIVE

## 🛡️ Verification
- **Verified By:** ${verified_by}
- **Verified At:** ${verified_at}
`.trim();
    } else {
      return `
# Your Case Update
**ID:** ${file_id.substring(0, 8)}
**Date:** ${order_date}

---

## 📝 Simple Summary
${citizen_explanation || summary}

## ⚠️ Important Info
${urgency_message || "Standard processing active."}

## 🗓️ Important Deadlines
${verified_actions.map(a => `- **${a.action}**: Due by ${a.deadline}`).join('\n')}

---

## 📞 Need Help?
Contact the legal aid cell at **1800-NYAYA-LENS**.
`.trim();
    }
  };

  return {
    text: generateText(),
    html: generateHTML(),
    markdown: generateMarkdown()
  };
};
