// popup.js — UI logic for Placement AutoFill extension

const PROFILE_FIELDS = [
  // Personal
  'fullName','rollNumber','admissionNumber','phone','altPhone','aadhar',
  'dob','gender','category','fatherName','motherName','nationality',
  // Academic
  'collegeName','branch','yearSem','cgpa','passingYear',
  // 10th
  'tenth_percent','tenth_year','tenth_school','tenth_board','tenth_rollno',
  // 12th
  'twelfth_percent','twelfth_year','twelfth_school','twelfth_board','twelfth_rollno','twelfth_stream','entrance_score',
  // Address
  'address','city','state','pincode',
  // Online
  'email','personalEmail','linkedin','github','leetcode','portfolio','hackerrank','codeforces'
];

// ─── TAB SWITCHING ───────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ─── LOAD SAVED PROFILE ──────────────────────────────────────────────────────
function loadProfile() {
  chrome.storage.local.get(['profile', 'customKeywords', 'sensitivity', 'lastSession'], (data) => {
    const profile = data.profile || {};
    PROFILE_FIELDS.forEach(f => {
      const el = document.getElementById(f);
      if (el && profile[f]) el.value = profile[f];
    });
    if (data.sensitivity) {
      document.getElementById('sensitivity').value = data.sensitivity;
    }
    renderCustomKeywords(data.customKeywords || []);
    if (data.lastSession) {
      document.getElementById('lastSession').innerHTML =
        `<span style="color:var(--text)">Last filled:</span> ${data.lastSession.formTitle || 'Unknown Form'}<br>` +
        `<span style="color:var(--success)">✓ ${data.lastSession.filled} fields filled</span>` +
        (data.lastSession.skipped ? ` · <span style="color:var(--muted)">${data.lastSession.skipped} skipped</span>` : '');
    }
  });
}

// ─── SAVE PROFILE ────────────────────────────────────────────────────────────
document.getElementById('saveBtn').addEventListener('click', () => {
  const profile = {};
  PROFILE_FIELDS.forEach(f => {
    const el = document.getElementById(f);
    if (el) profile[f] = el.value.trim();
  });
  const sensitivity = document.getElementById('sensitivity').value;
  chrome.storage.local.set({ profile, sensitivity }, () => {
    const ind = document.getElementById('saveIndicator');
    ind.classList.add('show');
    setTimeout(() => ind.classList.remove('show'), 2000);
  });
});

// ─── CLEAR PROFILE ───────────────────────────────────────────────────────────
document.getElementById('clearBtn').addEventListener('click', () => {
  if (!confirm('Clear all saved profile data?')) return;
  PROFILE_FIELDS.forEach(f => {
    const el = document.getElementById(f);
    if (el) el.value = '';
  });
  chrome.storage.local.remove(['profile'], () => {
    showResult('fillResult', 'info', '🗑️ Profile cleared.');
  });
});

// ─── CHECK IF ON GOOGLE FORM ─────────────────────────────────────────────────
function checkActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const isForm = tab && tab.url && tab.url.includes('docs.google.com/forms');
    document.getElementById('statusDot').className = 'status-dot' + (isForm ? ' active' : '');
    document.getElementById('footerText').textContent = isForm
      ? '✓ Google Form detected'
      : 'Open a Google Form to get started';
    document.getElementById('fillBtn').disabled = !isForm;
  });
}

// ─── AUTOFILL BUTTON ─────────────────────────────────────────────────────────
document.getElementById('fillBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url.includes('docs.google.com/forms')) {
      showResult('fillResult', 'error', '❌ Please open a Google Form first.');
      return;
    }

    chrome.storage.local.get(['profile', 'customKeywords', 'sensitivity'], (data) => {
      if (!data.profile || !Object.values(data.profile).some(v => v)) {
        showResult('fillResult', 'error', '⚠️ No profile saved. Fill in your profile first!');
        document.querySelectorAll('.tab')[1].click();
        return;
      }

      showResult('fillResult', 'info', '⏳ Filling form...');

      chrome.tabs.sendMessage(tab.id, {
        action: 'fillForm',
        profile: data.profile,
        customKeywords: data.customKeywords || [],
        sensitivity: data.sensitivity || 'loose'
      }, (response) => {
        if (chrome.runtime.lastError) {
          showResult('fillResult', 'error', '❌ Could not connect. Try refreshing the form page.');
          return;
        }
        if (response && response.success) {
          showResult('fillResult', 'success',
            `✅ Filled ${response.filled} field${response.filled !== 1 ? 's' : ''}` +
            (response.skipped > 0 ? ` · ${response.skipped} skipped` : ''));
          // Save last session
          chrome.storage.local.set({ lastSession: {
            formTitle: response.formTitle,
            filled: response.filled,
            skipped: response.skipped,
            time: new Date().toLocaleString()
          }});
        } else {
          showResult('fillResult', 'error', '⚠️ ' + (response?.message || 'Could not fill form.'));
        }
      });
    });
  });
});

// ─── CUSTOM KEYWORDS ─────────────────────────────────────────────────────────
function renderCustomKeywords(keywords) {
  const container = document.getElementById('customKeywordsContainer');
  container.innerHTML = '';
  if (!keywords.length) {
    container.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:4px 0;">No custom keywords yet.</div>';
    return;
  }
  keywords.forEach((kw, i) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:var(--surface2);border-radius:8px;margin-bottom:6px;';
    row.innerHTML = `
      <span style="font-size:12px;">
        <span style="color:var(--text)">"${kw.label}"</span>
        <span style="color:var(--muted)"> → ${kw.field}</span>
      </span>
      <span class="remove" data-index="${i}" style="cursor:pointer;color:var(--accent2);font-size:16px;line-height:1;">×</span>
    `;
    row.querySelector('.remove').addEventListener('click', () => removeKeyword(i));
    container.appendChild(row);
  });
}

document.getElementById('addKeywordBtn').addEventListener('click', () => {
  const label = document.getElementById('newKeywordLabel').value.trim();
  const field = document.getElementById('newKeywordField').value;
  if (!label || !field) return;

  chrome.storage.local.get(['customKeywords'], (data) => {
    const keywords = data.customKeywords || [];
    keywords.push({ label, field });
    chrome.storage.local.set({ customKeywords: keywords }, () => {
      renderCustomKeywords(keywords);
      document.getElementById('newKeywordLabel').value = '';
      document.getElementById('newKeywordField').value = '';
    });
  });
});

function removeKeyword(index) {
  chrome.storage.local.get(['customKeywords'], (data) => {
    const keywords = data.customKeywords || [];
    keywords.splice(index, 1);
    chrome.storage.local.set({ customKeywords: keywords }, () => renderCustomKeywords(keywords));
  });
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function showResult(id, type, message) {
  const el = document.getElementById(id);
  el.className = 'result ' + type;
  el.textContent = message;
  el.style.display = 'flex';
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
loadProfile();
checkActiveTab();
