/* ============================================================
   bEasy Portal — special flows
   Order · Partner Onboarding · Partner Payout · Payment Link
   ============================================================ */

/* ============================================================
   ORDER FLOW  — list → create (full page) → assign → track
   ============================================================ */
function OrderPage() {
  const { can, anno, toast } = useApp();
  const [orders, setOrders] = useState(() => window.DATA.orders.map((o) => ({ ...o })));
  const [sub, setSub] = useState("list");      // list | create | detail
  const [active, setActive] = useState(null);  // order code for detail
  const [assignFor, setAssignFor] = useState(null);
  const [filter, setFilter] = useState(0);
  const [query, setQuery] = useState("");

  const FILTERS = ["All", "Unassigned", "Assigned", "In progress", "Completed"];
  const FKEY = [null, "unassigned", "assigned", "in-progress", "completed"];
  const order = orders.find((o) => o.code === active);

  const visible = orders.filter((o) => {
    if (FKEY[filter] && o.status !== FKEY[filter]) return false;
    if (query.trim() && !JSON.stringify(o).toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  function assignCleaner(code, cleaner) {
    setOrders((os) => os.map((o) => o.code === code ? { ...o, cleaner: cleaner.name, status: o.status === "unassigned" ? "assigned" : o.status } : o));
    setAssignFor(null);
    toast(cleaner.name + " assigned to " + code);
  }
  function advance(code) {
    const flow = ["assigned", "in-progress", "completed"];
    setOrders((os) => os.map((o) => {
      if (o.code !== code) return o;
      const idx = flow.indexOf(o.status);
      const next = idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : o.status;
      return { ...o, status: next };
    }));
    toast("Order status advanced");
  }

  /* ---------- CREATE (full page) ---------- */
  if (sub === "create") {
    return <OrderCreate onCancel={() => setSub("list")} onCreate={(o) => {
      setOrders((os) => [o, ...os]); setSub("list"); toast("Order " + o.code + " created");
    }} />;
  }

  /* ---------- DETAIL / TRACK ---------- */
  if (sub === "detail" && order) {
    return <OrderDetail order={order} onBack={() => setSub("list")}
      onAssign={() => setAssignFor(order.code)} onAdvance={() => advance(order.code)}
      assignDrawer={<AssignDrawer open={assignFor === order.code} onClose={() => setAssignFor(null)} code={order.code} onAssign={(c) => assignCleaner(order.code, c)} />} />;
  }

  /* ---------- LIST ---------- */
  return (
    <React.Fragment>
      <PageHead eyebrow="Core" title="Orders" sub="Create, assign and track cleaning service orders."
        actions={<React.Fragment>
          <Gate action="export"><Btn kind="secondary" icon="Download01.svg" gated="Export" onClick={() => toast("Orders exported")}>Export</Btn></Gate>
          <Gate action="add"><Btn kind="primary" icon="PlusCircle.svg" gated="Add" onClick={() => setSub("create")}>New order</Btn></Gate>
        </React.Fragment>} />
      {anno && <AnnoBanner columns={[{ key: "code", label: "Order #" }, { key: "customer", label: "Customer" }, { key: "service", label: "Service" }, { key: "schedule", label: "Schedule" }, { key: "amount", label: "Amount" }, { key: "cleaner", label: "Cleaner" }, { key: "status", label: "Status" }]} />}

      <div className="card">
        <Toolbar filters={FILTERS} active={filter} onFilter={setFilter} query={query} onQuery={setQuery} />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Order</th><th>Customer</th><th>Service</th><th>Schedule</th><th>Amount</th><th>Cleaner</th><th>Status</th><th className="right">Actions</th></tr></thead>
            <tbody>
              {visible.map((o) => (
                <tr key={o.code}>
                  <td className="mono">{o.code}</td>
                  <td><div className="two"><b>{o.customer}</b><span>{o.area}</span></div></td>
                  <td style={{ color: "var(--gray-600)", maxWidth: 200 }}>{o.service}</td>
                  <td style={{ color: "var(--gray-600)" }}>{o.schedule}</td>
                  <td className="money">{o.amount}</td>
                  <td>{o.cleaner ? <div className="two"><b style={{ fontWeight: 500 }}>{o.cleaner}</b></div> : <span className="badge w"><span className="dot"></span>Unassigned</span>}</td>
                  <td><OrderBadge status={o.status} /></td>
                  <td className="right">
                    <div className="row-actions">
                      <Gate action="view"><RowIcon name="Eye.svg" title="Track" onClick={() => { setActive(o.code); setSub("detail"); }} /></Gate>
                      <Gate action="assign"><RowIcon name="User01.svg" title="Assign cleaner" onClick={() => setAssignFor(o.code)} /></Gate>
                      <Gate action="update"><RowIcon name="Edit01.svg" title="Edit" onClick={() => toast("Edit order " + o.code)} /></Gate>
                      <Gate action="delete"><RowIcon name="Trash01.svg" title="Cancel" danger onClick={() => toast("Order " + o.code + " cancelled")} /></Gate>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={1} pages={Math.ceil(248 / 10)} onPage={() => {}} total={248} shown={visible.length} unit="orders" />
      </div>

      <AssignDrawer open={!!assignFor && sub === "list"} onClose={() => setAssignFor(null)} code={assignFor} onAssign={(c) => assignCleaner(assignFor, c)} />
    </React.Fragment>
  );
}

function OrderCreate({ onCancel, onCreate }) {
  const { can } = useApp();
  const [service, setService] = useState("");
  const code = "ORD-" + (90413 + Math.floor(Math.random() * 80));
  function submit() {
    onCreate({ code, customer: document.getElementById("oc-name").value || "New customer", phone: document.getElementById("oc-phone").value || "+971 ••", service: service || "Standard clean", schedule: (document.getElementById("oc-date").value || "31 May") + ", " + (document.getElementById("oc-time").value || "10:00"), area: document.getElementById("oc-area").value || "Marina", amount: "AED " + (document.getElementById("oc-amount").value || "320"), status: "unassigned", cleaner: null, partner: "SparkleCo", payment: "Pending" });
  }
  return (
    <React.Fragment>
      <PageHead eyebrow={<button className="btn btn-ghost sm" style={{ padding: "2px 6px", marginLeft: -6 }} onClick={onCancel}><Icon name="ArrowLeft.svg" />Back to orders</button>}
        title="New order" sub="Step 1 of 1 — capture order details, then assign a cleaner." />
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, alignItems: "start" }}>
        <div className="card" style={{ padding: "22px 24px" }}>
          <div className="form-section-title">Customer</div>
          <div className="field-row">
            <Field label="Customer name" req><Input id="oc-name" placeholder="e.g. Hana Yusuf" /></Field>
            <Field label="Phone number" req><Input id="oc-phone" placeholder="+971 50 000 0000" /></Field>
          </div>
          <Field label="Service area" req><Input id="oc-area" placeholder="e.g. Marina" /></Field>

          <div className="form-section-title">Service</div>
          <Field label="Service item" req>
            <Select id="oc-service" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">Select a service…</option>
              <option>Deep clean — 2BR apartment</option>
              <option>Standard clean — villa</option>
              <option>Sofa & carpet shampoo</option>
              <option>Move-out deep clean</option>
              <option>Window cleaning</option>
            </Select>
          </Field>
          <div className="field-row">
            <Field label="Date" req><Input id="oc-date" placeholder="31 May" /></Field>
            <Field label="Time" req><Input id="oc-time" placeholder="10:00" /></Field>
          </div>

          <div className="form-section-title">Payment</div>
          <div className="field-row">
            <Field label="Amount (AED)" req><Input id="oc-amount" placeholder="320" /></Field>
            <Field label="Method"><Select><option>Wallet</option><option>Card</option><option>Cash on completion</option></Select></Field>
          </div>
          <Field label="Notes"><TextArea placeholder="Access instructions, preferences…" /></Field>
        </div>

        <div className="card" style={{ padding: "20px 22px", position: "sticky", top: 80 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, margin: "0 0 4px" }}>Order summary</h3>
          <p style={{ fontSize: 13, color: "var(--gray-500)", margin: "0 0 16px" }}>Review before creating.</p>
          <dl className="kv">
            <dt>Order #</dt><dd className="mono">{code}</dd>
            <dt>Service</dt><dd>{service || "—"}</dd>
            <dt>Status</dt><dd><span className="badge w"><span className="dot"></span>Unassigned</span></dd>
            <dt>Next step</dt><dd>Assign a cleaner</dd>
          </dl>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 22 }}>
            <Btn kind="primary" icon="Check.svg" onClick={submit} style={{ justifyContent: "center" }}>Create order</Btn>
            <Btn kind="ghost" onClick={onCancel} style={{ justifyContent: "center" }}>Cancel</Btn>
          </div>
          <div className="mini-note" style={{ marginTop: 14 }}><Icon name="InfoCircle.svg" />Creating requires the Add permission on Order.</div>
        </div>
      </div>
    </React.Fragment>
  );
}

const TRACK_STEPS = [
  { key: "placed", label: "Order placed", icon: "ShoppingBag01.svg" },
  { key: "assigned", label: "Cleaner assigned", icon: "User01.svg" },
  { key: "in-progress", label: "In progress", icon: "RefreshCcw01.svg" },
  { key: "completed", label: "Completed", icon: "Check.svg" },
];
function OrderDetail({ order, onBack, onAssign, onAdvance, assignDrawer }) {
  const { can } = useApp();
  const statusIdx = order.status === "cancelled" ? -1 : { unassigned: 0, assigned: 1, "in-progress": 2, completed: 3 }[order.status];
  return (
    <React.Fragment>
      <PageHead eyebrow={<button className="btn btn-ghost sm" style={{ padding: "2px 6px", marginLeft: -6 }} onClick={onBack}><Icon name="ArrowLeft.svg" />Back to orders</button>}
        title={order.code} sub={order.service}
        actions={<React.Fragment>
          {order.status === "unassigned" && can("assign") && <Btn kind="primary" icon="User01.svg" gated="Assign" onClick={onAssign}>Assign cleaner</Btn>}
          {["assigned", "in-progress"].includes(order.status) && can("update") && <Btn kind="success" icon="ArrowNarrowRight.svg" gated="Edit" onClick={onAdvance}>Advance status</Btn>}
        </React.Fragment>} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16, alignItems: "start" }}>
        <div className="card" style={{ padding: "22px 24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, margin: "0 0 16px" }}>Order details</h3>
          <dl className="kv">
            <dt>Customer</dt><dd>{order.customer}</dd>
            <dt>Phone</dt><dd className="mono">{order.phone}</dd>
            <dt>Service</dt><dd>{order.service}</dd>
            <dt>Schedule</dt><dd>{order.schedule}</dd>
            <dt>Area</dt><dd>{order.area}</dd>
            <dt>Partner</dt><dd>{order.partner}</dd>
            <dt>Amount</dt><dd className="money">{order.amount}</dd>
            <dt>Payment</dt><dd>{order.payment}</dd>
            <dt>Cleaner</dt><dd>{order.cleaner || <span className="badge w"><span className="dot"></span>Unassigned</span>}</dd>
          </dl>
        </div>

        <div className="card" style={{ padding: "22px 24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, margin: "0 0 18px" }}>Status tracking</h3>
          {order.status === "cancelled" ? (
            <div className="empty" style={{ padding: "30px 0" }}><div className="ec" style={{ background: "var(--error-50)" }}><Icon name="XClose.svg" /></div><h4>Order cancelled</h4><p>This order was cancelled and refunded.</p></div>
          ) : (
            <div className="timeline">
              {TRACK_STEPS.map((s, i) => {
                const state = i < statusIdx ? "done" : i === statusIdx ? "current" : "upcoming";
                return (
                  <div key={s.key} className={"tl-step " + state}>
                    <div className="tl-rail">
                      <div className="tl-dot"><Icon name={state === "done" ? "Check.svg" : s.icon} /></div>
                      {i < TRACK_STEPS.length - 1 && <div className="tl-line"></div>}
                    </div>
                    <div className="tl-body">
                      <b>{s.label}</b>
                      <span>{state === "done" ? "Completed" : state === "current" ? "In progress now" : "Pending"}{s.key === "assigned" && order.cleaner ? " · " + order.cleaner : ""}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {assignDrawer}
    </React.Fragment>
  );
}

function AssignDrawer({ open, onClose, code, onAssign }) {
  const [sel, setSel] = useState(null);
  useEffect(() => { if (open) setSel(null); }, [open]);
  const cleaners = window.DATA.cleaners;
  return (
    <Drawer open={open} onClose={onClose} title="Assign a cleaner" sub={code ? "Order " + code : ""}
      footer={<React.Fragment><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn kind="primary" icon="Check.svg" disabled={!sel} onClick={() => sel && onAssign(sel)}>Assign cleaner</Btn></React.Fragment>}>
      <div style={{ fontSize: 13, color: "var(--gray-500)", marginBottom: 14 }}>Showing cleaners ranked by availability and proximity.</div>
      {cleaners.map((c) => (
        <div key={c.id} className={"pick" + (sel && sel.id === c.id ? " sel" : "") + (c.status === "off" ? "" : "")} onClick={() => c.status !== "off" && setSel(c)} style={c.status === "off" ? { opacity: 0.5, cursor: "not-allowed" } : null}>
          <Avatar text={c.name.split(" ").map((x) => x[0]).join("")} color={c.status === "available" ? "var(--success-500)" : c.status === "on-job" ? "var(--info-500)" : "var(--gray-400)"} size={38} rounded="9px" />
          <div className="who"><b>{c.name}</b><span>{c.zone} · {c.rating} ★ · {c.load} active job{c.load === 1 ? "" : "s"}</span></div>
          {c.status === "available" ? <span className="badge s"><span className="dot"></span>Free</span> : c.status === "on-job" ? <span className="badge info"><span className="dot"></span>Busy</span> : <span className="badge n"><span className="dot"></span>Off</span>}
          <div className="radio"></div>
        </div>
      ))}
    </Drawer>
  );
}

/* ============================================================
   PARTNER ONBOARDING — review → approve / reject
   ============================================================ */
const ONB_STATUS = { pending: { label: "Pending", variant: "w" }, "in-review": { label: "In review", variant: "info" }, approved: { label: "Approved", variant: "s" }, rejected: { label: "Rejected", variant: "e" } };
function OnboardingPage() {
  const { can, anno, toast } = useApp();
  const [apps, setApps] = useState(() => window.DATA.onboarding.map((a) => ({ ...a })));
  const [review, setReview] = useState(null);
  const [filter, setFilter] = useState(0);
  const FILTERS = ["All", "Pending", "In review", "Approved", "Rejected"];
  const FKEY = [null, "pending", "in-review", "approved", "rejected"];
  const visible = apps.filter((a) => !FKEY[filter] || a.status === FKEY[filter]);
  const current = apps.find((a) => a.id === review);

  function decide(id, decision) {
    setApps((as) => as.map((a) => a.id === id ? { ...a, status: decision } : a));
    setReview(null);
    toast("Application " + (decision === "approved" ? "approved" : "rejected"));
  }

  return (
    <React.Fragment>
      <PageHead eyebrow="Partner" title="Partner onboarding" sub="Review applications from prospective service partners." />
      {anno && <AnnoBanner columns={[{ key: "company", label: "Company" }, { key: "contact", label: "Contact" }, { key: "area", label: "Area" }, { key: "fleet", label: "Fleet size" }, { key: "docs", label: "Documents" }, { key: "submitted", label: "Submitted" }, { key: "status", label: "Status" }]} />}

      <div className="card">
        <Toolbar filters={FILTERS} active={filter} onFilter={setFilter} query="" onQuery={() => {}} />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Application</th><th>Company</th><th>Area</th><th>Fleet</th><th>Documents</th><th>Submitted</th><th>Status</th><th className="right">Actions</th></tr></thead>
            <tbody>
              {visible.map((a) => (
                <tr key={a.id}>
                  <td className="mono">{a.id}</td>
                  <td><div className="two"><b>{a.company}</b><span>{a.contact}</span></div></td>
                  <td style={{ color: "var(--gray-600)" }}>{a.area}</td>
                  <td>{a.fleet} cleaners</td>
                  <td>{a.docs === "Complete" ? <span className="badge s"><span className="dot"></span>Complete</span> : <span className="badge w"><span className="dot"></span>{a.docs}</span>}</td>
                  <td style={{ color: "var(--gray-600)" }}>{a.submitted}</td>
                  <td><Badge label={ONB_STATUS[a.status].label} variant={ONB_STATUS[a.status].variant} /></td>
                  <td className="right">
                    <div className="row-actions" style={{ justifyContent: "flex-end" }}>
                      <Gate action="view"><RowIcon name="Eye.svg" title="View" onClick={() => setReview(a.id)} /></Gate>
                      <Gate action="update"><Btn kind="secondary" sm icon="file-check-01.svg" gated="Edit" onClick={() => setReview(a.id)}>Review</Btn></Gate>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={1} pages={1} onPage={() => {}} total={apps.length} shown={visible.length} unit="applications" />
      </div>

      <Drawer open={!!current} onClose={() => setReview(null)} wide
        title={current ? current.company : ""} sub={current ? "Application " + current.id + " · " + current.submitted : ""}
        footer={current && current.status !== "approved" && current.status !== "rejected" && can("update") ? (
          <React.Fragment>
            <Btn kind="danger" icon="XClose.svg" gated="Edit" onClick={() => decide(current.id, "rejected")}>Reject</Btn>
            <Btn kind="success" icon="Check.svg" gated="Edit" onClick={() => decide(current.id, "approved")}>Approve partner</Btn>
          </React.Fragment>
        ) : current ? <Btn kind="ghost" onClick={() => setReview(null)}>Close</Btn> : null}>
        {current && (
          <React.Fragment>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <Avatar text={current.company.split(" ").map((x) => x[0]).join("").slice(0, 2)} color="#7A5AF8" size={46} rounded="11px" />
              <div><div style={{ fontWeight: 700, fontSize: 16 }}>{current.company}</div><div style={{ fontSize: 13, color: "var(--gray-500)" }}>{current.area} · {current.fleet} cleaners</div></div>
              <div style={{ marginLeft: "auto" }}><Badge label={ONB_STATUS[current.status].label} variant={ONB_STATUS[current.status].variant} /></div>
            </div>
            <div className="form-section-title">Contact</div>
            <dl className="kv">
              <dt>Primary contact</dt><dd>{current.contact}</dd>
              <dt>Email</dt><dd>{current.email}</dd>
              <dt>Phone</dt><dd className="mono">{current.phone}</dd>
            </dl>
            <div className="form-section-title">Compliance documents</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[["Trade licence", current.docs === "Complete"], ["Insurance certificate", current.docs === "Complete"], ["Owner ID", true], ["Bank details", current.docs !== "Incomplete"]].map(([d, ok]) => (
                <div key={d} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--outline-soft)", borderRadius: 9 }}>
                  <Icon name="File01.svg" style={{ opacity: 0.5 }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{d}</span>
                  {ok ? <span className="badge s"><span className="dot"></span>Verified</span> : <span className="badge e"><span className="dot"></span>Missing</span>}
                </div>
              ))}
            </div>
            {!can("update") && <div className="mini-note" style={{ marginTop: 18 }}><Icon name="Lock01.svg" />Your role can view this application but cannot approve or reject it.</div>}
          </React.Fragment>
        )}
      </Drawer>
    </React.Fragment>
  );
}

/* ============================================================
   PARTNER PAYOUT — list → mark as paid → export
   ============================================================ */
const PAY_STATUS = { pending: { label: "Pending", variant: "w" }, approved: { label: "Approved", variant: "info" }, paid: { label: "Paid", variant: "s" } };
function PayoutPage() {
  const { can, anno, toast } = useApp();
  const [payouts, setPayouts] = useState(() => window.DATA.payouts.map((p) => ({ ...p })));
  const [filter, setFilter] = useState(0);
  const [detail, setDetail] = useState(null);
  const FILTERS = ["All", "Pending", "Approved", "Paid"];
  const FKEY = [null, "pending", "approved", "paid"];
  const visible = payouts.filter((p) => !FKEY[filter] || p.status === FKEY[filter]);
  const due = payouts.filter((p) => p.status !== "paid").length;
  const current = payouts.find((p) => p.id === detail);

  function markPaid(id) {
    setPayouts((ps) => ps.map((p) => p.id === id ? { ...p, status: "paid" } : p));
    setDetail(null);
    toast("Payout " + id + " marked as paid");
  }

  return (
    <React.Fragment>
      <PageHead eyebrow="Partner" title="Partner payout" sub={due + " payouts pending release · AED 55,760 total"}
        actions={<Gate action="export"><Btn kind="secondary" icon="Download01.svg" gated="Export" onClick={() => toast("Payout report exported")}>Export</Btn></Gate>} />
      {anno && <AnnoBanner columns={[{ key: "id", label: "Payout #" }, { key: "partner", label: "Partner" }, { key: "period", label: "Period" }, { key: "jobs", label: "Jobs" }, { key: "net", label: "Net payable" }, { key: "method", label: "Method" }, { key: "status", label: "Status" }]} />}

      <div className="card">
        <Toolbar filters={FILTERS} active={filter} onFilter={setFilter} query="" onQuery={() => {}} />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Payout</th><th>Partner</th><th>Period</th><th className="right">Jobs</th><th className="right">Net payable</th><th>Method</th><th>Status</th><th className="right">Actions</th></tr></thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id}>
                  <td className="mono">{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.partner}</td>
                  <td style={{ color: "var(--gray-600)" }}>{p.period}</td>
                  <td className="right">{p.jobs}</td>
                  <td className="right money">{p.net}</td>
                  <td><span className="tag">{p.method}</span></td>
                  <td><Badge label={PAY_STATUS[p.status].label} variant={PAY_STATUS[p.status].variant} /></td>
                  <td className="right">
                    <div className="row-actions">
                      <Gate action="view"><RowIcon name="Eye.svg" title="View" onClick={() => setDetail(p.id)} /></Gate>
                      <Gate action="update"><RowIcon name="Edit01.svg" title="Adjust" onClick={() => toast("Adjust payout " + p.id)} /></Gate>
                      {p.status !== "paid" && <Gate action="markPaid"><Btn kind="success" sm icon="CheckCircle.svg" gated="Mark paid" onClick={() => markPaid(p.id)}>Mark paid</Btn></Gate>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={1} pages={1} onPage={() => {}} total={payouts.length} shown={visible.length} unit="payouts" />
      </div>

      <Drawer open={!!current} onClose={() => setDetail(null)} title={current ? current.partner : ""} sub={current ? "Payout " + current.id + " · " + current.period : ""}
        footer={current ? (
          <React.Fragment>
            <Gate action="export"><Btn kind="ghost" icon="Download01.svg" onClick={() => toast("Statement exported")}>Statement</Btn></Gate>
            {current.status !== "paid" && can("markPaid") && <Btn kind="success" icon="CheckCircle.svg" onClick={() => markPaid(current.id)}>Mark as paid</Btn>}
          </React.Fragment>
        ) : null}>
        {current && (
          <React.Fragment>
            <dl className="kv">
              <dt>Partner</dt><dd>{current.partner}</dd>
              <dt>Period</dt><dd>{current.period}</dd>
              <dt>Jobs completed</dt><dd>{current.jobs}</dd>
              <dt>Method</dt><dd>{current.method}</dd>
              <dt>Status</dt><dd><Badge label={PAY_STATUS[current.status].label} variant={PAY_STATUS[current.status].variant} /></dd>
            </dl>
            <div className="form-section-title">Breakdown</div>
            <dl className="kv">
              <dt>Gross earnings</dt><dd className="money">{current.gross}</dd>
              <dt>Platform fee</dt><dd style={{ color: "var(--error-700)" }}>− {current.fee}</dd>
              <dt style={{ fontWeight: 700, color: "var(--gray-900)" }}>Net payable</dt><dd className="money" style={{ fontSize: 16 }}>{current.net}</dd>
            </dl>
            {!can("markPaid") && <div className="mini-note" style={{ marginTop: 18 }}><Icon name="Lock01.svg" />Marking payouts as paid requires the Finance role.</div>}
          </React.Fragment>
        )}
      </Drawer>
    </React.Fragment>
  );
}

/* ============================================================
   MARKETING PAYMENT LINK — generate → confirm payment
   ============================================================ */
const PL_STATUS = { pending: { label: "Awaiting payment", variant: "w" }, paid: { label: "Paid", variant: "s" }, expired: { label: "Expired", variant: "n" } };
function PaymentLinkPage() {
  const { can, anno, toast } = useApp();
  const [links, setLinks] = useState(() => window.DATA.paylinks.map((l) => ({ ...l })));
  const [gen, setGen] = useState(false);
  const [filter, setFilter] = useState(0);
  const FILTERS = ["All", "Awaiting payment", "Paid", "Expired"];
  const FKEY = [null, "pending", "paid", "expired"];
  const visible = links.filter((l) => !FKEY[filter] || l.status === FKEY[filter]);

  function confirmPay(id) { setLinks((ls) => ls.map((l) => l.id === id ? { ...l, status: "paid" } : l)); toast("Payment confirmed for " + id); }
  function generate() {
    const id = "PL-" + (7742 + Math.floor(Math.random() * 50));
    const title = document.getElementById("pl-title").value || "New payment request";
    const amount = "AED " + (document.getElementById("pl-amount").value || "100");
    setLinks((ls) => [{ id, title, customer: document.getElementById("pl-cust").value || "Customer", amount, created: "30 May 2026", expires: "06 Jun 2026", url: "pay.beasy.ae/l/" + id.slice(3), status: "pending" }, ...ls]);
    setGen(false);
    toast("Payment link generated · " + id);
  }

  return (
    <React.Fragment>
      <PageHead eyebrow="Marketing" title="Payment link" sub="Generate one-off payment links and confirm receipt."
        actions={<React.Fragment>
          <Gate action="export"><Btn kind="secondary" icon="Download01.svg" gated="Export" onClick={() => toast("Links exported")}>Export</Btn></Gate>
          <Gate action="add"><Btn kind="primary" icon="Link01.svg" gated="Add" onClick={() => setGen(true)}>Generate link</Btn></Gate>
        </React.Fragment>} />
      {anno && <AnnoBanner columns={[{ key: "id", label: "Link #" }, { key: "title", label: "Title" }, { key: "customer", label: "Customer" }, { key: "amount", label: "Amount" }, { key: "url", label: "URL" }, { key: "expires", label: "Expires" }, { key: "status", label: "Status" }]} />}

      <div className="card">
        <Toolbar filters={FILTERS} active={filter} onFilter={setFilter} query="" onQuery={() => {}} />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Link</th><th>Title</th><th>Customer</th><th className="right">Amount</th><th>URL</th><th>Expires</th><th>Status</th><th className="right">Actions</th></tr></thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l.id}>
                  <td className="mono">{l.id}</td>
                  <td style={{ fontWeight: 600 }}>{l.title}</td>
                  <td>{l.customer}</td>
                  <td className="right money">{l.amount}</td>
                  <td><span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--info-700)" }}><Icon name="Link01.svg" style={{ width: 13, height: 13, opacity: 0.6 }} />{l.url}</span></td>
                  <td style={{ color: "var(--gray-600)" }}>{l.expires}</td>
                  <td><Badge label={PL_STATUS[l.status].label} variant={PL_STATUS[l.status].variant} /></td>
                  <td className="right">
                    <div className="row-actions">
                      <RowIcon name="copy-01.svg" title="Copy URL" onClick={() => toast("Link copied to clipboard")} />
                      {l.status === "pending" && <Gate action="markPaid"><Btn kind="success" sm icon="CheckCircle.svg" gated="Mark paid" onClick={() => confirmPay(l.id)}>Confirm payment</Btn></Gate>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={1} pages={1} onPage={() => {}} total={links.length} shown={visible.length} unit="links" />
      </div>

      <Drawer open={gen} onClose={() => setGen(false)} title="Generate payment link" sub="A shareable link the customer pays through"
        footer={<React.Fragment><Btn kind="ghost" onClick={() => setGen(false)}>Cancel</Btn><Btn kind="primary" icon="Link01.svg" onClick={generate}>Generate link</Btn></React.Fragment>}>
        <Field label="Title" req><Input id="pl-title" placeholder="e.g. Premium plan — Q3" /></Field>
        <Field label="Customer" req><Input id="pl-cust" placeholder="e.g. Hana Yusuf" /></Field>
        <div className="field-row">
          <Field label="Amount (AED)" req><Input id="pl-amount" placeholder="899" /></Field>
          <Field label="Expires in"><Select><option>7 days</option><option>14 days</option><option>30 days</option></Select></Field>
        </div>
        <Field label="Message"><TextArea placeholder="Optional note shown to the customer…" /></Field>
        <div className="feature" style={{ marginTop: 8, marginBottom: 0, padding: "16px 18px" }}>
          <div className="ico"><Icon name="Link01.svg" /></div>
          <div className="body"><h4 style={{ fontSize: 14 }}>Link is generated as “Awaiting payment”</h4><p>Confirm payment once the customer pays to settle it.</p></div>
        </div>
      </Drawer>
    </React.Fragment>
  );
}

Object.assign(window, { OrderPage, OnboardingPage, PayoutPage, PaymentLinkPage });
