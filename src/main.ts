import type { Root } from "mdast";
import { toString as toStringMdast } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

export type ToC = {
    id: string;
    text: string;
    level: number;
};

export type RemarkExtractTocArgument = {
    prefix: string;
    startLevel: number;
};

export default function remarkExtractToc(opt: RemarkExtractTocArgument = { prefix: "heading", startLevel: 2 }) {
    return (tree: Root, file: VFile) => {
        const toc: ToC[] = [];
        const counters = [0, 0, 0, 0, 0, 0];

        visit(tree, "heading", (node) => {
            const level = node.depth - 1;

            if (level < opt.startLevel - 1) {
                return;
            }

            counters[level]++;
            for (let i = level + 1; i < counters.length; i++) {
                counters[i] = 0;
            }

            const idParts = counters.slice(0, level + 1).filter((c) => c > 0);
            const id = `${opt.prefix}-${idParts.join("-")}`;
            const text = toStringMdast(node);

            toc.push({
                id,
                text,
                level: node.depth,
            });

            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};
            node.data.hProperties.id = id;
        });

        file.data.toc = toc;
    };
}
