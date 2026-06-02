document.getElementById("contactForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;

        alert(`Thank you ${name}! Message sent successfully.`);
    });