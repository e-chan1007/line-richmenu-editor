import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError, AxiosRequestHeaders } from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!/^api(-data)?\.line\.me/.test(req.query.target as string)) {
    res.status(403).end();
  }

  const filteredHeaders = Object.fromEntries(Object.entries(req.headers).filter(([key, value]) => key !== "host")) as AxiosRequestHeaders;

  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const body = Buffer.concat(buffers);

  const apiResult = await axios({
    method: req.method,
    url: `https://${req.query.target}`,
    headers: filteredHeaders,
    data: body,
    timeout: 3000
  }).catch((e: AxiosError) => e.response);

  Object.entries(apiResult.headers).forEach(([key, value]) => res.setHeader(key, value));
  res.statusCode = apiResult.status || 500;
  res.statusMessage = apiResult.statusText || "";
  res.send(apiResult.data);
}

export const config = { api: { bodyParser: false }};
