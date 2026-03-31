// Dans public/index.html, remplacer la fonction generateWords par celle-ci :
// (une seule ligne change : l'URL de l'appel fetch)

async function generateWords(theme) {
  const resp = await fetch('/api/generate', {   // ← on appelle notre propre fonction Vercel
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme }),
  });
  if (!resp.ok) throw new Error('API error ' + resp.status);
  return await resp.json();
}
