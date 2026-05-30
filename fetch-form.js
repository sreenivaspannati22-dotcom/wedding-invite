const url = "https://docs.google.com/forms/d/e/1FAIpQLSexDONmjK-DR0JIcQGij5UG5lzP_XjYYK0UrErotowxeX3eMQ/viewform";
fetch(url).then(r => r.text()).then(html => {
  const matches = [...html.matchAll(/entry\.\d+/g)].map(m => m[0]);
  console.log(Array.from(new Set(matches)));
  
  // also extract the question titles to map them
  const dataRegex = /var FB_PUBLIC_LOAD_DATA_ = (\[.*\]);/s;
  const match = html.match(dataRegex);
  if (match) {
    const data = JSON.parse(match[1]);
    const questions = data[1][1];
    questions.forEach(q => {
      console.log(`Question: ${q[1]}`);
      const item = q[4][0];
      console.log(`ID: entry.${item[0]}`);
      if (item[1]) {
        console.log(`Options: ${item[1].map(o => o[0]).join(', ')}`);
      }
      console.log('---');
    });
  }
}).catch(console.error);
