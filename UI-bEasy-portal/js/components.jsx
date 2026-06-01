/* ============================================================
   bEasy Portal — shared components & RBAC-aware primitives
   ============================================================ */
const { useState, useEffect, useRef, createContext, useContext, useMemo } = React;

const ICON = (n) => "assets/icons/" + n;
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

function Icon({ name, style, cls }) {
  return <img className={cls || "ic"} src={ICON(name)} style={style} alt="" draggable="false" />;
}

function Avatar({ text, color, darkText, size = 30, rounded = "50%" }) {
  return (
    <div className="avatar-sm" style={{ width: size, height: size, borderRadius: rounded, background: color || "var(--gray-400)", color: darkText ? "#1A1A1A" : "#fff", fontSize: size < 28 ? 10 : 11 }}>
      {text}
    </div>
  );
}

const VAR_CLS = { s: "s", w: "w", e: "e", n: "n", info: "info", brand: "brand" };
function Badge({ label, variant }) {
  return <span className={"badge " + (VAR_CLS[variant] || "n")}><span className="dot"></span>{label}</span>;
}

/* ---- render a data cell by its declared type ---- */
function Cell({ col, value }) {
  if (value == null) return <span style={{ color: "var(--gray-300)" }}>—</span>;
  if (value && value._t === "badge") return <Badge label={value.label} variant={value.variant} />;
  if (value && value._t === "tag") return <span className="tag">{value.v}</span>;
  if (value && value._t === "money") return <span className="money">{value.v}</span>;
  if (value && value._t === "two") return (<div className="two"><b>{value.top}</b><span>{value.sub}</span></div>);
  if (col.type === "mono") return <span className="mono">{value}</span>;
  if (col.type === "money") return <span className="money">{value}</span>;
  if (col.type === "date") return <span style={{ color: "var(--gray-600)" }}>{value}</span>;
  return <span>{value}</span>;
}

/* ---- Button ---- */
function Btn({ kind = "secondary", icon, children, sm, gated, onClick, disabled, style, type }) {
  const { anno } = useApp() || {};
  const extra = anno && gated ? { "data-gated": gated } : {};
  return (
    <button type={type || "button"} className={"btn btn-" + kind + (sm ? " sm" : "")} onClick={onClick} disabled={disabled} style={style} {...extra}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

/* ---- Gated wrapper: render children only if the role can do `action`.
   When annotations are on, the child is tagged with the action's short label. ---- */
function Gate({ action, children }) {
  const { can, anno, ACT } = useApp();
  if (!can(action)) return null;
  if (anno && React.isValidElement(children)) {
    return React.cloneElement(children, { "data-gated": (ACT[action] && ACT[action].short) || action });
  }
  return children;
}

/* ---- Icon action button for table rows ---- */
function RowIcon({ name, title, danger, onClick }) {
  return (
    <button className={"ic-btn" + (danger ? " danger" : "")} title={title} onClick={onClick}>
      <Icon name={name} />
    </button>
  );
}

/* ---- KPI card ---- */
function KPI({ icon, label, num, delta, dir, note, color }) {
  return (
    <div className="kpi">
      <div className="label"><Icon name={icon} />{label}</div>
      <div className="num" style={color ? { color } : null}>{num}</div>
      {delta && (
        <div className={"delta " + (dir || "up")}>
          <span className="trend"><Icon name={dir === "down" ? "TrendDown01.svg" : "TrendUp01.svg"} />{delta}</span>
          <span className="muted">{note}</span>
        </div>
      )}
    </div>
  );
}

/* ---- Page header ---- */
function PageHead({ eyebrow, title, sub, actions }) {
  return (
    <div className="page-head">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {sub && <p className="sub">{sub}</p>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}

/* ---- Drawer ---- */
function Drawer({ open, onClose, title, sub, wide, children, footer }) {
  const [mounted, setMounted] = useState(open);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (open) { setMounted(true); const t = setTimeout(() => setShow(true), 20); return () => clearTimeout(t); }
    else { setShow(false); const t = setTimeout(() => setMounted(false), 260); return () => clearTimeout(t); }
  }, [open]);
  if (!mounted) return null;
  return (
    <React.Fragment>
      <div className={"scrim" + (show ? " show" : "")} onClick={onClose}></div>
      <aside className={"drawer" + (wide ? " wide" : "") + (show ? " show" : "")}>
        <div className="drawer-head">
          <div>
            <h3>{title}</h3>
            {sub && <p>{sub}</p>}
          </div>
          <button className="ic-btn x" onClick={onClose}><Icon name="XClose.svg" /></button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </aside>
    </React.Fragment>
  );
}

/* ---- Form primitives ---- */
function Field({ label, req, hint, children }) {
  return (
    <div className="field">
      {label && <label>{label}{req && <span className="req">*</span>}</label>}
      {children}
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}
function Input(props) { return <input className="input" {...props} />; }
function Select({ children, ...p }) { return <select className="select" {...p}>{children}</select>; }
function TextArea(props) { return <textarea className="input" rows={props.rows || 3} {...props} />; }

/* ---- Toolbar (filters + search) ---- */
function Toolbar({ filters, active, onFilter, query, onQuery, right }) {
  return (
    <div className="toolbar">
      {filters && (
        <div className="seg">
          {filters.map((f, i) => (
            <button key={f} className={i === active ? "on" : ""} onClick={() => onFilter(i)}>{f}</button>
          ))}
        </div>
      )}
      <div className="tb-search">
        <Icon name="SearchLg.svg" />
        <input placeholder="Search…" value={query} onChange={(e) => onQuery(e.target.value)} />
      </div>
      <button className="chip-filter"><Icon name="FilterFunnel01.svg" />Filters</button>
      <div className="tb-spacer"></div>
      {right}
    </div>
  );
}

/* ---- Pager ---- */
function Pager({ page, pages, onPage, total, shown, unit = "records" }) {
  const nums = [];
  for (let i = 1; i <= pages; i++) nums.push(i);
  return (
    <div className="tbl-foot">
      Showing {shown} of {total} {unit}
      <div className="pager">
        <button className="pager-btn" onClick={() => onPage(Math.max(1, page - 1))}><Icon name="ChevronLeft.svg" /></button>
        {nums.map((n) => (
          <button key={n} className={"pager-btn" + (n === page ? " on" : "")} onClick={() => onPage(n)}>{n}</button>
        ))}
        <button className="pager-btn" onClick={() => onPage(Math.min(pages, page + 1))}><Icon name="ChevronRight.svg" /></button>
      </div>
    </div>
  );
}

/* ---- Annotation banner: columns + permission chips for current role ---- */
function AnnoBanner({ columns }) {
  const { module, ACT, ACTION_ORDER, can, roleName } = useApp();
  const caps = module.caps;
  return (
    <div className="anno-banner">
      <div className="ab-head"><Icon name="InfoCircle.svg" />Wireframe annotations — {module.label}</div>
      <div className="anno-grid">
        <div className="anno-block">
          <div className="t">Data columns</div>
          <div className="anno-cols">
            {(columns || []).map((c) => <span key={c.key} className="c">{c.label}</span>)}
            {!columns && <span className="c" style={{ color: "var(--gray-400)" }}>Custom layout</span>}
          </div>
        </div>
        <div className="anno-block">
          <div className="t">Actions — {roleName}</div>
          <div className="perm-list">
            {ACTION_ORDER.filter((a) => caps.includes(a)).map((a) => {
              const ok = can(a);
              return (
                <span key={a} className={"perm-chip " + (ok ? "granted" : "denied")}>
                  <Icon name={ok ? "Check.svg" : "Lock01.svg"} />{ACT[a].label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AppCtx, useApp, ICON, Icon, Avatar, Badge, Cell, Btn, Gate, RowIcon,
  KPI, PageHead, Drawer, Field, Input, Select, TextArea, Toolbar, Pager, AnnoBanner,
});
