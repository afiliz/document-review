import {
  CheckOutlined,
  LeftOutlined,
  RightOutlined,
  StepForwardOutlined,
  FileOutlined,
} from '@ant-design/icons';
import type { IssueWithState } from '../types/review';

const SEV_LABELS: Record<string, string> = {
  critical: 'Critical issue',
  major: 'Major issue',
  minor: 'Minor issue',
};

const SEV_DOT_COLORS: Record<string, string> = {
  critical: 'var(--critical)',
  major: 'var(--major)',
  minor: 'var(--minor)',
  resolved: 'var(--resolved)',
};

interface Props {
  issue: IssueWithState;
  activePos: number | null;
  activeTotal: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: () => void;
  onResolve: () => void;
  onAcknowledge: () => void;
  allClear: boolean;
}

export function IssueDetailPanel({
  issue,
  activePos,
  activeTotal,
  onPrev,
  onNext,
  onJump,
  onResolve,
  onAcknowledge,
  allClear,
}: Props) {
  const sev = issue.severity;
  const isResolved = issue.resolved;
  const isAcknowledged = issue.acknowledged;

  const sevClass = isResolved
    ? 'detail__sev--resolved'
    : `detail__sev--${sev}`;

  const dotColor = isResolved ? SEV_DOT_COLORS.resolved : SEV_DOT_COLORS[sev];

  const eyebrowLabel = isResolved
    ? 'Resolved'
    : activePos !== null
    ? `Issue ${activePos} of ${activeTotal}`
    : '—';

  return (
    <aside className="pane detail">
      <div className="detail__body">
        <div className="detail__eyebrow">
          <span>{eyebrowLabel}</span>
        </div>

        <div className="detail__sev-row">
          <span className={`detail__sev ${sevClass}`}>
            <span className="d" style={{ background: dotColor }} />
            {isResolved
              ? `${SEV_LABELS[sev]} · resolved`
              : isAcknowledged && sev === 'minor'
              ? `${SEV_LABELS[sev]} · acknowledged`
              : SEV_LABELS[sev]}
          </span>
        </div>

        <h2 className="detail__title">{issue.title}</h2>

        <button className="detail__page-link" onClick={onJump}>
          <FileOutlined style={{ fontSize: 12 }} /> Page {issue.page} <span className="arrow">→</span>
        </button>

        <div className="detail__section">
          <h4>What we found</h4>
          <p>{issue.description}</p>
        </div>

        <div className="detail__section">
          <h4>How to fix</h4>
          <p>
            {sev === 'critical' || sev === 'major'
              ? 'Fix the issue in the source document and upload a new version. Once uploaded, this issue can be marked as resolved.'
              : 'Review and update this item in the source document if needed, or acknowledge to proceed with submission.'}
          </p>
        </div>
      </div>

      <div className="detail__actions" key={`${issue.id}-${sev}-${isResolved}`}>
        {isResolved ? (
          <>
            <div className="detail__resolved-note">
              Marked resolved · upload {allClear ? 'unlocked' : 'pending other blockers'}
            </div>
            <div className="cta-row">
              <button className="cta cta--secondary" onClick={onPrev}><LeftOutlined style={{ fontSize: 12 }} /> Prev</button>
              <button className="cta cta--secondary" onClick={onNext}>Next <RightOutlined style={{ fontSize: 12 }} /></button>
            </div>
          </>
        ) : sev === 'minor' ? (
          <>
            <button
              className={`cta ${isAcknowledged ? 'cta--success' : 'cta--secondary'}`}
              onClick={onAcknowledge}
            >
              <CheckOutlined style={{ fontSize: 13 }} /> {isAcknowledged ? 'Acknowledged' : 'Acknowledge'}
            </button>
            <div className="cta-row">
              <button className="cta cta--secondary" onClick={onPrev}><LeftOutlined style={{ fontSize: 12 }} /> Prev</button>
              <button className="cta cta--secondary" onClick={onNext}>Skip <StepForwardOutlined style={{ fontSize: 12 }} /></button>
            </div>
          </>
        ) : (
          <>
            <button className="cta cta--primary" onClick={onResolve}>
              <CheckOutlined style={{ fontSize: 13 }} /> Mark as resolved
            </button>
            <div className="cta-row">
              <button className="cta cta--secondary" onClick={onPrev}><LeftOutlined style={{ fontSize: 12 }} /> Prev</button>
              <button className="cta cta--secondary" onClick={onNext}>Next <RightOutlined style={{ fontSize: 12 }} /></button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
