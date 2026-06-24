async function submitData() {
    const input = document.getElementById("nodes").value;
    const data = input.split(",");

    const response = await fetch("https://chitkara-backend-mj0o.onrender.com/bfhl", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ data })
    });

    const result = await response.json();

    document.getElementById("result").innerText =
        JSON.stringify(result, null, 2);
}
