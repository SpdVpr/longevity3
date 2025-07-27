# Security Guide - API Key Management

## 🚨 IMMEDIATE ACTION REQUIRED

GitGuardian has detected exposed API keys in your repository. **You must take immediate action:**

### 1. Revoke Exposed API Keys

**Perplexity API Key:**
- Go to your Perplexity account settings
- Revoke the key: `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`
- Generate a new API key

**Strapi API Tokens:**
- Go to your Strapi admin panel
- Navigate to Settings > API Tokens
- Revoke all exposed tokens
- Generate new API tokens

### 2. Environment Variables Setup

Create a `.env.local` file in your website directory with your new API keys:

```env
# Strapi CMS Configuration
NEXT_PUBLIC_STRAPI_API_URL=https://special-acoustics-b9adb26838.strapiapp.com
STRAPI_API_TOKEN=your_new_strapi_api_token_here

# Perplexity AI Configuration
PERPLEXITY_API_KEY=your_new_perplexity_api_key_here

# NextAuth Configuration
NEXTAUTH_URL=https://www.longevitygrow.com
NEXTAUTH_SECRET=your_nextauth_secret_here

# Database Configuration
DATABASE_URL=your_database_url_here

# Preview Mode
PREVIEW_SECRET=your_preview_secret_here

# Webhook Configuration
STRAPI_WEBHOOK_SECRET=your_webhook_secret_here

# API Security
API_SECRET_KEY=your_api_secret_key_here
```

### 3. Vercel Environment Variables

Set these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable from your `.env.local` file
4. Make sure to set the correct environment (Production, Preview, Development)

### 4. Git Security

Add these files to your `.gitignore` to prevent future exposure:

```gitignore
# Environment variables
.env
.env.local
.env.production
.env.staging

# API keys and secrets
**/api-keys.json
**/secrets.json
```

## 🔒 Security Best Practices

### Never Commit These Items:
- API keys or tokens
- Database passwords
- JWT secrets
- Private keys
- OAuth client secrets

### Use Environment Variables:
- Store all sensitive data in environment variables
- Use different keys for different environments
- Rotate keys regularly

### Code Review:
- Always review code before committing
- Use tools like GitGuardian to scan for secrets
- Set up pre-commit hooks to prevent secret commits

## 📋 Files Fixed

The following files have been updated to use environment variables instead of hardcoded keys:

- `website/README-article-generation.md`
- `website/docs/automatic-article-generation.md`
- `website/app/strapi-config.js`
- `website/config.js`
- `website/lib/api.ts`
- `website/app/env.js`
- `website/app/[locale]/articles/[slug]/api-config.js`
- `website/app/[locale]/articles/api-config.js`
- `website/app/[locale]/biomarkers/direct-api.ts`
- `website/app/lib/cms.ts`
- `website/public/override-api-url.js`
- `website/app/layout.tsx`
- `website/vercel.json`
- `website/next.config.js`
- `website/app/[locale]/articles/[slug]/direct-content.js`
- `website/app/[locale]/articles/[slug]/debug.js`
- `website/app/[locale]/articles/[slug]/direct-render.js`
- `website/test-biomarkers-api.js`

## ⚠️ Next Steps

1. **Immediately revoke all exposed API keys**
2. **Generate new API keys**
3. **Set up environment variables locally and on Vercel**
4. **Test your application to ensure it still works**
5. **Commit and push the security fixes**
6. **Set up monitoring for future secret exposure**

## 🔍 Monitoring

Consider setting up:
- GitGuardian for continuous secret scanning
- Dependabot for dependency vulnerability alerts
- Regular security audits of your codebase
