/**
 * Renders a schema.org graph as a JSON-LD script tag.
 *
 * `</script>` inside a string value would close the tag early, so the
 * serialised JSON has its forward slashes escaped before it reaches the DOM.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
