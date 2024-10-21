export function setHeaders(req, res, next) {
  res.setHeader('Content-Type', 'application/json');  
  res.setHeader('X-Frame-Options', 'deny');
  res.setHeader(
    'Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self'"
  );
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.removeHeader('Access-Control-Allow-Origin');
  res.removeHeader('X-RateLimit-Limit');
  res.removeHeader('X-RateLimit-Remaining');
  res.removeHeader('Date');
  res.removeHeader('X-Powered-By');
  res.removeHeader('X-RateLimit-Reset');
  res.removeHeader('Cross-Origin-Embedder-Policy');
  res.removeHeader('Cross-Origin-Resource-Policy');
  res.removeHeader('X-DNS-Prefetch-Control');
  res.removeHeader('X-Download-Options');
  res.removeHeader('X-Content-Type-Options');
  res.removeHeader('Origin-Agent-Cluster');
  res.removeHeader('X-Permitted-Cross-Domain-Policies');
  res.removeHeader('Referrer-Policy');
  res.removeHeader('Content-Type');
  res.removeHeader('Connection');
  res.removeHeader('Keep-Alive');
  res.removeHeader('Server');
  res.removeHeader('X-XSS-Protection');
  next();
}
