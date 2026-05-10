interface Counts {
  critical: number;
  major: number;
  minor: number;
}

interface Props {
  blockersTotal: number;
  blockersOpen: number;
  wasInitiallyClean: boolean;
  counts: Counts;
}

export function StatusBanner({ blockersTotal, blockersOpen, wasInitiallyClean, counts }: Props) {
  const allClear = blockersOpen === 0;
  return (
    <div className={`banner ${allClear ? 'banner--ok' : 'banner--critical'}`}>
      <div className="banner__badge">{allClear ? '✓' : '!'}</div>
      <div className="banner__msg">
        {allClear ? (
          wasInitiallyClean
            ? <>No blocking issues found — <em>ready to submit</em></>
            : <>All blockers resolved — <em>upload a new document version to submit</em></>
        ) : (
          <><em>{blockersOpen} of {blockersTotal} blocking issue{blockersTotal !== 1 ? 's' : ''} (critical, major)</em> remaining — mark each as resolved to continue</>
        )}
      </div>
      <div className="banner__spacer" />
      <div className="banner__counts">
        <span className="item">
          <span className="swatch swatch--c" />
          <span className="num">{counts.critical}</span> critical
        </span>
        <span className="item">
          <span className="swatch swatch--m" />
          <span className="num">{counts.major}</span> major
        </span>
        <span className="item">
          <span className="swatch swatch--n" />
          <span className="num">{counts.minor}</span> minor
        </span>
      </div>
    </div>
  );
}
