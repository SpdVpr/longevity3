# Strapi CMS Setup Guide

This document provides instructions for setting up and configuring the Strapi CMS for the Longevity Hub website.

## Table of Contents

1. [Installation](#installation)
2. [Content Types](#content-types)
3. [Roles and Permissions](#roles-and-permissions)
4. [API Configuration](#api-configuration)
5. [Webhooks](#webhooks)
6. [Internationalization](#internationalization)
7. [Media Library](#media-library)
8. [Preview Mode](#preview-mode)

## Installation

The Strapi CMS is installed in the `cms` directory of the project. To set it up:

```bash
# Navigate to the cms directory
cd cms

# Start the Strapi development server
npm run develop
```

The admin panel will be available at http://localhost:1337/admin

## Content Types

The following content types need to be created in Strapi:

### Article

- **Title** (Text, required)
- **Slug** (UID, required, based on title)
- **Content** (Rich Text, required)
- **Excerpt** (Text, required)
- **Image** (Media, required)
- **Category** (Relation, required, one-to-many with Category)
- **Tags** (Relation, many-to-many with Tag)
- **Author** (Relation, required, one-to-many with Author)
- **Featured** (Boolean, default: false)
- **Published At** (Date, required)

### Category

- **Name** (Text, required)
- **Slug** (UID, required, based on name)
- **Description** (Text, required)
- **Image** (Media, required)
- **Articles** (Relation, one-to-many with Article)

### Tag

- **Name** (Text, required)
- **Slug** (UID, required, based on name)
- **Articles** (Relation, many-to-many with Article)

### Author

- **Name** (Text, required)
- **Bio** (Text, required)
- **Email** (Email, required)
- **Avatar** (Media, required)
- **Articles** (Relation, one-to-many with Article)

## Roles and Permissions

Configure the following roles and permissions:

### Public Role

- **Article**: find, findOne
- **Category**: find, findOne
- **Tag**: find, findOne
- **Author**: find, findOne
- **Upload**: find, findOne

### Editor Role

- All permissions for Article, Category, Tag, and Author
- Limited permissions for User and Admin

### Admin Role

- All permissions

## API Configuration

Configure the API settings:

1. Go to Settings > API Tokens
2. Create a new API token with full access
3. Copy the token and add it to your `.env.local` file:

```
STRAPI_API_TOKEN=your-api-token
```

## Webhooks

Set up webhooks to invalidate the cache when content changes:

1. Go to Settings > Webhooks
2. Create a new webhook:
   - Name: Cache Invalidation
   - URL: https://your-website.com/api/strapi-webhook
   - Headers: Authorization: Bearer your-webhook-secret
   - Events: Select all entry and media events

Add the webhook secret to your `.env.local` file:

```
STRAPI_WEBHOOK_SECRET=your-webhook-secret
```

## Internationalization

Configure internationalization:

1. Go to Settings > Internationalization
2. Add the following locales:
   - English (en) - Default
   - Czech (cs)

3. For each content type, enable localization

## Media Library

Configure the media library:

1. Go to Settings > Media Library
2. Configure the following image sizes:
   - Thumbnail: 250x250
   - Small: 500x500
   - Medium: 750x750
   - Large: 1000x1000

## Preview Mode

Configure preview mode:

1. Go to Settings > Preview Button
2. Add a new preview configuration:
   - Name: Article Preview
   - URL: https://your-website.com/api/preview?secret=your-preview-secret&slug={slug}&type=article&locale={locale}

3. Add the preview secret to your `.env.local` file:

```
PREVIEW_SECRET=your-preview-secret
```

## Content Seeding

To seed initial content:

1. Create at least one author
2. Create the main categories:
   - Nutrition
   - Fitness
   - Mental Health
   - Biomarkers
   - Supplements

3. Create some tags
4. Create a few articles in each category

## Development Workflow

When developing locally:

1. Start the Next.js development server:
```bash
cd website
npm run dev
```

2. Start the Strapi development server:
```bash
cd cms
npm run develop
```

3. Access the Next.js site at http://localhost:3000
4. Access the Strapi admin panel at http://localhost:1337/admin
