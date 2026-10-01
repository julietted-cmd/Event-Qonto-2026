// GET /api/guests : toute la liste (inscrits + hors liste) avec leur statut.
const { notion, checkAccess, toGuest, fail, DATABASE_ID } = require('../lib/notion');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée' });
  if (!checkAccess(req, res)) return;
  try {
    let results = [];
    let cursor;
    do {
      const d = await notion(`/databases/${DATABASE_ID}/query`, 'POST', { page_size: 100, start_cursor: cursor });
      results = results.concat(d.results);
      cursor = d.has_more ? d.next_cursor : undefined;
    } while (cursor);
    const guests = results.map(toGuest).filter((g) => g.p || g.n);
    // Cache CDN très court : plusieurs téléphones qui interrogent en même temps
    // ne déclenchent qu'une lecture Notion (la clé de cache inclut ?k=).
    res.setHeader('Cache-Control', 's-maxage=3, stale-while-revalidate=5');
    res.status(200).json({ guests });
  } catch (e) { fail(res, e); }
};
