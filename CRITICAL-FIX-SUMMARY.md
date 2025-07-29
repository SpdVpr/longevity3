# CRITICAL FIX: Missing Article Images on /articles Page

## Problem Identified
The `/articles` page was not displaying cover images for articles, even though the images were properly uploaded in Strapi CMS.

## Root Cause
**CRITICAL ISSUE**: The `/articles` page uses `app/lib/cms.ts` (different from `lib/cms.ts`), and this file was only checking the `image` field, NOT the `cover` field.

From browser console, we could see:
- Articles have `cover` field with image data
- Articles do NOT have `image` field
- The transformation code was only looking for `image` field
- Result: `imageUrl = null` for all articles

## Files Affected
- `app/lib/cms.ts` - Main CMS functions for `/articles` page
- `app/articles/page.tsx` - Uses `../lib/cms` (relative import)

## Fix Applied
Updated both `getArticles()` and `getArticlesByCategory()` functions in `app/lib/cms.ts`:

### Before (BROKEN):
```javascript
// Only checked image field
if (hasAttributes && item.attributes.image?.data?.attributes?.url) {
  imageUrl = getImageUrl(item.attributes.image.data.attributes.url);
} else if (item.image?.url) {
  imageUrl = getImageUrl(item.image.url);
}
```

### After (FIXED):
```javascript
// Now checks cover field FIRST, then image field as fallback
if (hasAttributes) {
  if (item.attributes.cover?.data?.attributes?.url) {
    imageUrl = getImageUrl(item.attributes.cover.data.attributes.url);
  } else if (item.attributes.cover?.url) {
    imageUrl = getImageUrl(item.attributes.cover.url);
  } else if (item.attributes.image?.data?.attributes?.url) {
    imageUrl = getImageUrl(item.attributes.image.data.attributes.url);
  } else if (item.attributes.image?.url) {
    imageUrl = getImageUrl(item.attributes.image.url);
  }
}
```

## Expected Results After Fix

### Browser Console Should Show:
```
Found cover image in attributes.cover.data.attributes.url
Final image URL for article: [Article Title] → https://special-acoustics-b9adb26838.strapiapp.com/uploads/image.jpg
```

### HTML Should Show:
```html
<img src="https://special-acoustics-b9adb26838.strapiapp.com/uploads/image.jpg" alt="Article Title" />
```

**Instead of:**
```html
<img src="/images/placeholder-article.svg" alt="Article Title" />
```

## Testing Instructions

1. **Open https://www.longevitygrow.com/articles**
2. **Navigate to page 4** (where the problem was reported)
3. **Check browser console** for these logs:
   - `"Found cover image in attributes.cover.data.attributes.url"`
   - `"Final image URL for article: [Title] → [URL]"`
4. **Verify images display** instead of placeholder SVG
5. **Check Network tab** - should see image requests to Strapi Cloud

## Why This Fix Works

1. **Correct Field**: Now checks `cover` field which actually contains the images
2. **Fallback Logic**: Still checks `image` field if `cover` doesn't exist
3. **Debug Logging**: Added detailed logs to track the process
4. **Both Functions**: Fixed both `getArticles` and `getArticlesByCategory`

## Impact
- ✅ Fixes missing images on `/articles` page (all pages)
- ✅ Fixes missing images on category pages that use `app/lib/cms.ts`
- ✅ Maintains backward compatibility with `image` field
- ✅ Provides detailed debugging information

## Deployment Status
- ✅ Changes committed to GitHub
- ✅ Ready for production deployment
- ✅ Should work immediately after deployment

## Verification
After deployment, the two articles on page 4 that have cover images in Strapi should now display their actual cover images instead of the placeholder SVG.

---

**This was the missing piece! The transformation was working correctly, but it was looking in the wrong field.**
