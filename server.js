const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const fetch = (url) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url));
const fs = require("fs");

// Middleware para servir archivos estáticos
app.use(express.static("public"));

// Ruta para la página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/blog", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "blog.html"));
});

function postBySlug(slug) {
  const data = fs.readFileSync(
    path.join(__dirname, "public/assets", "data.json"),
    "utf8"
  );
  const jsonData = JSON.parse(data);

  const post = jsonData.posts.find((post) => post.slug === slug);

  return post;
}

app.get("/:slug", async function (req, res) {
  const filePath = path.resolve(__dirname, "public", "post.html");

  const meta = postBySlug(req.params.slug);

  let nombre;
  let descripcion;
  let image;

  if (meta) {
    nombre = meta.name;
    descripcion = meta.title;
    image = meta.image;
  } else {
    nombre = "Post no encontrado";
    descripcion = "Post no encontrado";
  }

  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    data = data.replace(/\$OG_TITLE/g, nombre + " 🐼 Jose Gaspar");
    data = data.replace(/\$$OG_IMAGE/g, image);
    result = data.replace(
      /\$OG_DESCRIPTION/g,
      "En este post comparto mis apuntes sobre: " + descripcion
    );

    res.send(result);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en puerto: ${port}`);
});
