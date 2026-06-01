/* ============================================================
   bEasy Portal — pages: generic list, dashboard, overview, roles matrix
   ============================================================ */

/* ---------- Generic detail drawer (View) ---------- */
function DetailDrawer({ open, onClose, module, columns, row }) {
  return (
    <Drawer open={open} onClose={onClose} title={module.label + " record"} sub={module.parent ? module.parent + " · view only" : "Read-only detail"}>
      {row && (
        <dl className="kv">
          {columns.map((c) => {
            const v = row[c.key];
            let text = v;
            if (v && v._t === "two") text = v.top + " · " + v.sub;
            else if (v && (v._t === "money" || v._t === "tag")) text = v.v;
            else if (v && v._t === "badge") text = v.label;
            return (<React.Fragment key={c.key}><dt>{c.label}</dt><dd>{text == null ? "—" : text}</dd></React.Fragment>);
          })}
        </dl>
      )}
      <div className="mini-note" style={{ marginTop: 22 }}><Icon name="InfoCircle.svg" />Fields shown depend on the module schema.</div>
    </Drawer>
  );
}

/* ---------- Generic Add / Edit drawer ---------- */
function FormDrawer({ open, onClose, module, columns, mode, onSave }) {
  return (
    <Drawer open={open} onClose={onClose}
      title={(mode === "edit" ? "Edit " : "New ") + module.label.toLowerCase().replace(/s$/, "")}
      sub={module.parent ? module.parent + " › " + module.label : module.label}
      footer={<React.Fragment>
        <Btn kind="ghost" onClick={onClose}>Cancel</Btn>
        <Btn kind="primary" icon="Check.svg" onClick={onSave}>{mode === "edit" ? "Save changes" : "Create"}</Btn>
      </React.Fragment>}>
      {columns.filter((c) => c.key !== "status").map((c) => (
        <Field key={c.key} label={c.label} req={c.key === columns[0].key}>
          <Input placeholder={"Enter " + c.label.toLowerCase()} defaultValue="" />
        </Field>
      ))}
      <Field label="Status">
        <Select defaultValue="active"><option value="active">Active</option><option value="draft">Draft</option><option value="inactive">Inactive</option></Select>
      </Field>
    </Drawer>
  );
}

/* ---------- Generic role-gated list page ---------- */
function ListPage() {
  const ctx = useApp();
  const { module, can, anno, toast } = ctx;
  const ds = (window.DATASETS && window.DATASETS[module.id]) || { columns: [{ key: "name", label: "Name", type: "text" }], rows: [], filters: ["All"] };
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState(null);
  const [form, setForm] = useState(null);

  const rows = useMemo(() => {
    let r = ds.rows;
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
    }
    return r;
  }, [ds, query]);

  const hasRowActions = ["view", "update", "assign", "delete"].some((a) => module.caps.includes(a));
  const total = module.count || ds.rows.length;

  return (
    <React.Fragment>
      <PageHead
        eyebrow={module.parent}
        title={module.label}
        sub={subtitleFor(module)}
        actions={<React.Fragment>
          <Gate action="export"><Btn kind="secondary" icon="Download01.svg" gated="Export" onClick={() => toast("Exported " + module.label + " to CSV")}>Export</Btn></Gate>
          <Gate action="add"><Btn kind="primary" icon="PlusCircle.svg" gated="Add" onClick={() => setForm({ mode: "add" })}>Add {module.label.toLowerCase().replace(/s$/, "")}</Btn></Gate>
        </React.Fragment>}
      />
      {anno && <AnnoBanner columns={ds.columns} />}

      <div className="card">
        <Toolbar filters={ds.filters} active={filter} onFilter={setFilter} query={query} onQuery={setQuery} />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                {ds.columns.map((c) => <th key={c.key} className={c.type === "num" ? "right" : ""}>{c.label}</th>)}
                {hasRowActions && <th className="right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={ds.columns.length + 1}><div className="empty"><div className="ec"><Icon name="SearchLg.svg" /></div><h4>No matches</h4><p>Try a different search or filter.</p></div></td></tr>
              )}
              {rows.map((row, i) => (
                <tr key={i}>
                  {ds.columns.map((c) => <td key={c.key} className={c.type === "num" ? "right" : ""}><Cell col={c} value={row[c.key]} /></td>)}
                  {hasRowActions && (
                    <td className="right">
                      <div className="row-actions">
                        <Gate action="view"><RowIcon name="Eye.svg" title="View" onClick={() => setView(row)} /></Gate>
                        <Gate action="assign"><RowIcon name="User01.svg" title="Assign" onClick={() => toast("Assignment opened")} /></Gate>
                        <Gate action="update"><RowIcon name="Edit01.svg" title="Edit" onClick={() => setForm({ mode: "edit", row })} /></Gate>
                        <Gate action="delete"><RowIcon name="Trash01.svg" title="Delete" danger onClick={() => toast(module.label + " record deleted")} /></Gate>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={page} pages={Math.max(1, Math.ceil(total / 10))} onPage={setPage} total={total} shown={rows.length} unit={pluralUnit(module)} />
      </div>

      <DetailDrawer open={!!view} onClose={() => setView(null)} module={module} columns={ds.columns} row={view} />
      <FormDrawer open={!!form} onClose={() => setForm(null)} module={module} columns={ds.columns} mode={form && form.mode}
        onSave={() => { setForm(null); toast(module.label + (form && form.mode === "edit" ? " updated" : " created")); }} />
    </React.Fragment>
  );
}

function subtitleFor(m) {
  const map = {
    activity: "Immutable audit trail of every action in the portal",
    chat: "Live customer conversations across channels",
    exchange: "Currency rates applied to multi-currency billing",
    "fin-orders": "Settled order revenue, commission and net",
    "fin-topup": "Customer wallet top-ups",
    "fin-bcombo": "Bundle (BCombo) sales performance",
    "fin-direct": "Field-sales direct revenue",
    partner: "Service partner companies and their fleets",
    "partner-tracking": "Real-time cleaner location and job status",
    cleaner: "Individual cleaners across all partners",
    "mkt-customer": "Customer marketing segments",
    "mkt-users": "All app users",
    "mkt-coupon": "Promo codes and redemption",
    "mkt-otp": "One-time-password delivery log",
    "mkt-notification": "Push and in-app campaigns",
    "mkt-banner": "In-app and web banner placements",
    "cust-overview": "All customers — registered and direct",
    "cust-direct": "B2B and direct-sale accounts",
    "cust-registered": "App-registered customers",
    "cust-tickets": "Support tickets and escalations",
    "setup-items": "Service catalogue and add-ons",
    "setup-schedule": "Bookable time slots by zone",
  };
  return map[m.id] || "Manage " + m.label.toLowerCase();
}
function pluralUnit(m) {
  const map = { activity: "events", chat: "threads", exchange: "rates", cleaner: "cleaners", partner: "partners", "cust-tickets": "tickets", "mkt-coupon": "coupons", "mkt-otp": "messages", "setup-items": "items", "setup-schedule": "slots" };
  return map[m.id] || "records";
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard() {
  const { roleName } = useApp();
  return (
    <React.Fragment>
      <div className="feature">
        <div className="ico"><Icon name="Zap.svg" /></div>
        <div className="body">
          <h4>bEasy operations are running smoothly today</h4>
          <p>248 orders in the pipeline · 4 partner applications awaiting review · 2 payouts due.</p>
        </div>
        <span className="role-pill">Signed in as {roleName}</span>
      </div>

      <PageHead eyebrow="Tuesday · 30 May 2026" title="Operations dashboard" sub="A live overview of orders, partners and revenue across bEasy." />

      <div className="kpis">
        <KPI icon="ShoppingBag01.svg" label="Orders today" num="248" delta="12.4%" dir="up" note="vs. yesterday" />
        <KPI icon="currency-dollar.svg" label="Revenue (AED)" num="86.4k" delta="8.1%" dir="up" note="vs. yesterday" />
        <KPI icon="User01.svg" label="Active cleaners" num="132" delta="6" dir="up" note="on shift" />
        <KPI icon="AlertTriangle.svg" label="Open tickets" num="18" delta="3" dir="down" note="vs. last week" color="var(--gray-900)" />
      </div>

      <div className="row2">
        <section className="card">
          <div className="card-head"><h3>Orders over time</h3><div className="actions"><div className="seg"><button>7D</button><button className="on">30D</button><button>90D</button></div></div></div>
          <div style={{ padding: "16px 20px 22px" }}>
            <svg viewBox="0 0 720 220" preserveAspectRatio="none" style={{ width: "100%", height: 220, display: "block" }}>
              <g stroke="#E5E5E5" strokeWidth="1">
                <line x1="40" y1="20" x2="720" y2="20" /><line x1="40" y1="70" x2="720" y2="70" /><line x1="40" y1="120" x2="720" y2="120" /><line x1="40" y1="170" x2="720" y2="170" />
              </g>
              <g fontFamily="Inter" fontSize="10" fill="#A3A3A3"><text x="0" y="24">320</text><text x="0" y="74">240</text><text x="0" y="124">160</text><text x="0" y="174">80</text></g>
              <defs><linearGradient id="dg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#E52B33" stopOpacity="0.16" /><stop offset="1" stopColor="#E52B33" stopOpacity="0" /></linearGradient></defs>
              <path d="M40,160 L120,150 L200,120 L280,134 L360,100 L440,86 L520,96 L600,60 L680,48 L680,200 L40,200 Z" fill="url(#dg)" />
              <polyline points="40,160 120,150 200,120 280,134 360,100 440,86 520,96 600,60 680,48" fill="none" stroke="#E52B33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="40,178 120,172 200,166 280,168 360,150 440,146 520,140 600,128 680,120" fill="none" stroke="#1B4CFA" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
              <g fill="#fff" stroke="#E52B33" strokeWidth="2"><circle cx="600" cy="60" r="4" /><circle cx="680" cy="48" r="4" /></g>
              <g fontFamily="Inter" fontSize="11" fill="#737373" textAnchor="middle"><text x="40" y="200">W1</text><text x="200" y="200">W2</text><text x="360" y="200">W3</text><text x="520" y="200">W4</text><text x="680" y="200">Now</text></g>
            </svg>
            <div style={{ display: "flex", gap: 18, fontSize: 12, color: "var(--gray-600)", marginTop: 8 }}>
              <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#E52B33", marginRight: 6 }}></span>Completed orders</span>
              <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#1B4CFA", marginRight: 6 }}></span>New customers</span>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h3>Cleaner availability</h3><span className="badge info"><span className="dot"></span>Live</span></div>
          <div>
            {window.DATA.cleaners.slice(0, 5).map((c) => (
              <div className="feed-item" key={c.id}>
                <Avatar text={c.name.split(" ").map((x) => x[0]).join("")} color={c.status === "available" ? "var(--success-500)" : c.status === "on-job" ? "var(--info-500)" : "var(--gray-400)"} size={34} />
                <div className="who"><b>{c.name}</b><span>{c.zone} · {c.jobs} jobs</span></div>
                <Badge label={c.status === "available" ? "Available" : c.status === "on-job" ? "On-job" : "Off"} variant={c.status === "available" ? "s" : c.status === "on-job" ? "info" : "n"} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="row2">
        <section className="card">
          <div className="card-head"><h3>Recent orders</h3><div className="actions"><span className="badge n">{window.DATA.orders.length} shown</span></div></div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Order</th><th>Customer</th><th>Service</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {window.DATA.orders.slice(0, 5).map((o) => (
                  <tr key={o.code}>
                    <td className="mono">{o.code}</td>
                    <td><div className="two"><b>{o.customer}</b><span>{o.area}</span></div></td>
                    <td style={{ color: "var(--gray-600)" }}>{o.service}</td>
                    <td className="money">{o.amount}</td>
                    <td><OrderBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card-head"><h3>Needs attention</h3></div>
          <div>
            <div className="feed-item"><Avatar text="9" color="var(--warning-500)" darkText size={34} rounded="9px" /><div className="who"><b>Partner applications</b><span>Awaiting onboarding review</span></div><Icon name="ChevronRight.svg" style={{ opacity: 0.4 }} /></div>
            <div className="feed-item"><Avatar text="2" color="var(--success-500)" size={34} rounded="9px" /><div className="who"><b>Payouts due</b><span>AED 55,760 ready to release</span></div><Icon name="ChevronRight.svg" style={{ opacity: 0.4 }} /></div>
            <div className="feed-item"><Avatar text="3" color="var(--error-500)" size={34} rounded="9px" /><div className="who"><b>Escalated tickets</b><span>Refund and damage claims</span></div><Icon name="ChevronRight.svg" style={{ opacity: 0.4 }} /></div>
            <div className="feed-item"><Avatar text="1" color="var(--info-500)" size={34} rounded="9px" /><div className="who"><b>Unassigned order</b><span>ORD-90412 · Marina · 14:00</span></div><Icon name="ChevronRight.svg" style={{ opacity: 0.4 }} /></div>
          </div>
        </section>
      </div>
    </React.Fragment>
  );
}

const ORDER_STATUS = {
  unassigned: { label: "Unassigned", variant: "w" },
  assigned: { label: "Assigned", variant: "info" },
  "in-progress": { label: "In progress", variant: "brand" },
  completed: { label: "Completed", variant: "s" },
  cancelled: { label: "Cancelled", variant: "e" },
};
function OrderBadge({ status }) { const s = ORDER_STATUS[status] || { label: status, variant: "n" }; return <Badge label={s.label} variant={s.variant} />; }

/* ============================================================
   MARKETING OVERVIEW (view-only KPI page)
   ============================================================ */
function MarketingOverview() {
  const { anno } = useApp();
  return (
    <React.Fragment>
      <PageHead eyebrow="Marketing" title="Marketing overview" sub="Campaign reach, coupon performance and customer growth." />
      {anno && <AnnoBanner columns={null} />}
      <div className="kpis">
        <KPI icon="Users01.svg" label="New customers (30d)" num="3,412" delta="14%" dir="up" note="vs. prior" />
        <KPI icon="Tag01.svg" label="Coupon redemptions" num="7,836" delta="9%" dir="up" note="vs. prior" />
        <KPI icon="Bell01.svg" label="Campaign reach" num="124k" delta="22%" dir="up" note="vs. prior" />
        <KPI icon="CreditCard01.svg" label="Payment links paid" num="68%" delta="4%" dir="down" note="conversion" color="var(--gray-900)" />
      </div>
      <div className="row2">
        <section className="card">
          <div className="card-head"><h3>Top campaigns</h3></div>
          <div className="tbl-wrap"><table className="tbl">
            <thead><tr><th>Campaign</th><th>Channel</th><th className="right">Reach</th><th className="right">CTR</th></tr></thead>
            <tbody>
              <tr><td><div className="two"><b>Weekend 20% off</b><span>Active</span></div></td><td><span className="tag">Push</span></td><td className="right">42,100</td><td className="right">6.2%</td></tr>
              <tr><td><div className="two"><b>Refer a friend</b><span>Ongoing</span></div></td><td><span className="tag">In-app</span></td><td className="right">28,900</td><td className="right">4.8%</td></tr>
              <tr><td><div className="two"><b>Summer cleaning sale</b><span>Banner</span></div></td><td><span className="tag">App home</span></td><td className="right">61,400</td><td className="right">3.1%</td></tr>
            </tbody>
          </table></div>
        </section>
        <section className="card">
          <div className="card-head"><h3>Coupon performance</h3></div>
          <div>
            {[["CLEAN30", "1,204", "var(--success-500)"], ["WELCOME10", "3,890", "var(--info-500)"], ["SUMMER50", "642", "var(--bnow-500)"]].map(([c, n, col]) => (
              <div className="feed-item" key={c}><Avatar text={<Icon name="Tag01.svg" style={{ filter: "invert(1)", width: 15, height: 15 }} />} color={col} size={34} rounded="9px" /><div className="who"><b>{c}</b><span>{n} redemptions</span></div></div>
            ))}
          </div>
        </section>
      </div>
    </React.Fragment>
  );
}

/* ============================================================
   ROLES & PERMISSIONS MATRIX  (live editor)
   ============================================================ */
function RolesMatrix() {
  const { grants, setPerm, ROLES, GROUPS, MODULES, ACT, ACTION_ORDER, toast } = useApp();
  const [roleId, setRoleId] = useState("ops");
  const role = ROLES.find((r) => r.id === roleId);

  return (
    <React.Fragment>
      <PageHead eyebrow="Administration" title="Roles & permissions"
        sub="Grant or revoke actions per module. Changes apply live — switch roles in the top bar to preview."
        actions={<Btn kind="secondary" icon="RefreshCcw01.svg" onClick={() => toast("Permissions reset to defaults")}>Reset</Btn>} />

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="toolbar" style={{ gap: 8 }}>
          {ROLES.map((r) => (
            <button key={r.id} className={"role-tab" + (r.id === roleId ? " on" : "")} onClick={() => setRoleId(r.id)}>
              <span className="role-av" style={{ background: r.color, color: r.darkText ? "#1A1A1A" : "#fff" }}>{r.initials}</span>
              {r.name}
            </button>
          ))}
        </div>
        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--outline-soft)" }}>
          <span className="role-av" style={{ width: 38, height: 38, borderRadius: 9, fontSize: 13, background: role.color, color: role.darkText ? "#1A1A1A" : "#fff" }}>{role.initials}</span>
          <div><div style={{ fontWeight: 700, fontSize: 15 }}>{role.name}</div><div style={{ fontSize: 13, color: "var(--gray-500)" }}>{role.blurb}</div></div>
          {roleId === "super" && <span className="badge brand" style={{ marginLeft: "auto" }}><span className="dot"></span>Full access — locked</span>}
        </div>

        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th className="mod-col">Module</th>
                {ACTION_ORDER.map((a) => <th key={a}>{ACT[a].short}</th>)}
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((g) => {
                const mods = MODULES.filter((m) => m.group === g.id);
                if (!mods.length) return null;
                return (
                  <React.Fragment key={g.id}>
                    <tr className="grp-row"><td colSpan={ACTION_ORDER.length + 1}>{g.label}</td></tr>
                    {mods.map((m) => (
                      <tr key={m.id}>
                        <td className="mod-cell"><b>{m.parent ? m.parent + " › " + m.label : m.label}</b></td>
                        {ACTION_ORDER.map((a) => {
                          const supported = m.caps.includes(a);
                          if (!supported) return <td key={a} className="perm"><span className="pcell na" title="Not applicable"></span></td>;
                          const on = ((grants[roleId] && grants[roleId][m.id]) || []).includes(a);
                          const locked = roleId === "super";
                          return (
                            <td key={a} className="perm">
                              <span className={"pcell" + (on ? " on" : "")} title={ACT[a].label}
                                onClick={() => { if (!locked) setPerm(roleId, m.id, a, !on); }}
                                style={locked ? { cursor: "not-allowed" } : null}>
                                {on && <Icon name="Check.svg" />}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mini-note"><Icon name="InfoCircle.svg" />Hatched cells mean the module does not support that action at all. View must be granted for a module to appear in that role's sidebar.</div>
    </React.Fragment>
  );
}

Object.assign(window, { ListPage, Dashboard, MarketingOverview, RolesMatrix, OrderBadge, ORDER_STATUS });
