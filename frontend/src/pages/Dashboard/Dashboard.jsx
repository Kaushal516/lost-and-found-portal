import useDashboardStats from "../../hooks/useDashboardStats";
import styles from "./Dashboard.module.css";
import DashboardCharts from "./DashboardCharts";
import { useNavigate } from "react-router-dom";
import { Users, Search, Package, CheckCircle, Activity, LayoutDashboard, RotateCcw } from "lucide-react";

const Dashboard = () => {
  const { stats, loading } = useDashboardStats();
  const navigate = useNavigate();

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className="skeleton" style={{ width: "300px", height: "40px", marginBottom: "2rem" }} />
      <div className={styles.cards}>
        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: "200px", borderRadius: "20px" }} />)}
      </div>
    </div>
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <LayoutDashboard size={32} color="var(--primary)" />
          <h2>Admin Dashboard</h2>
        </div>
        <div className={styles.btnGroup}>
          <button onClick={() => navigate("/admin/users")} className={styles.usersBtn}>
            Manage Users
          </button>
        </div>
      </div>

      <div className={styles.widgetGrid}>
        <div className={styles.miniCard}>
          <h4>Item Distribution</h4>
          <DashboardCharts type="pie" stats={stats} />
        </div>
        <div className={styles.miniCard}>
          <h4>Status Breakdown</h4>
          <DashboardCharts type="bar" stats={stats} />
        </div>
        <div className={styles.miniCard}>
          <h4>Category Share</h4>
          {/* Placeholder for now, could be a simple list or progress bars */}
          <div className={styles.progressContainer}>
            <div className={styles.progressItem}>
              <div className={styles.progressLabel}><span>Lost Reports</span><span>{Math.round((stats.totalLost / (stats.totalLost + stats.totalFound)) * 100)}%</span></div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${(stats.totalLost / (stats.totalLost + stats.totalFound)) * 100}%` }}></div></div>
            </div>
            <div style={{ marginTop: "1.5rem" }} className={styles.progressItem}>
              <div className={styles.progressLabel}><span>Found Postings</span><span>{Math.round((stats.totalFound / (stats.totalLost + stats.totalFound)) * 100)}%</span></div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${(stats.totalFound / (stats.totalLost + stats.totalFound)) * 100}%`, background: "var(--secondary)" }}></div></div>
            </div>
            <div style={{ marginTop: "1.5rem" }} className={styles.progressItem}>
              <div className={styles.progressLabel}><span>Resolution Rate</span><span>{Math.round(((stats.lostResolved + stats.foundResolved) / (stats.totalLost + stats.totalFound)) * 100)}%</span></div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${((stats.lostResolved + stats.foundResolved) / (stats.totalLost + stats.totalFound)) * 100}%`, background: "var(--warning)" }}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.statSection}>
        <div className={styles.statGroup}>
          <h5>Top Statistics</h5>
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <div className={styles.val}>{Math.round((stats.lostResolved / stats.totalLost) * 100)}%</div>
              <div className={styles.label}>Lost Resolution</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.val}>{Math.round((stats.foundResolved / stats.totalFound) * 100)}%</div>
              <div className={styles.label}>Found Resolution</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.val}>{stats.totalUsers}</div>
              <div className={styles.label}>Total Users</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.val}>{stats.onlineUsers}</div>
              <div className={styles.label}>Active Now</div>
            </div>
          </div>
        </div>
        <div className={styles.navGroup}>
          <div className={styles.navSection}>
            <h5>Quick Management</h5>
            <div className={styles.navButtons}>
              <button
                onClick={() => navigate("/admin/lost-items?status=active")}
                className={styles.navBtn}
              >
                <Activity size={18} />
                <span>Active Reports</span>
              </button>
              <button
                onClick={() => navigate("/search?status=returned")}
                className={styles.navBtn}
              >
                <RotateCcw size={18} />
                <span>Returned Items</span>
              </button>
              <button
                onClick={() => navigate("/admin/claims")}
                className={styles.navBtn}
              >
                <Search size={18} />
                <span>Manage Claims</span>
              </button>
            </div>
          </div>

          <div className={styles.navSection} style={{ marginTop: "2rem" }}>
            <h5>Users & Access</h5>
            <div
              className={styles.userShortcut}
              onClick={() => navigate("/admin/users")}
            >
              <div className={styles.userShortcutInfo}>
                <Users size={24} color="var(--primary)" />
                <div>
                  <span className={styles.userShortcutLabel}>User Management</span>
                  <span className={styles.userShortcutDesc}>Click to view & manage registered users</span>
                </div>
              </div>
              <div className={styles.onlineBadge}>
                <div className={styles.pulse} />
                <span>{stats.onlineUsers} Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
