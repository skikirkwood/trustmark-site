import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check the secret and slug parameters
  const { secret, slug } = req.query;

  // Validate the secret
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Validate slug exists
  if (!slug) {
    return res.status(400).json({ message: 'Slug is required' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched slug
  const redirectUrl = slug === 'home' ? '/' : `/${slug}`;
  res.redirect(redirectUrl);
}
