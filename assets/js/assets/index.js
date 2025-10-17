const fetch = (...args) => import('node-fetch').then(m=>m.default(...args));
const GITHUB_OWNER = 'YOUR_GITHUB_USERNAME';
const GITHUB_REPO  = 'rashifal-site';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // set from Secret Manager or env

const signs = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];

async function getAztro(sign){
  const url = `https://aztro.sameerkumar.website/?sign=${sign}&day=today`;
  const r = await fetch(url, { method: 'POST' });
  return r.json();
}

async function getFileSha(path){
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const r = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });
  if (r.status===200) { const j=await r.json(); return j.sha; }
  return null;
}

async function putFile(path, content, message, sha){
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const body = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch: 'main'
  };
  if (sha) body.sha = sha;
  await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type':'application/json' },
    body: JSON.stringify(body)
  });
}

exports.fetchRashifal = async (req,res) => {
  try {
    const out = {};
    for(const s of signs){
      const data = await getAztro(s);
      out[s] = `${data.description}`; // description field contains horoscope
    }
    const jsonText = JSON.stringify(out, null, 2);
    const path = 'data/rashifal.json';
    const sha = await getFileSha(path);
    await putFile(path, jsonText, `Daily update ${new Date().toISOString()}`, sha);
    res.status(200).send('Updated');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error');
  }
};
