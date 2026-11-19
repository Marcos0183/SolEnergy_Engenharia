"use client";

import { useState } from "react";
import "./ClientForm.css";
import "./UpdateClient.css";

export default function UpdateClient({ clientes, onAtualizarCliente }) {
  const [cpfBusca, setCpfBusca] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  function formatarCpf(valor) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    }
    if (numeros.length <= 9) {
      return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    }
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
  }

  function preencherFormulario(cliente) {
    setClienteSelecionado(cliente);
    setNome(cliente.nome);
    setCpf(formatarCpf(cliente.cpf));
    setTelefone(cliente.telefone);
    setEmail(cliente.email);
    setEndereco(cliente.endereco);
    setMensagemErro("");
    setMensagemSucesso("");
  }

  function handleBuscar(evento) {
    evento.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");
    setClienteSelecionado(null);

    const cpfNumeros = cpfBusca.replace(/\D/g, "");
    if (cpfNumeros.length !== 11) {
      setMensagemErro("Informe um CPF com 11 dígitos para realizar a busca.");
      return;
    }

    const clienteEncontrado = clientes.find(
      (cliente) =>
        cliente.cpf.replace(/\D/g, "") === cpfNumeros && cliente.ativo !== false
    );

    if (!clienteEncontrado) {
      setMensagemErro("Nenhum cliente foi encontrado com o CPF informado.");
      return;
    }

    preencherFormulario(clienteEncontrado);
  }

  function handleCpfChange(evento) {
    setCpf(formatarCpf(evento.target.value));
  }

  function handleSalvar(evento) {
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
    const cpfJaUtilizado = clientes.some(
      (cliente) =>
        cliente.id !== clienteSelecionado.id &&
        cliente.cpf.replace(/\D/g, "") === cpfNumeros
    );

    if (cpfJaUtilizado) {
      setMensagemErro("Outro cliente já está cadastrado com este CPF.");
      return;
    }

    const clienteAtualizado = {
      ...clienteSelecionado,
      ...dadosAtualizados,
      cpf: formatarCpf(dadosAtualizados.cpf),
    };

    onAtualizarCliente(clienteAtualizado);
    setClienteSelecionado(clienteAtualizado);
    setCpfBusca(clienteAtualizado.cpf);
    setMensagemSucesso(`Os dados de ${clienteAtualizado.nome} foram atualizados com sucesso.`);
  }

  function cancelarEdicao() {
    setClienteSelecionado(null);
    setCpfBusca("");
    setNome("");
    setCpf("");
    setTelefone("");
    setEmail("");
    setEndereco("");
    setMensagemErro("");
    setMensagemSucesso("");
  }

  return (
    <section className="update-client-section" aria-labelledby="update-heading">
      <div className="form-card">
        <div className="form-card-header">
          <div>
            <h3 id="update-heading" className="form-card-title">
              Atualizar dados de cliente
            </h3>
            <p className="update-intro">
              Informe o CPF do cliente para localizar o cadastro que deseja alterar.
            </p>
          </div>
          <span className="form-badge">Clientes • Atualização</span>
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

        <form onSubmit={handleBuscar} className="update-search-form">
          <div className="form-group">
            <label htmlFor="buscar-cpf" className="form-label">
              CPF do cliente
            </label>
            <input
              id="buscar-cpf"
              name="buscar-cpf"
              type="text"
              className="form-input"
              placeholder="000.000.000-00"
              value={cpfBusca}
              onChange={(evento) => setCpfBusca(formatarCpf(evento.target.value))}
              maxLength={14}
              inputMode="numeric"
            />
          </div>
          <button type="submit" className="btn-submit update-search-button">
            Buscar cliente
          </button>
        </form>

        {clientes.filter((c) => c.ativo !== false).length === 0 && (
          <div className="empty-state update-empty-state">
            Ainda não há clientes cadastrados para atualizar.
          </div>
        )}

        {clienteSelecionado && (
          <div className="update-edit-area">
            <div className="update-selected-client">
              <span className="update-selected-icon" aria-hidden="true">✓</span>
              <div>
                <strong>Cliente localizado</strong>
                <p>Altere os campos necessários e salve as modificações.</p>
              </div>
            </div>

            <form onSubmit={handleSalvar} className="client-form">
              <div className="form-group">
                <label htmlFor="update-nome" className="form-label">
                  Nome completo <span className="required-mark">*</span>
                </label>
                <input
                  id="update-nome"
                  name="nome"
                  type="text"
                  className="form-input"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="update-cpf" className="form-label">
                    CPF <span className="required-mark">*</span>
                  </label>
                  <input
                    id="update-cpf"
                    name="cpf"
                    type="text"
                    className="form-input"
                    value={cpf}
                    onChange={handleCpfChange}
                    maxLength={14}
                    inputMode="numeric"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="update-telefone" className="form-label">
                    Telefone <span className="required-mark">*</span>
                  </label>
                  <input
                    id="update-telefone"
                    name="telefone"
                    type="tel"
                    className="form-input"
                    value={telefone}
                    onChange={(evento) => setTelefone(evento.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="update-email" className="form-label">
                  E-mail <span className="required-mark">*</span>
                </label>
                <input
                  id="update-email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="update-endereco" className="form-label">
                  Endereço <span className="required-mark">*</span>
                </label>
                <input
                  id="update-endereco"
                  name="endereco"
                  type="text"
                  className="form-input"
                  value={endereco}
                  onChange={(evento) => setEndereco(evento.target.value)}
                />
              </div>

              <div className="form-actions update-form-actions">
                <button
                  type="button"
                  className="btn-cancel-update"
                  onClick={cancelarEdicao}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  Salvar alterações
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
