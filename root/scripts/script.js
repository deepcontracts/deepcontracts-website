var request;
var currentPage;

function getPage(href) {
  currentPage = href;
  url = `https://raw.githubusercontent.com/deepcontracts/deepcontracts-website/main/${href}`;
  // url = `http://127.0.0.1:5500/${href}`;

  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) {
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }

  try {
    request.onreadystatechange = function(){embedPage(href)};
    request.open("GET", url, true);
    request.send();
  }
  catch (e) {
    alert("Unable to connect to server");
  }
}

const renderer = {
  link(href, title, text) {
    if (href.startsWith("https://") || href.startsWith("http://")) {
      return `
        <a href="${href}"${title?` title="${title}`:""}>
          ${text}
        </a>
      `;
    } else {
      return `
        <a href="#${href}"${title?` title="${title}`:""}>
          ${text}
        </a>
      `;
    }
  },
  heading(text, level) {
    let headingStyle = '';
    switch (level) {
      case 1:
        headingStyle = ` font-size: 1.4em; font-weight: bold; color: #ffffff; text-align: center; margin: 20px 0; font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, sans-serif;`;
    break;
      case 2:
        headingStyle = 'font-size: 1.75em; font-weight: bold;';
        break;
      case 3:
        headingStyle = 'font-size: 1.5em; font-weight: bold; font-family: Diatype, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; margin-top: 1em;';
        break;
      case 4:
        headingStyle = 'font-size: 1.25em;';
        break;
      case 5:
        headingStyle = 'font-size: 0.950em; font-style: italic; font-family: BinancePlex, NotoSansSinhala, Arial, sans-serif;';
        break;
      case 6:
        headingStyle = 'font-size: 0.950em; font-style: italic; color: #ffffff; text-align: center; margin: 20px 0';
        break;
    }
    return `
      <h${level}>
        <div style="${headingStyle}">
          ${text}
        </div>
      </h${level}>
    `;
  },
  image(href, title, text) {
    if (href === null) {
      return text;
    }

    let out = `<BR><img src="${href.startsWith("root/")?href.substring(5):href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += '>';
    return out;
  },
  table(header, body) {
    if (body) body = `<tbody>${body}</tbody>`;

    return '<table style="width:100%">\n'
      + '<thead>\n'
      + header
      + '</thead>\n'
      + body
      + '</table><BR>\n';
  },
  paragraph(text) {
    if (text.startsWith(":::horizontal")) {
      const paragraphs = text.split(":::horizontal")[1].split("\n").filter(p => p.trim() !== '');
      return `
        <div class="horizontal-paragraphs">
          <p>${paragraphs[0]}</p>
          <p>${paragraphs[1]}</p>
          <p>${paragraphs[2]}</p>
        </div>
      `;
    }
    return `<p>${text}</p>`;
  }
};

marked.use({ renderer });

function embedPage(href) {
  if (request.readyState == 4) {
    if (href=="pages/home.md") {
      history.replaceState(null, "", window.location.pathname);
    }
    var val = request.responseText;
    document.getElementById('page').innerHTML = window.marked.marked(val);
    window.scrollTo({ top: 0 });
  }
}

if (window.location.hash) {
  getPage(window.location.hash.substring(1));
} else {
  getPage("pages/home.md");
}

window.onpopstate = function(event) {
  if (window.location.hash) {
    getPage(window.location.hash.substring(1));
  } else {
    getPage("pages/home.md");
  }
};
