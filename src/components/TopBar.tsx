import { SearchOutlined, HistoryOutlined, BellOutlined } from '@ant-design/icons';
import type { Review } from '../types/review';

interface Props {
  review: Review;
}

export function TopBar({ review }: Props) {
  const docName = review.name.replace(/\.pdf$/i, '');
  return (
    <header className="topbar">
      <div className="topbar__crumbs">
        <span className="topbar__crumb">Reviews</span>
        <span className="topbar__sep">/</span>
        <span className="topbar__crumb">Q2 Compliance</span>
        <span className="topbar__sep">/</span>
        <span className="topbar__crumb topbar__crumb--active">{docName}</span>
      </div>
      <div className="topbar__spacer" />
      <span className="topbar__pill">
        <span className="dot" /> AI review complete
      </span>
      <button className="topbar__icon-btn" title="Search" aria-label="Search"><SearchOutlined style={{ fontSize: 16 }} /></button>
      <button className="topbar__icon-btn" title="History" aria-label="History"><HistoryOutlined style={{ fontSize: 16 }} /></button>
      <button className="topbar__icon-btn" title="Notifications" aria-label="Notifications"><BellOutlined style={{ fontSize: 16 }} /></button>
    </header>
  );
}
