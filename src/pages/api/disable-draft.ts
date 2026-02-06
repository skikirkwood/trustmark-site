import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Clear the preview mode cookies
  res.clearPreviewData();

  // Redirect to the homepage or the provided redirect URL
  const redirectUrl = (req.query.redirect as string) || '/';
  res.redirect(redirectUrl);
}
