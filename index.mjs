import fetch from "node-fetch";

const term = process.argv[2];

if (!term) {
  console.log("Invoke with a term, like `node index.mjs foo`.");
  process.exit();
}

const seen = {};

const fetchAndMatchTerms = async function () {
  const result = await fetch(`https://hnrss.org/newcomments?q=${term}`);
  const body = await result.text();
  const items = body.matchAll(/<item>[\s\S]*?<\/item>/gm);
  Array.from(items).reverse().forEach((item) => {
    const description = item[0].match(/<description>([\s\S]*)<\/description>/m);
    const comment = description && description[1];
    const link = item[0].match(/<link>([\s\S]*)<\/link>/m);
    if (!seen[link]) {
      const date = item[0].match(/<pubDate>([\s\S]*)<\/pubDate>/m);
      console.log(link[1]);
      console.log(date[1]);
      console.log(comment.slice(10, -4));
      console.log();
      seen[link] = true;
    }
  });

  setTimeout(fetchAndMatchTerms, 2000);
};

fetchAndMatchTerms();
