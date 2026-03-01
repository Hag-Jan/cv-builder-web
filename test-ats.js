const req = require('http').request('http://localhost:3000/api/ats/simulate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(res.statusCode, body));
});
req.write(JSON.stringify({ 
  resume: { schemaVersion: "2.0", sections: [] }, 
  templateId: 'executive-classic' 
}));
req.end();
