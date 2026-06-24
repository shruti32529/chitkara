async function submitData() {
    const input = document.getElementById("nodes").value;
    const data = input.split(",");

    const response = await fetch("http://localhost:5000/bfhl", {
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
