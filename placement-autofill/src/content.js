// content.js — Runs on Google Forms pages
// Detects form fields and fills them based on saved profile data

// ─── KEYWORD MAP ─────────────────────────────────────────────────────────────
// Maps profile field names → arrays of keywords to match in form labels
const FIELD_KEYWORDS = {
  fullName: [
    'full name', 'name', 'your name', 'student name', 'candidate name',
    'applicant name', 'naam', 'complete name', 'name of student'
  ],
  rollNumber: [
    'roll number', 'roll no', 'roll no.', 'enrollment number', 'enrollment no',
    'university roll', 'exam roll', 'roll', 'roll num', 'univ roll no'
  ],
  admissionNumber: [
    'admission number', 'admission no', 'admission no.', 'adm no',
    'admission id', 'adm. number', 'reg no', 'registration number',
    'registration no', 'reg. no', 'reg number', 'application number'
  ],
  phone: [
    'phone', 'mobile', 'contact', 'phone number', 'mobile number',
    'contact number', 'whatsapp', 'cell', 'phone no', 'mobile no',
    'personal phone', 'student phone'
  ],
  altPhone: [
    'alternate phone', 'alternative phone', 'parent phone', 'guardian phone',
    'emergency contact', 'parent contact', 'father phone', 'mother phone',
    'alternate mobile', 'alternate contact', 'second phone'
  ],
  aadhar: [
    'aadhar', 'aadhaar', 'aadhar number', 'aadhaar number',
    'aadhar no', 'aadhar card', 'uid number', 'uidai'
  ],
  dob: [
    'date of birth', 'dob', 'birth date', 'birthdate', 'd.o.b',
    'd.o.b.', 'born on', 'date of birth (dd/mm/yyyy)', 'birth day'
  ],
  gender: [
    'gender', 'sex', 'gender identity'
  ],
  category: [
    'category', 'caste', 'caste category', 'reservation category',
    'social category', 'sc/st/obc', 'general/obc/sc/st', 'cast'
  ],
  fatherName: [
    "father's name", 'father name', 'fathers name', 'father',
    "name of father", 'pita ka naam', 'dad name'
  ],
  motherName: [
    "mother's name", 'mother name', 'mothers name', 'mother',
    "name of mother", 'mata ka naam', 'mom name'
  ],
  nationality: [
    'nationality', 'citizenship', 'country of citizenship', 'country'
  ],
  collegeName: [
    'college', 'university', 'institution', 'institute', 'college name',
    'university name', 'school', 'organization', 'college/university',
    'name of college', 'institute name'
  ],
  branch: [
    'branch', 'department', 'dept', 'stream', 'specialization',
    'trade', 'course', 'programme', 'program', 'field of study',
    'engineering branch', 'branch name', 'dept name', 'discipline'
  ],
  yearSem: [
    'year', 'semester', 'sem', 'current year', 'academic year',
    'year of study', 'current semester', 'studying in', 'present year'
  ],
  cgpa: [
    'cgpa', 'gpa', 'percentage', 'marks', 'aggregate', 'score',
    'academic score', 'overall percentage', 'current cgpa', 'cumulative gpa',
    'academic percentage', 'percentage of marks', 'total marks',
    'b.tech percentage', 'btech cgpa', 'degree cgpa', 'graduation cgpa',
    'current aggregate', 'current percentage'
  ],
  passingYear: [
    'passing year', 'graduation year', 'year of passing', 'pass out year',
    'expected graduation', 'year of graduation', 'batch', 'batch year',
    'passout year', 'year of passout', 'expected year of passing'
  ],
  // 10TH
  tenth_percent: [
    '10th percentage', '10th %', '10th marks', 'class 10 percentage',
    'matriculation percentage', 'ssc percentage', '10th aggregate',
    'high school percentage', '10th score', '10 percentage',
    'class x percentage', 'x percentage', 'matric percentage',
    '10th marks obtained', 'secondary percentage'
  ],
  tenth_year: [
    '10th passing year', '10th year', 'class 10 passing year',
    'matriculation year', 'ssc passing year', '10th pass year',
    'class x passing year', 'secondary passing year', '10 pass year'
  ],
  tenth_school: [
    '10th school', 'school name', 'high school name', 'secondary school',
    'matriculation school', 'class 10 school', 'school', '10th institute'
  ],
  tenth_board: [
    '10th board', 'secondary board', 'class 10 board', 'school board',
    'matriculation board', 'ssc board', 'board of secondary education',
    '10th board name', 'high school board'
  ],
  tenth_rollno: [
    '10th roll no', '10th roll number', 'secondary roll number',
    'matric roll no', 'class 10 roll no', 'board roll 10'
  ],
  // 12TH
  twelfth_percent: [
    '12th percentage', '12th %', '12th marks', 'class 12 percentage',
    'intermediate percentage', 'hsc percentage', '12th aggregate',
    'senior secondary percentage', '12th score', '12 percentage',
    'class xii percentage', 'xii percentage', '+2 percentage',
    'intermediate marks', '12th marks obtained', 'higher secondary percentage'
  ],
  twelfth_year: [
    '12th passing year', '12th year', 'class 12 passing year',
    'intermediate passing year', 'hsc passing year', '12th pass year',
    'class xii passing year', 'senior secondary passing year', '12 pass year',
    'inter passing year'
  ],
  twelfth_school: [
    '12th college', '12th school', 'intermediate college', 'hsc school',
    'senior secondary school', 'class 12 college', 'inter college',
    'higher secondary school', '12th institute', 'intermediate institute'
  ],
  twelfth_board: [
    '12th board', 'intermediate board', 'class 12 board', 'hsc board',
    'senior secondary board', 'board of intermediate education',
    '12th board name', 'higher secondary board', 'inter board'
  ],
  twelfth_rollno: [
    '12th roll no', '12th roll number', 'intermediate roll number',
    'hsc roll no', 'class 12 roll no', 'board roll 12', 'inter roll no'
  ],
  twelfth_stream: [
    '12th stream', 'intermediate stream', 'stream', 'pcm', 'pcb',
    'class 12 stream', 'hsc stream', 'subject group', 'group'
  ],
  entrance_score: [
    'jee score', 'jee rank', 'jee percentile', 'entrance score',
    'entrance rank', 'jee mains', 'jee advanced', 'neet score',
    'entrance exam', 'qualifying exam', 'entrance exam score'
  ],
  // ADDRESS
  address: [
    'address', 'full address', 'home address', 'permanent address',
    'residential address', 'current address', 'correspondence address',
    'postal address', 'residence', 'house address'
  ],
  city: [
    'city', 'town', 'district', 'city name', 'home city',
    'hometown', 'location', 'tehsil'
  ],
  state: [
    'state', 'state name', 'home state', 'province'
  ],
  pincode: [
    'pin', 'pincode', 'pin code', 'zip', 'zip code', 'postal code',
    'post code', 'area code', 'zip/postal code'
  ],
  // ONLINE
  email: [
    'college email', 'official email', 'institute email',
    'university email', 'college mail', 'institutional email'
  ],
  personalEmail: [
    'personal email', 'gmail', 'personal mail', 'email', 'e-mail',
    'email address', 'email id', 'mail id', 'mail', 'your email'
  ],
  linkedin: [
    'linkedin', 'linkedin profile', 'linkedin url', 'linkedin id',
    'linkedin link', 'linkedin profile url', 'linked in'
  ],
  github: [
    'github', 'github profile', 'github url', 'github id',
    'github link', 'git hub', 'github username'
  ],
  leetcode: [
    'leetcode', 'leet code', 'leetcode profile', 'leetcode url',
    'leetcode id', 'leetcode link', 'leetcode username'
  ],
  portfolio: [
    'portfolio', 'website', 'personal website', 'portfolio url',
    'portfolio link', 'personal site', 'blog'
  ],
  hackerrank: [
    'hackerrank', 'hacker rank', 'hackerrank profile', 'hackerrank url',
    'hackerrank id', 'hackerrank link'
  ],
  codeforces: [
    'codeforces', 'code forces', 'codeforces profile', 'codeforces id',
    'cf handle', 'codeforces handle'
  ]
};

// ─── MATCH FIELD LABEL ───────────────────────────────────────────────────────
function matchLabel(labelText, customKeywords = [], sensitivity = 'loose') {
  const normalized = labelText.toLowerCase().replace(/[*:]/g, '').trim();

  // Check custom keywords first
  for (const ck of customKeywords) {
    if (normalized.includes(ck.label.toLowerCase())) {
      return ck.field;
    }
  }

  // Match built-in keywords
  for (const [field, keywords] of Object.entries(FIELD_KEYWORDS)) {
    for (const kw of keywords) {
      if (sensitivity === 'strict') {
        if (normalized === kw) return field;
      } else {
        if (normalized.includes(kw) || kw.includes(normalized)) return field;
      }
    }
  }

  return null;
}

// ─── GET ALL FORM QUESTIONS ───────────────────────────────────────────────────
function getFormQuestions() {
  // Google Forms uses role="listitem" for each question container
  const questions = [];

  // Strategy 1: role=listitem (modern Google Forms)
  document.querySelectorAll('[role="listitem"]').forEach(item => {
    const labelEl = item.querySelector('[role="heading"], .freebirdFormviewerComponentsQuestionBaseTitle');
    const inputs = item.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input[type="number"], textarea');
    const radioInputs = item.querySelectorAll('[role="radio"]');
    const checkboxInputs = item.querySelectorAll('[role="checkbox"]');
    const dropdownTrigger = item.querySelector('[role="listbox"], [aria-haspopup="listbox"]');

    if (labelEl && (inputs.length || radioInputs.length || checkboxInputs.length || dropdownTrigger)) {
      questions.push({
        label: labelEl.textContent.trim(),
        inputs: Array.from(inputs),
        radios: Array.from(radioInputs),
        checkboxes: Array.from(checkboxInputs),
        dropdown: dropdownTrigger,
        container: item
      });
    }
  });

  // Fallback: data-params based containers
  if (!questions.length) {
    document.querySelectorAll('[data-params]').forEach(item => {
      const labelEl = item.querySelector('span[dir="auto"]');
      const inputs = item.querySelectorAll('input, textarea');
      if (labelEl && inputs.length) {
        questions.push({
          label: labelEl.textContent.trim(),
          inputs: Array.from(inputs),
          radios: [],
          checkboxes: [],
          dropdown: null,
          container: item
        });
      }
    });
  }

  return questions;
}

// ─── FILL TEXT INPUT ─────────────────────────────────────────────────────────
function fillTextInput(input, value) {
  if (!input || !value) return false;
  try {
    input.focus();
    // Use native input setter to trigger React/Angular reactivity
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value') ||
                                    Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
    if (nativeInputValueSetter && nativeInputValueSetter.set) {
      nativeInputValueSetter.set.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.blur();
    return true;
  } catch (e) {
    return false;
  }
}

// ─── FILL TEXTAREA ───────────────────────────────────────────────────────────
function fillTextArea(textarea, value) {
  if (!textarea || !value) return false;
  try {
    textarea.focus();
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
    if (nativeSetter && nativeSetter.set) {
      nativeSetter.set.call(textarea, value);
    } else {
      textarea.value = value;
    }
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    textarea.blur();
    return true;
  } catch (e) {
    return false;
  }
}

// ─── FILL RADIO / SELECT ─────────────────────────────────────────────────────
function fillRadio(radios, value) {
  if (!radios.length || !value) return false;
  const lv = value.toLowerCase();
  for (const radio of radios) {
    const label = radio.getAttribute('data-value') ||
                  radio.closest('[data-value]')?.getAttribute('data-value') ||
                  radio.textContent.trim();
    if (label && label.toLowerCase().includes(lv)) {
      radio.click();
      return true;
    }
  }
  return false;
}

// ─── FILL DROPDOWN ───────────────────────────────────────────────────────────
function fillDropdown(container, value) {
  if (!value) return false;
  const lv = value.toLowerCase();

  // Try to find select element
  const select = container.querySelector('select');
  if (select) {
    for (const opt of select.options) {
      if (opt.text.toLowerCase().includes(lv)) {
        select.value = opt.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    }
  }

  // Try Google Forms listbox dropdown
  const trigger = container.querySelector('[role="listbox"], [aria-haspopup="listbox"]');
  if (trigger) {
    trigger.click();
    setTimeout(() => {
      const options = document.querySelectorAll('[role="option"]');
      for (const opt of options) {
        if (opt.textContent.trim().toLowerCase().includes(lv)) {
          opt.click();
          return;
        }
      }
    }, 300);
    return true;
  }
  return false;
}

// ─── MAIN FILL FUNCTION ───────────────────────────────────────────────────────
function fillForm(profile, customKeywords, sensitivity) {
  const questions = getFormQuestions();
  let filled = 0;
  let skipped = 0;

  if (!questions.length) {
    return { success: false, message: 'No form fields detected. Try refreshing the page.' };
  }

  const formTitleEl = document.querySelector('[role="heading"][aria-level="1"], .freebirdFormviewerViewHeaderTitle');
  const formTitle = formTitleEl ? formTitleEl.textContent.trim() : 'Google Form';

  for (const q of questions) {
    const field = matchLabel(q.label, customKeywords, sensitivity);
    if (!field) { skipped++; continue; }

    const value = profile[field];
    if (!value) { skipped++; continue; }

    let didFill = false;

    // Try text inputs first
    for (const input of q.inputs) {
      const tag = input.tagName.toLowerCase();
      if (tag === 'textarea') {
        didFill = fillTextArea(input, value);
      } else {
        didFill = fillTextInput(input, value);
      }
      if (didFill) break;
    }

    // Try radio buttons (e.g. gender)
    if (!didFill && q.radios.length) {
      didFill = fillRadio(q.radios, value);
    }

    // Try dropdown
    if (!didFill && q.dropdown) {
      didFill = fillDropdown(q.container, value);
    }

    if (didFill) filled++;
    else skipped++;
  }

  return { success: true, filled, skipped, formTitle };
}

// ─── MESSAGE LISTENER ─────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fillForm') {
    try {
      const result = fillForm(message.profile, message.customKeywords || [], message.sensitivity || 'loose');
      sendResponse(result);
    } catch (err) {
      sendResponse({ success: false, message: 'Error: ' + err.message });
    }
    return true; // Keep channel open for async
  }
});
