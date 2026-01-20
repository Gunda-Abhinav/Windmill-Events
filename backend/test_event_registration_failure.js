(async () => {
  try {
    const payload = {
      eventTitle: "Hearts and Beats",
      fullName: "T",
      email: "not-an-email",
      phone: "123",
      passes: 0,
      acceptedLiability: false,
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
