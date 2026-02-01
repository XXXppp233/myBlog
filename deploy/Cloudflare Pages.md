# Cloudflare Pages

Cloudflare Pages is a JAMstack platform for frontend developers to collaborate and deploy websites.

## Prerequisites

1.  A GitHub repository containing your static content or frontend application.
2.  A Cloudflare account.

## Steps

### 1. Connect Your Repository

1.  Log in to the **Cloudflare Dashboard**.
2.  Navigate to **Workers & Pages** > **Pages**.
3.  Click **Connect to Git**.
4.  Select your GitHub account and the specific repository you want to deploy.

### 2. Configure Build Settings

For this Vue.js project (built with Vite), use the following settings:

*   **Project Name**: `my-blog` (or your preference)
*   **Production Branch**: `Cloudflare` (or `main`)
*   **Framework Preset**: `Vue` or `Vite`
*   **Build Command**: `npm run build`
*   **Build Output Directory**: `dist`

### 3. Deploy

Click **Save and Deploy**. Cloudflare will start the build process. Once complete, your site will be available at a `*.pages.dev` subdomain.

## Custom Domains

You can add a custom domain (e.g., `blog.example.com`) in the **Custom Domains** tab of your Pages project settings. Cloudflare will automatically handle the SSL certificate.
