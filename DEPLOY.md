# Deploying the Demo

Recommended quick deploys:

- Netlify: connect the GitHub repo and set `build command` to `npm run build` and `publish` to `dist`.
- GitHub Pages: build locally `npm run build` and push `dist` to `gh-pages` branch (can use `gh-pages` npm helper).

Local preview:

```bash
npm run build
npm run preview
```

If you need to fetch Instamart APIs with an API key that must be private, add a tiny serverless function (Netlify Functions, Vercel Serverless, or a tiny Express proxy) that forwards read-only product requests.

Example Netlify Function (sketch):

```js
// netlify/functions/product-proxy.js
export async function handler(event) {
  const id = event.queryStringParameters.id
  const res = await fetch(`https://api.instamart.swiggy.com/v1/products/${id}`, { headers: { Authorization: `Bearer ${process.env.INSTAMART_KEY}` }})
  const body = await res.text()
  return { statusCode: res.status, body }
}
```
