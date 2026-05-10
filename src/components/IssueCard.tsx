import { useEffect, useRef } from 'react';
import { FileOutlined, CheckOutlined } from '@ant-design/icons';
import type { IssueWithState } from '../types/review';

interface Props {
  issue: IssueWithState;
  active: boolean;
  onSelect: () => void;
}

function getSevLabel(sev: string): string {
  if (sev === 'critical') return 'Critical';
  if (sev === 'major') return 'Major';
  return 'Minor';
}

function getRailClass(issue: IssueWithState): string {
  if (issue.resolved) return 'icard__rail--resolved';
  return `icard__rail--${issue.severity}`;
}

function getBadgeClass(issue: IssueWithState): string {
  if (issue.resolved) return 'sev-badge sev-badge--resolved';
  return `sev-badge sev-badge--${issue.severity}`;
}

export function IssueCard({ issue, active, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [active]);

  const desc = issue.description.length > 90
    ? issue.description.slice(0, 88) + '…'
    : issue.description;

  const cardClass = [
    'icard',
    active ? 'icard--active' : '',
    issue.resolved ? 'icard--resolved' : '',
    !issue.resolved && issue.acknowledged ? 'icard--acknowledged' : '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={cardClass} onClick={onSelect} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onSelect()}>
      <div className={`icard__rail ${getRailClass(issue)}`} />
      <div className="icard__row">
        <div className="icard__title">{issue.title}</div>
        <span className={getBadgeClass(issue)}>
          {issue.resolved && <CheckOutlined style={{ fontSize: 9 }} />}
          {issue.resolved ? 'Resolved' : getSevLabel(issue.severity)}
        </span>
      </div>
      <div className="icard__sub">{desc}</div>
      <div className="icard__foot">
        <span className="icard__page">
          <FileOutlined style={{ fontSize: 11 }} /> Page {issue.page}
        </span>
        <span className="icard__jump">
          Jump <span className="arrow">→</span>
        </span>
      </div>
    </div>
  );
}
