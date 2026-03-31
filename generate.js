export default async function handler(req, res) {
  // Autoriser uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Headers CORS pour autoriser le navigateur à appeler cette fonction
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { theme } = req.body;

  const prompt = theme
    ? `Génère une paire de mots pour le jeu Undercover. Thème : "${theme}". Les deux mots doivent être proches sémantiquement mais distincts. Réponds UNIQUEMENT en JSON : {"civil":"mot1","undercover":"mot2","theme":"${theme}"}`
    : `Génère une paire de mots pour le jeu Undercover. Choisis un thème aléatoire. Les deux mots doivent être proches sémantiquement mais distincts (ex: Lion/Tigre, Café/Thé, Guitare/Violon). Réponds UNIQUEMENT en JSON : {"civil":"mot1","undercover":"mot2","theme":"thème choisi"}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,  // clé secrète, jamais exposée
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content[0].text.trim().replace(/```json|```/g, '').trim();
    const words = JSON.parse(text);

    return res.status(200).json(words);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Erreur de génération' });
  }
}
