import { useState, useCallback, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  LeftOutlined,
  RightOutlined,
  MinusOutlined,
  PlusOutlined,
  CompressOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
// use cdn version of worker to avoid version mismatch
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDF_URL = '/example_document.pdf';
const PAGE_WIDTH = 612;

interface Props {
  totalPages: number;
  currentPage: number;
  activePos: number | null;
  activeTotal: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function PdfViewer({
  totalPages,
  currentPage,
  activePos,
  activeTotal,
  scrollRef,
}: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [zoom, setZoom] = useState(100);
  const [viewPage, setViewPage] = useState(currentPage);
  const documentLoadedRef = useRef(false);
  const pendingPageRef = useRef(currentPage);

  const effectiveTotal = numPages || totalPages;

  const scrollToPage = useCallback((page: number) => {
    const el = document.getElementById(`pdf-page-${page}`);
    const container = scrollRef.current;
    if (el && container) {
      const elTop = el.getBoundingClientRect().top;
      const containerTop = container.getBoundingClientRect().top;
      container.scrollBy({ top: elTop - containerTop - 20, behavior: 'smooth' });
    }
  }, [scrollRef]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    documentLoadedRef.current = true;
    // scroll to whichever page was requested before the document finished loading
    const t = setTimeout(() => scrollToPage(pendingPageRef.current), 300);
    return () => clearTimeout(t);
  }, [scrollToPage]);

  useEffect(() => {
    setViewPage(currentPage);
    pendingPageRef.current = currentPage;
    if (!documentLoadedRef.current) return;
    const t = setTimeout(() => scrollToPage(currentPage), 80);
    return () => clearTimeout(t);
  }, [currentPage, scrollToPage]);

  // track visible page so page counter stays accurate
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          const num = parseInt(id.replace('pdf-page-', ''), 10);
          if (!isNaN(num)) setViewPage(num);
        }
      },
      { root: container, threshold: 0.5 }
    );
    const pages = container.querySelectorAll('[id^="pdf-page-"]');
    pages.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, [scrollRef, numPages]);

  const jumpToPage = useCallback((page: number) => {
    setViewPage(page);
    scrollToPage(page);
  }, [scrollToPage]);

  const prevPage = () => jumpToPage(Math.max(1, viewPage - 1));
  const nextPage = () => jumpToPage(Math.min(effectiveTotal, viewPage + 1));

  const scaledWidth = Math.round(PAGE_WIDTH * (zoom / 100));

  return (
    <section className="pane pane--center">
      <div className="viewer">
        <div className="viewer__toolbar">
          <div className="tbtn-group">
            <button className="tbtn tbtn--icon" onClick={prevPage} title="Previous page"><LeftOutlined style={{ fontSize: 13 }} /></button>
            <div className="viewer__page-display">
              Page <strong style={{ marginLeft: 2 }}>{viewPage}</strong>
              <span className="total" style={{ marginLeft: 4 }}>of {effectiveTotal}</span>
            </div>
            <button className="tbtn tbtn--icon" onClick={nextPage} title="Next page"><RightOutlined style={{ fontSize: 13 }} /></button>
          </div>

          <div className="tbtn-group">
            <button className="tbtn tbtn--icon" onClick={() => setZoom((z) => Math.max(50, z - 10))} title="Zoom out"><MinusOutlined style={{ fontSize: 13 }} /></button>
            <button
              className="tbtn"
              style={{ minWidth: 58, justifyContent: 'center', fontVariantNumeric: 'tabular-nums' }}
              onClick={() => setZoom(100)}
              title="Reset zoom"
            >
              {zoom}%
            </button>
            <button className="tbtn tbtn--icon" onClick={() => setZoom((z) => Math.min(200, z + 10))} title="Zoom in"><PlusOutlined style={{ fontSize: 13 }} /></button>
          </div>

          <button className="tbtn tbtn--icon" title="Fit width" onClick={() => setZoom(100)}><CompressOutlined style={{ fontSize: 13 }} /></button>

          <div className="viewer__spacer" />

          <a href={PDF_URL} download className="tbtn tbtn--icon" title="Download PDF"><DownloadOutlined style={{ fontSize: 13 }} /></a>
        </div>

        <div className="viewer__canvas" ref={scrollRef}>
          <Document
            file={PDF_URL}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-3)', fontSize: 13 }}>
                Loading PDF…
              </div>
            }
            error={
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--critical)', fontSize: 13 }}>
                Failed to load PDF.
              </div>
            }
          >
            {Array.from({ length: effectiveTotal }, (_, i) => i + 1).map((pageNum) => (
              <div
                key={pageNum}
                id={`pdf-page-${pageNum}`}
                className="pdf-page-wrapper"
                style={{ width: scaledWidth }}
              >
                <span className="pdf-page-num">P.{String(pageNum).padStart(2, '0')}</span>
                <Page
                  pageNumber={pageNum}
                  width={scaledWidth}
                  renderTextLayer
                  renderAnnotationLayer
                />
              </div>
            ))}
          </Document>

          <div className="viewer__nav-pill">
            <span className="lbl">
              Issue {activePos ?? '—'} of {activeTotal}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
