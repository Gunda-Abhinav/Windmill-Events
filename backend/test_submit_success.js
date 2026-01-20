(async ()=>{
  try{
    const payload = {
      name: "Test User",
      email: "test.user@example.com",
      phone: "1234567890",
      eventType: "wedding",
      eventDate: "2026-06-01",
      message: "This is a test enquiry from automated test. Please ignore."
    }
    const res = await fetch('http://localhost:4000/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const text = await res.text()
    console.log('STATUS', res.status)
    console.log('BODY', text)
  }catch(e){
    console.error('ERROR', e)
  }
  process.exit()
})()
