"use client";

import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ClientForm from "../components/ClientForm";
import ClientList from "../components/ClientList";

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
          <div className="page-header">
            <h2 className="page-title">Gerenciamento de Clientes</h2>
            <p className="page-description">
              Esta área é destinada ao cadastro, consulta, atualização e exclusão
              de clientes da SolarTech. Preencha os dados abaixo para registrar
              um novo cliente ou busque pelo CPF para alterar dados ou excluir um
              cadastro existente.
            </p>
          </div>

          <ClientForm
            clientes={clientes}
            onAdicionarCliente={adicionarCliente}
          />

          <ClientList
            clientes={clientes}
            onAtualizarCliente={atualizarCliente}
            onExcluirCliente={excluirCliente}
          />
        </main>
      </div>
    </div>
  );
}
