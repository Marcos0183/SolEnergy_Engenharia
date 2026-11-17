"use client";

import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ClientForm from "../components/ClientForm";

export default function HomePage() {
  const [clientes, setClientes] = useState([]);

  function adicionarCliente(novoCliente) {
    setClientes((clientesAtuais) => [...clientesAtuais, novoCliente]);
  }

  return (
    <div className="app-wrapper">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">Gerenciamento de Clientes</h2>
            <p className="page-description">
              Esta área é destinada ao cadastro de clientes da SolarTech.
              Preencha os dados abaixo para registrar um novo cliente no sistema.
            </p>
          </div>

          <ClientForm
            clientes={clientes}
            onAdicionarCliente={adicionarCliente}
          />
        </main>
      </div>
    </div>
  );
}
