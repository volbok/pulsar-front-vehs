/* eslint eqeqeq: "off" */
import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "./Context";
import moment from "moment";
import "moment/locale/pt-br";
// router.
import { useHistory } from "react-router-dom";
// funções.
import toast from "../functions/toast";
import checkinput from "../functions/checkinput";
import maskdate from "../functions/maskdate";
import maskphone from "../functions/maskphone";
// imagens.
import salvar from "../images/salvar.svg";
import deletar from "../images/deletar.svg";
import back from "../images/back.svg";
import novo from "../images/novo.svg";
import modal from "../functions/modal";

function Cadastro() {
  // context.
  const {
    html,
    pagina,
    setpagina,
    setusuario,
    settoast,
    setdialogo,
    unidade,
    setunidade,
    hospital,
    unidades,
    pacientes,
    setpacientes,
    paciente,
    setpaciente,
    atendimentos,
    setatendimentos,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  const refreshApp = () => {
    setusuario({
      id: 0,
      nome_usuario: "LOGOFF",
      dn_usuario: null,
      cpf_usuario: null,
      email_usuario: null,
    });
    setpagina(0);
    history.push("/");
  };
  window.addEventListener("load", refreshApp);

  const [atendimento, setatendimento] = useState([]);
  const [arrayleitos, setarrayleitos] = useState([]);
  useEffect(() => {
    if (pagina == 2) {
      setpaciente([]);
      setatendimento([]);
      loadPacientes();
      loadAtendimentos();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // recuperando registros de pacientes cadastrados na aplicação.
  const [arraypacientes, setarraypacientes] = useState([]);
  const loadPacientes = () => {
    axios
      .get(html + "list_pacientes")
      .then((response) => {
        setpacientes(response.data.rows);
        setarraypacientes(response.data.rows);
      })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO: " + error,
            "black",
            3000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 3000);
        } else {
          toast(
            settoast,
            error.response.data.message + " REINICIANDO APLICAÇÃO.",
            "black",
            3000
          );
          setTimeout(() => {
            setpagina(0);
            history.push("/");
          }, 3000);
        }
      });
  };

  // recuperando registros de pacientes cadastrados na aplicação.
  const loadAtendimentos = () => {
    axios
      .get(html + "allatendimentos/" + hospital)
      .then((response) => {
        setatendimentos(response.data.rows);
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO AO CARREGAR ATENDIMENTOS, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // registrando um novo paciente.
  const insertPaciente = () => {
    var obj = {
      nome_paciente: document
        .getElementById("inputEditNomePaciente")
        .value.toUpperCase(),
      nome_mae_paciente: document
        .getElementById("inputEditNomeMae")
        .value.toUpperCase(),
      dn_paciente: moment(
        document.getElementById("inputEditDn").value,
        "DD/MM/YYYY"
      ),

      antecedentes_pessoais: null,
      medicacoes_previas: null,
      exames_previos: null,
      exames_atuais: null,

      tipo_documento: document
        .getElementById("inputEditTipoDocumento")
        .value.toUpperCase(),
      numero_documento: document
        .getElementById("inputEditNumeroDocumento")
        .value.toUpperCase(),
      cns: document
        .getElementById("inputEditCns")
        .value.toUpperCase(),
      endereco: document
        .getElementById("inputEditEndereco")
        .value.toUpperCase(),

      logradouro: document
        .getElementById("inputEditLogradouro")
        .value.toUpperCase(),
      bairro: document
        .getElementById("inputEditBairro")
        .value.toUpperCase(),
      localidade: document
        .getElementById("inputEditLocalidade")
        .value.toUpperCase(),
      uf: document
        .getElementById("inputEditUf")
        .value.toUpperCase(),
      cep: document
        .getElementById("inputEditCep")
        .value.toUpperCase(),

      telefone: document
        .getElementById("inputEditTelefone")
        .value.toUpperCase(),
      email: document.getElementById("inputEditEmail").value,

      nome_responsavel: document
        .getElementById("inputEditNomeResponsavel")
        .value.toUpperCase(),
      sexo: document
        .getElementById("inputEditSexo")
        .value.toUpperCase(),
      nacionalidade: document
        .getElementById("inputEditNacionalidade")
        .value.toUpperCase(),
      cor: document
        .getElementById("inputEditCor")
        .value.toUpperCase(),
      etnia: document
        .getElementById("inputEditEtnia")
        .value.toUpperCase(),

      orgao_emissor: document
        .getElementById("inputEditOrgaoEmissor")
        .value.toUpperCase(),
      endereco_numero: document
        .getElementById("inputEditEnderecoNumero")
        .value.toUpperCase(),
      endereco_complemento: document
        .getElementById("inputEditEnderecoComplemento")
        .value.toUpperCase(),
      foto: 1,
    };
    axios
      .post(html + "insert_paciente", obj)
      .then(() => {
        loadPacientes();
        setvieweditpaciente(0);
        toast(
          settoast,
          "PACIENTE CADASTRADO COM SUCESSO NA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          3000
        );
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO AO INSERIR PACIENTE, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // excluir um paciente.
  const deletePaciente = (paciente) => {
    axios
      .get(html + "delete_paciente/" + paciente)
      .then(() => {
        loadPacientes();
        toast(
          settoast,
          "PACIENTE EXCLUÍDO COM SUCESSO DA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          3000
        );
        // excluindo todos os registros de atendimentos relativos ao paciente excluído.
        atendimentos
          .filter((atendimento) => atendimento.id_paciente == paciente)
          .map((atendimento) => {
            deleteAtendimento(atendimento.id_atendimento);
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              loadAtendimentos();
              setvieweditpaciente(0);
            }, 1000);
            return null;
          });
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
        setTimeout(() => {
          setpagina(0);
          history.push("/");
        }, 5000);
      });
  };

  // registrando um novo atendimento.
  const insertAtendimento = (leito) => {
    var obj = {
      data_inicio: moment(),
      data_termino: null,
      problemas: null,
      id_paciente: paciente.id_paciente,
      id_unidade: unidade,
      nome_paciente: paciente.nome_paciente,
      leito: leito,
      situacao: 1, // 1 = atendimento ativo; 0 = atendimento encerrado.
      id_cliente: hospital,
      classificacao: null,
      id_profissional: null,
    };
    axios
      .post(html + "insert_atendimento", obj)
      .then(() => {
        loadAtendimentos();
        loadLeitos();
        toast(
          settoast,
          "ATENDIMENTO INICIADO COM SUCESSO",
          "rgb(82, 190, 128, 1)",
          3000
        );
      })
  };

  const updateAtendimento = (item, leito) => {
    var obj = {
      data_inicio: item.data_inicio,
      data_termino: null,
      problemas: item.problemas,
      id_paciente: item.id_paciente,
      id_unidade: unidade,
      nome_paciente: item.nome_paciente,
      leito: leito,
      situacao: 1,
      id_cliente: hospital,
      classificacao: item.classificacao,
      id_profissional: item.id_profissional
    };
    axios.post(html + "update_atendimento/" + item.id_atendimento, obj).then(() => {
      loadLeitos();
      axios
        .get(html + "allatendimentos/" + hospital)
        .then((response) => {
          let x = [];
          setatendimentos(response.data.rows);
          x = response.data.rows;
          setatendimento(
            x.filter(
              (valor) =>
                valor.id_cliente == hospital &&
                valor.data_termino == null &&
                valor.id_paciente == paciente.id_paciente
            ));
        });
    });
  }

  // encerrando um atendimento.
  const closeAtendimento = (atendimento) => {
    atendimento.map((item) => {
      var obj = {
        data_inicio: item.data_inicio,
        data_termino: moment(),
        historia_atual: item.historia_atual,
        id_paciente: item.id_paciente,
        id_unidade: item.id_unidade,
        nome_paciente: item.nome_paciente,
        leito: item.leito,
        situacao: 0, // 1 = atendimento ativo; 0 = atendimento encerrado.
        id_cliente: hospital,
        classificacao: item.classificacao,
      };
      axios
        .post(html + "update_atendimento/" + item.id_atendimento, obj)
        .then(() => {
          axios
            .get(html + "list_all_leitos")
            .then((response) => {
              setarrayleitos(response.data.rows);
              var x = response.data.rows;
              console.log(arrayleitos);
              console.log(x);
              console.log(x.filter(valor => valor.leito == item.leito).map(valor => valor.id_leito).pop());
              updateStatusLeito(x.filter(valor => valor.leito == item.leito).map(valor => valor.id_leito).pop(), item.id_unidade, item.leito, 'LIVRE');
              loadLeitos();
              axios
                .get(html + "allatendimentos/" + hospital)
                .then((response) => {
                  let x = [];
                  setatendimentos(response.data.rows);
                  x = response.data.rows;
                  setatendimento(
                    x.filter(
                      (valor) =>
                        valor.id_cliente == hospital &&
                        valor.data_termino == null &&
                        valor.id_paciente == paciente.id_paciente
                    ));
                });
              setvieweditpaciente(0);
              toast(
                settoast,
                "ATENDIMENTO ENCERRADO COM SUCESSO NA BASE PULSAR",
                "rgb(82, 190, 128, 1)",
                3000
              );
            });
        });
      return null;
    });
  };

  // excluir um atendimento.
  const deleteAtendimento = (id) => {
    axios.get(html + "delete_atendimento/" + id).catch(function () {
      toast(settoast, "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.", "black", 5000);
      setTimeout(() => {
        setpagina(0);
        history.push("/");
      }, 5000);
    });
  };

  const [viewtipodocumento, setviewtipodocumento] = useState(0);
  function ViewTipoDocumento() {
    let array = ["CPF", "RG", "CERT. NASCTO.", "OUTRO"];
    return (
      <div
        className="fundo"
        style={{ display: viewtipodocumento == 1 ? "flex" : "none" }}
        onClick={() => setviewtipodocumento(0)}
      >
        <div className="janela scroll" onClick={(e) => e.stopPropagation()}>
          {array.map((item) => (
            <div
              className="button"
              style={{ width: 100 }}
              onClick={() => {
                document.getElementById("inputEditTipoDocumento").value = item;
                setviewtipodocumento(0);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const [filterpaciente, setfilterpaciente] = useState("");
  var timeout = null;
  var searchpaciente = "";
  const filterPaciente = () => {
    clearTimeout(timeout);
    document.getElementById("inputPaciente").focus();
    searchpaciente = document
      .getElementById("inputPaciente")
      .value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchpaciente == "") {
        setfilterpaciente("");
        setarraypacientes(pacientes);
        document.getElementById("inputPaciente").value = "";
        setTimeout(() => {
          document.getElementById("inputPaciente").focus();
        }, 100);
      } else {
        setfilterpaciente(
          document.getElementById("inputPaciente").value.toUpperCase()
        );
        setarraypacientes(
          pacientes.filter((item) =>
            item.nome_paciente.includes(searchpaciente)
          )
        );
        document.getElementById("inputPaciente").value = searchpaciente;
        setTimeout(() => {
          document.getElementById("inputPaciente").focus();
        }, 100);
      }
    }, 1000);
  };

  // filtro de paciente por nome.
  function FilterPaciente() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="BUSCAR PACIENTE..."
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = "BUSCAR PACIENTE...")}
        onKeyUp={() => filterPaciente()}
        type="text"
        id="inputPaciente"
        defaultValue={filterpaciente}
        maxLength={100}
        style={{ margin: 0, width: window.innerWidth < 426 ? "100%" : "30vw" }}
      ></input>
    );
  }

  function ListaDePacientes() {
    return (
      <div style={{ position: 'relative' }}>
        <BuscaPaciente></BuscaPaciente>
        <div className="grid"
          style={{
            marginTop: 10,
          }}
        >
          {arraypacientes
            .sort((a, b) => (a.nome_paciente > b.nome_paciente ? 1 : -1))
            .map((item) => (
              <div
                className="button"
                key={"paciente " + item.id_paciente}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
                onClick={() => {
                  setpaciente(item);
                  setatendimento(
                    atendimentos.filter(
                      (valor) =>
                        valor.id_cliente == hospital &&
                        valor.data_termino == null &&
                        valor.id_paciente == item.id_paciente
                    ));
                  setvieweditpaciente(1)
                }}
              >
                <div>
                  <div className="texto_claro">
                    {'NOME DO CLIENTE:'}
                  </div>
                  <div style={{ margin: 5, marginTop: 0, textAlign: 'left' }}>
                    {item.nome_paciente.length > 25 ? item.nome_paciente.slice(0, 25) + '...' : item.nome_paciente}
                  </div>
                  <div className="texto_claro">
                    {'DATA DE NASCIMENTO:'}
                  </div>
                  <div style={{ margin: 5, marginTop: 0, textAlign: 'left' }}>
                    {moment(item.dn_paciente).format("DD/MM/YY")}
                  </div>
                  <div className="texto_claro">
                    {'NOME DA MÃE DO PACIENTE:'}
                  </div>
                  <div style={{ margin: 5, marginTop: 0, textAlign: 'left' }}>
                    {item.nome_mae_paciente.length > 25 ? item.nome_mae_paciente.slice(0, 25) + '...' : item.nome_mae_paciente}
                  </div>
                </div>
                <div
                  className="button"
                  style={{
                    width: 'calc(100% - 20px)',
                    backgroundColor:
                      atendimentos.filter(
                        (valor) =>
                          valor.id_paciente == item.id_paciente &&
                          valor.data_termino == null
                      ).length > 0
                        ? "rgb(82, 190, 128, 1)"
                        : "#66b2b2"
                  }}
                >
                  {atendimentos.filter(
                    (valor) =>
                      valor.id_paciente == item.id_paciente &&
                      valor.data_termino == null
                  ).length > 0
                    ? "EM ATENDIMENTO"
                    : "INICIAR ATENDIMENTO"}
                </div>
              </div>
            ))}
        </div>
        <div
          className="text1"
          style={{
            display: arraypacientes.length == 0 ? "flex" : "none",
            width: "90vw",
            opacity: 0.5,
          }}
        >
          SEM PACIENTES CADASTRADOS NA APLICAÇÃO
        </div>
      </div>
    );
  }

  // api para busca do endereço pelo CEP:
  const pegaEndereco = (cep) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://viacep.com.br/ws/" + cep + "/json/", true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
      if ((xhr.readyState == 0 || xhr.readyState == 4) && xhr.status == 200) {
        let endereco = JSON.parse(xhr.responseText);
        if (endereco.logradouro != undefined) {
          document.getElementById("inputEditEndereco").value =
            endereco.logradouro +
            ", BAIRRO: " +
            endereco.bairro +
            ", " +
            endereco.localidade +
            " - " +
            endereco.uf +
            " - CEP: " +
            endereco.cep;
          document.getElementById("inputEditCep").value = endereco.cep;
          document.getElementById("inputEditLogradouro").value = endereco.logradouro.toUpperCase();
          document.getElementById("inputEditBairro").value = endereco.bairro.toUpperCase();
          document.getElementById("inputEditLocalidade").value = endereco.localidade.toUpperCase();
          document.getElementById("inputEditUf").value = endereco.uf.toUpperCase();
        } else {
          document.getElementById("inputEditEndereco").value = "";
          document.getElementById("inputEditCep").value = "CEP";
        }
      }
    };
    xhr.send(null);
  };

  const [vieweditpaciente, setvieweditpaciente] = useState(0);
  const DadosPacienteAtendimento = useCallback(() => {
    var timeout = null;
    return (
      <div
        className="fundo"
        style={{ display: (vieweditpaciente == 1 || vieweditpaciente == 2) && atendimento != null ? "flex" : "none" }}
        onClick={() => setvieweditpaciente(0)}
      >
        <div
          className="janela scroll"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            flexDirection: "column",
            justifyContent: "flex-start",
            width: '90vw',
            height: '90vh',
          }}
        >
          <div id="botão para fechar tela de edição do paciente e movimentação de leito"
            className="button-yellow"
            onClick={() => setvieweditpaciente(0)}
            style={{
              display: vieweditpaciente == 1 ? "flex" : "none",
              alignSelf: 'flex-end',
            }}
          >
            <img
              alt=""
              src={back}
              style={{
                margin: 10,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: window.innerWidth < 425 ? 'column' : 'row',
            alignContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
            <div id="dados do paciente"
              style={{
                flexDirection: "column",
                justifyContent: 'flex-start',
                alignItems: "center",
                marginRight: 0,
              }}
            >
              <div id="nome do paciente"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">NOME DO PACIENTE</div>
                <textarea
                  autoComplete="off"
                  placeholder="NOME DO PACIENTE"
                  className="textarea"
                  type="text"
                  id="inputEditNomePaciente"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "NOME DO PACIENTE")}
                  defaultValue={vieweditpaciente == 1 ? paciente.nome_paciente : ''}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: '30vw',
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
              <div id="nome do responsavel"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">NOME DO RESPONSÁVEL</div>
                <textarea
                  autoComplete="off"
                  placeholder="NOME DO RESPONSÁVEL"
                  className="textarea"
                  type="text"
                  id="inputEditNomeResponsavel"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "NOME DO RESPONSÁVEL")}
                  defaultValue={vieweditpaciente == 1 ? paciente.nome_responsavel : ''}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: '30vw',
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
              <div id="dn paciente"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">DATA DE NASCIMENTO</div>
                <textarea
                  autoComplete="off"
                  placeholder="DN"
                  className="textarea"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  id="inputEditDn"
                  title="FORMATO: DD/MM/YYYY"
                  onClick={() => document.getElementById("inputEditDn").value = ""}
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "DN")}
                  onKeyUp={() => maskdate(timeout, "inputEditDn")}
                  defaultValue={vieweditpaciente == 1 ? moment(paciente.dn_paciente).format("DD/MM/YYYY") : moment().format('DD/MM/YYYY')}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 100,
                    textAlign: "center",
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
              <div id="sexo"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">SEXO</div>
                <textarea
                  autoComplete="off"
                  placeholder="SEXO"
                  className="textarea"
                  type="text"
                  id="inputEditSexo"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "SEXO")}
                  defaultValue={vieweditpaciente == 1 ? paciente.sexo : ''}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    textAlign: "center",
                    width: 100,
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
              <div id="nacionalidade"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">NACIONALIDADE</div>
                <textarea
                  autoComplete="off"
                  placeholder="NACIONALIDADE"
                  className="textarea"
                  type="text"
                  id="inputEditNacionalidade"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "NACIONALIDADE")}
                  defaultValue={vieweditpaciente == 1 ? paciente.nacionalidade : ''}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: '30vw',
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
              <div id="cor"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">COR</div>
                <textarea
                  autoComplete="off"
                  placeholder="COR"
                  className="textarea"
                  type="text"
                  id="inputEditCor"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "COR")}
                  defaultValue={vieweditpaciente == 1 ? paciente.cor : ''}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: '30vw',
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
              <div id="etnia"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">ETNIA</div>
                <textarea
                  autoComplete="off"
                  placeholder="ETNIA"
                  className="textarea"
                  type="text"
                  id="inputEditEtnia"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "ETNIA")}
                  defaultValue={vieweditpaciente == 1 ? paciente.etnia : ''}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: '30vw',
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>

              <div id="documento"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">DOCUMENTO</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <input id="inputEditTipoDocumento"
                    autoComplete="off"
                    placeholder="TIPO DE DOC."
                    className="input destacaborda"
                    type="text"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "TIPO DE DOC.")}
                    defaultValue={vieweditpaciente == 1 ? paciente.tipo_documento : ''}
                    onClick={() => setviewtipodocumento(1)}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignSelf: "center",
                      width: 130,
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  ></input>
                  <textarea id="inputEditNumeroDocumento"
                    autoComplete="off"
                    placeholder="NÚMERO DO DOCUMENTO"
                    className="textarea"
                    type="text"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "NÚMERO DO DOCUMENTO")}
                    defaultValue={vieweditpaciente == 1 ? paciente.numero_documento : ''}
                    style={{
                      flexDirection: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      textAlign: "center",
                      width: 100,
                      padding: 15,
                      height: 20,
                      minHeight: 20,
                      maxHeight: 20,
                    }}
                  ></textarea>
                </div>
              </div>
              <div id="orgao emissor"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">ÓRGÃO EMISSOR</div>
                <textarea
                  autoComplete="off"
                  placeholder="ÓRGÃO EMISSOR"
                  className="textarea"
                  type="text"
                  id="inputEditOrgaoEmissor"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "ÓRGÃO EMISSOR")}
                  defaultValue={vieweditpaciente == 1 ? paciente.orgao_emissor : ''}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 200,
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
              <div id="cns"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">CNS</div>
                <textarea
                  title="CNS = CARTÃO NACIONAL DE SAÚDE."
                  autoComplete="off"
                  placeholder="CNS"
                  className="textarea"
                  type="text"
                  id="inputEditCns"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "CNS")}
                  defaultValue={vieweditpaciente == 1 ? paciente.cns : ''}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 200,
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
              <div id="nome da mae"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">NOME DA MÃE</div>
                <textarea
                  autoComplete="off"
                  placeholder="NOME DA MÃE"
                  className="textarea"
                  type="text"
                  id="inputEditNomeMae"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "NOME DA MÃE")}
                  defaultValue={vieweditpaciente == 1 ? paciente.nome_mae_paciente : ''}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: '30vw',
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
              <div id="endereco completo"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">ENDEREÇO</div>
                <textarea
                  autoComplete="off"
                  placeholder="BUSCAR CEP..."
                  className="textarea"
                  type="text"
                  id="inputEditCep"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "BUSCAR CEP...")}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    textAlign: 'center',
                    width: 100,
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                  onKeyUp={() => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                      pegaEndereco(document.getElementById("inputEditCep").value);
                    }, 2000);
                  }}
                ></textarea>
                <textarea id="inputEditEndereco"
                  className="textarea"
                  type="text"
                  defaultValue={vieweditpaciente == 1 ? paciente.endereco : ''}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: '30vw',
                    padding: 15,
                    height: 75,
                    minHeight: 75,
                    maxHeight: 75,
                  }}
                ></textarea>

                <div id="endereco - logradouro"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div className="text1">LOGRADOURO</div>
                  <textarea
                    className="textarea"
                    type="text"
                    id="inputEditLogradouro"
                    placeholder="LOGRADOURO"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "LOGRADOURO (RUA, PRAÇA)...")}
                    defaultValue={vieweditpaciente == 1 ? paciente.logradouro : ''}
                    style={{
                      flexDirection: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      width: '30vw',
                      padding: 15,
                      height: 20,
                      minHeight: 20,
                      maxHeight: 20,
                    }}
                  ></textarea>
                </div>
                <div id="endereco - numero"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div className="text1">NÚMERO</div>
                  <textarea
                    className="textarea"
                    type="text"
                    id="inputEditEnderecoNumero"
                    placeholder="NÚMERO"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "NUMERO...")}
                    defaultValue={vieweditpaciente == 1 ? paciente.endereco_numero : ''}
                    style={{
                      flexDirection: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      width: 100,
                      padding: 15,
                      height: 20,
                      minHeight: 20,
                      maxHeight: 20,
                    }}
                  ></textarea>
                </div>
                <div id="endereco - complemento"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div className="text1">COMPLEMENTO</div>
                  <textarea
                    className="textarea"
                    type="text"
                    id="inputEditEnderecoComplemento"
                    placeholder="COMPLEMENTO"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "COMPLEMENTO...")}
                    defaultValue={vieweditpaciente == 1 ? paciente.endereco_complemento : ''}
                    style={{
                      flexDirection: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      width: '30vw',
                      padding: 15,
                      height: 20,
                      minHeight: 20,
                      maxHeight: 20,
                    }}
                  ></textarea>
                </div>
                <div id="endereco - bairro"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div className="text1">BAIRRO</div>
                  <textarea
                    className="textarea"
                    type="text"
                    id="inputEditBairro"
                    placeholder="BAIRRO"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "BAIRRO...")}
                    defaultValue={vieweditpaciente == 1 ? paciente.bairro : ''}
                    style={{
                      flexDirection: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      width: '30vw',
                      padding: 15,
                      height: 20,
                      minHeight: 20,
                      maxHeight: 20,
                    }}
                  ></textarea>
                </div>
                <div id="endereco - localidade"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div className="text1">CIDADE/LOCALIDADE</div>
                  <textarea
                    className="textarea"
                    type="text"
                    id="inputEditLocalidade"
                    placeholder="LOCALIDADE"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "LOCALIDADE (CIDADE)...")}
                    defaultValue={vieweditpaciente == 1 ? paciente.localidade : ''}
                    style={{
                      flexDirection: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      width: '30vw',
                      padding: 15,
                      height: 20,
                      minHeight: 20,
                      maxHeight: 20,
                    }}
                  ></textarea>
                </div>
                <div id="endereco - uf"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div className="text1">UF</div>
                  <textarea
                    className="textarea"
                    type="text"
                    id="inputEditUf"
                    placeholder="UF"
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "UF")}
                    defaultValue={vieweditpaciente == 1 ? paciente.uf : ''}
                    style={{
                      flexDirection: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      textAlign: "center",
                      width: 100,
                      padding: 15,
                      height: 20,
                      minHeight: 20,
                      maxHeight: 20,
                    }}
                  ></textarea>
                </div>
              </div>

              <div id="telefone"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">TELEFONE</div>
                <textarea
                  autoComplete="off"
                  placeholder="TELEFONE"
                  className="textarea"
                  type="text"
                  id="inputEditTelefone"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "TELEFONE")}
                  defaultValue={vieweditpaciente == 1 ? paciente.telefone : ''}
                  onKeyUp={() =>
                    maskphone(timeout, "inputEditTelefone")
                  }
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: 100,
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
              <div id="email"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="text1">EMAIL</div>
                <textarea
                  autoComplete="off"
                  placeholder="EMAIL"
                  className="textarea nocaps"
                  type="text"
                  id="inputEditEmail"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "EMAIL")}
                  defaultValue={vieweditpaciente == 1 ? paciente.email : ''}
                  style={{
                    flexDirection: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    width: '30vw',
                    padding: 15,
                    height: 20,
                    minHeight: 20,
                    maxHeight: 20,
                  }}
                ></textarea>
              </div>
              <div id="botões da tela editar paciente"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <div id="botão para fechar tela de edição do paciente e movimentação de leito"
                  className="button-yellow"
                  onClick={() => setvieweditpaciente(0)}
                  style={{ display: vieweditpaciente == 2 ? "flex" : "none" }}
                >
                  <img
                    alt=""
                    src={back}
                    style={{
                      margin: 10,
                      height: 30,
                      width: 30,
                    }}
                  ></img>
                </div>
                <div id="btnUpdatePaciente"
                  title={vieweditpaciente == 1 ? "ATUALIZAR DADOS DO PACIENTE" : "SALVAR REGISTRO DE PACIENTE"}
                  className="button-green"
                  onClick={() => {
                    if (vieweditpaciente == 1) {
                      checkinput('textarea', settoast, ["inputEditNomePaciente", "inputEditDn", "inputEditNumeroDocumento", "inputEditNomeMae", "inputEditEndereco", "inputEditTelefone", "inputEditEmail"], "btnUpdatePaciente", updatePaciente, [])
                    } else {
                      checkinput('textarea', settoast, ["inputEditNomePaciente", "inputEditDn", "inputEditNumeroDocumento", "inputEditNomeMae", "inputEditEndereco", "inputEditTelefone", "inputEditEmail"], "btnUpdatePaciente", insertPaciente, [])
                    }
                  }}
                  style={{ width: 50, height: 50, alignSelf: "center" }}
                >
                  <img
                    alt=""
                    src={salvar}
                    style={{
                      margin: 10,
                      height: 30,
                      width: 30,
                    }}
                  ></img>
                </div>
                <div id="btnDeletePaciente"
                  title="EXCLUIR PACIENTE"
                  className="button-yellow"
                  onClick={() => {
                    modal(
                      setdialogo,
                      "TEM CERTEZA QUE DESEJA EXCLUIR O REGISTRO DESTE PACIENTE? ESTA AÇÃO É IRREVERSÍVEL.",
                      deletePaciente,
                      paciente.id_paciente
                    );
                  }}
                  style={{ width: 50, height: 50, alignSelf: "center" }}
                >
                  <img
                    alt=""
                    src={deletar}
                    style={{
                      margin: 10,
                      height: 30,
                      width: 30,
                    }}
                  ></img>
                </div>
              </div>
            </div>
            <div id="card status de atendimento"
              className="card cor7"
              style={{
                display: vieweditpaciente == 1 ? "flex" : "none",
                flexDirection: "column",
                justifyContent: 'center',
                margin: window.innerWidth < 769 ? 5 : 20,
                marginRight: 5,
                width: '40vw',
              }}
            >
              <div id="paciente sem atendimento ativo"
                style={{
                  display:
                    atendimentos.filter(
                      (item) =>
                        item.id_paciente == paciente.id_paciente &&
                        item.data_termino == null
                    ).length == 0
                      ? "flex"
                      : "none",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <div className="text1" style={{ margin: 15, width: '100%' }}>
                  {
                    "HÓSPEDE AINDA NÃO ALOCADO EM UM APARTAMENTO."
                  }
                </div>
                <div className="button" onClick={() => { setviewseletorunidades(1) }}>
                  INICIAR ATENDIMENTO
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                ></div>
              </div>
              <div id="em atendimento na unidade logada"
                className="card cor5hover"
                style={{
                  display:
                    atendimentos.filter(
                      (item) =>
                        item.id_paciente == paciente.id_paciente &&
                        item.data_termino == null
                    ).length > 0
                      ? "flex"
                      : "none",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <div className="text1"
                  style={{
                    width: '100%',
                    display:
                      atendimentos.filter(
                        (item) =>
                          item.id_paciente == paciente.id_paciente &&
                          item.data_termino == null && item.id_unidade != 4
                      ).length > 0
                        ? "flex"
                        : "none",
                  }}>
                  {"PACIENTE ATUALMENTE EM ATENDIMENTO: UNIDADE " +
                    unidades
                      .filter(
                        (value) =>
                          value.id_unidade ==
                          atendimento.map((item) => item.id_unidade)
                      )
                      .map((item) => item.nome_unidade) +
                    " - LEITO " +
                    atendimento.map((item) => item.leito)}
                </div>
                <div className="text1"
                  style={{
                    display: atendimento.map(item => item.id_unidade) == 4 ? 'flex' : 'none',
                  }}>
                  {atendimento.id_unidade}
                  {"PACIENTE AGUARDANDO TRIAGEM PARA ATENDIMENTO"}
                </div>
                <div className="button" onClick={() => setviewseletorunidades(1)}>
                  ALTERAR LEITO
                </div>
                <div
                  className="button-yellow"
                  title="ENCERRAR ATENDIMENTO"
                  onClick={() => {
                    modal(
                      setdialogo,
                      "TEM CERTEZA DE QUE DESEJA ENCERRAR ESTE ATENDIMENTO? ESTA OPERAÇÃO É IRREVERSÍVEL.",
                      closeAtendimento,
                      atendimento
                    );
                  }}
                >
                  ENCERRAR ATENDIMENTO
                </div>
              </div>
              <div id="em atendimento em outro serviço"
                className="card cor6hover"
                style={{
                  display:
                    atendimentos.filter(
                      (item) =>
                        item.id_paciente == paciente.id_paciente &&
                        item.id_unidade != unidade &&
                        item.id_cliente != hospital &&
                        item.data_termino == null
                    ).length > 0
                      ? "flex"
                      : "none",
                  flexDirection: "column",
                  justifyContent: "center",
                  // width: window.innerWidth < 426 ? "70vw" : "30vw",
                  alignSelf: "center",
                }}
              >
                <div className="text1" style={{
                  width: '100%',
                }}>
                  {"PACIENTE COM ATENDIMENTO ATIVO EM OUTRO SERVIÇO"}
                </div>
                <div className="button" onClick={() => setviewseletorunidades(1)}>
                  ALTERAR LEITO
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    // eslint-disable-next-line  
  }, [paciente, hospital, unidades, unidade, atendimento, atendimentos, vieweditpaciente, arrayleitos]);

  // atualizando um novo paciente.
  const updatePaciente = () => {
    var obj = {
      nome_paciente: document.getElementById("inputEditNomePaciente").value.toUpperCase(),
      nome_mae_paciente: document.getElementById("inputEditNomeMae").value.toUpperCase(),
      dn_paciente: moment(document.getElementById("inputEditDn").value, "DD/MM/YYYY"),
      antecedentes_pessoais: paciente.antecedentes_pessoais,
      medicacoes_previas: paciente.medicacoes_previas,
      exames_previos: paciente.exames_previos,
      exames_atuais: paciente.exames_atuais,
      tipo_documento: document.getElementById("inputEditTipoDocumento").value.toUpperCase(),
      numero_documento: document.getElementById("inputEditNumeroDocumento").value.toUpperCase(),
      cns: document.getElementById("inputEditCns").value.toUpperCase(),
      endereco: document.getElementById("inputEditEndereco").value.toUpperCase(),

      logradouro: document.getElementById("inputEditLogradouro").value.toUpperCase(),
      bairro: document.getElementById("inputEditBairro").value.toUpperCase(),
      localidade: document.getElementById("inputEditLocalidade").value.toUpperCase(),
      uf: document.getElementById("inputEditUf").value.toUpperCase(),
      cep: document.getElementById("inputEditCep").value.toUpperCase(),

      telefone: document.getElementById("inputEditTelefone").value.toUpperCase(),
      email: document.getElementById("inputEditEmail").value,

      nome_responsavel: document.getElementById("inputEditNomeResponsavel").value.toUpperCase(),
      sexo: document.getElementById("inputEditSexo").value.toUpperCase(),
      nacionalidade: document.getElementById("inputEditNacionalidade").value.toUpperCase(),
      cor: document.getElementById("inputEditCor").value.toUpperCase(),
      etnia: document.getElementById("inputEditEtnia").value.toUpperCase(),

      orgao_emissor: document.getElementById("inputEditOrgaoEmissor").value.toUpperCase(),
      endereco_numero: document.getElementById("inputEditEnderecoNumero").value.toUpperCase(),
      endereco_complemento: document.getElementById("inputEditEnderecoComplemento").value.toUpperCase(),

    };
    axios
      .post(html + "update_paciente/" + paciente.id_paciente, obj)
      .then(() => {
        loadPacientes();
        setvieweditpaciente(0);
        toast(
          settoast,
          "PACIENTE ATUALIZADO COM SUCESSO NA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          3000
        );
      })
  };

  const [viewseletorunidades, setviewseletorunidades] = useState(0);
  const [selectedunidade, setselectedunidade] = useState("");
  function SeletorDeUnidades() {
    return (
      <div style={{ width: '80%' }}>
        <div className="text1" style={{ marginTop: 50 }}>
          UNIDADES DE INTERNAÇÃO
        </div>
        <div
          id="scroll de unidades"
          className="grid5"
          style={{ width: '100%' }}
        >
          {unidades
            .filter((item) => item.id_cliente == hospital)
            .map((item) => (
              <div
                id={"unidade: " + item}
                className={
                  selectedunidade == item.id_unidade ? "button-selected" : "button"
                }
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 150
                }}
                onClick={() => {
                  setselectedunidade(item.id_unidade);
                  setunidade(item.id_unidade);
                  loadAtendimentos();
                  loadLeitos();
                }}
              >
                <div>{item.nome_unidade}</div>
                <div style={{
                  display: item.nome_unidade == 'TRIAGEM' ? 'none' : 'flex'
                }}>
                  {parseInt(item.total_leitos) -
                    parseInt(
                      atendimentos.filter(
                        (check) => check.id_unidade == item.id_unidade
                      ).length +
                      " / " +
                      item.total_leitos
                    )}
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  const loadLeitos = () => {
    axios
      .get(html + "list_all_leitos")
      .then((response) => {
        setarrayleitos(response.data.rows);
      })
  };

  const updateStatusLeito = (id, unidade, leito, status) => {
    var obj = {
      id_unidade: unidade,
      leito: leito,
      status: status,
    };
    axios.post(html + "update_leito/" + id, obj).then(() => {
      loadAtendimentos();
      loadLeitos();
    })
  }

  function SeletorDeLeitos() {
    const [viewstatusleito, setviewstatusleito] = useState(0);
    function ViewStatusLeito() {
      let arraystatusleitos = [
        "LIVRE",
        "LIMPEZA",
        "MANUTENÇÃO",
        "DESATIVADO",
      ];
      return (
        <div
          className="fundo"
          style={{ display: viewstatusleito == 1 ? "flex" : "none" }}
          onClick={() => {
            setviewstatusleito(0);
          }}
        >
          <div className="janela" onClick={(e) => e.stopPropagation()}>
            {arraystatusleitos.map((item) => (
              <div
                className="button"
                style={{ width: 150 }}
                onClick={() => {
                  updateStatusLeito(localStorage.getItem("id_leito clicado"), unidade, localStorage.getItem("leito clicado"), item);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div id="scroll de leitos"
        style={{
          display: arrayleitos.length > 0 ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
          width: '100%',
        }}
      >
        <div className="text1">LEITOS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center' }}>
          {arrayleitos.filter(item => item.id_unidade == unidade).sort((a, b) => a.leito > b.leito ? 1 : -1).map((item) => (
            <div
              className="button"
              style={{
                position: "relative",
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                height: 100,
                minWidth: 100,
                display: "flex",
              }}
              onClick={() => {
                loadAtendimentos();
                localStorage.setItem("id_leito selecionado", item.id_leito);
                localStorage.setItem("leito selecionado", item.leito);
                if (item.status == 'LIVRE') {
                  let atendimento = {};
                  // paciente já tem atendimento ativo.
                  if (atendimentos.filter(valor => valor.id_paciente == paciente.id_paciente).length > 0) {
                    atendimento = atendimentos.filter(valor => valor.id_paciente == paciente.id_paciente).pop();
                    localStorage.setItem('id_leito_antigo', arrayleitos.filter(valor => valor.leito == atendimento.leito).map(valor => valor.id_leito).pop());
                    localStorage.setItem('id_unidade_antiga', arrayleitos.filter(valor => valor.leito == atendimento.leito).map(valor => valor.id_unidade).pop());
                    updateStatusLeito(localStorage.getItem('id_leito_antigo'), localStorage.getItem('id_unidade_antiga'), atendimento.leito, 'LIVRE');
                    updateAtendimento(atendimentos.filter(valor => valor.id_paciente == paciente.id_paciente).pop(), item.leito);
                    updateStatusLeito(item.id_leito, unidade, item.leito, 'OCUPADO');
                    // paciente não tem atendimento ativo.
                  } else if (atendimentos.filter(valor => valor.id_paciente == paciente.id_paciente).length == 0) {
                    insertAtendimento(item.leito);
                    updateStatusLeito(item.id_leito, unidade, item.leito, 'OCUPADO');
                  }
                }
              }}
            >
              <div style={{ position: 'absolute', top: 2.5, left: 5, fontSize: 20, margin: 10 }}>{item.leito}</div>
              <div
                style={{
                  display:
                    atendimentos.filter(
                      (valor) =>
                        valor.id_cliente == hospital &&
                        valor.id_unidade == unidade &&
                        valor.data_termino == null &&
                        valor.leito == item.leito,
                    ).length > 0
                      ? "flex"
                      : "none",
                  fontSize: 12,
                  position: 'absolute',
                  top: 50,
                  padding: 5,
                  alignContent: 'center',
                  alignSelf: 'center',
                }}
              >
                {atendimentos
                  .filter(
                    (valor) =>
                      valor.id_cliente == hospital &&
                      valor.id_unidade == unidade &&
                      valor.data_termino == null &&
                      valor.leito == item.leito
                  )
                  .map((valor) => valor.nome_paciente.substring(0, 20) + "...")}
              </div>
              <div
                className="button-yellow"
                style={{
                  height: 25,
                  width: 25,
                  minHeight: 25,
                  minWidth: 25,
                  borderRadius: 5,
                  position: "absolute",
                  top: 5,
                  right: 5,
                  fontSize: 12,
                  backgroundColor:
                    item.status == "LIVRE"
                      ? "rgb(82, 190, 128, 1)"
                      : item.status == "OCUPADO"
                        ? "#E59866"
                        : item.status == "MANUTENÇÃO"
                          ? "#CCD1D1 "
                          : item.status == "DESATIVADO"
                            ? "#EC7063"
                            : item.status == "LIMPEZA"
                              ? "#85C1E9 "
                              : "rgb(0, 0, 0, 0.5)"
                }}
                onClick={(e) => {
                  if (item.status == 'OCUPADO') {
                    toast(settoast, 'NÃO É POSSÍVEL ALTERAR O STATUS DE UM LEITO OCUPADO', 'rgb(231, 76, 60, 1', 3000);
                  } else {
                    localStorage.setItem("id_leito clicado", item.id_leito);
                    localStorage.setItem("leito clicado", item.leito);
                    setviewstatusleito(1);
                  }
                  e.stopPropagation();
                }}
              >
                {
                  item.status == "LIVRE"
                    ? "L"
                    : item.status == "OCUPADO"
                      ? "O"
                      : item.status == "MANUTENÇÃO"
                        ? "M"
                        : item.status == "LIMPEZA"
                          ? "H"
                          : item.status == "DESATIVADO"
                            ? "D"
                            : ""
                }
              </div>
            </div>
          ))}
        </div>
        <ViewStatusLeito></ViewStatusLeito>
      </div >
    );
  }

  function MovimentaPaciente() {
    return (
      <div
        className="fundo"
        style={{
          display: viewseletorunidades == 1 ? "flex" : "none",
        }}
      >
        <div
          className="janela scroll"
          style={{
            position: 'relative',
            width: "90vw",
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div
            className="text3"
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              margin: 5,
              padding: 5,
            }}
          >
            {paciente.nome_paciente +
              ", " +
              moment().diff(moment(paciente.dn_paciente), "years") +
              " ANOS."}
          </div>
          <div
            className="button-yellow"
            style={{ position: "absolute", top: 10, right: 10 }}
            onClick={() => {
              setviewseletorunidades(0);
            }}
          >
            <img
              alt=""
              src={back}
              style={{
                margin: 0,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <SeletorDeUnidades></SeletorDeUnidades>
          <SeletorDeLeitos></SeletorDeLeitos>
        </div>
      </div>
    );
  }

  function BuscaPaciente() {
    return (
      <div id="cadastro de pacientes e de atendimentos"
        style={{
          position: 'sticky', top: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <div id="botões e pesquisa"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          <div
            className="button-yellow"
            style={{ margin: 0, marginRight: 10, width: 50, height: 50 }}
            title={"VOLTAR PARA O LOGIN"}
            onClick={() => {
              setpagina(0);
              history.push("/");
            }}
          >
            <img
              alt=""
              src={back}
              style={{
                margin: 0,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <FilterPaciente></FilterPaciente>
          <div
            className="button-green"
            style={{ margin: 0, marginLeft: 10, width: 50, height: 50 }}
            title={"CADASTRAR PACIENTE"}
            onClick={() => setvieweditpaciente(2)}
          >
            <img
              alt=""
              src={novo}
              style={{
                margin: 0,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main" style={{ display: pagina == 2 ? "flex" : "none" }}>
      <div
        className="chassi scroll"
        id="conteúdo do cadastro"
      >
        <ListaDePacientes></ListaDePacientes>
        <DadosPacienteAtendimento></DadosPacienteAtendimento>
        <MovimentaPaciente></MovimentaPaciente>
        <ViewTipoDocumento></ViewTipoDocumento>
      </div>
    </div>
  );
}

export default Cadastro;
