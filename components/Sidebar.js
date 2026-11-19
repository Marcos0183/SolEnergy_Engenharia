export default function Sidebar({ paginaAtiva, onNavigate }) {
  const itens = [
    { id: "clientes", icone: "👥", titulo: "Clientes" },
    { id: "atualizar", icone: "✏️", titulo: "Atualizar dados" },
  ];

  return (
    <aside className="sidebar" aria-label="Menu principal">
      <p className="sidebar-label">Navegação</p>
      <nav>
        <ul className="sidebar-list">
          {itens.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`sidebar-item ${paginaAtiva === item.id ? "active" : ""}`}
                onClick={() => onNavigate(item.id)}
                aria-current={paginaAtiva === item.id ? "page" : undefined}
              >
                <span aria-hidden="true">{item.icone}</span>
                <span>{item.titulo}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
