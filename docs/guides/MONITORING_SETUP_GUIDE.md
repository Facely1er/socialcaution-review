# Monitoring Setup Guide - SocialCaution

This guide helps you set up comprehensive monitoring for the SocialCaution platform in production.

---

## 1. Error Tracking with Sentry (Recommended)

### Setup Steps

1. **Create Sentry Account**
   - Go to https://sentry.io/signup/
   - Create a new organization and project
   - Select "React" as the platform

2. **Get Your DSN**
   - In Sentry dashboard, go to Settings → Projects → Your Project → Client Keys (DSN)
   - Copy the DSN (format: `https://xxxxx@sentry.io/xxxxx`)

3. **Configure Environment Variable**
   ```bash
   VITE_REACT_APP_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
   ```

4. **Set Performance Sample Rate** (Optional)
   ```bash
   VITE_REACT_APP_PERFORMANCE_SAMPLE_RATE=0.1  # 10% of transactions
   ```

5. **Verify Integration**
   - The app already has Sentry integration in `src/utils/errorTracking.js`
   - After deployment, trigger a test error to verify it's working
   - Check Sentry dashboard for incoming events

### Sentry Features to Configure

- [ ] **Alerts**: Set up alerts for error rates
- [ ] **Releases**: Configure release tracking
- [ ] **Performance Monitoring**: Enable performance tracking
- [ ] **User Context**: Add user information to errors
- [ ] **Source Maps**: Upload source maps for better error tracking

---

## 2. Analytics with Google Analytics (Optional)

### Setup Steps

1. **Create GA4 Property**
   - Go to https://analytics.google.com/
   - Create a new GA4 property
   - Get your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Configure Environment Variable**
   ```bash
   VITE_REACT_APP_GA_ID=G-XXXXXXXXXX
   ```

3. **Verify Tracking**
   - After deployment, visit your site
   - Check Google Analytics Real-Time reports
   - Verify events are being tracked

### Analytics Events to Monitor

- Page views
- User interactions
- Assessment completions
- Language switches
- Theme changes
- Error occurrences

---

## 3. Uptime Monitoring

### Recommended Services

1. **UptimeRobot** (Free tier available)
   - Monitor homepage availability
   - Set up alerts for downtime
   - Monitor API endpoints (if applicable)

2. **Pingdom** (Paid)
   - Advanced monitoring features
   - Real user monitoring
   - Transaction monitoring

3. **StatusCake** (Free tier available)
   - Website monitoring
   - SSL certificate monitoring
   - Performance monitoring

### Setup Checklist

- [ ] Set up uptime monitoring for production URL
- [ ] Configure alert notifications (email/SMS/Slack)
- [ ] Set monitoring interval (recommended: 5 minutes)
- [ ] Test alert system

---

## 4. Performance Monitoring

### Core Web Vitals

Monitor these metrics:

1. **Largest Contentful Paint (LCP)**
   - Target: < 2.5 seconds
   - Monitor via Google Search Console or PageSpeed Insights

2. **First Input Delay (FID)**
   - Target: < 100 milliseconds
   - Monitor via Google Search Console

3. **Cumulative Layout Shift (CLS)**
   - Target: < 0.1
   - Monitor via Google Search Console

### Tools

- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/
- **Lighthouse CI**: Automated performance testing

### Setup Checklist

- [ ] Set up Core Web Vitals monitoring
- [ ] Configure performance budgets
- [ ] Set up alerts for performance degradation
- [ ] Regular performance audits

---

## 5. Log Monitoring

### Application Logs

If using server-side functionality:

1. **Netlify Functions Logs**
   - Access via Netlify Dashboard → Functions → Logs
   - Monitor for errors and performance issues

2. **Vercel Logs**
   - Access via Vercel Dashboard → Project → Logs
   - Real-time log streaming available

### Log Aggregation (Optional)

For advanced log management:

- **LogRocket**: Session replay and log aggregation
- **Datadog**: Comprehensive logging and monitoring
- **New Relic**: Application performance monitoring

---

## 6. Security Monitoring

### Security Headers

Verify security headers are present:
- Test at https://securityheaders.com/
- Check for: CSP, HSTS, X-Frame-Options, etc.

### Vulnerability Scanning

- [ ] Set up automated dependency scanning (Dependabot)
- [ ] Regular security audits (`npm audit`)
- [ ] Monitor security advisories
- [ ] Set up alerts for critical vulnerabilities

---

## 7. User Feedback Monitoring

### Tools

1. **Hotjar** (Optional)
   - Heatmaps and session recordings
   - User feedback widgets
   - Conversion funnels

2. **Google Analytics User Feedback**
   - In-app feedback forms
   - User satisfaction surveys

### Setup Checklist

- [ ] Set up user feedback collection
- [ ] Monitor user satisfaction metrics
- [ ] Track feature usage
- [ ] Analyze user behavior patterns

---

## 8. Monitoring Dashboard

### Recommended Setup

Create a monitoring dashboard with:

1. **Error Rates**: Track error frequency and trends
2. **Performance Metrics**: Page load times, Core Web Vitals
3. **User Metrics**: Active users, sessions, conversions
4. **System Health**: Uptime, response times, availability

### Tools for Dashboards

- **Grafana**: Custom dashboards
- **Datadog**: Comprehensive monitoring
- **New Relic**: Application monitoring
- **Custom Dashboard**: Build your own with APIs

---

## 9. Alert Configuration

### Critical Alerts

Set up alerts for:

- [ ] **High Error Rate**: > 5% error rate
- [ ] **Downtime**: Site unavailable
- [ ] **Performance Degradation**: LCP > 4 seconds
- [ ] **Security Issues**: Critical vulnerabilities
- [ ] **High Traffic**: Unusual traffic spikes

### Alert Channels

- Email notifications
- SMS alerts (for critical issues)
- Slack/Discord webhooks
- PagerDuty (for on-call)

---

## 10. Regular Monitoring Tasks

### Daily

- [ ] Check error rates
- [ ] Review performance metrics
- [ ] Monitor user feedback

### Weekly

- [ ] Review security alerts
- [ ] Analyze performance trends
- [ ] Review user analytics
- [ ] Check dependency updates

### Monthly

- [ ] Comprehensive security audit
- [ ] Performance optimization review
- [ ] User satisfaction analysis
- [ ] Cost optimization review

---

## Quick Start Checklist

- [ ] Set up Sentry for error tracking
- [ ] Configure Google Analytics (if using)
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring
- [ ] Set up security monitoring
- [ ] Configure alerts
- [ ] Create monitoring dashboard
- [ ] Test all monitoring systems
- [ ] Document monitoring procedures

---

## Support

For issues with monitoring setup:

1. Check service documentation
2. Review environment variable configuration
3. Verify API keys and tokens are correct
4. Test in staging environment first
5. Check browser console for errors

---

*Last Updated: November 2025*

