import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!/^api(-data)?\.line\.me/.test(req.query.target as string)) {
    res.status(403).end();
  }

  const filteredHeaders = Object.fromEntries(
    Object
      .entries(req.headers)
      .filter(([key, value]) => ["content-type", "authorization"].includes(key))
  );

  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const body = ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(buffers);

  try {
    const apiResult = await fetch(`https://${req.query.target}`, {
      method: req.method,
      headers: filteredHeaders as Record<string, string>,
      body: body
    });

    Object.entries(apiResult.headers).forEach(([key, value]) => res.setHeader(key, value as string));
    res.statusCode = apiResult.status || 500;
    res.statusMessage = apiResult.statusText || "";
    const result = await apiResult.text();
    res.setHeader("Content-Type", apiResult.headers.get("content-type") || "text/plain");
    res.send(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message || "Unknown error" });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
}

export const config = { api: { bodyParser: false } };
