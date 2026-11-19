"use client";

import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ClientForm from "../components/ClientForm";
import ClientList from "../components/ClientList";
import UpdateClient from "../components/UpdateClient";

export default function HomePage() {
  const [clientes, setClientes] = useState([]);
  const [paginaAtiva, setPaginaAtiva] = useState("clientes");

  function adicionarCliente(novoCliente) {
    setClientes((clientesAtuais) => [...clientesAtuais, novoCliente]);
  }

  function atualizarCliente(clienteAtualizado) {
    setClientes((clientesAtuais) =>
      clientesAtuais.map((cliente) =>
        cliente.id === clienteAtualizado.id ? clienteAtualizado : cliente
      )
    );
  }

  return (
    <div className="app-wrapper">
      <Header />

      <div className="app-body">
        <Sidebar paginaAtiva={paginaAtiva} onNavigate={setPaginaAtiva} />

        <main className="main-content">
          {paginaAtiva === "clientes" ? (
            <>
              <div className="page-header">
                <h2 className="page-title">Gerenciamento de Clientes</h2>
                <p className="page-description">
                  Esta área é destinada ao cadastro e consulta de clientes da
                  SolarTech. Preencha os dados abaixo para registrar um novo cliente
                  ou utilize o filtro por CPF para localizar cadastros existentes.
                </p>
              </div>

              <ClientForm
                clientes={clientes}
                onAdicionarCliente={adicionarCliente}
              />

              <ClientList clientes={clientes} />
            </>
          ) : (
            <>
              <div className="page-header">
                <h2 className="page-title">Atualização de Clientes</h2>
                <p className="page-description">
                  Localize um cliente pelo CPF, edite as informações do cadastro e
                  salve as alterações.
                </p>
              </div>

              <UpdateClient
                clientes={clientes}
                onAtualizarCliente={atualizarCliente}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
