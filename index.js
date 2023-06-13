import axios from "axios";
import cheerio from "cheerio";

// approach

/*
-- visit vegamovies
    --search the movie
        --find the correct result
            --find the links
                --and get the direct download links

*/

const targetUri = "https://m.vegamovies.tips/";
const lastPage = "https://m.vegamovies.tips/page/725/";
const searchQuery = "https://m.vegamovies.tips/?s=";
// let pageNo = 1;
let pageNo = 1;

console.log("#Hello Scrapper...... 🚀");

// const getAllMovies = async () => {
//   const titles = [];
//   while (pageNo < 2) {
//     //   while (true) {
//     try {
//       let response = await axios.get(
//         `https://m.vegamovies.tips/page/${pageNo}/`
//       );
//       const html = response.data;
//       const $ = cheerio.load(html);
//       $(
//         "article.post-item.site__col.post.type-post.status-publish.format-standard.has-post-thumbnail"
//       ).each((index, el) => {
//         const titleEl = $(el);
//         const element = titleEl.find("a");
//         const title = element.text();
//         const link = element.attr().href;
//         titles.push({
//           title,
//           link,
//         });
//       });
//       pageNo++;
//     } catch (err) {
//     //   console.log(err.response);
//       console.log("page ended");
//       break;
//     }
//   }
//   return titles;
// };

// getAllMovies().then((data) => console.log(JSON.stringify(data, null, 2)));

const search = async (query) => {
  const searchResult = [];
  //   pageNo = 1;
  while (true) {
    try {
      console.log(`fetching page - ${pageNo}`);
      const response = await axios.get(
        `${targetUri}page/${pageNo}/?s=${query.split(" ").join("+")}`
      );
      const html = response.data;
      const $ = cheerio.load(html);
      $(
        "article.post-item.site__col.post.type-post.status-publish.format-standard.has-post-thumbnail"
      ).each((index, el) => {
        const titleEl = $(el);
        const element = titleEl.find("a");
        const title = element.text();
        const link = element.attr().href;
        searchResult.push({
          title,
          link,
        });
      });
      pageNo++;
    } catch (err) {
      //   console.log(err.response);
      console.log("page ended");
      break;
    }
  }
  return searchResult;
};

// search("spider man").then((data) => console.log(JSON.stringify(data, null, 2)));

// const data = await search("spider man");
// console.log(data);

async function getLatestSiteLink() {
  const searchString = "inurl:vegamovies";
  const encodeSearchString = encodeURIComponent(searchString);
  const result = [];
  try {
    const AXIOS_OPTIONS = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.62 Safari/537.36",
      },
    };

    // in this link after & it's not neccessary it can work even without this string but to be safe i'm using this
    const response = await axios.get(
      `https://www.google.com/search?q=${encodeSearchString}&sxsrf=APwXEdeh-_gF447BxDdOKUlrgzVKcqCWCg%3A1686642401954&source=hp&ei=4R6IZMijN8WA2roPorWnwAM&iflsig=AOEireoAAAAAZIgs8aYFJtXOoLGSzLSYi87TZ_SYIvwT&oq=in&gs_lcp=Cgdnd3Mtd2l6EAMYADIECCMQJzIHCCMQigUQJzIECCMQJzINCAAQigUQsQMQgwEQQzIICAAQigUQkQIyBwgAEIoFEEMyDQgAEIoFELEDEIMBEEMyBwgAEIoFEEMyBwgAEIoFEEMyCwgAEIAEELEDEIMBOgcIIxDqAhAnOg4IABCKBRCxAxCDARCRAjoICC4QgAQQsQM6CwgAEIoFELEDEIMBOgUIABCABDoRCC4QgAQQsQMQgwEQxwEQ0QNQlgNY7ANgog1oAXAAeACAAawBiAHLApIBAzAuMpgBAKABAbABCg&sclient=gws-wiz`,
      AXIOS_OPTIONS
    );
    const $ = cheerio.load(response.data);
    // $("div.byrV5b > div").each((index, ele) => {
    //   const titleEl = $(ele);
    //   const title = titleEl.find("span").text();
    //   const linkPage = titleEl.find("");
    //   const link = titleEl.find("cite.apx8Vc").text();
    //   console.log({
    //     title,
    //     link,
    //   });
    // });

    $("div.yuRUbf > a").map((index, ele) => {
      const element = $(ele);
      const desc = element.find("h3").text();
      const title = element.find("div.TbwUpd > div > span.VuuXrf").text();
      const link = element.find("div.TbwUpd > div > div.byrV5b > cite").text();

      result.push({
        title,
        link: link.replace(/ .*/, ""),
        desc,
      });
    });
  } catch (err) {
    console.log(err);
    return [];
  }
  return result;
}

// getLatestSiteLink().then((Data) => JSON.stringify(Data, null, 2));

// to avoid top level await
(async function () {
  const getLatest = await getLatestSiteLink();
  const latest = JSON.stringify(
    getLatest.filter((target) => target.link.includes("vegamovies")),
    null,
    2
  );
  console.log(latest);
})();
