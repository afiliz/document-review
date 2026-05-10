import { FileTextOutlined } from '@ant-design/icons';
import type { Review } from '../types/review';

interface Props {
  review: Review;
}

const STATUS_LABELS: Record<string, string> = {
  created: 'Created',
  processing: 'Processing',
  on_review: 'On Review',
  submitted: 'Submitted',
};

export function MetaStrip({ review }: Props) {
  const uploaded = new Date(review.uploaded_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="meta">
      <div className="meta__icon"><FileTextOutlined style={{ fontSize: 13 }} /></div>
      <div className="meta__name" title={review.name}>{review.name}</div>
      <div className="meta__chip">v{review.version}</div>
      <div className="meta__sep" />
      <div className="meta__field">
        <span className="lbl">Uploaded</span>
        <span className="val">{uploaded}</span>
      </div>
      <div className="meta__field">
        <span className="lbl">Status</span>
        <span className="val">
          <span className="meta__status-dot" />
          {STATUS_LABELS[review.status] ?? review.status}
        </span>
      </div>
      <div className="meta__field">
        <span className="lbl">Pages</span>
        <span className="val">{review.document.pages.length}</span>
      </div>
      <div className="meta__spacer" />
      <div className="meta__field" style={{ alignItems: 'flex-end' }}>
        <span className="lbl">Assigned</span>
      </div>
      <div className="meta__assigned">
        <div className="meta__avatar">
          {review.user.first_name[0]}{review.user.last_name[0]}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600 }}>
          {review.user.first_name} {review.user.last_name}
        </span>
      </div>
    </div>
  );
}
