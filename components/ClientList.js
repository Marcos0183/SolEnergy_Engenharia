"use client";

import { useState } from "react";
import "./ClientForm.css";
import "./ClientList.css";

export default function ClientList({
  clientes,
  onAtualizarCliente,
  onExcluirCliente,
}) {
  const [filtroCpf, setFiltroCpf] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  // Formata o CPF digitado no padrão 000.000.000-00
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

  // Exibe apenas clientes ativos (exclusão lógica)
  const clientesAtivos = clientes.filter((cliente) => cliente.ativo !== false);

  function preencherFormulario(cliente) {
    setClienteSelecionado(cliente);
    setNome(cliente.nome);
    setCpf(formatarCpf(cliente.cpf));
    setTelefone(cliente.telefone);
    setEmail(cliente.email);
    setEndereco(cliente.endereco);
    setConfirmandoExclusao(false);
    setMensagemErro("");
    setMensagemSucesso("");
  }

  function handleFiltroChange(evento) {
    const cpfFormatado = formatarCpf(evento.target.value);
    setFiltroCpf(cpfFormatado);
    setMensagemErro("");
    setMensagemSucesso("");

    const numeros = cpfFormatado.replace(/\D/g, "");
    if (numeros.length === 11) {
      const encontrado = clientesAtivos.find(
        (cliente) => cliente.cpf.replace(/\D/g, "") === numeros
      );
      if (encontrado) {
        preencherFormulario(encontrado);
      } else {
        setClienteSelecionado(null);
        setConfirmandoExclusao(false);
      }
    } else {
      setClienteSelecionado(null);
      setConfirmandoExclusao(false);
    }
  }

  function handleBuscarCliente(evento) {
    evento.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");

    const cpfNumeros = filtroCpf.replace(/\D/g, "");
    if (cpfNumeros.length !== 11) {
      setClienteSelecionado(null);
      setMensagemErro("Informe um CPF com 11 dígitos para buscar o cliente.");
      return;
    }

    const clienteEncontrado = clientesAtivos.find(
      (cliente) => cliente.cpf.replace(/\D/g, "") === cpfNumeros
    );

    if (!clienteEncontrado) {
      setClienteSelecionado(null);
      setMensagemErro("Nenhum cliente ativo foi encontrado com o CPF informado.");
      return;
    }

    preencherFormulario(clienteEncontrado);
  }

  function limparFiltro() {
    setFiltroCpf("");
    cancelarEdicao();
  }

  function cancelarEdicao() {
    setClienteSelecionado(null);
    setNome("");
    setCpf("");
    setTelefone("");
    setEmail("");
    setEndereco("");
    setConfirmandoExclusao(false);
    setMensagemErro("");
  }

  function handleSalvarAlteracoes(evento) {
    evento.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");

    if (!clienteSelecionado) return;

    const dadosAtualizados = {
      nome: nome.trim(),
      cpf: cpf.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      endereco: endereco.trim(),
    };

    if (
      !dadosAtualizados.nome ||
      !dadosAtualizados.cpf ||
      !dadosAtualizados.telefone ||
      !dadosAtualizados.email ||
      !dadosAtualizados.endereco
    ) {
      setMensagemErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(dadosAtualizados.cpf)) {
      setMensagemErro("Formato de CPF inválido. Digite os 11 números.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dadosAtualizados.email)) {
      setMensagemErro("Formato de e-mail inválido. Informe um e-mail válido.");
      return;
    }

    const cpfNumeros = dadosAtualizados.cpf.replace(/\D/g, "");
    const cpfJaUtilizado = clientesAtivos.some(
      (cliente) =>
        cliente.id !== clienteSelecionado.id &&
        cliente.cpf.replace(/\D/g, "") === cpfNumeros
    );

    if (cpfJaUtilizado) {
      setMensagemErro("Outro cliente ativo já está cadastrado com este CPF.");
      return;
    }

    const clienteAtualizado = {
      ...clienteSelecionado,
      ...dadosAtualizados,
      cpf: formatarCpf(dadosAtualizados.cpf),
    };

    onAtualizarCliente(clienteAtualizado);
    setClienteSelecionado(clienteAtualizado);
    setFiltroCpf(clienteAtualizado.cpf);
    setMensagemSucesso(
      `Os dados do cliente "${clienteAtualizado.nome}" foram atualizados com sucesso!`
    );
  }

  function handleConfirmarExclusao() {
    if (!clienteSelecionado) return;

    const nomeExcluido = clienteSelecionado.nome;
    onExcluirCliente(clienteSelecionado.id);

    setClienteSelecionado(null);
    setConfirmandoExclusao(false);
    setFiltroCpf("");
    setMensagemErro("");
    setMensagemSucesso(
      `O cliente "${nomeExcluido}" foi excluído com sucesso.`
    );
  }

  // Filtra os clientes pelo CPF (comparando apenas os números para facilitar a busca)
  const cpfBuscaNumeros = filtroCpf.replace(/\D/g, "");
  const clientesFiltrados = clientesAtivos.filter((cliente) => {
    if (!cpfBuscaNumeros) return true;
    const cpfClienteNumeros = cliente.cpf.replace(/\D/g, "");
    return cpfClienteNumeros.includes(cpfBuscaNumeros);
  });

  return (
    <section className="client-list-section" aria-labelledby="list-heading">
      <div className="list-card">
        <div className="list-card-header">
          <div>
            <h3 id="list-heading" className="list-card-title">
              Clientes Cadastrados e Busca
            </h3>
            <p className="list-card-subtitle">
              Busque um cliente pelo CPF ou selecione na lista para alterar seus
              dados ou excluí-lo.
            </p>
          </div>
          <span className="list-badge">
            {clientesFiltrados.length}{" "}
            {clientesFiltrados.length === 1 ? "cliente" : "clientes"}
          </span>
        </div>

        {mensagemErro && (
          <div className="alert alert-error" role="alert">
            {mensagemErro}
          </div>
        )}

        {mensagemSucesso && (
          <div className="alert alert-success" role="status">
            {mensagemSucesso}
          </div>
        )}

        <form onSubmit={handleBuscarCliente} className="filter-container">
          <label htmlFor="filtro-cpf" className="filter-label">
            Buscar cliente por CPF
          </label>
          <div className="filter-row">
            <input
              id="filtro-cpf"
              name="filtro-cpf"
              type="text"
              className="filter-input"
              placeholder="Digite o CPF para buscar (ex: 000.000.000-00)"
              value={filtroCpf}
              onChange={handleFiltroChange}
              maxLength={14}
              inputMode="numeric"
            />
            <button type="submit" className="btn-submit btn-search-client">
              Buscar cliente
            </button>
            {(filtroCpf || clienteSelecionado) && (
              <button
                type="button"
                className="btn-clear"
                onClick={limparFiltro}
              >
                Limpar
              </button>
            )}
          </div>
        </form>

        {clienteSelecionado && (
          <div className="client-edit-panel">
            <div className="client-edit-banner">
              <span className="client-edit-icon" aria-hidden="true">
                ✏️
              </span>
              <div>
                <strong>Gerenciar cliente: {clienteSelecionado.nome}</strong>
                <p>
                  Altere os campos abaixo para atualizar o cadastro ou utilize a
                  opção de excluir cliente.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSalvarAlteracoes}
              className="client-form"
              noValidate
            >
              <div className="form-group">
                <label htmlFor="edit-nome" className="form-label">
                  Nome completo <span className="required-mark">*</span>
                </label>
                <input
                  id="edit-nome"
                  name="nome"
                  type="text"
                  className="form-input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-cpf" className="form-label">
                    CPF <span className="required-mark">*</span>
                  </label>
                  <input
                    id="edit-cpf"
                    name="cpf"
                    type="text"
                    className="form-input"
                    value={cpf}
                    onChange={(e) => setCpf(formatarCpf(e.target.value))}
                    maxLength={14}
                    inputMode="numeric"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-telefone" className="form-label">
                    Telefone <span className="required-mark">*</span>
                  </label>
                  <input
                    id="edit-telefone"
                    name="telefone"
                    type="tel"
                    className="form-input"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-email" className="form-label">
                  E-mail <span className="required-mark">*</span>
                </label>
                <input
                  id="edit-email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-endereco" className="form-label">
                  Endereço <span className="required-mark">*</span>
                </label>
                <input
                  id="edit-endereco"
                  name="endereco"
                  type="text"
                  className="form-input"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>

              {!confirmandoExclusao ? (
                <div className="client-edit-actions">
                  <button
                    type="button"
                    className="btn-delete-client"
                    onClick={() => setConfirmandoExclusao(true)}
                  >
                    Excluir cliente
                  </button>
                  <div className="client-edit-actions-right">
                    <button
                      type="button"
                      className="btn-cancel-edit"
                      onClick={cancelarEdicao}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn-submit">
                      Salvar alterações
                    </button>
                  </div>
                </div>
              ) : (
                <div className="delete-confirm-box">
                  <p className="delete-confirm-text">
                    Tem certeza que deseja excluir o cliente{" "}
                    <strong>{clienteSelecionado.nome}</strong>? O registro será
                    inativado (exclusão lógica) e deixará de ser exibido na
                    listagem ativa.
                  </p>
                  <div className="delete-confirm-actions">
                    <button
                      type="button"
                      className="btn-cancel-edit"
                      onClick={() => setConfirmandoExclusao(false)}
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      className="btn-delete-client btn-delete-confirm"
                      onClick={handleConfirmarExclusao}
                    >
                      Confirmar exclusão
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {clientesAtivos.length === 0 ? (
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
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => {
                  const isSelecionado =
                    clienteSelecionado && clienteSelecionado.id === cliente.id;
                  return (
                    <tr
                      key={cliente.id}
                      className={isSelecionado ? "selected-row" : ""}
                    >
                      <td>{cliente.nome}</td>
                      <td className="cpf-cell">{cliente.cpf}</td>
                      <td>{cliente.telefone}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.endereco}</td>
                      <td className="actions-cell">
                        <button
                          type="button"
                          className="btn-table-action"
                          onClick={() => {
                            setFiltroCpf(formatarCpf(cliente.cpf));
                            preencherFormulario(cliente);
                          }}
                        >
                          Alterar / Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
