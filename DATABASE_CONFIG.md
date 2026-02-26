# Database Configuration

## Supabase Project Details

**Project URL**: `https://nuwfdvwqiynzhbbsqagw.supabase.co`  
**Project Reference**: `nuwfdvwqiynzhbbsqagw`

## Connection Strings

### PostgreSQL Direct Connection
```
postgresql://postgres:K1551d0ug0u@db.nuwfdvwqiynzhbbsqagw.supabase.co:5432/postgres
```

### Supabase API
- **URL**: `https://nuwfdvwqiynzhbbsqagw.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDQxMjQsImV4cCI6MjA3NzIyMDEyNH0.9X_HxnSYDFqzxvzEUMx1dGg4GPHyw13oQfxpCXprsX8`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY0NDEyNCwiZXhwIjoyMDc3MjIwMTI0fQ.bWa5K7YIi3KW_4FGdnC0Y63-B5UICFTx9n0H1Vg_JVs`

## Environment Variables for Netlify

### Frontend (Public - Safe to expose)
```bash
VITE_SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDQxMjQsImV4cCI6MjA3NzIyMDEyNH0.9X_HxnSYDFqzxvzEUMx1dGg4GPHyw13oQfxpCXprsX8
```

### Backend/Webhook (Private - NEVER expose)
```bash
SUPABASE_URL=https://nuwfdvwqiynzhbbsqagw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51d2ZkdndxaXluemhiYnNxYWd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY0NDEyNCwiZXhwIjoyMDc3MjIwMTI0fQ.bWa5K7YIi3KW_4FGdnC0Y63-B5UICFTx9n0H1Vg_JVs
```

## Security Notes

⚠️ **IMPORTANT**:
- **Anon Key**: Safe to expose in frontend code (has RLS protection)
- **Service Role Key**: **NEVER** expose in frontend - only use in server-side functions (webhook)
- **PostgreSQL Password**: Keep secure, only use for direct database access

## Next Steps

1. ✅ Add environment variables to Netlify
2. ✅ Apply database migrations
3. ✅ Test webhook integration
4. ✅ Verify premium features work

