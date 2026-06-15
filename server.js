const express = require("express");
const path = require("path");
const bosses = require("./bosses");

const app = express();
const PORT = 3000;

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  let html = require("fs").readFileSync(
    path.join(__dirname, "views", "index.html"),
    "utf8"
  );

  const bossCards = bosses
    .map(
      (boss) => `
      <article>
        <img src="${boss.image}" alt="${boss.name}" />
        <h3>${boss.name}</h3>
        <p><strong>Game:</strong> ${boss.game}</p>
        <p><strong>Difficulty:</strong> ${boss.difficulty}</p>
        <a href="/bosses/${boss.id}" role="button">View Details</a>
      </article>
    `
    )
    .join("");

  html = html.replace("{{bosses}}", bossCards);

  res.send(html);
});

app.get("/bosses/:id", (req, res) => {
  const boss = bosses.find((b) => b.id === req.params.id);

  if (!boss) {
    return res.status(404).sendFile(
      path.join(__dirname, "views", "404.html")
    );
  }

  let html = require("fs").readFileSync(
    path.join(__dirname, "views", "detail.html"),
    "utf8"
  );

  html = html
    .replaceAll("{{name}}", boss.name)
    .replaceAll("{{game}}", boss.game)
    .replaceAll("{{difficulty}}", boss.difficulty)
    .replaceAll("{{description}}", boss.description)
    .replaceAll("{{image}}", boss.image);

  res.send(html);
});

app.use((req, res) => {
  res.status(404).sendFile(
    path.join(__dirname, "views", "404.html")
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});