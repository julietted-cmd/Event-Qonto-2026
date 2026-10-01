// Petit client Notion pour les fonctions Vercel (Node 18+, aucune dépendance).
const NOTION_VERSION = '2022-06-28';
const DATABASE_ID = process.env.NOTION_DATABASE_ID || 'b08a8e113dae474ca3d2187c6c6b2d41';

const P = {
  full: 'Nom complet',
  first: 'Prénom',
  last: 'Nom',
  company: 'Entreprise',
  status: 'Statut',
  time: "Heure d'arrivée",
  plus: 'Accompagnants',
  source: 'Source',
};

async function notion(path, method = 'GET', body) {
  if (!process.env.NOTION_TOKEN) {
    const e = new Error('NOTION_TOKEN manquant dans les variables Vercel.'); e.status = 500; throw e;
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch('https://api.notion.com/v1' + path, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 429 || r.status >= 500) {
      const wait = Number(r.headers.get('retry-after')) || 0.4 * (attempt + 1);
      await new Promise((s) => setTimeout(s, wait * 1000));
      continue;
    }
    const data = await r.json();
    if (!r.ok) { const e = new Error(data.message || 'Erreur Notion'); e.status = r.status; throw e; }
    return data;
  }
  const e = new Error('Notion ne répond pas, réessayez.'); e.status = 503; throw e;
}

// Code d'accès facultatif (variable ACCESS_CODE). GET : ?k=..., POST/DELETE : en-tête x-access-code.
function checkAccess(req, res) {
  const expected = process.env.ACCESS_CODE;
  if (!expected) return true;
  const given = req.headers['x-access-code'] || (req.query && req.query.k) || '';
  if (given === expected) return true;
  res.status(401).json({ error: "Code d'accès requis" });
  return false;
}

const text = (p) => ((p && (p.rich_text || p.title)) || []).map((t) => t.plain_text).join('').trim();
const rt = (s) => [{ type: 'text', text: { content: String(s || '').slice(0, 200) } }];
const isPageId = (id) => typeof id === 'string' && /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(id);
const clampPlus = (n) => Math.max(0, Math.min(20, parseInt(n, 10) || 0));

function toGuest(page) {
  const pr = page.properties || {};
  let first = text(pr[P.first]);
  let last = text(pr[P.last]);
  const full = text(pr[P.full]);
  if (!first && !last && full) { // ligne ajoutée à la main dans Notion avec seulement le nom complet
    const parts = full.split(/\s+/);
    first = parts.shift() || '';
    last = parts.join(' ');
  }
  return {
    id: page.id,
    p: first,
    n: last,
    c: text(pr[P.company]),
    venu: (pr[P.status] && pr[P.status].select && pr[P.status].select.name) === 'Venu',
    at: (pr[P.time] && pr[P.time].date && pr[P.time].date.start) || null,
    plus: (pr[P.plus] && pr[P.plus].number) || 0,
    walk: (pr[P.source] && pr[P.source].select && pr[P.source].select.name) === 'Hors liste',
  };
}

function fail(res, e) {
  res.status(e.status && e.status < 600 ? e.status : 500).json({ error: e.message || 'Erreur serveur' });
}

module.exports = { notion, checkAccess, toGuest, fail, rt, isPageId, clampPlus, DATABASE_ID, P };
