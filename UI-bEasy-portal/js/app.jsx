/* ============================================================
   bEasy Portal — application root
   ============================================================ */
const R = window.RBAC;

function App() {
  const [grants, setGrants] = useState(() => R.buildGrants());
  const [roleId, setRoleId] = useState("super");
  const [moduleId, setModuleId] = useState("dashboard");
  const [anno, setAnno] = useState(false);
  const [roleMenu, setRoleMenu] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

  const role = R.ROLES.find((r) => r.id === roleId);
  const module = R.MODULE_BY_ID[moduleId];
  const nav = useMemo(() => R.navForRole(grants, roleId), [grants, roleId]);

  // If current module becomes invisible for the role, fall back.
  useEffect(() => {
    if (!R.canView(grants, roleId, moduleId)) {
      const first = nav[0] && nav[0].items[0];
      setModuleId(first ? first.id : "dashboard");
    }
  }, [roleId, grants]); // eslint-disable-line

  function toast(msg) {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2600);
  }
  function setPerm(rid, mid, action, value) {
    setGrants((g) => {
      const next = { ...g, [rid]: { ...g[rid] } };
      const cur = new Set(next[rid][mid] || []);
      if (value) { cur.add(action); if (action !== "view") cur.add("view"); }
      else { cur.delete(action); }
      next[rid][mid] = R.MODULE_BY_ID[mid].caps.filter((c) => cur.has(c));
      return next;
    });
  }

  const ctx = {
    grants, roleId, role, roleName: role.name, module, anno,
    ROLES: R.ROLES, GROUPS: R.GROUPS, MODULES: R.MODULES, ACT: R.ACTIONS, ACTION_ORDER: R.ACTION_ORDER,
    can: (action) => R.can(grants, roleId, moduleId, action),
    setPerm, toast,
  };

  function renderPage() {
    switch (module.kind) {
      case "dashboard": return <Dashboard />;
      case "order": return <OrderPage />;
      case "onboarding": return <OnboardingPage />;
      case "payout": return <PayoutPage />;
      case "paylink": return <PaymentLinkPage />;
      case "mkt-overview": return <MarketingOverview />;
      case "roles": return <RolesMatrix />;
      default: return <ListPage key={moduleId} />;
    }
  }

  return (
    <AppCtx.Provider value={ctx}>
      <div className={"app" + (anno ? " anno-on" : "")}>
        {/* ---------- SIDEBAR ---------- */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">b</div>
            <div className="brand-name">bEasy<small>Operations portal</small></div>
          </div>
          <nav className="nav">
            {nav.map((grp) => (
              <React.Fragment key={grp.id}>
                <div className="nav-group">{grp.label}</div>
                {grp.items.map((m) => (
                  <button key={m.id} className={"nav-item" + (m.id === moduleId ? " active" : "")} onClick={() => setModuleId(m.id)}>
                    <Icon name={m.icon} />
                    {m.parent ? m.parent + " · " + m.label : m.label}
                    {m.count != null && <span className="count">{m.count}</span>}
                  </button>
                ))}
              </React.Fragment>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="me">
              <div className="avatar"><img src="assets/avatar-sample.png" alt="" /></div>
              <div className="who"><b>Aria Soto</b><span>aria@beasy.ae</span></div>
              <button className="ic-btn" style={{ border: 0 }}><Icon name="log-out-01.svg" /></button>
            </div>
          </div>
        </aside>

        {/* ---------- MAIN ---------- */}
        <div className="main">
          <header className="topbar">
            <div className="crumbs">
              {module.parent ? module.parent : R.GROUPS.find((g) => g.id === module.group).label}
              <span className="sep">/</span><b>{module.label}</b>
            </div>
            <div className="search">
              <Icon name="SearchLg.svg" />
              <input placeholder="Search orders, partners…" />
            </div>
            <div className="top-spacer"></div>

            <button className={"anno-toggle" + (anno ? " on" : "")} onClick={() => setAnno((a) => !a)} title="Toggle wireframe annotations">
              <span className="sw"></span>Annotations
            </button>
            <button className="icon-btn"><Icon name="Bell01.svg" /><span className="pip"></span></button>

            {/* role switcher */}
            <div className="role-switch">
              <button className="role-btn" onClick={() => setRoleMenu((v) => !v)}>
                <span className="role-av" style={{ background: role.color, color: role.darkText ? "#1A1A1A" : "#fff" }}>{role.initials}</span>
                <span className="role-meta"><span className="lbl">Viewing as</span><span className="nm">{role.name}</span></span>
                <Icon name="ChevronDown.svg" cls="chev" />
              </button>
              {roleMenu && (
                <React.Fragment>
                  <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setRoleMenu(false)}></div>
                  <div className="role-menu">
                    <div className="head">Preview the portal as</div>
                    {R.ROLES.map((r) => (
                      <div key={r.id} className={"role-opt" + (r.id === roleId ? " sel" : "")} onClick={() => { setRoleId(r.id); setRoleMenu(false); }}>
                        <span className="role-av" style={{ background: r.color, color: r.darkText ? "#1A1A1A" : "#fff" }}>{r.initials}</span>
                        <div className="txt"><b>{r.name}</b><span>{r.blurb}</span></div>
                        <Icon name="Check.svg" cls="tick" />
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              )}
            </div>
          </header>

          <main className="content">{renderPage()}</main>
        </div>
      </div>

      {/* toast */}
      <div className={"toast" + (toastMsg ? " show" : "")}>
        <span className="dotok"><Icon name="Check.svg" /></span>{toastMsg}
      </div>
    </AppCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
