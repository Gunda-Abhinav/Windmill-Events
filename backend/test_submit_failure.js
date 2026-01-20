(async ()=>{
  try{
    // Missing `name` and short `message` to trigger validation errors
    const payload = {
      email: "invalid@example.com",
      phone: "123",
      eventType: "",
      eventDate: "",
      message: "short"
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
