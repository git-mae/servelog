import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

let initialized = false;
function init() {
  if (initialized) return;
  initialized = true;
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    securityLevel: "loose",
    fontFamily: "inherit",
    themeVariables: {
      primaryColor: "#dce5d4",
      primaryTextColor: "#1f3a2a",
      primaryBorderColor: "#2d5a3d",
      lineColor: "#6b8a72",
      tertiaryColor: "#f5f0e8",
      background: "#ffffff",
      fontSize: "13px",
    },
  });
}

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    init();
    let cancelled = false;
    mermaid
      .render(`m-${id}`, chart)
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch((e) => {
        if (!cancelled) setErr(String(e?.message ?? e));
      });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (err) {
    return (
      <pre className="overflow-auto rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-[11px] text-destructive">
        {err}
      </pre>
    );
  }
  return (
    <div
      ref={ref}
      className="mermaid-host w-full overflow-x-auto [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
