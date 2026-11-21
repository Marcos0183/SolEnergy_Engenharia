"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ClientForm from "../components/ClientForm";
import ClientList from "../components/ClientList";

const STORAGE_KEY = "solartech_clientes";

const CLIENTES_INICIAIS = [
  {
    id: 1,
    nome: "Marcos Vinícius Dantas",
    cpf: "123.456.789-01",
    telefone: "(84) 99812-3456",
    email: "marcos.dantas@solenergy.com.br",
    endereco: "Av. Coronel Martiniano, 540, Centro, Caicó - RN",
    ativo: true,
  },
  {
    id: 2,
    nome: "Ana Beatriz Medeiros",
    cpf: "234.567.890-12",
    telefone: "(84) 99645-7810",
    email: "ana.medeiros@email.com.br",
    endereco: "Rua Otávio Lamartine, 215, Penedo, Caicó - RN",
    ativo: true,
  },
  {
    id: 3,
    nome: "Carlos Eduardo Silva",
    cpf: "345.678.901-23",
    telefone: "(84) 99123-4567",
    email: "carlos.silva@empresa.com.br",
    endereco: "Av. Seridó, 890, Paraíba, Caicó - RN",
    ativo: true,
  },
  {
    id: 4,
    nome: "Fernanda Oliveira Costa",
    cpf: "456.789.012-34",
    telefone: "(84) 99988-1122",
    email: "fernanda.costa@email.com.br",
    endereco: "Rua Joel Damasceno, 112, Maynard, Caicó - RN",
    ativo: true,
  },
  {
    id: 5,
    nome: "Roberto Almeida Santos",
    cpf: "567.890.123-45",
    telefone: "(84) 98877-6655",
    email: "roberto.santos@solar.com.br",
    endereco: "Rua Major Lula, 304, Acampamento, Caicó - RN",
    ativo: true,
  },
];

export default function HomePage() {
  const [clientes, setClientes] = useState(CLIENTES_INICIAIS);
  const [hidratado, setHidratado] = useState(false);
  const [paginaAtiva, setPaginaAtiva] = useState("clientes");

  // Carrega dados salvos no localStorage ao iniciar, mantendo os clientes iniciais caso esteja vazio
  useEffect(() => {
    try {
      const dadosSalvos = localStorage.getItem(STORAGE_KEY);
      if (dadosSalvos) {
        const listaParseada = JSON.parse(dadosSalvos);
        if (Array.isArray(listaParseada) && listaParseada.length > 0) {
          setClientes(listaParseada);
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(CLIENTES_INICIAIS));
      }
    } catch {
      // Caso o localStorage não esteja disponível, mantém CLIENTES_INICIAIS em memória
    } finally {
      setHidratado(true);
    }
  }, []);

  // Persiste alterações no localStorage sempre que a lista de clientes mudar
  useEffect(() => {
    if (!hidratado) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
    } catch {
      // Ignora erros de escrita no localStorage
    }
  }, [clientes, hidratado]);

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
