'use client';

import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

// Import components
// Using relative imports instead of path aliases
import Breadcrumbs from '../../../components/Breadcrumbs';
import ShareButtons from '../../../components/ShareButtons';

// Import CMS services
// Using relative imports instead of path aliases
import { getArticle, getRelated } from '../../../../lib/cms';
import { formatDate } from '../../../../lib/utils';
import { Article } from '../../../../types';

// Import direct API implementation
import { getArticleDirect, getRelatedDirect } from './api-config';

// Import debugging functions
import { getRawArticleData, extractContentFromBlocks } from './debug';

// Temporary mock data until CMS is fully set up
const articles = {
  'science-of-intermittent-fasting': {
    title: 'The Science of Intermittent Fasting',
    excerpt: 'Discover how intermittent fasting can improve longevity markers and metabolic health.',
    imageSrc: '/images/placeholder-article.svg',
    category: 'Nutrition',
    date: 'May 1, 2025',
    author: 'Dr. Jane Smith',
    authorImage: '/images/placeholder-article.svg',
    authorBio: 'PhD in Nutritional Sciences with a focus on metabolic health and longevity.',
    content: `
      <h2>What is Intermittent Fasting?</h2>
      <p>Intermittent fasting (IF) is an eating pattern that cycles between periods of fasting and eating. It doesn't specify which foods you should eat, but rather when you should eat them. In this respect, it's not a diet in the conventional sense but more accurately described as an eating pattern.</p>

      <p>Common intermittent fasting methods involve daily 16-hour fasts or fasting for 24 hours, twice per week. These methods have gained significant popularity in recent years, particularly in the longevity and health optimization communities.</p>

      <h2>The Science Behind Intermittent Fasting</h2>
      <p>When you fast, several things happen in your body on the cellular and molecular level. For example, your body adjusts hormone levels to make stored body fat more accessible and initiates important cellular repair processes. Here are some of the changes that occur in your body during fasting:</p>

      <ul>
        <li><strong>Insulin levels drop significantly</strong>, which facilitates fat burning</li>
        <li><strong>Human Growth Hormone (HGH) levels increase</strong>, which has benefits for fat loss and muscle gain</li>
        <li><strong>Cellular repair processes begin</strong>, including autophagy, where cells digest and remove old and dysfunctional proteins</li>
        <li><strong>Gene expression changes</strong>, related to longevity and protection against disease</li>
      </ul>

      <h2>Intermittent Fasting and Longevity</h2>
      <p>Research in animals has shown that intermittent fasting can extend lifespan. While human studies on lifespan are obviously difficult to conduct, the available evidence suggests that IF may have powerful benefits for metabolic health and potentially for longevity.</p>

      <p>Studies have shown that intermittent fasting can improve various health markers associated with longevity:</p>

      <ul>
        <li>Reduced inflammation</li>
        <li>Improved insulin sensitivity</li>
        <li>Lower blood pressure</li>
        <li>Improved lipid profiles</li>
        <li>Enhanced cellular stress resistance</li>
        <li>Activation of cellular cleansing processes (autophagy)</li>
      </ul>

      <h2>Popular Intermittent Fasting Methods</h2>
      <p>There are several different ways to do intermittent fasting, all of which involve splitting the day or week into eating and fasting periods. During the fasting periods, you eat either very little or nothing at all.</p>

      <p>These are the most popular methods:</p>

      <ul>
        <li><strong>The 16/8 Method</strong>: Fast for 16 hours each day, for example by only eating between noon and 8 pm.</li>
        <li><strong>Eat-Stop-Eat</strong>: Once or twice a week, don't eat anything from dinner one day until dinner the next day (a 24-hour fast).</li>
        <li><strong>The 5:2 Diet</strong>: During 2 days of the week, eat only about 500–600 calories.</li>
        <li><strong>Alternate-Day Fasting</strong>: Fast every other day, either by not eating anything or only eating a few hundred calories.</li>
      </ul>

      <h2>Is Intermittent Fasting Right for You?</h2>
      <p>While intermittent fasting has shown promising results in scientific studies, it's not for everyone. People who are underweight, have a history of eating disorders, are pregnant or breastfeeding, or have certain medical conditions should not attempt intermittent fasting without consulting with a healthcare professional.</p>

      <p>Additionally, the long-term effects of intermittent fasting are still being studied. As with any significant change to your diet or lifestyle, it's best to approach intermittent fasting with a well-informed and cautious mindset.</p>

      <h2>Conclusion</h2>
      <p>Intermittent fasting is a powerful dietary intervention that can have numerous benefits for your body and brain. It can help you lose weight, improve metabolic health, and may even help you live longer. However, it's not a one-size-fits-all solution, and what works for one person may not work for another.</p>

      <p>If you're interested in trying intermittent fasting, start with a simple protocol like the 16/8 method, and see how your body responds. Remember to focus on nutritious, whole foods during your eating periods, and stay well-hydrated during your fasting periods.</p>
    `,
    tags: ['intermittent fasting', 'nutrition', 'metabolic health', 'longevity', 'autophagy'],
    relatedArticles: [
      'mediterranean-diet-longevity',
      'caloric-restriction-benefits-risks',
      'protein-intake-healthy-aging'
    ]
  },
  // Additional articles would be defined here
};

export default function ArticlePage() {
  const params = useParams();
  const locale = params.locale as string;
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        console.log('Article page: Fetching article with slug', slug);

        // Try to fetch raw article data for debugging first
        try {
          console.log('Article page: Using debug function to fetch raw article data');
          const rawArticleData = await getRawArticleData(slug, locale);

          if (rawArticleData) {
            console.log('Article page: Raw article data received');

            // Create a processed article object
            const processedArticle = {
              id: rawArticleData.id,
              title: '',
              excerpt: '',
              content: '',
              slug: slug,
              publishedAt: null,
              image: null,
              category: null
            };

            // Extract data based on structure
            if (rawArticleData.attributes) {
              // Standard Strapi v4 structure
              const attrs = rawArticleData.attributes;
              processedArticle.title = attrs.title || '';
              processedArticle.excerpt = attrs.description || '';
              processedArticle.slug = attrs.slug || slug;
              processedArticle.publishedAt = attrs.publishedAt || null;

              // Extract content from blocks
              if (attrs.blocks && Array.isArray(attrs.blocks)) {
                processedArticle.content = extractContentFromBlocks(attrs.blocks);
                processedArticle.blocks = attrs.blocks;
              }

              // Get image
              if (attrs.cover && attrs.cover.data && attrs.cover.data.attributes) {
                let imageUrl = attrs.cover.data.attributes.url || '';
                if (imageUrl.startsWith('/')) {
                  imageUrl = `https://special-acoustics-b9adb26838.strapiapp.com${imageUrl}`;
                }
                processedArticle.image = imageUrl;
              }

              // Get category
              if (attrs.category && attrs.category.data && attrs.category.data.attributes) {
                processedArticle.category = {
                  id: attrs.category.data.id,
                  name: attrs.category.data.attributes.name,
                  slug: attrs.category.data.attributes.slug
                };
              }
            } else {
              // Direct properties structure (new Strapi Cloud)
              processedArticle.title = rawArticleData.title || '';
              processedArticle.excerpt = rawArticleData.description || '';
              processedArticle.slug = rawArticleData.slug || slug;
              processedArticle.publishedAt = rawArticleData.publishedAt || null;

              // Extract content from blocks
              if (rawArticleData.blocks && Array.isArray(rawArticleData.blocks)) {
                processedArticle.content = extractContentFromBlocks(rawArticleData.blocks);
                processedArticle.blocks = rawArticleData.blocks;
              }

              // Get image
              if (rawArticleData.cover) {
                let imageUrl = '';
                if (typeof rawArticleData.cover === 'string') {
                  imageUrl = rawArticleData.cover;
                } else if (rawArticleData.cover.url) {
                  imageUrl = rawArticleData.cover.url;
                }

                if (imageUrl.startsWith('/')) {
                  imageUrl = `https://special-acoustics-b9adb26838.strapiapp.com${imageUrl}`;
                }

                processedArticle.image = imageUrl;
              }

              // Get category
              if (rawArticleData.category) {
                processedArticle.category = {
                  id: rawArticleData.category.id || 0,
                  name: rawArticleData.category.name || '',
                  slug: rawArticleData.category.slug || ''
                };
              }
            }

            console.log('Article page: Processed article data:', {
              id: processedArticle.id,
              title: processedArticle.title,
              contentLength: processedArticle.content?.length || 0,
              hasBlocks: !!processedArticle.blocks,
              blocksCount: processedArticle.blocks?.length || 0
            });

            setArticle(processedArticle);

            // Fetch related articles
            if (processedArticle.category?.id) {
              console.log('Article page: Fetching related articles');
              try {
                const related = await getRelatedDirect(
                  processedArticle.id,
                  processedArticle.category.id,
                  3,
                  locale
                );
                setRelatedArticles(related);
              } catch (relatedError) {
                console.error('Article page: Error fetching related articles:', relatedError);
              }
            }

            setIsLoading(false);
            return;
          }
        } catch (debugError) {
          console.error('Article page: Debug function failed:', debugError);
        }

        // Fall back to direct API if debug function fails
        try {
          console.log('Article page: Using direct API to fetch article');
          const articleData = await getArticleDirect(slug, locale);

          if (articleData) {
            console.log('Article page: Direct API returned article data');
            setArticle(articleData);

            // Fetch related articles using direct API
            if (articleData.id && articleData.category?.id) {
              console.log('Article page: Fetching related articles with direct API');
              const related = await getRelatedDirect(
                articleData.id,
                articleData.category.id,
                3,
                locale
              );
              setRelatedArticles(related);
            }

            setIsLoading(false);
            return;
          } else {
            console.log('Article page: No article from direct API, falling back to CMS service');
          }
        } catch (directApiError) {
          console.error('Article page: Direct API failed:', directApiError);
          console.log('Article page: Falling back to CMS service');
        }

        // Try to fetch from CMS as fallback
        try {
          console.log('Article page: Using CMS service to fetch article');
          const articleData = await getArticle(slug, locale);

          if (articleData) {
            console.log('Article page: CMS service returned article data');
            setArticle(articleData);

            // Fetch related articles
            if (articleData.id && articleData.category?.id) {
              console.log('Article page: Fetching related articles with CMS service');
              const related = await getRelated(
                String(articleData.id),
                articleData.category.slug,
                3,
                locale
              );
              setRelatedArticles(related);
            }

            setIsLoading(false);
            return;
          } else {
            console.log('Article page: No article from CMS service, falling back to mock data');
          }
        } catch (cmsError) {
          console.log('Article page: CMS service failed, falling back to mock data', cmsError);
        }

        // Fallback to mock data if both API and CMS fetch fail
        console.log('Article page: Checking mock data for slug', slug);
        if (articles[slug as keyof typeof articles]) {
          console.log('Article page: Found mock data for slug', slug);
          setArticle(articles[slug as keyof typeof articles] as any);
        } else {
          console.log('Article page: No mock data found for slug', slug);
          setError('Article not found');
        }
      } catch (err) {
        console.error('Article page: Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug, locale]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-gray-600">{error || 'Article not found'}</p>
        <Link href={`/${locale}`} className="mt-4 inline-block text-blue-600 hover:text-blue-800">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Article Header - Improved for better readability */}
      <div className="relative bg-gray-900 text-white py-24">
        {/* Darker overlay for better text readability */}
        <div className="absolute inset-0 z-0 opacity-70">
          <Image
            src={article.image || article.imageSrc || '/images/placeholder-article.svg'}
            alt={article.title}
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 17%' }}
            unoptimized={article.image?.startsWith('http')}
          />
        </div>

        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Category and date */}
            <div className="mb-6">
              <Link
                href={`/${locale}/${article.category?.slug || (typeof article.category === 'string' ? article.category.toLowerCase() : 'uncategorized')}`}
                className="inline-block bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full"
              >
                {article.category?.name || (typeof article.category === 'string' ? article.category : 'Uncategorized')}
              </Link>
              <div className="mt-3 text-gray-300">
                {article.publishedAt ? formatDate(article.publishedAt, locale) : ''}
              </div>
            </div>

            {/* Title with better spacing */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt with better width constraint for readability */}
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              {article.excerpt}
            </p>

            {/* Author info removed as requested */}
          </div>
        </div>
      </div>

      {/* Breadcrumbs - Styled to match the new design */}
      <div className="bg-gray-100 py-3 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Articles', href: `/${locale}/articles` },
              { label: article.category?.name || 'Category', href: `/${locale}/${article.category?.slug || 'uncategorized'}` },
              { label: article.title }
            ]}
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Wider for better readability */}
          <div className="lg:col-span-8 lg:col-start-3">
            {/* Article content with improved readability */}
            <article className="prose prose-lg max-w-none article-content" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : article.blocks && Array.isArray(article.blocks) ? (
                // Handle blocks directly if content is not available
                <div>
                  {article.blocks.map((block, index) => {
                    console.log(`Rendering block ${index}:`, block.__component);

                    if (block.__component === 'shared.rich-text' && block.body) {
                      return <div key={index} dangerouslySetInnerHTML={{ __html: block.body }} />;
                    } else if (block.__component === 'shared.media' && block.media) {
                      let imageUrl = '';
                      let altText = 'Article image';

                      if (block.media.data && block.media.data.attributes) {
                        imageUrl = block.media.data.attributes.url;
                        altText = block.media.data.attributes.alternativeText || 'Article image';
                      } else if (block.media.url) {
                        imageUrl = block.media.url;
                      } else if (typeof block.media === 'string') {
                        imageUrl = block.media;
                      }

                      if (imageUrl.startsWith('/')) {
                        imageUrl = `https://special-acoustics-b9adb26838.strapiapp.com${imageUrl}`;
                      }

                      console.log(`Block ${index} image URL:`, imageUrl);

                      return (
                        <div key={index} className="my-8">
                          <img
                            src={imageUrl}
                            alt={altText}
                            className="w-full rounded-lg"
                          />
                        </div>
                      );
                    } else if (block.__component === 'shared.quote') {
                      return (
                        <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-8">
                          {block.quote}
                        </blockquote>
                      );
                    } else {
                      console.log(`Unknown block component: ${block.__component}`);
                      return (
                        <div key={index} className="my-4 p-4 bg-gray-100 rounded">
                          <p className="text-sm text-gray-500">Unsupported content block: {block.__component}</p>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                  <h3 className="text-yellow-800 font-bold mb-2">Content Not Available</h3>
                  <p className="text-yellow-700">
                    The content for this article could not be loaded. This might be due to:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-yellow-700">
                    <li>The article content is not available in the CMS</li>
                    <li>There was an error processing the content format</li>
                  </ul>
                  <p className="mt-4 text-yellow-700">
                    Please check the article in the Strapi CMS and ensure it has content.
                  </p>
                  <div className="mt-4 p-4 bg-gray-100 rounded">
                    <p className="font-mono text-sm text-gray-700">
                      Debug info: Content field type: {typeof article.content},
                      Has blocks: {article.blocks ? 'Yes' : 'No'},
                      Article structure: {JSON.stringify(Object.keys(article))}
                    </p>
                  </div>
                </div>
              )}
            </article>

            {/* Tags */}
            {(article.tags && article.tags.length > 0) && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(article.tags) && article.tags.map((tag: any, index: number) => (
                    <Link
                      key={index}
                      href={`/${locale}/tags/${tag.slug || tag.replace(/\s+/g, '-')}`}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.name || tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio removed as requested */}

            {/* Share buttons - moved to bottom of article for better UX */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Share This Article</h3>
                <ShareButtons
                  title={article.title}
                  description={article.excerpt}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Related Articles - Full width and connected to footer */}
      <section className="bg-gray-100 py-12 mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Related Articles</h2>

          <div className="max-w-6xl mx-auto">
            {relatedArticles && relatedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                    <div className="relative h-48 group">
                      <Link href={`/${locale}/articles/${relatedArticle.slug}`} className="block w-full h-full">
                        <Image
                          src={relatedArticle.image || '/images/placeholder-article.svg'}
                          alt={relatedArticle.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </Link>
                    </div>
                    <Link href={`/${locale}/articles/${relatedArticle.slug}`} className="block p-6">
                      <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">{relatedArticle.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{formatDate(relatedArticle.publishedAt, locale)}</p>
                      <p className="text-gray-600 line-clamp-3">{relatedArticle.excerpt}</p>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              // Fallback to mock related articles if CMS data is not available
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Fallback related articles would be shown here */}
                <div className="text-center py-4">
                  <p className="text-gray-500">No related articles available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
