const signs = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
const sel = document.getElementById('sign');
signs.forEach(s=> sel.add(new Option(s, s)));
sel.addEventListener('change', show);
async function show(){
  const sign = sel.value || 'aries';
  const res = await fetch('/data/rashifal.json');
  const json = await res.json();
  document.getElementById('result').innerText = json[sign] || 'No data';
}
sel.value='aries';
show();
