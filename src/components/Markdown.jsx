import { Fragment } from 'react';
import { Link } from './ui.jsx';

// Minimal, safe markdown: headings, lists, paragraphs, **bold**, *italic*, [links](/path or https://...). No raw HTML.
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*)/g;

function inline(text, key) {
  return text.split(TOKEN).map((p, i) => {
    const k = `${key}-${i}`;
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={k}>{inline(p.slice(2, -2), k)}</strong>;
    const link = p.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      return href.startsWith('/') ? (
        <Link key={k} to={href}>
          {label}
        </Link>
      ) : (
        <a key={k} href={href} target="_blank" rel="noopener nofollow">
          {label}
        </a>
      );
    }
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={k}>{p.slice(1, -1)}</em>;
    return <Fragment key={k}>{p}</Fragment>;
  });
}

export function Markdown({ source }) {
  const blocks = [];
  let list = null;
  source
    .trim()
    .split('\n')
    .forEach((raw, i) => {
      const line = raw.trim();
      if (/^[-*] /.test(line)) {
        (list ||= []).push(<li key={i}>{inline(line.slice(2), i)}</li>);
        return;
      }
      if (list) {
        blocks.push(<ul key={`ul-${i}`}>{list}</ul>);
        list = null;
      }
      if (!line) return;
      if (line.startsWith('### ')) blocks.push(<h3 key={i}>{inline(line.slice(4), i)}</h3>);
      else if (line.startsWith('## ')) blocks.push(<h2 key={i}>{inline(line.slice(3), i)}</h2>);
      else if (line.startsWith('# ')) blocks.push(<h2 key={i}>{inline(line.slice(2), i)}</h2>);
      else blocks.push(<p key={i}>{inline(line, i)}</p>);
    });
  if (list) blocks.push(<ul key="ul-end">{list}</ul>);
  return <div className="prose">{blocks}</div>;
}
