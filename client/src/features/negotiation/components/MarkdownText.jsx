import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="text-white/90">{children}</em>,
  h1: ({ children }) => (
    <h1 className="mb-2 text-base font-bold last:mb-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 text-sm font-bold last:mb-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 text-sm font-semibold last:mb-0">{children}</h3>
  ),
  a: (props) => (
    <a
      className="text-violet-400 underline decoration-violet-400/50 hover:text-violet-300"
      {...props}
    />
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-neutral-600 pl-3 last:mb-0">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.85em]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-black/40 p-3 last:mb-0">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-3 border-neutral-700" />,
};

function MarkdownText({ text }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {text}
    </ReactMarkdown>
  );
}

export default MarkdownText;
