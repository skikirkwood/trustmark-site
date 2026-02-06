# Trustmark Website

A modern website built with Next.js, Contentful CMS, and Tailwind CSS. Features include Contentful Live Preview and Inspector Mode for real-time content editing.

## Features

- **Next.js 14** with Pages Router
- **Contentful CMS** integration with Live Preview
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Responsive Design** - Mobile-first approach
- **ISR** (Incremental Static Regeneration) for fast page loads

## Content Model

The following content types are configured in Contentful:

### Navigation
- **Navigation**: Site navigation with logo and menu items
- **Navigation Item**: Individual nav link with optional dropdown children

### Page Modules
- **Hero**: Full-width hero banner with headline, subheadline, and CTA
- **Quick Links**: Horizontal row of icon links (mobile banking, etc.)
- **Quick Link Item**: Individual quick link with icon
- **Feature Cards Section**: Grid of feature cards
- **Feature Card**: Card with image, title, description, and link
- **CTA Banner**: Full-width call-to-action banner
- **Article Grid**: Grid of article/resource cards
- **Article Card**: Individual article card

### Other
- **Footer**: Site footer with logo, link columns, and social links
- **Page**: Container for page content (slug, navigation, modules, footer)

## Setup

### Prerequisites

- Node.js 18+
- Contentful account with space
- Contentful API keys (Delivery and Preview)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd trustmark
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Contentful credentials:
```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_api_token
CONTENTFUL_PREVIEW_SECRET=your_preview_secret
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_space_id
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Creating Content

### Homepage Setup

1. In Contentful, create entries for your navigation items
2. Create a Navigation entry linking to those items
3. Create module entries (Hero, Feature Cards, etc.)
4. Create a Page entry with:
   - **Title**: "Home"
   - **Slug**: "home"
   - **Navigation**: Link to your Navigation entry
   - **Modules**: Add your module entries
   - **Footer**: Link to your Footer entry
5. Publish all entries

## Live Preview

This project supports Contentful Live Preview for real-time content editing.

### Setup in Contentful

1. Go to **Settings > Content preview**
2. Add a preview URL:
   ```
   https://your-domain.com/api/draft?secret=YOUR_PREVIEW_SECRET&slug={entry.fields.slug}
   ```
3. Replace `YOUR_PREVIEW_SECRET` with your `CONTENTFUL_PREVIEW_SECRET` value

### Inspector Mode

When in preview mode, hover over any content element to see a blue outline. Click to navigate directly to that field in Contentful's editor.

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx    # Header with mega-menu
│   ├── Hero.tsx          # Hero banner
│   ├── QuickLinks.tsx    # Quick link icons
│   ├── FeatureCards.tsx  # Feature cards grid
│   ├── CtaBanner.tsx     # CTA banner
│   ├── ArticleGrid.tsx   # Article cards grid
│   ├── Footer.tsx        # Site footer
│   └── ModuleRenderer.tsx # Dynamic module renderer
├── lib/
│   └── contentful.ts     # Contentful client & helpers
├── pages/
│   ├── _app.tsx          # App wrapper with Live Preview
│   ├── index.tsx         # Homepage
│   ├── [slug].tsx        # Dynamic pages
│   └── api/
│       ├── draft.ts      # Enable preview mode
│       └── disable-draft.ts # Disable preview mode
├── styles/
│   └── globals.css       # Global styles
└── types/
    └── contentful.ts     # TypeScript types
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build and deploy the static files:
```bash
npm run build
npm start
```

## License

MIT
