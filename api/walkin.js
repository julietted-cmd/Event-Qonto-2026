// POST /api/walkin { p, n, c, at, plus } : ajoute une personne hors liste (déjà arrivée).
// DELETE /api/walkin?id=... : supprime une personne hors liste (jamais un inscrit de la liste).
const { notion, checkAccess, fail, rt, isPageId, clampPlus, DATABASE_ID, P } = require('../lib/notion');

module.exports = async (req, res) => {
  if (!checkAccess(req, res)) return;
  try {
    if (req.method === 'POST') {
      const { p, n, c, at, plus } = req.body || {};
      const first = String(p || '').trim(), last = String(n || '').trim();
      if (!first || !last) return res.status(400).json({ error: 'Prénom et nom obligatoires' });
      const when = at && !isNaN(Date.parse(at)) ? new Date(at).toISOString() : new Date().toISOString();
      const page = await notion('/pages', 'POST', {
        parent: { database_id: DATABASE_ID },
        properties: {
          [P.full]: { title: rt(`${first} ${last}`) },
          [P.first]: { rich_text: rt(first) },
          [P.last]: { rich_text: rt(last) },
          [P.company]: { rich_text: rt(c) },
          [P.status]: { select: { name: 'Venu' } },
          [P.time]: { date: { start: when } },
          [P.plus]: { number: clampPlus(plus) },
          [P.source]: { select: { name: 'Hors liste' } },
        },
      });
      return res.status(200).json({ id: page.id });
    }
    if (req.method === 'DELETE') {
      const id = req.query && req.query.id;
      if (!isPageId(id)) return res.status(400).json({ error: 'Identifiant invalide' });
      const page = await notion(`/pages/${id}`);
      const source = page.properties && page.properties[P.source] && page.properties[P.source].select;
      if (!source || source.name !== 'Hors liste') return res.status(400).json({ error: 'Seules les personnes hors liste peuvent être supprimées' });
      await notion(`/pages/${id}`, 'PATCH', { archived: true });
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (e) { fail(res, e); }
};
