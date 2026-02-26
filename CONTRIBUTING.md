# Contributing to SocialCaution

Thank you for your interest in contributing to SocialCaution! We're excited to work with you to improve privacy education and protection for everyone.

## 🌟 Ways to Contribute

- **Report Bugs** - Help us identify and fix issues
- **Suggest Features** - Propose new privacy tools or improvements
- **Improve Documentation** - Help make our guides clearer and more comprehensive
- **Submit Code** - Fix bugs, add features, or optimize performance
- **Privacy Research** - Contribute privacy expertise and best practices
- **Translation** - Help make privacy accessible in more languages

## 🚀 Getting Started

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/socialcaution.git
   cd socialcaution
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm run test
   ```

### Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make Your Changes**
   - Write clear, focused commits
   - Add tests for new features
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add new privacy assessment question"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use our PR template
   - Describe your changes clearly
   - Link to related issues

## 📝 Code Guidelines

### JavaScript/TypeScript Standards

- **Use TypeScript** for new code when possible
- **Follow ESLint rules** - run `npm run lint`
- **Write descriptive variable names**
- **Comment complex logic**
- **Keep functions small and focused**

### React Component Guidelines

```jsx
// ✅ Good: Clear, focused component
const PrivacyTip = ({ tip, level, onDismiss }) => {
  return (
    <div className={`privacy-tip privacy-tip--${level}`}>
      <p>{tip.content}</p>
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
};

// ❌ Avoid: Large, unfocused components
const MegaComponent = () => {
  // 200+ lines of mixed concerns
};
```

### CSS/Styling Guidelines

- **Use Tailwind CSS** for styling
- **Follow mobile-first responsive design**
- **Ensure dark mode compatibility**
- **Maintain accessibility standards**
- **Use semantic color names**

### Privacy-First Development

- **Never collect personal data** without explicit consent
- **Default to privacy-protective settings**
- **Validate all user inputs**
- **Use secure coding practices**
- **Document privacy implications**

## 🧪 Testing Standards

### Unit Tests
```javascript
describe('PersonaDetectionEngine', () => {
  it('should detect cautious parent persona', () => {
    const results = { familyConcerns: true, childSafety: 'high' };
    const persona = PersonaDetectionEngine.detect(results);
    expect(persona.primary).toBe('cautious-parent');
  });
});
```

### Integration Tests
- Test complete user workflows
- Verify assessment flow
- Check personalization accuracy

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation

## 📚 Documentation Standards

### Code Documentation
```javascript
/**
 * Calculates privacy risk score based on assessment responses
 * @param {Object} responses - User assessment responses
 * @param {string} responses.passwordSecurity - Password management approach
 * @param {string} responses.socialMediaUse - Social media usage level
 * @returns {number} Risk score from 0-100 (lower is higher risk)
 */
function calculateRiskScore(responses) {
  // Implementation...
}
```

### Component Documentation
- Use JSDoc for component props
- Include usage examples
- Document accessibility features
- Explain privacy implications

## 🐛 Bug Reports

### Before Reporting
- Search existing issues
- Try the latest version
- Test in different browsers

### Bug Report Template
```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**
1. Go to assessment page
2. Select 'Heavy' social media usage
3. Complete assessment
4. Notice incorrect persona detection

**Expected Behavior**
Should detect social-influencer persona

**Environment**
- Browser: Chrome 120
- OS: macOS 14
- Device: Desktop
```

## 💡 Feature Requests

### Before Requesting
- Check existing feature requests
- Consider privacy implications
- Think about user personas

### Feature Request Template
```markdown
**Feature Description**
Brief description of the proposed feature

**Privacy Persona**
Which personas would benefit most?

**Privacy Impact**
How does this affect user privacy?

**Implementation Ideas**
Optional technical suggestions
```

## 🔒 Security Guidelines

### Reporting Security Issues
- **DO NOT** create public issues for security vulnerabilities
- Email support@ermits.com
- Include detailed reproduction steps
- We'll respond within 24 hours

### Secure Coding Practices
- Validate and sanitize all inputs
- Use parameterized queries (when applicable)
- Implement proper error handling
- Follow OWASP guidelines

## 📖 Privacy Contribution Guidelines

### Privacy Content Standards
- **Evidence-based recommendations**
- **Keep content current** with law changes
- **Consider international users**
- **Use clear, non-technical language**
- **Cite authoritative sources**

### Assessment Question Guidelines
```javascript
// ✅ Good: Clear, actionable question
{
  id: 'password-manager-usage',
  question: 'How do you manage your passwords?',
  options: [
    { value: 'same', label: 'I use the same password everywhere' },
    { value: 'variations', label: 'I use variations of the same password' },
    { value: 'unique', label: 'I create unique passwords for important accounts' },
    { value: 'manager', label: 'I use a password manager for all accounts' }
  ],
  privacyImpact: 'high',
  explanation: 'Password reuse is the #1 cause of account takeovers'
}
```

## 🌍 Translation Guidelines

### Content Localization
- Maintain privacy law accuracy
- Consider cultural context
- Use inclusive language
- Test with native speakers

### Technical Translation
- Keep technical terms consistent
- Maintain UI layout compatibility
- Test responsiveness in target language

## 📋 Pull Request Process

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Tests pass (`npm run test`)
- [ ] TypeScript checks pass (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated if needed
- [ ] Privacy impact assessed
- [ ] Accessibility tested

### PR Review Process
1. **Automated Checks** - CI pipeline runs tests
2. **Code Review** - Maintainer reviews code quality
3. **Privacy Review** - Privacy implications assessed
4. **Testing** - Manual testing of changes
5. **Merge** - Approved PRs are merged

## 🏆 Recognition

We recognize contributors in several ways:
- **Contributors page** on our website
- **GitHub releases** mention notable contributions
- **Special recognition** for privacy research contributions
- **Early access** to new features

## 📞 Getting Help

- **Development Questions**: [GitHub Discussions](https://github.com/socialcaution/socialcaution/discussions)
- **Privacy Questions**: support@ermits.com
- **General Support**: support@ermits.com
- **Chat**: Join our contributor Discord (invite in discussions)

## 📄 License

By contributing to SocialCaution, you agree that your contributions will be licensed under the same MIT License that covers the project.

## 🙏 Thank You

Every contribution, no matter how small, helps make digital privacy more accessible and understandable. Thank you for being part of the privacy-first movement!

---

**Questions?** Don't hesitate to ask in [GitHub Discussions](https://github.com/socialcaution/socialcaution/discussions) or email us at support@ermits.com.