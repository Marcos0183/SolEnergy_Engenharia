"use client";

import { useState } from "react";
import "./ClientForm.css";
import "./DeleteClient.css";

export default function DeleteClient({ clientes, onExcluirCliente }) {
  const [cpfBusca, setCpfBusca] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
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

  function handleBuscar(evento) {
    evento.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");
    setClienteSelecionado(null);
    setConfirmando(false);

    const cpfNumeros = cpfBusca.replace(/\D/g, "");
    if (cpfNumeros.length !== 11) {
      setMensagemErro("Informe um CPF com 11 dígitos para realizar a busca.");
      return;
    }

    // Busca apenas entre clientes ativos (exclusão lógica)
    const clienteEncontrado = clientes.find(
      (cliente) =>
        cliente.cpf.replace(/\D/g, "") === cpfNumeros && cliente.ativo !== false
    );

    if (!clienteEncontrado) {
      setMensagemErro(
        "Nenhum cliente ativo foi encontrado com o CPF informado."
      );
      return;
    }

    setClienteSelecionado(clienteEncontrado);
  }

  function handleConfirmarExclusao() {
    if (!clienteSelecionado) return;

    onExcluirCliente(clienteSelecionado.id);

    setMensagemSucesso(
      `O cliente "${clienteSelecionado.nome}" foi inativado com sucesso.`
    );
    setClienteSelecionado(null);
    setConfirmando(false);
    setCpfBusca("");
  }

  function cancelar() {
    setClienteSelecionado(null);
    setConfirmando(false);
    setCpfBusca("");
    setMensagemErro("");
    setMensagemSucesso("");
  }

  return (
    <section className="delete-client-section" aria-labelledby="delete-heading">
      <div className="form-card">
        <div className="form-card-header">
          <div>
            <h3 id="delete-heading" className="form-card-title">
              Inativar cliente
            </h3>
            <p className="delete-intro">
              Informe o CPF do cliente para localizar e inativar o cadastro.
              O registro é mantido no sistema (exclusão lógica).
            </p>
          </div>
          <span className="form-badge delete-badge">Clientes • Exclusão</span>
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
            <label htmlFor="delete-cpf" className="form-label">
              CPF do cliente
            </label>
            <input
              id="delete-cpf"
              name="delete-cpf"
              type="text"
              className="form-input"
              placeholder="000.000.000-00"
              value={cpfBusca}
              onChange={(evento) =>
                setCpfBusca(formatarCpf(evento.target.value))
              }
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
            Não há clientes ativos para inativar.
          </div>
        )}

        {clienteSelecionado && (
          <div className="delete-edit-area">
            <div className="delete-info-card">
              <div className="delete-info-header">
                <span className="delete-info-icon" aria-hidden="true">⚠️</span>
                <div>
                  <strong>Cliente localizado</strong>
                  <p>Confirme os dados abaixo antes de prosseguir com a inativação.</p>
                </div>
              </div>

              <dl className="delete-client-data">
                <div className="delete-data-row">
                  <dt>Nome</dt>
                  <dd>{clienteSelecionado.nome}</dd>
                </div>
                <div className="delete-data-row">
                  <dt>CPF</dt>
                  <dd className="cpf-cell">{clienteSelecionado.cpf}</dd>
                </div>
                <div className="delete-data-row">
                  <dt>Telefone</dt>
                  <dd>{clienteSelecionado.telefone}</dd>
                </div>
                <div className="delete-data-row">
                  <dt>E-mail</dt>
                  <dd>{clienteSelecionado.email}</dd>
                </div>
                <div className="delete-data-row">
                  <dt>Endereço</dt>
                  <dd>{clienteSelecionado.endereco}</dd>
                </div>
              </dl>

              {!confirmando ? (
                <div className="delete-actions">
                  <button
                    type="button"
                    className="btn-cancel-update"
                    onClick={cancelar}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => setConfirmando(true)}
                  >
                    Inativar cliente
                  </button>
                </div>
              ) : (
                <div className="delete-confirm-box">
                  <p className="delete-confirm-text">
                    Tem certeza que deseja inativar{" "}
                    <strong>{clienteSelecionado.nome}</strong>? O cadastro será
                    mantido no sistema, mas o cliente não aparecerá na listagem ativa.
                  </p>
                  <div className="delete-actions">
                    <button
                      type="button"
                      className="btn-cancel-update"
                      onClick={() => setConfirmando(false)}
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      className="btn-delete btn-delete-confirm"
                      onClick={handleConfirmarExclusao}
                    >
                      Confirmar inativação
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
