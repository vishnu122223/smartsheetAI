
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="leading-relaxed">

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
          h2: (props) => <h2 className="text-xl font-bold mt-4 mb-2" {...props} />,
          h3: (props) => <h3 className="text-lg font-semibold mt-3 mb-2" {...props} />,
          h4: (props) => <h4 className="text-base font-semibold mt-3 mb-1" {...props} />,

          p: (props) => <p className="mb-3" {...props} />,

          a: (props) => (
            <a className="text-primary hover:underline" {...props} />
          ),

          ul: (props) => (
            <ul className="list-disc list-inside mb-3 ml-4" {...props} />
          ),

          ol: (props) => (
            <ol className="list-decimal list-inside mb-3 ml-4" {...props} />
          ),

          li: (props) => <li className="mb-1" {...props} />,

          strong: (props) => <strong className="font-semibold" {...props} />,

          em: (props) => <em className="italic" {...props} />,

          blockquote: (props) => (
            <blockquote className="border-l-4 border-accent pl-4 italic my-4 opacity-85" {...props} />
          ),

          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');

            return !inline && match ? (
              <SyntaxHighlighter
                style={oneLight}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-fill-strong px-1 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            );
          },

          pre: (props) => (
            <pre className="bg-elevated text-foreground border border-hairline p-3 rounded-md overflow-x-auto my-4" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>

    </div>
  );
};

export default MarkdownRenderer;