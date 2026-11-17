export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Menu principal">
      <p className="sidebar-label">Navegação</p>
      <nav>
        <ul className="sidebar-list">
          <li className="sidebar-item active">
            <span aria-hidden="true">👥</span>
            <span>Clientes</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
