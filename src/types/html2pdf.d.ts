declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: { scale?: number };
    jsPDF?: { unit?: string; format?: string; orientation?: string };
  }
  interface Worker {
    set(options: Html2PdfOptions): Worker;
    from(element: HTMLElement): Worker;
    output(type: "blob"): Promise<Blob>;
    save(filename?: string): Promise<void>;
  }
  function html2pdf(): Worker;
  export default html2pdf;
}
