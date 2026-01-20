(async () => {
  try {
    const payload = {
      eventTitle: "Hearts and Beats",
      fullName: "Test User",
      email: "test.user@example.com",
      phone: "1234567890",
      passes: 2,
      acceptedLiability: true,
    }

    const res = await fetch("http://localhost:4000/api/event-registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    console.log("STATUS", res.status)
    console.log("BODY", text)
  } catch (e) {
    console.error("ERROR", e)
  }
  process.exit()
})()
