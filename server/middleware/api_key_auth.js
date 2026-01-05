export function api_key_auth(req, res, next) {
  const api_key = req.header("x-api-key");

  if (!api_key) {
    return res.status(404).json({ message: "api key needed" });
  }

  if (api_key !== process.env.API_KEY) {
    return res.status(404).json({ message: "Invalid API key" });
  }

  next();
}
