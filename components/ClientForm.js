"use client";

import { useState } from "react";
import "./ClientForm.css";

export default function ClientForm({ clientes, onAdicionarCliente }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");

  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  // Formata o CPF no padrão 000.000.000-00 durante a digitação
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

  // Valida se o CPF possui formato válido (000.000.000-00 ou 11 dígitos numéricos)
  function validarFormatoCpf(valorCpf) {
    const padraoFormatado = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const padraoApenasNumeros = /^\d{11}$/;
    return padraoFormatado.test(valorCpf) || padraoApenasNumeros.test(valorCpf);
  }

  // Valida o formato básico de e-mail
  function validarFormatoEmail(valorEmail) {
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return padraoEmail.test(valorEmail);
  }

  function handleCpfChange(evento) {
    setCpf(formatarCpf(evento.target.value));
  }

  function handleSubmit(evento) {
    evento.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");

    const nomeLimpo = nome.trim();
    const cpfLimpo = cpf.trim();
    const telefoneLimpo = telefone.trim();
    const emailLimpo = email.trim();
    const enderecoLimpo = endereco.trim();

    // 1. Verificar se todos os campos obrigatórios foram preenchidos
    if (!nomeLimpo || !cpfLimpo || !telefoneLimpo || !emailLimpo || !enderecoLimpo) {
      setMensagemErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // 2. Validar se o CPF possui um formato válido
    if (!validarFormatoCpf(cpfLimpo)) {
      setMensagemErro(
        "Formato de CPF inválido. Digite os 11 números (ex: 000.000.000-00)."
      );
      return;
    }

    // 3. Validar o formato do e-mail
    if (!validarFormatoEmail(emailLimpo)) {
      setMensagemErro(
        "Formato de e-mail inválido. Informe um e-mail válido (ex: cliente@email.com)."
      );
      return;
    }

    // 4. Verificar se já existe um cliente ATIVO cadastrado com o mesmo CPF
    const cpfApenasNumeros = cpfLimpo.replace(/\D/g, "");
    const cpfJaCadastrado = clientes.some(
      (cliente) =>
        cliente.cpf.replace(/\D/g, "") === cpfApenasNumeros &&
        cliente.ativo !== false
    );

    if (cpfJaCadastrado) {
      setMensagemErro("Já existe um cliente cadastrado com este CPF.");
      return;
    }

    // 5. Adicionar o cliente à lista de clientes utilizando o estado do React
    const novoCliente = {
      id: Date.now(),
      nome: nomeLimpo,
      cpf: formatarCpf(cpfLimpo),
      telefone: telefoneLimpo,
      email: emailLimpo,
      endereco: enderecoLimpo,
    };

    onAdicionarCliente(novoCliente);

    // 6. Exibir uma mensagem informando que o cadastro foi realizado com sucesso
    setMensagemSucesso(
      `Cliente "${novoCliente.nome}" cadastrado com sucesso!`
    );

    // 7. Limpar os campos do formulário após o cadastro
    setNome("");
    setCpf("");
    setTelefone("");
    setEmail("");
    setEndereco("");
  }

  return (
    <section className="client-form-section" aria-labelledby="form-heading">
      <div className="form-card">
        <div className="form-card-header">
          <h3 id="form-heading" className="form-card-title">
            Novo Cadastro de Cliente
          </h3>
          <span className="form-badge">Etapa 1 • Cadastro</span>
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

        <form onSubmit={handleSubmit} className="client-form" noValidate>
          <div className="form-group">
            <label htmlFor="nome" className="form-label">
              Nome completo <span className="required-mark">*</span>
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              className="form-input"
              placeholder="Ex: João Carlos da Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cpf" className="form-label">
                CPF <span className="required-mark">*</span>
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                className="form-input"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone" className="form-label">
                Telefone <span className="required-mark">*</span>
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                className="form-input"
                placeholder="(84) 99999-0000"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail <span className="required-mark">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="cliente@exemplo.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endereco" className="form-label">
              Endereço <span className="required-mark">*</span>
            </label>
            <input
              id="endereco"
              name="endereco"
              type="text"
              className="form-input"
              placeholder="Rua, número, bairro, cidade - UF"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Cadastrar Cliente
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
