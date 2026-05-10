import { FlagOutlined, LockOutlined, SendOutlined, UploadOutlined } from '@ant-design/icons';
import type { IssueWithState, FilterType, Severity } from '../types/review';
import { IssueCard } from './IssueCard';

const FILTER_TABS: { key: FilterType; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'all', label: 'All' },
];

interface Props {
  issues: IssueWithState[];
  visibleIssues: IssueWithState[];
  activeId: string;
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  severityFilter: Severity | null;
  onSeverityFilterChange: (s: Severity | null) => void;
  blockersOpen: number;
  blockersTotal: number;
  blockersResolved: number;
  counts: { critical: number; major: number; minor: number };
  onSelectIssue: (id: string) => void;
  wasInitiallyClean: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
  onUpload: () => void;
}

export function IssueList({
  issues,
  visibleIssues,
  activeId,
  filter,
  onFilterChange,
  severityFilter,
  onSeverityFilterChange,
  blockersOpen,
  blockersTotal,
  blockersResolved,
  counts,
  onSelectIssue,
  wasInitiallyClean,
  canSubmit,
  onSubmit,
  onUpload,
}: Props) {
  const openCount = issues.filter((i) => !i.resolved).length;
  const resolvedCount = issues.filter((i) => i.resolved).length;

  const isBlockersFilter = filter === 'blockers';

  function tabCount(f: FilterType): number {
    if (f === 'open') return openCount;
    if (f === 'resolved') return resolvedCount;
    return issues.length;
  }

  const progressPct = Math.round((blockersResolved / Math.max(1, blockersTotal)) * 100);

  return (
    <aside className="pane">
      <div className="issues-head">
        <div className="issues-head__title">
          Issues <span className="count">{issues.length}</span>
        </div>
        <div className="tabs">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tab ${filter === tab.key && !isBlockersFilter ? 'tab--active' : ''}`}
              onClick={() => onFilterChange(tab.key)}
            >
              {tab.label}
              <span className="pill">{tabCount(tab.key)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="issues-filter">
        <button
          className={`chip ${isBlockersFilter ? 'chip--active' : ''}`}
          onClick={() => onFilterChange(isBlockersFilter ? 'open' : 'blockers')}
          title="Show only blocking issues"
        >
          <FlagOutlined style={{ fontSize: 11 }} /> Blockers only
        </button>
        <button
          className={`chip ${severityFilter === 'critical' ? 'chip--active' : ''}`}
          onClick={() => onSeverityFilterChange(severityFilter === 'critical' ? null : 'critical')}
          title="Filter by critical"
        >
          <span className="dot dot--c" /> {counts.critical}
        </button>
        <button
          className={`chip ${severityFilter === 'major' ? 'chip--active' : ''}`}
          onClick={() => onSeverityFilterChange(severityFilter === 'major' ? null : 'major')}
          title="Filter by major"
        >
          <span className="dot dot--m" /> {counts.major}
        </button>
        <button
          className={`chip ${severityFilter === 'minor' ? 'chip--active' : ''}`}
          onClick={() => onSeverityFilterChange(severityFilter === 'minor' ? null : 'minor')}
          title="Filter by minor"
        >
          <span className="dot dot--n" /> {counts.minor}
        </button>
      </div>

      <div className="issues-list">
        {visibleIssues.map((iss) => (
          <IssueCard
            key={iss.id}
            issue={iss}
            active={iss.id === activeId}
            onSelect={() => onSelectIssue(iss.id)}
          />
        ))}
        {visibleIssues.length === 0 && (
          <div className="issues-empty">No issues match this filter.</div>
        )}
      </div>

      <div className="progress-footer">
        {blockersTotal > 0 && (
          <>
            <div className="progress-footer__row">
              <span className="progress-footer__label">Resolution progress</span>
              <span className="progress-footer__count">{blockersResolved} of {blockersTotal} blockers</span>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-bar__fill ${blockersOpen === 0 ? 'progress-bar__fill--ok' : ''}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </>
        )}
        {!canSubmit ? (
          <>
            <button className="upload-btn upload-btn--locked" disabled>
              <LockOutlined style={{ fontSize: 13 }} /> Upload New Document
            </button>
            <div className="progress-footer__hint">
              Resolve {blockersOpen} more blocker{blockersOpen === 1 ? '' : 's'} to unlock upload
            </div>
          </>
        ) : wasInitiallyClean ? (
          <button className="upload-btn upload-btn--ready" onClick={onSubmit}>
            <SendOutlined style={{ fontSize: 13 }} /> Submit review
          </button>
        ) : (
          <button className="upload-btn upload-btn--ready" onClick={onUpload}>
            <UploadOutlined style={{ fontSize: 13 }} /> Upload New Document
          </button>
        )}
      </div>
    </aside>
  );
}
