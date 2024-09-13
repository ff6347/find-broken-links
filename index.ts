import blc from 'broken-link-checker';
// const siteUrl = 'https://p5js.org';
const siteUrl = 'http://localhost:8080';
import fs from 'node:fs';
const hashMap = new Map<string, { href: string; text: string }[]>();

function generateMarkdown(
  map: Map<string, { href: string; text: string }[]>,
): string {
  let markdown = `report created: ${new Date().toUTCString()}\n\n`;
  const sortedEntries = Array.from(map.entries()).sort(([keyA], [keyB]) =>
    keyA.localeCompare(keyB),
  );
  sortedEntries.forEach(([base, links]) => {
    markdown += `\n- [ ] ${base}\n`;
    links.forEach((link) => {
      markdown += `    - [ ] ${link.text} | ${link.href}\n`;
    });
  });

  return markdown;
}

const siteChecker = new blc.SiteChecker(
  {
    excludeExternalLinks: true,
    requestMethod: 'get',
  },
  {
    link: function (result) {
      if (result.broken) {
        // console.log(result);
        const href = result.url.resolved
          ? (result.url.resolved as string)
          : (result.url.original as string);
        const text = result.html.text;
        const base = result.base.resolved
          ? (result.base.resolved as string)
          : (result.base.original as string);
        // console.log('link', url, base);
        if (!hashMap.has(base)) {
          hashMap.set(base, []);
        }
        hashMap.get(base)?.push({ href, text });
      }
    },

    end: function () {
      console.log('end');
      // console.log('Broken links dataset:', hashMap);
      const markdown = generateMarkdown(hashMap);
      // console.log(markdown);
      fs.writeFileSync(
        `${import.meta.dirname}/${new URL(siteUrl).host}-report.md`,
        markdown,
      );
    },
  },
);

siteChecker.enqueue(siteUrl, {});
