import type { CVFormData } from "@/types/cv";

export async function downloadCVAsPdf(
  cvText: string,
  formData: CVFormData,
  options: { withWatermark: boolean; filename?: string }
): Promise<void> {
  const html2pdf = (await import("html2pdf.js")).default;
  const container = document.createElement("div");
  container.style.cssText =
    "padding: 24px; max-width: 210mm; color: #1e293b; font-family: system-ui, sans-serif; font-size: 11pt; line-height: 1.5; background: #fff;";
  container.innerHTML = cvText
    .split("\n")
    .map((p) =>
      p.trim()
        ? `<p style="margin: 0 0 0.6em 0;">${p.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`
        : '<p style="margin: 0 0 0.4em 0;">&nbsp;</p>'
    )
    .join("");
  if (options.withWatermark) {
    const wm = document.createElement("div");
    wm.setAttribute(
      "style",
      "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 28px; color: #94a3b8; opacity: 0.35; pointer-events: none; white-space: nowrap; z-index: 9999;"
    );
    wm.textContent = "CVcraft ile hazırlandı";
    container.style.position = "relative";
    container.appendChild(wm);
  }
  document.body.appendChild(container);
  const filename =
    options.filename ||
    `CV_${formData.fullName || "ozgecmis"}.pdf`.replace(/\s+/g, "_");
  const opt = {
    margin: 10,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  const worker = html2pdf().set(opt).from(container);
  let blob: Blob | null = null;
  try {
    const out = (worker as { output?: (t: string) => Promise<Blob> }).output;
    if (typeof out === "function") blob = await out.call(worker, "blob");
  } catch {}
  document.body.removeChild(container);
  if (blob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  } else {
    document.body.appendChild(container);
    await worker.save();
    document.body.removeChild(container);
  }
}
