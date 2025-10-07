import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkExportToc from "../src/main";

const markdown = `
# h1

hello

## h2

another hello

## h2-2

### h3

## h2-3

### h3-2

### h3-3
`;

const proc = await unified()
    .use(remarkParse)
    .use(remarkExportToc)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

console.log(proc.data);
