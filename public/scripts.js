//cambio de tema
(function (d, w, ls) {
  const $btn = d.querySelector(".theme-toggle");
  let prefersDark = w.matchMedia("(prefers-color-scheme: dark)").matches,
    lightIcon = `<i class="fa-solid fa-moon"></i>`,
    darkIcon = `<i class="fa-sharp fa-solid fa-sun"></i>`;

  function lightMode() {
    ls.setItem("theme", "light");
    d.querySelector(":root").classList.add("light");
    d.querySelector(":root").classList.remove("dark");
    $btn.innerHTML = lightIcon;
  }

  function darkMode() {
    ls.setItem("theme", "dark");
    d.querySelector(":root").classList.remove("light");
    d.querySelector(":root").classList.add("dark");
    $btn.innerHTML = darkIcon;
  }

  if (ls.getItem("theme") === null) {
    if (prefersDark) {
      ls.setItem("theme", "dark");
    } else {
      ls.setItem("theme", "light");
    }
  }

  if (ls.getItem("theme") === "dark") darkMode();
  if (ls.getItem("theme") === "light") lightMode();

  $btn.addEventListener("click", (e) =>
    ls.getItem("theme") === "dark" ? lightMode() : darkMode()
  );
})(document, window, localStorage);

(async function (d) {
  //Fecha formato humano
  function humanDate(date) {
    return new Date(`${date}T00:00:00`)
      .toDateString()
      .slice(4)
      .replace("Jan", "Ene")
      .replace("Apr", "Abr")
      .replace("Aug", "Ago")
      .replace("Dec", "Dic");
  }

  //Datos del sitio
  async function getData() {
    let res = await fetch("assets/data.json", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    json = await res.json();

    return json;
  }

  let data = await getData();

  //Publicaciones del blog
  if (d.getElementById("posts")) {
    const posts = data.posts.filter((el) => el.publish === true);
    let $posts = "";

    posts.forEach(
      (el) =>
        ($posts += `
          <a href="${location.origin}/${el.slug}" class="blog-item">
            <figure>
              <img src="images/category/${el.category}.png" alt="${
          el.category
        }" title="Categoría: ${el.category}" loading="lazy">
              <figcaption>
                <span>${el.title}</span>
                <time datetime="${el.date}">${humanDate(el.date)}</time>
              </figcaption>
            </figure>
          </a>
      `)
    );
    d.getElementById("posts").insertAdjacentHTML("beforeend", $posts);
  }

  //Artículo o nota actual
  if (d.getElementById("post-blog")) {
    let post;

    const currentPost = data.posts.filter(
      (el) =>
        location.pathname === `/${el.slug}` ||
        location.pathname === `/${el.slug}.html`
    );

    if (currentPost.length === 0) {
      const currentToughts = data.thoughts.filter(
        (el) =>
          location.pathname === `/${el.slug}` ||
          location.pathname === `/${el.slug}.html`
      );

      post = currentToughts[0];
    } else {
      post = currentPost[0];
    }

    d.getElementById("post-blog").innerHTML = `
        <h1>${post.title}</h1>
        <aside class="post-date">
          <small>
            <span>Última actualización:</span>
            <i>
              <time datetime="${post.date}">
                ${humanDate(post.date)}
              </time>
            </i>
          </small>
        </aside>
        <img class="post-category" src="images/category/${
          post.category
        }.png" alt="Categoría: ${post.category}" title="Categoría: ${
      post.category
    }" loading="lazy">
      `;

    $article = d.querySelector("article");
    $menu = d.querySelector("#post-menu");

    fetch("assets/" + post.slug + "-menu.md")
      .then((res) => (res.ok ? res.text() : Promise.reject(res)))
      .then((text) => {
        $menu.insertAdjacentHTML(
          "beforeend",
          new showdown.Converter().makeHtml(text)
        );
      })
      .catch((err) => {
        console.log(err);
        let message = err.statusText || "Ocurrió un error";
        $menu.insertAdjacentHTML(
          "beforeend",
          `<p>Error ${err.status}: ${message}</p>`
        );
      });

    fetch("assets/" + post.slug + ".md")
      .then((res) => (res.ok ? res.text() : Promise.reject(res)))
      .then((text) => {
        $article.insertAdjacentHTML(
          "beforeend",
          new showdown.Converter().makeHtml(text)
        );
      })
      .catch((err) => {
        console.log(err);
        let message = err.statusText || "Ocurrió un error";
        $article.insertAdjacentHTML(
          "beforeend",
          `<p>Error ${err.status}: ${message}</p>`
        );
      });
  }

  //Agregando atributos a enlaces externos en artículos del blog
  d.querySelectorAll('a[href^="http"]:not(.blog-item)').forEach((el) => {
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  //Proyectos
  if (d.getElementById("projects")) {
    const projects = data.projects;
    let $projects = "";

    projects.forEach(
      (el) =>
        ($projects += `
          <a class="card-list" href="${el.link}">
            <figure>
              <img src="${el.img}" alt="${el.name}" loading="lazy">
              <figcaption>
                <span>${el.name} <small>(${el.date})</small></span>
                <small>${el.excerpt}</small>
              </figcaption>
            </figure>
          </a>
      `)
    );
    d.getElementById("projects").innerHTML = $projects;
  }
})(document);

//temas
(function (d, w) {
  if (d.getElementById("temas")) {
    const mq = window.matchMedia("(min-width: 62em)");
    mq.addEventListener("change", mqHandler);

    function mqHandler(e) {
      if (e.matches) {
        d.querySelectorAll('a[href="#temas"').forEach((el) => {
          el.setAttribute("href", "#");
        });
      } else {
        d.querySelectorAll('a[href="#"').forEach((el) => {
          el.setAttribute("href", "#temas");
        });
      }
    }

    mqHandler(mq);
  }
})(document, window);
