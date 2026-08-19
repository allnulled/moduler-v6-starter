Scoped_block: {
    console.log("OKKK");
    const b = document.createElement("button");
    b.textContent = "Reok!";
    b.onclick = () => window.alert("Reok!");
    document.body.appendChild(b);
}