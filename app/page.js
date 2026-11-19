"use client";

import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ClientForm from "../components/ClientForm";
import ClientList from "../components/ClientList";
import UpdateClient from "../components/UpdateClient";
import DeleteClient from "../components/DeleteClient";

export default function HomePage() {
  const [clientes, setClientes] = useState([]);
  const [paginaAtiva, setPaginaAtiva] = useState("clientes");

  function adicionarCliente(novoCliente) {
    // Novos clientes nascem com ativo: true
    setClientes((clientesAtuais) => [
      ...clientesAtuais,
      { ...novoCliente, ativo: true },
    ]);
  }

  function atualizarCliente(clienteAtualizado) {
    setClientes((clientesAtuais) =>
      clientesAtuais.map((cliente) =>
        cliente.id === clienteAtualizado.id ? clienteAtualizado : cliente
      )
    );
  }

  // Exclusão lógica: marca o cliente como inativo (ativo: false)
  function excluirCliente(idCliente) {
    setClientes((clientesAtuais) =>
      clientesAtuais.map((cliente) =>
        cliente.id === idCliente ? { ...cliente, ativo: false } : cliente
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
          ) : paginaAtiva === "atualizar" ? (
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
          ) : (
            <>
              <div className="page-header">
                <h2 className="page-title">Inativação de Clientes</h2>
                <p className="page-description">
                  Localize um cliente pelo CPF e inative o cadastro. O registro
                  é preservado no sistema (exclusão lógica) e não aparece na
                  listagem ativa.
                </p>
              </div>

              <DeleteClient
                clientes={clientes}
                onExcluirCliente={excluirCliente}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
