import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  _request: VercelRequest,
  response: VercelResponse
) {

  return response.status(200).json({ ok: 200 });
}
