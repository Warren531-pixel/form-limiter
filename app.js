const http = require('http');

const SUBMISSION_LIMIT = 99;
const VALID_CLUBS = ["Bryanston", "Centurion", "Waterfall", "Greenstone Park", "Honeydew", "Lenasia", "Glen Acres"];
const counts = {"Bryanston":0,"Centurion":0,"Waterfall":0,"Greenstone Park":0,"Honeydew":0,"Lenasia":0,"Glen Acres":0};

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.end();

  if (req.method !== 'POST') {
    res.writeHead(405);
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { club } = JSON.parse(body);
      const c = club ? club.trim() : null;
      if (!c || !VALID_CLUBS.includes(c)) {
        return res.end(JSON.stringify({ success: false, message: 'Please select a valid departure club.' }));
      }
      if (counts[c] >= SUBMISSION_LIMIT) {
        return res.end(JSON.stringify({ success: false, message: `Sorry, ${c} is fully booked. Please select another departure club.` }));
      }
      counts[c]++;
      res.end(JSON.stringify({ success: true, message: "Thanks! Your spot has been reserved." }));
    } catch(e) {
      res.end(JSON.stringify({ success: false, message: 'Invalid request.' }));
    }
  });
}).listen(10000, () => console.log('Server running on port 10000'));
