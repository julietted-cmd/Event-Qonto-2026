// POST /api/checkin { id, venu, at, plus } : pointe / dépointe une personne et met à jour ses accompagnants.
const { notion, checkAccess, fail, isPageId, clampPlus, P } = require('../lib/notion');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  if (!checkAccess(req, res)) return;
  const { id, venu, at, plus } = req.body || {};
  if (!isPageId(id)) return res.status(400).json({ error: 'Identifiant invalide' });
  const when = at && !isNaN(Date.parse(at)) ? new Date(at).toISOString() : new Date().toISOString();
  try {
    await notion(`/pages/${id}`, 'PATCH', {
      properties: {
        [P.status]: { select: { name: venu ? 'Venu' : 'Pas venu' } },
        [P.time]: { date: venu ? { start: when } : null },
        [P.plus]: { number: venu ? clampPlus(plus) : 0 },
      },
    });
    res.status(200).json({ ok: true });
  } catch (e) { fail(res, e); }
};
