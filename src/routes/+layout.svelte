<script lang="ts">
  import './layout.css';
  import { injectAnalytics } from '@vercel/analytics/sveltekit';
  import favicon from '$lib/assets/favicon.ico';
  import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
  import { ModeWatcher } from 'mode-watcher';
  import { page } from '$app/stores';

  let { children } = $props();

  injectAnalytics();

  const title = 'Endless Bee — Free Unlimited Spelling Bee Game';
  const description =
    'Play Endless Bee, a free unlimited word game inspired by NYT Spelling Bee. Find words using 7 letters, earn points, and reach Queen Bee status — no daily limit, play as many puzzles as you want.';
  const keywords =
    'spelling bee, NYT spelling bee, spelling bee game, word game, free spelling bee, unlimited spelling bee, daily word game';
</script>

<ModeWatcher />
<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="apple-touch-icon" href={appleTouchIcon} />
  <link rel="canonical" href={$page.url.origin} />

  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  <meta name="author" content="Endless Bee" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.origin} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:site_name" content="Endless Bee" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />

  <!-- Structured data -->
  {@html `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Endless Bee',
    description,
    url: $page.url.origin,
    applicationCategory: 'GameApplication',
    genre: 'Word Game',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    keywords: keywords,
  })}<\/script>`}
</svelte:head>
{@render children()}
