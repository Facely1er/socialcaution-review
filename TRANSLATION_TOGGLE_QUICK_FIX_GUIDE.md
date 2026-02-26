# Translation Toggle Quick Fix Guide

**For Future Reference:** If the translation toggle stops working again, apply these fixes.

## 🔧 Quick Fixes

### Fix #1: Change Event Listeners
```javascript
// ❌ WRONG - Causes race conditions
document.addEventListener('click', handleClickOutside);

// ✅ CORRECT - Prevents race conditions
document.addEventListener('mousedown', handleClickOutside);
document.addEventListener('touchstart', handleClickOutside);
```

### Fix #2: Simplify Refs
```javascript
// ❌ WRONG - Too many refs
const containerRef = useRef(null);
const buttonRef = useRef(null);
const dropdownRef = useRef(null);

// ✅ CORRECT - Only what's needed
const buttonRef = useRef(null);
const dropdownRef = useRef(null);
```

### Fix #3: Z-Index
```javascript
// ❌ WRONG - Can be overridden
className="... z-[60]"

// ✅ CORRECT - Always on top
className="... z-[9999]"
```

### Fix #4: Button Types
```javascript
// ❌ WRONG - No type attribute
<button onClick={handler}>

// ✅ CORRECT - Explicit type
<button type="button" onClick={handler}>
```

### Fix #5: Close Before Change
```javascript
// ❌ WRONG - Close after language change
const handleLanguageChange = async (langCode) => {
  await changeLanguage(langCode);
  setIsOpen(false);
};

// ✅ CORRECT - Close before language change
const handleLanguageChange = async (langCode) => {
  setIsOpen(false);
  await changeLanguage(langCode);
};
```

### Fix #6: Early Return in useEffect
```javascript
// ❌ WRONG - Conditional logic inside
useEffect(() => {
  if (isOpen) {
    // logic here
  }
}, [isOpen]);

// ✅ CORRECT - Early return
useEffect(() => {
  if (!isOpen) return;
  // logic here
}, [isOpen]);
```

## 🎯 The Complete Fixed Component Pattern

```javascript
export const LanguageSelector = ({ className = '', buttonClassName = '', iconClassName = 'w-5 h-5' }) => {
  const { currentLanguage, changeLanguage, getSupportedLanguages, isLoading } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handler for button click
  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  // Handler for language change
  const handleLanguageChange = async (langCode) => {
    setIsOpen(false);
    await changeLanguage(langCode);
  };

  // Click-outside handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // ... rest of component
};
```

## 🐛 Common Symptoms

If you see these issues, apply the fixes above:

1. **Dropdown doesn't open** → Check button click handler, ensure `type="button"`
2. **Dropdown closes immediately** → Use `mousedown` instead of `click`
3. **Dropdown hidden behind other elements** → Increase z-index to `z-[9999]`
4. **Touch doesn't work on mobile** → Add `touchstart` event listener
5. **Language doesn't change** → Check if `changeLanguage` is being called
6. **UI jank when switching** → Close dropdown before calling `changeLanguage`

## ✅ Testing Checklist

- [ ] Dropdown opens when clicking button
- [ ] Dropdown closes when clicking outside
- [ ] Dropdown closes when pressing Escape
- [ ] Language changes when selecting option
- [ ] Works on desktop (mouse)
- [ ] Works on mobile (touch)
- [ ] Dropdown is always visible (not hidden behind other elements)
- [ ] No console errors

## 📝 Files to Check

When debugging translation toggle issues:

1. `src/contexts/TranslationContext.jsx` - Main component
2. `src/components/layout/Header.jsx` - Usage in header
3. `src/data/translations/*.json` - Translation files
4. Browser console - Check for errors

## 🚀 Prevention

To prevent this from recurring:

1. **Copy-paste the complete pattern** above when recreating
2. **Don't optimize prematurely** - the pattern works, keep it
3. **Test on both desktop and mobile** before committing
4. **Reference this guide** during code review

---

**Last Updated:** December 29, 2025  
**Related Documentation:** TRANSLATION_TOGGLE_FIX.md
