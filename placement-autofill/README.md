# 🎓 Placement AutoFill — Chrome Extension

Auto-fill your placement-related Google Forms with one click!

---

## 📦 Installation (Load Unpacked)

1. **Download & Extract** the ZIP file to a folder on your computer
2. Open **Google Chrome** and go to: `chrome://extensions/`
3. Enable **Developer Mode** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the extracted `placement-autofill` folder
6. The extension icon (⚡) will appear in your Chrome toolbar

---

## 🚀 How to Use

1. **Click the extension icon** in the toolbar
2. Go to the **Profile tab** and fill in your details:
   - Roll Number, Admission Number
   - Branch, College Name, CGPA
   - Email, Phone, Address, etc.
3. Click **"Save Profile"**
4. Open any **Google Form** (placement drive, company registration, etc.)
5. Click the extension icon → **"⚡ Fill This Form"**
6. Done! Fields are filled automatically ✅

---

## ⚙️ Settings

- **Loose matching** (recommended): fills more fields, even if label wording varies
- **Strict matching**: only fills exact keyword matches
- **Custom keywords**: add your own label → field mappings for non-standard forms

---

## 🔒 Privacy

All your profile data is stored **locally in your browser** using `chrome.storage.local`.  
Nothing is sent to any server. This extension has no analytics, no accounts, no tracking.

---

## 📁 File Structure

```
placement-autofill/
├── manifest.json          # Extension config
├── popup.html             # Extension popup UI
├── src/
│   ├── popup.js           # Popup logic
│   └── content.js         # Form detection & filling logic
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🛠️ Adding Custom Keywords

If a form uses unusual labels like "Reg. No." or "Dept.", go to:  
**Settings tab → Custom Keywords → Add**  
Map the label to the correct profile field.

---

## 💡 Tips

- Works best on standard Google Forms
- If some fields aren't filled, try **refreshing the form** and clicking Fill again
- For dropdowns (like Gender/Branch), the extension tries to match your value to the closest option
- After filling, **review before submitting** to make sure everything looks right

---

Made with ❤️ for students tired of filling the same form 70 times.
