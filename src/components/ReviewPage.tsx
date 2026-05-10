import { useState, useMemo, useCallback, useRef } from 'react';
import { message } from 'antd';
import type { IssueWithState, FilterType, Severity } from '../types/review';
import type { Review } from '../types/review';
import { Rail } from './Rail';
import { TopBar } from './TopBar';
import { MetaStrip } from './MetaStrip';
import { StatusBanner } from './StatusBanner';
import { IssueList } from './IssueList';
import { PdfViewer } from './PdfViewer';
import { IssueDetailPanel } from './IssueDetailPanel';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  review: Review;
}

export function ReviewPage({ review }: Props) {
  const [issues, setIssues] = useState<IssueWithState[]>(() =>
    review.issues.map((i) => ({ ...i, resolved: false, acknowledged: false }))
  );

  const initialActiveId = useMemo(() => {
    const blockersSorted = review.issues
      .filter((i) => i.severity === 'critical' || i.severity === 'major')
      .sort((a, b) => a.page - b.page);
    return (blockersSorted[0] ?? review.issues[0]).id;
  }, [review.issues]);

  const [activeId, setActiveId] = useState<string>(initialActiveId);
  const [filter, setFilter] = useState<FilterType>('open');
  const [severityFilter, setSeverityFilter] = useState<Severity | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    () => review.issues.find((i) => i.id === initialActiveId)?.page ?? 1
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => ({
    critical: issues.filter((i) => i.severity === 'critical' && !i.resolved).length,
    major: issues.filter((i) => i.severity === 'major' && !i.resolved).length,
    minor: issues.filter((i) => i.severity === 'minor' && !i.acknowledged).length,
  }), [issues]);

  const wasInitiallyClean = useMemo(
    () => review.issues.filter((i) => i.severity === 'critical' || i.severity === 'major').length === 0,
    [review.issues]
  );

  const blockers = useMemo(
    () => issues.filter((i) => i.severity === 'critical' || i.severity === 'major'),
    [issues]
  );
  const blockersOpen = useMemo(() => blockers.filter((i) => !i.resolved).length, [blockers]);
  const blockersTotal = blockers.length;
  const blockersResolved = blockersTotal - blockersOpen;
  const canSubmit = blockersOpen === 0;

  const openBlockers = useMemo(() => blockers.filter((i) => !i.resolved), [blockers]);

  const activeIssue = useMemo(
    () => issues.find((i) => i.id === activeId) ?? issues[0],
    [issues, activeId]
  );

  const visibleIssues = useMemo(() => {
    const SEV_ORDER: Record<string, number> = { critical: 0, major: 1, minor: 2 };
    const sort = (list: typeof issues) =>
      [...list].sort((a, b) => {
        const sevDiff = (SEV_ORDER[a.severity] ?? 3) - (SEV_ORDER[b.severity] ?? 3);
        return sevDiff !== 0 ? sevDiff : a.page - b.page;
      });

    const bySev = (list: typeof issues) =>
      severityFilter ? list.filter((i) => i.severity === severityFilter) : list;

    if (filter === 'all') {
      const open = sort(bySev(issues.filter((i) => !i.resolved)));
      const resolved = sort(bySev(issues.filter((i) => i.resolved)));
      return [...open, ...resolved];
    }
    if (filter === 'resolved') return sort(bySev(issues.filter((i) => i.resolved)));
    if (filter === 'blockers') return sort(issues.filter((i) => !i.resolved && (i.severity === 'critical' || i.severity === 'major')));
    return sort(bySev(issues.filter((i) => !i.resolved)));
  }, [issues, filter, severityFilter]);

  const activePos = useMemo(() => {
    const idx = visibleIssues.findIndex((i) => i.id === activeId);
    return idx >= 0 ? idx + 1 : null;
  }, [visibleIssues, activeId]);

  const jumpToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const selectIssue = useCallback((id: string) => {
    setActiveId(id);
    const iss = issues.find((i) => i.id === id);
    if (iss) jumpToPage(iss.page);
  }, [issues, jumpToPage]);

  const goPrev = useCallback(() => {
    const idx = visibleIssues.findIndex((i) => i.id === activeId);
    if (idx > 0) selectIssue(visibleIssues[idx - 1].id);
  }, [visibleIssues, activeId, selectIssue]);

  const goNext = useCallback(() => {
    const idx = visibleIssues.findIndex((i) => i.id === activeId);
    if (idx >= 0 && idx < visibleIssues.length - 1) selectIssue(visibleIssues[idx + 1].id);
  }, [visibleIssues, activeId, selectIssue]);

  const handleResolve = useCallback(() => {
    setIssues((prev) =>
      prev.map((i) => (i.id === activeId ? { ...i, resolved: true } : i))
    );
    const nextIdx = visibleIssues.findIndex((i) => i.id === activeId);
    const next = visibleIssues[nextIdx + 1] ?? visibleIssues[nextIdx - 1];
    if (next) selectIssue(next.id);
  }, [activeId, visibleIssues, selectIssue]);

  const handleAcknowledge = useCallback(() => {
    setIssues((prev) =>
      prev.map((i) => (i.id === activeId ? { ...i, acknowledged: !i.acknowledged } : i))
    );
  }, [activeId]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    try {
      // mock submit POST api
      await Promise.resolve();
      message.success('Review submitted successfully!');
    } catch {
      message.error('Submission failed. Please try again.');
    }
  }, [canSubmit]);

  return (
    <div className="app">
      <Rail />
      <div className="main">
        <TopBar review={review} />
        <MetaStrip review={review} />
        <StatusBanner
          blockersTotal={blockersTotal}
          blockersOpen={blockersOpen}
          wasInitiallyClean={wasInitiallyClean}
          counts={counts}
        />
        <div className="workspace">
          <IssueList
            issues={issues}
            visibleIssues={visibleIssues}
            activeId={activeId}
            filter={filter}
            onFilterChange={(f) => { setFilter(f); if (f === 'blockers') setSeverityFilter(null); }}
            severityFilter={severityFilter}
            onSeverityFilterChange={(s) => { setSeverityFilter(s); if (filter === 'blockers') setFilter('open'); }}
            blockersOpen={blockersOpen}
            blockersTotal={blockersTotal}
            blockersResolved={blockersResolved}
            counts={counts}
            onSelectIssue={selectIssue}
            wasInitiallyClean={wasInitiallyClean}
            canSubmit={canSubmit}
            onSubmit={handleSubmit}
            onUpload={() => message.info('Upload flow coming soon.')}
          />
          <ErrorBoundary>
            <PdfViewer
              totalPages={review.document.pages.length}
              currentPage={currentPage}
              activePos={activePos}
              activeTotal={visibleIssues.length}
              scrollRef={scrollRef}
            />
          </ErrorBoundary>
          <IssueDetailPanel
            issue={activeIssue}
            activePos={activePos}
            activeTotal={visibleIssues.length}
            onPrev={goPrev}
            onNext={goNext}
            onJump={() => jumpToPage(activeIssue.page)}
            onResolve={handleResolve}
            onAcknowledge={handleAcknowledge}
            allClear={canSubmit}
          />
        </div>
      </div>
    </div>
  );
}
