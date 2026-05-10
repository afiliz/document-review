import {
  InboxOutlined,
  FileTextOutlined,
  FolderOutlined,
  TeamOutlined,
  BarChartOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  MessageOutlined,
} from '@ant-design/icons';

const NAV_ITEMS = [
  { key: 'inbox', label: 'Inbox', icon: <InboxOutlined style={{ fontSize: 18 }} /> },
  { key: 'list', label: 'Reviews', icon: <FileTextOutlined style={{ fontSize: 18 }} /> },
  { key: 'folder', label: 'Documents', icon: <FolderOutlined style={{ fontSize: 18 }} /> },
  { key: 'person', label: 'Clients', icon: <TeamOutlined style={{ fontSize: 18 }} /> },
  { key: 'bars', label: 'Reports', icon: <BarChartOutlined style={{ fontSize: 18 }} /> },
];

export function Rail() {
  return (
    <aside className="rail" aria-label="Navigation">
      <div className="rail__brand">
        <img src="/home_vision.svg" width="28" height="28" alt="HomeVision" />
      </div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          className={`rail__btn ${item.key === 'list' ? 'rail__btn--active' : ''}`}
          title={item.label}
          aria-label={item.label}
        >
          {item.icon}
        </button>
      ))}
      <div className="rail__divider" />
      <button className="rail__btn" title="Notifications" aria-label="Notifications">
        <BellOutlined style={{ fontSize: 18 }} />
      </button>
      <div className="rail__spacer" />
      <button className="rail__btn" title="Help" aria-label="Help">
        <QuestionCircleOutlined style={{ fontSize: 18 }} />
      </button>
      <button className="rail__btn" title="Messages" aria-label="Messages">
        <MessageOutlined style={{ fontSize: 18 }} />
      </button>
      <div className="rail__avatar" title="Jane Cooper">JC</div>
    </aside>
  );
}
