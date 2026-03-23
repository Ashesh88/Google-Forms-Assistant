# 🎓 Placement AutoFill — Chrome Extension

<div align="center">

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-6c63ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-43e97b?style=for-the-badge)
![Made By](https://img.shields.io/badge/Made%20by-Ashesh-ff6584?style=for-the-badge)

**Placement drives mein baar baar same form fill karna band karo. Ek click mein sab ho jaata hai. ⚡**

</div>

---

## 🤔 Problem

Placement season mein har company ka alag Google Form hota hai — par **60-70% fields same hote hain** har baar:

> Roll Number • Admission Number • Branch • CGPA • 10th % • 12th % • Email • Phone • Address...

Yeh sab baar baar likhna boring bhi hai aur time waste bhi. **Placement AutoFill** ek baar data save karo, baad mein sirf ek click karo.

---

## ✨ Features

- ⚡ **One-click autofill** — kisi bhi Google Form mein
- 🧠 **Smart label matching** — "10th marks", "matric %", "SSC percentage" sab ko samjhta hai
- 📋 **40+ profile fields** — personal, academic, 10th, 12th, address, online profiles sab
- 🔧 **Custom keyword mapper** — agar koi unusual label ho toh apna mapping add karo
- 🔒 **100% local storage** — data sirf aapke browser mein, koi server nahi
- 🎯 **Loose + Strict matching** — apni zaroorat ke hisaab se sensitivity set karo

---

## 📸 Screenshots

| AutoFill Tab | Profile Tab | Settings Tab |
|---|---|---|
| One-click fill button with last session info | All your academic & personal details | Custom keywords + sensitivity control |

---

## 🚀 Installation

> Chrome Web Store pe abhi available nahi hai. Manually load karna hoga (2 minute ka kaam hai).

### Step 1 — Download karo
- Is repo ka **ZIP download** karo (`Code → Download ZIP`)
- Ya clone karo:
```bash
git clone https://github.com/yourusername/placement-autofill.git
```

### Step 2 — Chrome mein load karo
1. Chrome open karo aur address bar mein type karo: **`chrome://extensions`**
2. Top-right mein **Developer Mode** toggle ON karo
3. **"Load unpacked"** button click karo
4. `placement-autofill` folder select karo
5. Extension toolbar mein ⚡ icon aa jaayega

---

## 📖 How to Use

```
1. Extension icon click karo (toolbar mein ⚡)
2. "Profile" tab mein jaao
3. Apni details bharo — Roll No, Branch, 10th %, 12th %, sab kuch
4. "💾 Save Profile" click karo
5. Koi bhi placement Google Form open karo
6. Extension icon → "⚡ Fill This Form" click karo
7. ✅ Done!
```

---

## 📋 Supported Fields

### 👤 Personal Info
| Field | Example |
|---|---|
| Full Name | Rahul Sharma |
| Roll Number | 21CS001 |
| Admission Number | ADM2021001 |
| Phone | 9876543210 |
| Alternate Phone | Parent ka number |
| Aadhar Number | 1234 5678 9012 |
| Date of Birth | 15/08/2002 |
| Gender | Male / Female / Other |
| Category | General / OBC / SC / ST / EWS |
| Father's Name | Ram Sharma |
| Mother's Name | Sita Sharma |
| Nationality | Indian |

### 🎓 Academic Info
| Field | Example |
|---|---|
| College / University | AKTU, IIT Delhi |
| Branch / Department | CSE, ECE, ME |
| Year / Semester | Final Year, 7th Sem |
| CGPA / % | 8.5 or 85% |
| Passing Year | 2025 |

### 📘 10th Details
| Field | Example |
|---|---|
| 10th Percentage | 87.4% |
| 10th Passing Year | 2019 |
| School Name | St. Mary's High School |
| Board | CBSE / UP Board / ICSE |
| Roll Number | Board roll no. |

### 📗 12th Details
| Field | Example |
|---|---|
| 12th Percentage | 82.0% |
| 12th Passing Year | 2021 |
| School / College | Govt. Inter College |
| Board | CBSE / ISC / UP Board |
| Roll Number | Board roll no. |
| Stream | PCM / PCB / Commerce |
| JEE / Entrance Score | 95 percentile |

### 🏠 Address
| Field | Example |
|---|---|
| Full Address | Street, Colony, City |
| City | Lucknow |
| State | Uttar Pradesh |
| PIN Code | 226001 |

### 🌐 Online Profiles
| Field | Example |
|---|---|
| College Email | 21cs001@college.ac.in |
| Personal Email | rahul@gmail.com |
| LinkedIn | linkedin.com/in/rahul |
| GitHub | github.com/rahul |
| LeetCode | leetcode.com/u/rahul |
| Portfolio | rahulsharma.dev |
| HackerRank | hackerrank.com/rahul |
| Codeforces | codeforces.com/rahul |

---

## ⚙️ Custom Keywords

Agar kisi form mein unusual label ho jaise **"Reg. No."** ya **"Dept."** — toh Settings tab mein jaao:

```
Settings → Custom Keywords → Label likhо → Field select karo → Add
```

Example:
- `"Reg. No."` → Roll Number
- `"Institute"` → College Name  
- `"Aggregate Marks"` → CGPA

---

## 📁 Project Structure

```
placement-autofill/
├── manifest.json          # Chrome extension config (Manifest V3)
├── popup.html             # Extension popup UI
├── src/
│   ├── popup.js           # UI logic, storage, tab switching
│   └── content.js         # Form detection & field filling logic
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🛠️ How It Works

```
User clicks "Fill This Form"
        ↓
popup.js → reads saved profile from chrome.storage.local
        ↓
Sends message to content.js (running on the Google Form page)
        ↓
content.js → scans all form questions (role="listitem")
        ↓
Each question label is matched against 200+ keywords
        ↓
Matched fields are filled using native input setters
(works with React/Angular-based Google Forms)
        ↓
Result: "✅ 12 fields filled · 3 skipped"
```

---

## 🔒 Privacy

- ✅ Koi bhi data **kisi server ko nahi jaata**
- ✅ Sab kuch **`chrome.storage.local`** mein store hota hai — sirf aapke browser mein
- ✅ Koi analytics, koi tracking, koi account nahi
- ✅ Open source — code dekh sakte ho khud

---

## 🤝 Contributing

PRs welcome hain! Kuch ideas:

- [ ] More keyword mappings for regional universities
- [ ] Support for Microsoft Forms
- [ ] Export/Import profile as JSON
- [ ] Multiple profiles (home address vs hostel address)
- [ ] Dark/Light theme toggle

```bash
# Fork karo → Clone karo → Changes karo → PR bhejo
git clone https://github.com/yourusername/placement-autofill.git
```

---

## 📄 License

MIT License — freely use, modify, distribute karo.

---

<div align="center">

Made with ❤️ by **Ashesh**

*Placement season mein thodi help toh banti hai* 😄

</div>
