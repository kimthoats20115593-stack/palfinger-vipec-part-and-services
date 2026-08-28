import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders admin-entered long-form text (Part.detailVi/En, etc.) as Markdown:
 * headings (###), bold (**text**), bullet/numbered lists, and GFM tables
 * (| a | b |) all render as real HTML instead of showing the raw syntax.
 */
export function MarkdownContent({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={
        "space-y-4 text-sm leading-relaxed text-steel-700 " +
        "[&_h1]:mt-6 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-navy-900 " +
        "[&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-navy-900 " +
        "[&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:text-navy-900 " +
        "[&_h1]:first:mt-0 [&_h2]:first:mt-0 [&_h3]:first:mt-0 " +
        "[&_p]:leading-relaxed " +
        "[&_strong]:font-semibold [&_strong]:text-navy-900 " +
        "[&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 " +
        "[&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 " +
        "[&_a]:font-semibold [&_a]:text-red-600 [&_a]:underline " +
        "[&_img]:my-2 [&_img]:w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-steel-100 " +
        "dark:[&_img]:border-navy-800 " +
        "[&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border [&_table]:border-steel-100 " +
        "[&_th]:border-b [&_th]:border-steel-100 [&_th]:bg-steel-50 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-bold [&_th]:text-navy-900 " +
        "[&_td]:border-b [&_td]:border-steel-100 [&_td]:px-4 [&_td]:py-2.5 [&_td]:align-top " +
        "dark:text-steel-300 " +
        "dark:[&_h1]:text-white dark:[&_h2]:text-white dark:[&_h3]:text-white " +
        "dark:[&_strong]:text-white " +
        "dark:[&_table]:border-navy-800 dark:[&_th]:border-navy-800 dark:[&_th]:bg-navy-900 dark:[&_th]:text-white dark:[&_td]:border-navy-800 " +
        (className ?? "")
      }
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
