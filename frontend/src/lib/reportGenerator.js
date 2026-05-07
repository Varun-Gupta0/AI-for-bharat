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

  // --- 2. HTML VERSION (GOVERNMENT-GRADE EXPORT) ---
  const generateHTML = () => {
    if (role === "judge") {
      return `
<div style="font-family: 'Lora', Georgia, serif; color: #1a1a1a; max-width: 850px; margin: 0 auto; padding: 60px 50px; background: #ffffff; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); position: relative; overflow: hidden; border: 1px solid #e2e8f0;">
  
  <!-- Subtle Background Seal -->
  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.03; font-size: 400px; z-index: 0; pointer-events: none; filter: blur(2px);">
    ⚖️
  </div>

  <div style="position: relative; z-index: 1;">
    <!-- Official Header -->
    <div style="border-bottom: 3px double #1a1a1a; padding-bottom: 30px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <h1 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; letter-spacing: 0.02em; color: #0d1117;">NYAYALENS</h1>
        <p style="margin: 8px 0 0; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #4a4a4a;">Official Judicial Intelligence Record</p>
      </div>
      <div style="text-align: right; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #4a4a4a;">
        <p style="margin: 0 0 4px;">REF NO: <strong>${file_id.substring(0, 12)}</strong></p>
        <p style="margin: 0 0 4px;">DATE: <strong>${new Date().toLocaleDateString('en-GB')}</strong></p>
        <p style="margin: 0;">STATUS: <span style="color: #238636; font-weight: 900;">VERIFIED</span></p>
      </div>
    </div>

    <!-- Case Information -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; font-family: 'Inter', sans-serif; font-size: 12px; border: 1px solid #e2e8f0; padding: 20px; background: #fafafa;">
      <div>
        <p style="margin: 0 0 8px; color: #666; text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; font-weight: 700;">Jurisdiction / Court</p>
        <p style="margin: 0; font-weight: 700; color: #1a1a1a; font-size: 14px;">${court}</p>
      </div>
      <div>
        <p style="margin: 0 0 8px; color: #666; text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; font-weight: 700;">Date of Order</p>
        <p style="margin: 0; font-weight: 700; color: #1a1a1a; font-size: 14px;">${order_date}</p>
      </div>
    </div>

    <!-- Decision Summary (Headline) -->
    <section style="margin-bottom: 40px;">
      <h3 style="font-family: 'Inter', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #666; border-bottom: 1px solid #eaeaea; padding-bottom: 8px; margin-bottom: 20px; font-weight: 800;">I. Executive Judicial Summary</h3>
      <p style="font-family: 'Playfair Display', serif; font-size: 22px; line-height: 1.5; font-weight: 700; color: #1a1a1a; margin: 0;">
        ${decision_summary || summary}
      </p>
    </section>

    <!-- Risk & Deadline Section -->
    <section style="margin-bottom: 40px; border: 1px solid #8b0000; padding: 25px; background: #fffcfc; position: relative;">
      <div style="position: absolute; top: -10px; left: 20px; background: #fffcfc; padding: 0 10px; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 900; color: #8b0000; letter-spacing: 0.2em; text-transform: uppercase;">
        Statutory Compliance Warning
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1; padding-right: 20px;">
          <p style="font-size: 16px; margin: 0; color: #8b0000; font-weight: 600; font-style: italic;">${urgency_message || "Immediate administrative action required to prevent contempt of court."}</p>
        </div>
        <div style="text-align: right; border-left: 1px solid rgba(139,0,0,0.2); padding-left: 20px;">
          <p style="font-family: 'Inter', sans-serif; font-size: 10px; margin: 0 0 5px; color: #666; text-transform: uppercase; letter-spacing: 0.1em;">Assessed Risk</p>
          <p style="font-family: 'Inter', sans-serif; font-size: 18px; margin: 0 0 10px; font-weight: 900; color: #8b0000;">${riskLevel}</p>
          <p style="font-family: 'Inter', sans-serif; font-size: 10px; margin: 0 0 5px; color: #666; text-transform: uppercase; letter-spacing: 0.1em;">Primary Deadline</p>
          <p style="font-family: 'Inter', sans-serif; font-size: 14px; margin: 0; font-weight: 800; color: #1a1a1a;">${mainDeadline}</p>
        </div>
      </div>
    </section>

    <!-- Action Breakdown Table -->
    <section style="margin-bottom: 50px;">
      <h3 style="font-family: 'Inter', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #666; border-bottom: 1px solid #eaeaea; padding-bottom: 8px; margin-bottom: 20px; font-weight: 800;">II. Verified Actionable Directives</h3>
      <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', sans-serif; font-size: 13px;">
        <thead>
          <tr style="background: #f4f4f5; text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; color: #666;">
            <th style="padding: 15px; border: 1px solid #d4d4d8; text-align: left; width: 50%;">Directive</th>
            <th style="padding: 15px; border: 1px solid #d4d4d8; text-align: left;">Responsible Dept.</th>
            <th style="padding: 15px; border: 1px solid #d4d4d8; text-align: left;">Deadline</th>
            <th style="padding: 15px; border: 1px solid #d4d4d8; text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${verified_actions.map(a => `
            <tr>
              <td style="padding: 15px; border: 1px solid #d4d4d8; font-family: 'Lora', serif; font-size: 14px; color: #1a1a1a; line-height: 1.5;">${a.action}</td>
              <td style="padding: 15px; border: 1px solid #d4d4d8; font-weight: 600; color: #3f3f46;">${a.department}</td>
              <td style="padding: 15px; border: 1px solid #d4d4d8; font-weight: 700; color: #8b0000;">${a.deadline}</td>
              <td style="padding: 15px; border: 1px solid #d4d4d8; text-align: center; color: #238636; font-weight: 800; font-size: 11px;">PENDING</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>

    <!-- Verification Section -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; padding-top: 30px; border-top: 1px solid #1a1a1a;">
      <div>
        <p style="font-family: 'Inter', sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin: 0 0 10px;">Digitally Verified By</p>
        <p style="font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; margin: 0 0 5px; color: #1a1a1a; font-style: italic;">${verified_by}</p>
        <p style="font-family: 'Inter', sans-serif; font-size: 11px; margin: 0; color: #666;">${verified_at}</p>
      </div>
      
      <!-- Official Stamp -->
      <div style="border: 3px solid #b91c1c; color: #b91c1c; padding: 10px 20px; font-family: 'Inter', sans-serif; font-weight: 900; font-size: 18px; letter-spacing: 0.1em; transform: rotate(-5deg); text-transform: uppercase; border-radius: 4px; display: inline-block;">
        CERTIFIED TRUE EXTRACT
      </div>
    </div>

  </div>
</div>
      `.trim();
    } else {
      return `
<div style="font-family: 'Lora', Georgia, serif; color: #1a1a1a; max-width: 650px; margin: 0 auto; padding: 50px 40px; background: #ffffff; border: 1px solid #e2e8f0; border-top: 6px solid #2c5282; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
  <div style="text-align: center; margin-bottom: 40px;">
    <h1 style="font-family: 'Playfair Display', serif; font-size: 28px; color: #2c5282; margin: 0 0 10px; font-weight: 900;">Public Awareness Notice</h1>
    <p style="font-family: 'Inter', sans-serif; font-size: 11px; color: #64748b; margin: 0; letter-spacing: 0.1em; text-transform: uppercase;">REF: ${file_id.substring(0, 10)} | DATE: ${order_date}</p>
  </div>

  <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 35px; border-left: 4px solid #2c5282;">
    <h2 style="font-family: 'Inter', sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #1e40af; margin: 0 0 15px; font-weight: 800;">Understanding This Proceeding</h2>
    <p style="font-size: 18px; line-height: 1.7; color: #1a1a1a; margin: 0; font-style: italic;">"${citizen_explanation || summary}"</p>
  </div>

  <h2 style="font-family: 'Inter', sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin: 0 0 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Important Required Actions</h2>
  <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 40px;">
    ${verified_actions.map(a => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <span style="font-size: 15px; font-weight: 600; color: #334155; line-height: 1.5; padding-right: 20px;">${a.action}</span>
        <div style="text-align: right; min-width: 100px;">
          <span style="display: block; font-family: 'Inter', sans-serif; font-size: 10px; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px;">Deadline</span>
          <span style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 800; color: #ef4444;">${a.deadline}</span>
        </div>
      </div>
    `).join('')}
  </div>

  <div style="border-top: 1px dashed #cbd5e1; padding-top: 25px; text-align: center;">
    <p style="font-family: 'Inter', sans-serif; font-size: 12px; color: #64748b; margin: 0; line-height: 1.6;">
      <strong>Need assistance?</strong><br>
      Contact the state legal aid cell at <span style="color: #2c5282; font-weight: 800;">1800-NYAYA-LENS</span> for free guidance.
    </p>
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
