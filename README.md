# remark-export-toc

A remark plugin that assigns sequential numeric IDs to headings and extracts table of contents data as a separate JavaScript array, enabling flexible ToC rendering outside the markdown content.

## Installation

```bash
npm install remark-export-toc
```

or

```bash
yarn add remark-export-toc
```

## Features

- **Sequential numeric IDs**: Generates clean, hierarchical IDs (e.g., `heading-1`, `heading-1-1`, `heading-2`) instead of using heading text as IDs
- **Separate ToC extraction**: Extracts table of contents data as a JavaScript array, separate from the rendered markdown
- **Flexible rendering**: Enables rendering ToC in a different location or component from the main content
- **Configurable**: Customize ID prefix and starting heading level
- **TypeScript support**: Includes TypeScript type definitions

## Why This Plugin?

Traditional remark ToC plugins typically:
- Generate IDs directly from heading text, which can be messy with non-ASCII characters (e.g., Japanese, Chinese)
- Embed the ToC directly into the markdown output

This plugin solves these issues by:
- Using clean, sequential numeric IDs that are URL-safe and readable
- Extracting ToC data separately, allowing you to render it anywhere in your application
- Providing structured data that's easy to work with in modern frameworks like React

## Usage

### Basic Usage

```javascript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkExportToc from 'remark-export-toc';

const markdown = `
# Document Title

## Introduction

Some content here.

## Main Section

### Subsection 1

More content.

### Subsection 2

Even more content.

## Conclusion
`;

const processor = unified()
  .use(remarkParse)
  .use(remarkExportToc) // Add the plugin
  .use(remarkRehype)
  .use(rehypeStringify);

const result = await processor.process(markdown);

// Access the ToC data
console.log(result.data.toc);
// Output HTML
console.log(String(result));
```

### Output Example

The `result.data.toc` will contain:

```javascript
[
  { id: 'heading-1', text: 'Introduction', level: 2 },
  { id: 'heading-2', text: 'Main Section', level: 2 },
  { id: 'heading-2-1', text: 'Subsection 1', level: 3 },
  { id: 'heading-2-2', text: 'Subsection 2', level: 3 },
  { id: 'heading-3', text: 'Conclusion', level: 2 }
]
```

The HTML output will have IDs assigned to headings:

```html
<h2 id="heading-1">Introduction</h2>
<h2 id="heading-2">Main Section</h2>
<h3 id="heading-2-1">Subsection 1</h3>
<h3 id="heading-2-2">Subsection 2</h3>
<h2 id="heading-3">Conclusion</h2>
```

### React Example

Here's how to use this plugin with React to render markdown content and a separate table of contents:

```jsx
import React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkExportToc from 'remark-export-toc';

function MarkdownDocument({ markdown }) {
  const [content, setContent] = React.useState('');
  const [toc, setToc] = React.useState([]);

  React.useEffect(() => {
    async function processMarkdown() {
      const processor = unified()
        .use(remarkParse)
        .use(remarkExportToc)
        .use(remarkRehype)
        .use(rehypeStringify);

      const result = await processor.process(markdown);
      
      setContent(String(result));
      setToc(result.data.toc);
    }

    processMarkdown();
  }, [markdown]);

  return (
    <div className="document-layout">
      {/* Sidebar with ToC */}
      <aside className="toc-sidebar">
        <nav>
          <h2>Table of Contents</h2>
          <ul>
            {toc.map((item) => (
              <li 
                key={item.id}
                style={{ marginLeft: `${(item.level - 2) * 1.5}rem` }}
              >
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export default MarkdownDocument;
```

### Next.js Example (App Router)

```jsx
// app/blog/[slug]/page.jsx
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkExportToc from 'remark-export-toc';
import TableOfContents from '@/components/TableOfContents';

async function getMarkdownData(slug) {
  const markdown = await fetchMarkdownFromSomewhere(slug);
  
  const processor = unified()
    .use(remarkParse)
    .use(remarkExportToc)
    .use(remarkRehype)
    .use(rehypeStringify);

  const result = await processor.process(markdown);
  
  return {
    content: String(result),
    toc: result.data.toc
  };
}

export default async function BlogPost({ params }) {
  const { content, toc } = await getMarkdownData(params.slug);

  return (
    <div className="blog-layout">
      <TableOfContents items={toc} />
      <article dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
```

```jsx
// components/TableOfContents.jsx
'use client';

export default function TableOfContents({ items }) {
  return (
    <nav className="toc">
      <h2>On This Page</h2>
      <ul>
        {items.map((item) => (
          <li 
            key={item.id}
            className={`toc-level-${item.level}`}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

## Configuration

### Options

```typescript
type RemarkExportTocArgument = {
  prefix: string;      // Default: "heading"
  startLevel: number;  // Default: 2
};
```

#### `prefix` (default: `"heading"`)

The prefix used for generated IDs. This is useful when you have multiple markdown documents on the same page and need to avoid ID conflicts.

```javascript
// Example with custom prefix
.use(remarkExportToc, { prefix: 'doc1' })
// Generates IDs: doc1-1, doc1-2, doc1-2-1, etc.

.use(remarkExportToc, { prefix: 'doc2' })
// Generates IDs: doc2-1, doc2-2, doc2-2-1, etc.
```

#### `startLevel` (default: `2`)

The minimum heading level to include in the ToC. Set to `2` by default to exclude `h1` headings, as they typically serve as the page title and shouldn't be in the table of contents.

```javascript
// Include h1 headings
.use(remarkExportToc, { startLevel: 1 })

// Start from h3 headings
.use(remarkExportToc, { startLevel: 3 })
```

### TypeScript Types

```typescript
import type { ToC } from 'remark-export-toc';

// ToC type definition
type ToC = {
  id: string;      // The generated ID (e.g., "heading-2-1")
  text: string;    // The heading text content
  level: number;   // The heading level (1-6)
};
```

## How ID Generation Works

The plugin generates IDs using a hierarchical counter system:

1. Each heading level maintains its own counter
2. When a heading is encountered, its counter increments
3. All deeper level counters reset to 0
4. The ID is constructed from the prefix and all active counters

Example:

```markdown
## First h2          → heading-1
### First h3         → heading-1-1
### Second h3        → heading-1-2
## Second h2         → heading-2
### Another h3       → heading-2-1
```

## Use Cases

- **Documentation sites**: Render ToC in a fixed sidebar while content scrolls
- **Blog posts**: Display ToC at the top or in a collapsible widget
- **Multi-document pages**: Use different prefixes to handle multiple markdown files
- **Custom ToC styling**: Build your own ToC component with complete control over styling and behavior
- **Analytics**: Track which ToC links users click
- **Smooth scrolling**: Implement custom scroll behavior for ToC links

## License

MIT

## Contributing

Issues and pull requests are welcome at [https://github.com/osawa-naotaka/remark-export-toc](https://github.com/osawa-naotaka/remark-export-toc)
