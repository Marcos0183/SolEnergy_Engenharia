"use client";

import { useState } from "react";
import "./ClientList.css";

export default function ClientList({ clientes }) {
  const [filtroCpf, setFiltroCpf] = useState("");

  // Formata o CPF digitado no filtro no padrão 000.000.000-00
  function formatarCpf(valor) {
    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);

    if (apenasNumeros.length <= 3) return apenasNumeros;
    if (apenasNumeros.length <= 6) {
      return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
    }
    if (apenasNumeros.length <= 9) {
      return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
    }
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
  }

  function handleFiltroChange(evento) {
    setFiltroCpf(formatarCpf(evento.target.value));
  }

  function limparFiltro() {
    setFiltroCpf("");
  }

  // Filtra os clientes pelo CPF (comparando apenas os números para facilitar a busca)
  const cpfBuscaNumeros = filtroCpf.replace(/\D/g, "");
  const clientesFiltrados = clientes.filter((cliente) => {
    if (!cpfBuscaNumeros) return true;
    const cpfClienteNumeros = cliente.cpf.replace(/\D/g, "");
    return cpfClienteNumeros.includes(cpfBuscaNumeros);
  });

  return (
    <section className="client-list-section" aria-labelledby="list-heading">
      <div className="list-card">
        <div className="list-card-header">
          <h3 id="list-heading" className="list-card-title">
            Clientes Cadastrados
          </h3>
          <span className="list-badge">
            {clientesFiltrados.length}{" "}
            {clientesFiltrados.length === 1 ? "cliente" : "clientes"}
          </span>
        </div>

        <div className="filter-container">
          <label htmlFor="filtro-cpf" className="filter-label">
            Consultar por CPF
          </label>
          <div className="filter-row">
            <input
              id="filtro-cpf"
              name="filtro-cpf"
              type="text"
              className="filter-input"
              placeholder="Digite o CPF para filtrar (ex: 000.000.000-00)"
              value={filtroCpf}
              onChange={handleFiltroChange}
              maxLength={14}
            />
            {filtroCpf && (
              <button
                type="button"
                className="btn-clear"
                onClick={limparFiltro}
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {clientes.length === 0 ? (
          <div className="empty-state">
            Nenhum cliente cadastrado no sistema até o momento.
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="empty-state">
            Nenhum cliente encontrado com o CPF informado.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Endereço</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td className="cpf-cell">{cliente.cpf}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.endereco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}