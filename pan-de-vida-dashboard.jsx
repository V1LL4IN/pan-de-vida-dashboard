import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// PAN DE VIDA FOUNDATION — DASHBOARD 2026
// Google-inspired redesign with 3-level help structure
// ─────────────────────────────────────────────────────────────

const C = {
  blue: "#1a73e8",
  blueBg: "#e8f0fe",
  blueLight: "#4285f4",
  green: "#34a853",
  greenBg: "#e6f4ea",
  yellow: "#fbbc04",
  yellowBg: "#fef7e0",
  red: "#ea4335",
  redBg: "#fce8e6",
  orange: "#fa903e",
  orangeBg: "#fef3e8",
  purple: "#a142f4",
  purpleBg: "#f3e8fd",
  teal: "#129eaf",
  tealBg: "#e4f7fb",
  text1: "#202124",
  text2: "#5f6368",
  text3: "#80868b",
  border: "#dadce0",
  bg: "#f8f9fa",
  white: "#ffffff",
};

const i18n = {
  en: {
    overview: "Overview",
    level1: "Level 1", level1Name: "Relief", level1Desc: "Immediate assistance",
    level2: "Level 2", level2Name: "Restoration", level2Desc: "Rebuilding lives",
    level3: "Level 3", level3Name: "Development", level3Desc: "Sustainable growth",
    evangelism: "Evangelism", evangelismDesc: "Across all levels",
    beneficiaries: "Beneficiaries", beneficiariesDesc: "People we serve",
    lastUpdated: "Last updated", dataSynced: "Data synced",
    totalBeneficiaries: "Active Beneficiaries", totalAccounts: "Active Accounts",
    newFamilies: "New Families", totalDeliveries: "Service Deliveries",
    impactByLevel: "Impact by Level",
    hotMeals: "Hot Meals", hotMealsDelivered: "Hot meal plates delivered",
    familiesHotMeals: "Families served",
    groceries: "Groceries", groceryBags: "Grocery bags delivered",
    ubGrocery: "Unique beneficiaries", avgCost: "Avg. unit cost",
    totalCost: "Total estimated cost",
    clothing: "Clothing", clothingDonations: "Clothing donations",
    ubClothing: "Unique beneficiaries",
    emergency: "Emergency", christmas: "Christmas",
    noDataYet: "No data recorded yet for this period",
    monthlyDistribution: "Monthly Distribution",
    jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun",
    health: "Health", education: "Education", shelter: "Living Conditions",
    medicalAttention: "Medical consultations", ubMedical: "Unique beneficiaries",
    paidByVozManos: "Paid by Voz y Manos", paidByPDV: "Paid by Pan de Vida",
    otherMedicalAids: "Other medical aids", ubOtherMedical: "UB other medical",
    investedOther: "Invested in other medical",
    totalHealthServices: "Total health services", totalHealthUB: "Total health UB",
    schoolKits: "School kits", backpacks: "Backpacks",
    unitCost: "Unit cost", totalCostLabel: "Total cost",
    vbsCamps: "VBS camps held", shelterServices: "Total shelter services",
    lifeFarms: "Life Farms", sharkTank: "Shark Tank PDV",
    revolvingFund: "Revolving Fund",
    idealFarm: "Ideal Life Farm",
    idealFarmDesc: "Seed banks + compost + animals + others",
    fullSizeFarm: "Full Size Life Farm",
    fullSizeFarmDesc: "No additionals",
    totalChampions: "Total Champions",
    basicFarm: "Basic Life Farms",
    basicFarmDesc: "New cases + seedling production",
    multiplicationFarm: "Multiplication",
    multiplicationDesc: "Selected cases + support",
    goal: "Goal", done: "Done",
    totalMEPs: "Total MEPs", active: "Active", inactive: "Inactive",
    finished: "Finished", aborted: "Aborted", marketReady: "Market Ready",
    sharkTankPlaceholder: "Data coming soon — this program's metrics are being integrated.",
    byLocation: "By Location",
    quito: "Quito", otavalo: "Otavalo", mantaRiobamba: "Manta & Riobamba",
    biblesDelivered: "Bibles delivered",
    vbsCampsHeld: "VBS camps held",
    childrenVBS: "Children attended VBS",
    activeAccounts: "Active accounts", activeBeneficiaries: "Active beneficiaries",
    activeGirls: "Active girls", activeBoys: "Active boys",
    acceptedFamilies: "New families this year", acceptedUB: "New UB accepted",
    combined: "Combined", imbabura: "Imbabura",
    statusDist: "Status Distribution",
    serviceProviders: "Service providers include Joshua Expeditions, Staff PDV, Grace Baptist Church Wilmington, and New Life Church.",
    championsLabel: "Champions (Full Size)",
    growthLabel: "Growth Pipeline",
  },
  es: {
    overview: "Resumen",
    level1: "Nivel 1", level1Name: "Alivio", level1Desc: "Asistencia inmediata",
    level2: "Nivel 2", level2Name: "Restauración", level2Desc: "Reconstruyendo vidas",
    level3: "Nivel 3", level3Name: "Desarrollo", level3Desc: "Crecimiento sostenible",
    evangelism: "Evangelización", evangelismDesc: "En todos los niveles",
    beneficiaries: "Beneficiarios", beneficiariesDesc: "Personas que servimos",
    lastUpdated: "Última actualización", dataSynced: "Datos sincronizados",
    totalBeneficiaries: "Beneficiarios Activos", totalAccounts: "Cuentas Activas",
    newFamilies: "Nuevas Familias", totalDeliveries: "Servicios Entregados",
    impactByLevel: "Impacto por Nivel",
    hotMeals: "Comida Caliente", hotMealsDelivered: "Platos entregados",
    familiesHotMeals: "Familias servidas",
    groceries: "Víveres", groceryBags: "Bolsas entregadas",
    ubGrocery: "Beneficiarios únicos", avgCost: "Costo promedio",
    totalCost: "Costo total estimado",
    clothing: "Ropa", clothingDonations: "Donaciones de ropa",
    ubClothing: "Beneficiarios únicos",
    emergency: "Emergencia", christmas: "Navidad",
    noDataYet: "Sin datos registrados aún para este período",
    monthlyDistribution: "Distribución Mensual",
    jan: "Ene", feb: "Feb", mar: "Mar", apr: "Abr", may: "May", jun: "Jun",
    health: "Salud", education: "Educación", shelter: "Condiciones de Vida",
    medicalAttention: "Consultas médicas", ubMedical: "Beneficiarios únicos",
    paidByVozManos: "Pagado por Voz y Manos", paidByPDV: "Pagado por Pan de Vida",
    otherMedicalAids: "Otras ayudas médicas", ubOtherMedical: "BU otras ayudas",
    investedOther: "Invertido en otras ayudas",
    totalHealthServices: "Total servicios de salud", totalHealthUB: "Total BU salud",
    schoolKits: "Kits escolares", backpacks: "Mochilas",
    unitCost: "Costo unitario", totalCostLabel: "Costo total",
    vbsCamps: "Campamentos EBV", shelterServices: "Total servicios vivienda",
    lifeFarms: "Huertos de Vida", sharkTank: "Shark Tank PDV",
    revolvingFund: "Fondo Rotativo",
    idealFarm: "Huerto Ideal",
    idealFarmDesc: "Banco semillas + compost + animales + otros",
    fullSizeFarm: "Huerto Completo",
    fullSizeFarmDesc: "Sin adicionales",
    totalChampions: "Total Campeones",
    basicFarm: "Huertos Básicos",
    basicFarmDesc: "Nuevos casos + producción plántulas",
    multiplicationFarm: "Multiplicación",
    multiplicationDesc: "Casos seleccionados + apoyo",
    goal: "Meta", done: "Realizado",
    totalMEPs: "Total MEPs", active: "Activos", inactive: "Inactivos",
    finished: "Finalizados", aborted: "Cancelados", marketReady: "Listos para Mercado",
    sharkTankPlaceholder: "Datos próximamente — las métricas de este programa están siendo integradas.",
    byLocation: "Por Ubicación",
    quito: "Quito", otavalo: "Otavalo", mantaRiobamba: "Manta y Riobamba",
    biblesDelivered: "Biblias entregadas",
    vbsCampsHeld: "Campamentos EBV",
    childrenVBS: "Niños en EBV",
    activeAccounts: "Cuentas activas", activeBeneficiaries: "Beneficiarios activos",
    activeGirls: "Niñas activas", activeBoys: "Niños activos",
    acceptedFamilies: "Nuevas familias este año", acceptedUB: "Nuevos BU aceptados",
    combined: "Combinado", imbabura: "Imbabura",
    statusDist: "Distribución por Estado",
    serviceProviders: "Proveedores de servicio: Joshua Expeditions, Staff PDV, Grace Baptist Church Wilmington y New Life Church.",
    championsLabel: "Campeones (Tamaño Completo)",
    growthLabel: "Pipeline de Crecimiento",
  },
};

// ─── PRIMITIVES ──────────────────────────────────────────────

function Card({ children, style }) {
  return (
    <div style={{
      background: C.white, borderRadius: 12, border: `1px solid ${C.border}`,
      padding: 24, ...style,
    }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, prefix = "", color = C.blue, icon, delay = 0 }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  const bgMap = { [C.blue]: C.blueBg, [C.green]: C.greenBg, [C.red]: C.redBg, [C.yellow]: C.yellowBg, [C.orange]: C.orangeBg, [C.purple]: C.purpleBg, [C.teal]: C.tealBg, [C.text1]: "#e8eaed" };
  return (
    <Card style={{
      opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(6px)",
      transition: "all 0.35s cubic-bezier(0.2, 0, 0, 1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: C.text3, marginBottom: 6, lineHeight: 1.4 }}>{label}</div>
          <div style={{ fontSize: 28, fontWeight: 600, color, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            {prefix}{typeof value === "number" ? value.toLocaleString() : value}
          </div>
        </div>
        {icon && (
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: bgMap[color] || C.blueBg,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
          }}>{icon}</div>
        )}
      </div>
    </Card>
  );
}

function ProgressBar({ label, goal, done, color = C.blue, description }) {
  const [a, setA] = useState(false);
  useEffect(() => { const t = setTimeout(() => setA(true), 200); return () => clearTimeout(t); }, []);
  const pct = Math.min(Math.round((done / goal) * 100), 200);
  const over = done >= goal;
  return (
    <Card style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.text1, marginBottom: 2 }}>{label}</div>
          {description && <div style={{ fontSize: 11, color: C.text3, lineHeight: 1.4 }}>{description}</div>}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: over ? C.green : C.text1 }}>{done}</span>
          <span style={{ fontSize: 13, color: C.text3 }}> / {goal}</span>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ height: 6, borderRadius: 3, background: "#e8eaed", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 3, background: over ? C.green : color,
            width: a ? `${Math.min(pct, 100)}%` : "0%",
            transition: "width 1s cubic-bezier(0.2, 0, 0, 1)",
          }} />
        </div>
        <div style={{ fontSize: 11, fontWeight: 500, color: over ? C.green : C.text3, marginTop: 4, textAlign: "right" }}>{pct}%</div>
      </div>
    </Card>
  );
}

function BarChart({ data, color = C.blue }) {
  const [a, setA] = useState(false);
  useEffect(() => { const t = setTimeout(() => setA(true), 300); return () => clearTimeout(t); }, []);
  const mx = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
          {d.value > 0 && <span style={{ fontSize: 13, fontWeight: 600, color: C.text1 }}>{d.value}</span>}
          <div style={{
            width: "100%", maxWidth: 48, borderRadius: "6px 6px 0 0",
            background: d.value ? (d.color || color) : "#e8eaed",
            height: a ? `${d.value ? Math.max((d.value / mx) * 120, 6) : 3}px` : "0px",
            transition: `height 0.8s cubic-bezier(0.2, 0, 0, 1) ${i * 80}ms`,
            opacity: d.value ? 1 : 0.3,
          }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: C.text3 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, size = 140, stroke = 20 }) {
  const [a, setA] = useState(false);
  useEffect(() => { const t = setTimeout(() => setA(true), 300); return () => clearTimeout(t); }, []);
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let off = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8eaed" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circ, cur = off; off += dash;
          return <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={seg.color}
            strokeWidth={stroke} strokeLinecap="butt"
            strokeDasharray={`${a ? dash : 0} ${circ}`} strokeDashoffset={-cur}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: `stroke-dasharray 1s cubic-bezier(0.2,0,0,1) ${i * 80}ms` }} />;
        })}
        <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 22, fontWeight: 600, fill: C.text1, fontFamily: "'Outfit',sans-serif" }}>{total}</text>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", justifyContent: "center" }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color }} />
            <span style={{ fontSize: 12, color: C.text2 }}>{seg.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text1 }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e8eaed", marginBottom: 28, overflowX: "auto" }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} style={{
          padding: "12px 18px", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500,
          color: active === tab.id ? C.blue : C.text2, background: "transparent",
          borderBottom: active === tab.id ? `2px solid ${C.blue}` : "2px solid transparent",
          marginBottom: -2, transition: "all 0.15s ease", whiteSpace: "nowrap",
          fontFamily: "'Outfit',sans-serif",
        }}>
          {tab.icon && <span style={{ marginRight: 6 }}>{tab.icon}</span>}{tab.label}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ message, icon = "📋" }) {
  return (
    <Card style={{ padding: "56px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.7 }}>{icon}</div>
      <div style={{ fontSize: 14, color: C.text3, maxWidth: 340, margin: "0 auto", lineHeight: 1.6 }}>{message}</div>
    </Card>
  );
}

function LevelBadge({ level, name, color }) {
  const bgMap = { [C.orange]: C.orangeBg, [C.blue]: C.blueBg, [C.green]: C.greenBg };
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px 4px 4px",
      borderRadius: 20, background: bgMap[color] || C.blueBg, marginBottom: 12,
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 12, background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700, color: C.white,
      }}>{level}</div>
      <span style={{ fontSize: 12, fontWeight: 600, color }}>{name}</span>
    </div>
  );
}

function SectionTitle({ children, style }) {
  return <h3 style={{ fontSize: 16, fontWeight: 600, color: C.text1, margin: "0 0 16px", ...style }}>{children}</h3>;
}

function Grid({ cols = 4, gap = 16, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${Math.max(Math.floor(720 / cols), 160)}px, 1fr))`, gap }}>{children}</div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────

function NavSection({ label }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, textTransform: "uppercase", letterSpacing: "0.06em", padding: "20px 16px 6px" }}>{label}</div>;
}

function NavItem({ icon, label, sublabel, active, onClick, color }) {
  const [h, setH] = useState(false);
  const bgMap = { [C.orange]: C.orangeBg, [C.green]: C.greenBg, [C.purple]: C.purpleBg, [C.blue]: C.blueBg };
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 16px",
      border: "none", borderRadius: 24, cursor: "pointer", fontSize: 14,
      fontWeight: active ? 600 : 400, fontFamily: "'Outfit',sans-serif",
      color: active ? (color || C.blue) : C.text2,
      background: active ? (bgMap[color] || C.blueBg) : h ? "#f1f3f4" : "transparent",
      transition: "all 0.15s ease", textAlign: "left",
    }}>
      <span style={{ fontSize: 17, width: 24, textAlign: "center", flexShrink: 0 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11, color: C.text3, fontWeight: 400 }}>{sublabel}</div>}
      </div>
    </button>
  );
}

// ─── PAGES ───────────────────────────────────────────────────

function OverviewPage({ t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <Grid cols={4}>
        <StatCard label={t.totalBeneficiaries} value={2337} color={C.blue} icon="👥" delay={0} />
        <StatCard label={t.totalAccounts} value={623} color={C.teal} icon="📂" delay={60} />
        <StatCard label={t.newFamilies} value={23} color={C.green} icon="🏠" delay={120} />
        <StatCard label={t.totalDeliveries} value={2437} color={C.orange} icon="📦" delay={180} />
      </Grid>

      <div>
        <SectionTitle>{t.impactByLevel}</SectionTitle>
        <Grid cols={3}>
          {[
            { lvl: "1", name: t.level1Name, color: C.orange, items: [
              [t.hotMeals, 882], [t.groceries, 133], [t.clothing, 96], [t.totalCost, "$2,347"]
            ]},
            { lvl: "2", name: t.level2Name, color: C.blue, items: [
              [t.health, 266], [t.education, 11], [t.shelter, 143], [t.totalHealthUB, 140]
            ]},
            { lvl: "3", name: t.level3Name, color: C.green, items: [
              [t.lifeFarms, 318], [t.revolvingFund, 286], [t.marketReady, 8], [t.sharkTank, "—"]
            ]},
          ].map((sec, idx) => (
            <Card key={idx} style={{ borderLeft: `3px solid ${sec.color}` }}>
              <LevelBadge level={sec.lvl} name={sec.name} color={sec.color} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
                {sec.items.map(([lbl, val], j) => (
                  <div key={j}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: C.text3, marginBottom: 2 }}>{lbl}</div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: C.text1 }}>{typeof val === "number" ? val.toLocaleString() : val}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </Grid>
      </div>

      <div>
        <SectionTitle>{t.evangelism}</SectionTitle>
        <Grid cols={3}>
          <StatCard label={t.biblesDelivered} value={34} color={C.purple} icon="📖" delay={0} />
          <StatCard label={t.vbsCampsHeld} value={9} color={C.purple} icon="⛺" delay={60} />
          <StatCard label={t.childrenVBS} value={228} color={C.purple} icon="👧" delay={120} />
        </Grid>
      </div>
    </div>
  );
}

function Level1Page({ t }) {
  const [tab, setTab] = useState("hotmeals");
  return (
    <div>
      <LevelBadge level="1" name={t.level1Name} color={C.orange} />
      <TabBar tabs={[
        { id: "hotmeals", label: t.hotMeals, icon: "🍲" },
        { id: "groceries", label: t.groceries, icon: "🛒" },
        { id: "clothing", label: t.clothing, icon: "👕" },
        { id: "emergency", label: t.emergency, icon: "🚨" },
        { id: "christmas", label: t.christmas, icon: "🎄" },
      ]} active={tab} onChange={setTab} />

      {tab === "hotmeals" && (
        <Grid cols={2}>
          <StatCard label={t.hotMealsDelivered} value={882} color={C.red} icon="🍲" delay={0} />
          <StatCard label={t.familiesHotMeals} value={100} color={C.orange} icon="👨‍👩‍👧‍👦" delay={60} />
        </Grid>
      )}
      {tab === "groceries" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Grid cols={4}>
            <StatCard label={t.groceryBags} value={133} color={C.yellow} icon="🛒" delay={0} />
            <StatCard label={t.ubGrocery} value={80} color={C.orange} icon="👥" delay={60} />
            <StatCard label={t.avgCost} value="12.70" prefix="$" color={C.teal} icon="💲" delay={120} />
            <StatCard label={t.totalCost} value="1,118.70" prefix="$" color={C.green} icon="💰" delay={180} />
          </Grid>
          <Card>
            <SectionTitle>{t.monthlyDistribution}</SectionTitle>
            <BarChart data={[
              { label: t.jan, value: 44, color: "#f28b82" },
              { label: t.feb, value: 133, color: "#b39ddb" },
              { label: t.mar, value: 45, color: "#81d4fa" },
              { label: t.apr, value: 0 }, { label: t.may, value: 0 }, { label: t.jun, value: 0 },
            ]} />
          </Card>
        </div>
      )}
      {tab === "clothing" && (
        <Grid cols={2}>
          <StatCard label={t.clothingDonations} value={96} color={C.purple} icon="👕" delay={0} />
          <StatCard label={t.ubClothing} value={39} color={C.teal} icon="👥" delay={60} />
        </Grid>
      )}
      {tab === "emergency" && <EmptyState message={t.noDataYet} icon="🚨" />}
      {tab === "christmas" && <EmptyState message={t.noDataYet} icon="🎄" />}
    </div>
  );
}

function Level2Page({ t }) {
  const [tab, setTab] = useState("health");
  return (
    <div>
      <LevelBadge level="2" name={t.level2Name} color={C.blue} />
      <TabBar tabs={[
        { id: "health", label: t.health, icon: "🏥" },
        { id: "education", label: t.education, icon: "📚" },
        { id: "shelter", label: t.shelter, icon: "🏠" },
      ]} active={tab} onChange={setTab} />

      {tab === "health" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Card style={{ background: C.blueBg, borderColor: "transparent" }}>
            <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center", flexWrap: "wrap", gap: 24 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.blue, marginBottom: 6 }}>{t.totalHealthServices}</div>
                <div style={{ fontSize: 36, fontWeight: 600, color: C.blue }}> 266</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.blue, marginBottom: 6 }}>{t.totalHealthUB}</div>
                <div style={{ fontSize: 36, fontWeight: 600, color: C.blue }}>140</div>
              </div>
            </div>
          </Card>
          <SectionTitle>Clínica la Y</SectionTitle>
          <Grid cols={4}>
            <StatCard label={t.medicalAttention} value={175} color={C.blue} delay={0} />
            <StatCard label={t.ubMedical} value={86} color={C.teal} delay={60} />
            <StatCard label={t.paidByVozManos} value="3,571.50" prefix="$" color={C.green} delay={120} />
            <StatCard label={t.paidByPDV} value="62.00" prefix="$" color={C.blue} delay={180} />
          </Grid>
          <SectionTitle style={{ marginTop: 4 }}>{t.otherMedicalAids}</SectionTitle>
          <Grid cols={3}>
            <StatCard label={t.otherMedicalAids} value={91} color={C.orange} delay={0} />
            <StatCard label={t.ubOtherMedical} value={75} color={C.teal} delay={60} />
            <StatCard label={t.investedOther} value="341.80" prefix="$" color={C.green} delay={120} />
          </Grid>
          <Card>
            <SectionTitle>{t.monthlyDistribution}</SectionTitle>
            <BarChart data={[
              { label: t.jan, value: 84, color: C.blueLight },
              { label: t.feb, value: 91, color: "#f48fb1" },
              { label: t.mar, value: 0 }, { label: t.apr, value: 0 },
              { label: t.may, value: 0 }, { label: t.jun, value: 0 },
            ]} />
          </Card>
        </div>
      )}
      {tab === "education" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Grid cols={3}>
            <StatCard label={t.schoolKits} value={1} color={C.red} icon="🎒" delay={0} />
            <StatCard label={`${t.unitCost} (kit)`} value="13.75" prefix="$" color={C.yellow} delay={60} />
            <StatCard label={`${t.totalCostLabel} (kits)`} value="13.75" prefix="$" color={C.green} delay={120} />
          </Grid>
          <Grid cols={3}>
            <StatCard label={t.backpacks} value={1} color={C.blue} icon="🎒" delay={180} />
            <StatCard label={`${t.unitCost} (${t.backpacks.toLowerCase()})`} value="8.75" prefix="$" color={C.yellow} delay={240} />
            <StatCard label={`${t.totalCostLabel} (${t.backpacks.toLowerCase()})`} value="8.75" prefix="$" color={C.green} delay={300} />
          </Grid>
          <StatCard label={t.vbsCamps} value={9} color={C.purple} icon="⛺" delay={360} />
        </div>
      )}
      {tab === "shelter" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <StatCard label={t.shelterServices} value={143} color={C.blue} icon="🏠" delay={0} />
          <Card>
            <div style={{ fontSize: 14, color: C.text2, lineHeight: 1.7 }}>{t.serviceProviders}</div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Level3Page({ t }) {
  const [tab, setTab] = useState("lifefarms");
  return (
    <div>
      <LevelBadge level="3" name={t.level3Name} color={C.green} />
      <TabBar tabs={[
        { id: "lifefarms", label: t.lifeFarms, icon: "🌿" },
        { id: "revolving", label: t.revolvingFund, icon: "💰" },
        { id: "sharktank", label: t.sharkTank, icon: "🦈" },
      ]} active={tab} onChange={setTab} />

      {tab === "lifefarms" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <SectionTitle>🏆 {t.championsLabel}</SectionTitle>
          <Grid cols={3}>
            <ProgressBar label={t.idealFarm} description={t.idealFarmDesc} goal={30} done={42} color={C.yellow} />
            <ProgressBar label={t.fullSizeFarm} description={t.fullSizeFarmDesc} goal={10} done={10} color={C.blue} />
            <ProgressBar label={t.totalChampions} goal={40} done={52} color={C.green} />
          </Grid>
          <SectionTitle style={{ marginTop: 4 }}>🌱 {t.growthLabel}</SectionTitle>
          <Grid cols={2}>
            <ProgressBar label={t.basicFarm} description={t.basicFarmDesc} goal={118} done={154} color={C.orange} />
            <ProgressBar label={t.multiplicationFarm} description={t.multiplicationDesc} goal={108} done={112} color={C.purple} />
          </Grid>
        </div>
      )}
      {tab === "revolving" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Grid cols={3}>
            <StatCard label={t.totalMEPs} value={286} color={C.text1} icon="📊" delay={0} />
            <StatCard label={t.active} value={17} color={C.green} icon="✅" delay={60} />
            <StatCard label={t.marketReady} value={8} color={C.yellow} icon="⭐" delay={120} />
          </Grid>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>{t.statusDist}</SectionTitle>
              <DonutChart segments={[
                { label: t.active, value: 17, color: C.green },
                { label: t.inactive, value: 76, color: "#bdc1c6" },
                { label: t.finished, value: 113, color: C.blue },
                { label: t.aborted, value: 80, color: C.red },
              ]} />
            </Card>
            <Card>
              <SectionTitle>{t.byLocation}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}>
                {[
                  { name: t.quito, value: 286, color: C.blue },
                  { name: t.otavalo, value: 285, color: C.green },
                  { name: t.mantaRiobamba, value: 1, color: C.orange },
                ].map((loc, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 4, background: loc.color }} />
                        <span style={{ fontSize: 14, color: C.text2 }}>{loc.name}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.text1 }}>{loc.value}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "#e8eaed" }}>
                      <div style={{ height: "100%", borderRadius: 2, background: loc.color, width: `${(loc.value / 286) * 100}%`, transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
      {tab === "sharktank" && <EmptyState message={t.sharkTankPlaceholder} icon="🦈" />}
    </div>
  );
}

function EvangelismPage({ t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px 4px 4px",
        borderRadius: 20, background: C.purpleBg, alignSelf: "flex-start",
      }}>
        <div style={{ width: 24, height: 24, borderRadius: 12, background: C.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.white }}>✦</div>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.purple }}>{t.evangelismDesc}</span>
      </div>
      <Grid cols={3}>
        <StatCard label={t.biblesDelivered} value={34} color={C.purple} icon="📖" delay={0} />
        <StatCard label={t.vbsCampsHeld} value={9} color={C.blue} icon="⛺" delay={80} />
        <StatCard label={t.childrenVBS} value={228} color={C.red} icon="👧" delay={160} />
      </Grid>
    </div>
  );
}

function BeneficiariesPage({ t }) {
  const [tab, setTab] = useState("combined");
  const data = {
    combined: { accounts: 623, bene: 2337, girls: 359, boys: 364, families: 23, ub: 557 },
    quito: { accounts: 349, bene: 1166, girls: 212, boys: 215, families: 11, ub: 415 },
    imbabura: { accounts: 274, bene: 1171, girls: 147, boys: 149, families: 12, ub: 142 },
  };
  const d = data[tab];

  return (
    <div>
      <TabBar tabs={[
        { id: "combined", label: t.combined },
        { id: "quito", label: t.quito },
        { id: "imbabura", label: t.imbabura },
      ]} active={tab} onChange={setTab} />

      {tab === "combined" ? (
        <Card style={{ background: "linear-gradient(135deg, #174ea6 0%, #1a73e8 100%)", borderColor: "transparent", padding: 36 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 28 }}>
            {[
              [t.activeAccounts, d.accounts],
              [t.activeBeneficiaries, d.bene],
              [t.activeGirls, d.girls],
              [t.activeBoys, d.boys],
              [t.acceptedFamilies, d.families],
            ].map(([lbl, val], i) => (
              <div key={i}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 500, marginBottom: 6 }}>{lbl}</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: "white" }}>{val.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Grid cols={3}>
            <StatCard label={t.activeAccounts} value={d.accounts} color={C.blue} delay={0} />
            <StatCard label={t.activeBeneficiaries} value={d.bene} color={C.teal} delay={60} />
            <StatCard label={t.acceptedFamilies} value={d.families} color={C.green} delay={120} />
          </Grid>
          <Grid cols={3}>
            <StatCard label={t.activeGirls} value={d.girls} color="#e91e8a" delay={180} />
            <StatCard label={t.activeBoys} value={d.boys} color={C.blueLight} delay={240} />
            <StatCard label={t.acceptedUB} value={d.ub} color={C.orange} delay={300} />
          </Grid>
        </div>
      )}
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────

export default function Dashboard() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const t = i18n[lang];

  const titles = {
    overview: t.overview,
    level1: `${t.level1} · ${t.level1Name}`,
    level2: `${t.level2} · ${t.level2Name}`,
    level3: `${t.level3} · ${t.level3Name}`,
    evangelism: t.evangelism,
    beneficiaries: t.beneficiaries,
  };

  const go = useCallback((p) => { setPage(p); setMobileNav(false); }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #dadce0; border-radius: 3px; }
        @media (max-width: 860px) {
          .pdv-sidebar { display: none !important; }
          .pdv-sidebar.open { display: flex !important; position: fixed; z-index: 100; left: 0; top: 0; bottom: 0; box-shadow: 4px 0 24px rgba(0,0,0,0.15); }
          .pdv-main { padding: 72px 16px 24px !important; }
          .pdv-mobile-hdr { display: flex !important; }
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Outfit',-apple-system,BlinkMacSystemFont,sans-serif", color: C.text1 }}>

        {/* MOBILE HEADER */}
        <div className="pdv-mobile-hdr" style={{
          display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 90,
          height: 56, background: C.white, borderBottom: `1px solid ${C.border}`,
          alignItems: "center", padding: "0 16px", gap: 12,
        }}>
          <button onClick={() => setMobileNav(!mobileNav)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: C.text2, padding: 4 }}>☰</button>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Pan de Vida</span>
        </div>

        {mobileNav && <div onClick={() => setMobileNav(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 99 }} />}

        {/* SIDEBAR */}
        <aside className={`pdv-sidebar ${mobileNav ? "open" : ""}`} style={{
          width: 264, background: C.white, borderRight: `1px solid ${C.border}`,
          padding: "16px 8px", display: "flex", flexDirection: "column",
          position: "sticky", top: 0, height: "100vh", overflowY: "auto", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px 24px" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.white, fontSize: 14, fontWeight: 700, flexShrink: 0,
            }}>PV</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text1, lineHeight: 1.2 }}>Pan de Vida</div>
              <div style={{ fontSize: 11, color: C.text3 }}>Dashboard 2026</div>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            <NavItem icon="📊" label={t.overview} active={page === "overview"} onClick={() => go("overview")} color={C.blue} />
            <NavSection label={t.level1Desc} />
            <NavItem icon="🤝" label={`${t.level1} · ${t.level1Name}`} active={page === "level1"} onClick={() => go("level1")} color={C.orange} />
            <NavSection label={t.level2Desc} />
            <NavItem icon="💪" label={`${t.level2} · ${t.level2Name}`} active={page === "level2"} onClick={() => go("level2")} color={C.blue} />
            <NavSection label={t.level3Desc} />
            <NavItem icon="🚀" label={`${t.level3} · ${t.level3Name}`} active={page === "level3"} onClick={() => go("level3")} color={C.green} />
            <div style={{ height: 1, background: C.border, margin: "12px 12px" }} />
            <NavItem icon="✝️" label={t.evangelism} sublabel={t.evangelismDesc} active={page === "evangelism"} onClick={() => go("evangelism")} color={C.purple} />
            <NavItem icon="👥" label={t.beneficiaries} active={page === "beneficiaries"} onClick={() => go("beneficiaries")} color={C.blue} />
          </nav>

          <div style={{ padding: "16px 8px 8px", display: "flex", justifyContent: "center" }}>
            <div style={{ display: "inline-flex", borderRadius: 20, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              {["en", "es"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: "6px 16px", border: "none", cursor: "pointer", fontSize: 13,
                  fontWeight: lang === l ? 600 : 400, fontFamily: "'Outfit',sans-serif",
                  color: lang === l ? C.white : C.text2,
                  background: lang === l ? C.blue : "transparent",
                  transition: "all 0.15s ease",
                }}>{l.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="pdv-main" style={{ flex: 1, padding: "32px 48px", maxWidth: 1120 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.3 }}>{titles[page]}</h1>
              <p style={{ fontSize: 13, color: C.text3, marginTop: 2 }}>{t.lastUpdated}: 04/03/2026</p>
            </div>
            <div style={{
              padding: "5px 14px", borderRadius: 16, background: C.greenBg,
              fontSize: 12, fontWeight: 500, color: C.green,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: C.green }} />
              {t.dataSynced}
            </div>
          </div>

          {page === "overview" && <OverviewPage t={t} />}
          {page === "level1" && <Level1Page t={t} />}
          {page === "level2" && <Level2Page t={t} />}
          {page === "level3" && <Level3Page t={t} />}
          {page === "evangelism" && <EvangelismPage t={t} />}
          {page === "beneficiaries" && <BeneficiariesPage t={t} />}
        </main>
      </div>
    </>
  );
}
