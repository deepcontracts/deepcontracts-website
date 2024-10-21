var request;
var currentPage;

function getPage(href) {
  currentPage = href;
  url = `https://raw.githubusercontent.com/deepcontracts/deepcontracts-website/master/${href}`;

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
    return `
      <h${level}>
        <div style="text-decoration: underline;">
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
