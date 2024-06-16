/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useCallback, useState } from "react";
import axios from "axios";
import Context from "./Context";
import moment from "moment";
// imagens.
import back from "../images/back.svg";
import body from "../images/body.svg";
import refresh from "../images/refresh.svg";
import flag from "../images/white_flag.svg";
import deletar from "../images/deletar.svg";
import prec_padrao from "../images/prec_padrao.svg";
import prec_contato from "../images/prec_contato.svg";
import prec_respiratorio from "../images/prec_respiratorio.svg";
import lupa from '../images/lupa.svg';
import clock from "../images/clock.svg";
import dots_teal from "../images/dots_teal.svg";
// funções.
import toast from "../functions/toast";
import modal from "../functions/modal";
// router.
import { useHistory } from "react-router-dom";
// componentes.
import Logo from "../components/Logo";
// cards.
import Alergias from "../cards/Alergias";
import Documentos from "../cards/Documentos";
import Boneco from "../cards/Boneco";
import Infusoes from "../cards/Infusoes";
import Propostas from "../cards/Propostas";
import SinaisVitais from "../cards/SinaisVitais";
import Dieta from "../cards/Dieta";
import Precaucoes from "../cards/Precaucoes";
import Riscos from "../cards/Riscos";
import Alertas from "../cards/Alertas";
import Prescricao from "./Prescricao";
import EvolucaoMobile from "../cards/EvolucaoMobile";
import selector from "../functions/selector";
import Feedback from "./Feedback";
import Diagnosticos from "../cards/Diagnosticos";
import Camera from "../cards/Camera";
import EscalasAssistenciais from "../cards/EscalasAssistenciais";
import Medicacoes from "../cards/Medicacoes";
import MedicacoesCheck from "../cards/MedicacoesCheck";

function Consultas() {
  // context.
  const {
    html,
    usuario,
    setusuario,

    hospital,

    settoast,
    pagina,
    setpagina,

    setpacientes,
    pacientes,
    paciente,
    setpaciente,
    objpaciente,
    setobjpaciente,
    atendimentos,
    setatendimentos,
    setatendimento,
    atendimento,

    // estados utilizados pela função getAllData (necessária para alimentar os card fechados).
    setalergias,
    alergias,
    setinvasoes,
    setlesoes,
    setprecaucoes,
    precaucoes,
    setriscos,
    riscos,
    setdietas,
    dietas,
    setevolucoes,
    setarrayevolucoes,
    setpropostas,
    propostas,
    setsinaisvitais,
    sinaisvitais,
    card, setcard,
    setprescricao,

    mobilewidth,

    setunidade,
    setarrayitensprescricao,
    setidprescricao,

    setdialogo,

    arrayatividades,

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

  // carregar lista de pacientes.
  const loadPacientes = () => {
    axios
      .get(html + "list_pacientes")
      .then((response) => {
        setpacientes(response.data.rows);
        loadAtendimentos();
      })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
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

  /*
  // ATIVIDADES NAS INSTITUIÇÕES DE IDOSOS (definidos no campo situação, da tabela atendimentos).
  situação 1 = atendimento médico.
  situacao 2 = fisioterapia.
  situacao 3 = to.
  situacao 4 = massagem.
  situacao 5 = cabeleireiro.
  situacao 6 = manicure.
  situacao 7 = atividades recreativa específica com Hugo...
  */

  // carregar lista de atendimentos ativos para a unidade selecionada.
  const [arrayatendimentos, setarrayatendimentos] = useState([]);
  const loadAtendimentos = () => {
    axios
      .get(html + "all_atendimentos")
      .then((response) => {
        let x = response.data.rows;
        setatendimentos(x.filter(item => item.situacao != 1 && item.situacao != 4));
        setarrayatendimentos(x.filter(item => item.situacao != 1 && item.situacao != 4)); // situação 3 = consulta ou atividade ativa. situação 4 == consulta ou atividade encerrada.
        loadAllPrecaucoes();
      })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
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

  const [allprecaucoes, setallprecaucoes] = useState([]);
  const loadAllPrecaucoes = () => {
    axios.get(html + "paciente_all_precaucoes").then((response) => {
      setallprecaucoes(response.data.rows);
    });
  };

  // recuperando lista de prescrições.
  const loadItensPrescricao = (atendimento) => {
    axios.get(html + 'list_itens_prescricoes/' + atendimento).then((response) => {
      let x = response.data.rows;
      setprescricao(x);
    });
  }

  var timeout = null;
  const [viewagendamento, setviewagendamento] = useState(0);
  const [selectedatividade, setselectedatividade] = useState('CONSULTA MÉDICA');
  const [fotinho, setfotinho] = useState(null);
  useEffect(() => {
    if (pagina == -2) {
      setpaciente([]);
      setatendimento(null);
      loadPacientes();
      currentMonth();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // identificação do usuário.
  function Usuario() {
    return (
      <div id="identificação do usuário, filtro de pacientes e botões principais"
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignContent: 'center', width: 'calc(100% - 10px)', alignSelf: 'center',
        }}>
        <div className="text1" style={{ alignSelf: 'flex-start', margin: 0 }}>{'USUÁRIO: ' + usuario.nome_usuario.split(' ', 1)}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          <div
            className="button-yellow"
            onClick={() => {
              setpagina(0);
              history.push("/");
            }}
          >
            <img
              alt=""
              src={back}
              style={{
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <FilterPaciente></FilterPaciente>
        </div>
      </div>
    );
  }

  const [filterpaciente, setfilterpaciente] = useState("");
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
        setarrayatendimentos(atendimentos);
        document.getElementById("inputPaciente").value = "";
        setTimeout(() => {
          document.getElementById("inputPaciente").focus();
        }, 100);
      } else {
        setfilterpaciente(document.getElementById("inputPaciente").value.toUpperCase());
        if (atendimentos.filter((item) => item.nome_paciente.includes(searchpaciente)).length > 0) {
          setarrayatendimentos(atendimentos.filter((item) => item.nome_paciente.includes(searchpaciente)));
          setTimeout(() => {
            document.getElementById("inputPaciente").value = searchpaciente;
            document.getElementById("inputPaciente").focus()
          }, 100)
        } else {
          setarrayatendimentos(atendimentos.filter((item) => item.leito.includes(searchpaciente)));
          setTimeout(() => {
            document.getElementById("inputPaciente").value = searchpaciente;
            document.getElementById("inputPaciente").focus()
          }, 100)
        }
      }
    }, 1000);
  };
  // filtro de paciente por nome.
  function FilterPaciente() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
        <input
          className="input cor2"
          autoComplete="off"
          placeholder={
            window.innerWidth < mobilewidth ? "BUSCAR PACIENTE..." : "BUSCAR..."
          }
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) =>
            window.innerWidth < mobilewidth
              ? (e.target.placeholder = "BUSCAR PACIENTE...")
              : "BUSCAR..."
          }
          onKeyUp={() => filterPaciente()}
          type="text"
          id="inputPaciente"
          defaultValue={filterpaciente}
          maxLength={100}
          style={{ width: '100%' }}
        ></input>
        <div
          id="botão para atualizar a lista de pacientes."
          className="button"
          style={{
            display: "flex",
            opacity: 1,
            alignSelf: "center",
          }}
          onClick={() => { loadPacientes(); setatendimento(null); }}
        >
          <img
            alt="" src={refresh}
            style={{ width: 30, height: 30 }}></img>
        </div>
      </div>
    );
  }

  const updateConsulta = ([item, status]) => {
    var obj = {
      data_inicio: item.data_inicio,
      data_termino: moment(),
      problemas: item.problemas,
      id_paciente: item.id_paciente,
      id_unidade: item.id_unidade,
      nome_paciente: item.nome_paciente,
      leito: null,
      situacao: status, // 4 = consulta encerrada, 5 = consulta cancelada.
      id_cliente: item.id_cliente,
      classificacao: item.classificacao,
      id_profissional: item.id_profissional,
    };
    axios
      .post(html + "update_atendimento/" + item.id_atendimento, obj)
      .then(() => {
        loadAtendimentos();
      });
  };

  // excluir um agendamento de consulta.
  const deleteAtendimento = (id) => {
    axios.get(html + "delete_atendimento/" + id).then(() => {
      loadAtendimentos();
    });
  };

  // inserir um agendamento de consulta.
  const insertAtendimento = (inicio) => {
    var obj = {
      data_inicio: moment(inicio, 'DD/MM/YYYY - HH:mm'),
      data_termino: moment(inicio, 'DD/MM/YYYY - HH:mm').add(30, 'minutes'),
      historia_atual: null,
      id_paciente: objpaciente.id_paciente,
      id_unidade: 5, // ATENÇÃO: 5 é o ID da unidade ambulatorial.
      nome_paciente: objpaciente.nome_paciente,
      leito: null,
      situacao: selectedatividade, // 3 = atendimento ambulatorial (consulta).
      id_cliente: hospital,
      classificacao: null,
      id_profissional: usuario.id,
    };
    axios
      .post(html + "insert_consulta", obj)
      .then(() => {
        loadAtendimentos();
        geraWhatsapp(inicio);
      });
  };

  // ENVIO DE MENSAGENS DE AGENDAMENTO DA CONSULTA PELO WHATSAPP.
  function geraWhatsapp(inicio) {

    const gzappy_url_envia_mensagem = "https://api.gzappy.com/v1/message/send-message/";
    const instance_id = 'L05K3GC2YX03DGWYLDKZQW5L';
    const instance_token = '2d763c00-4b6d-4842-99d7-cb32ea357a80';
    const USER_TOKEN_ID = '3a1d021d-ad34-473e-9255-b9a3e6577cf9';
    const message =
      'Olá, ' + objpaciente.nome_paciente + '!\n' +
      'Você tem uma consulta agendada pelo seu médico, Dr(a). ' + usuario.nome_usuario + ', ' + usuario.tipo_usuario + ',\n' +
      'para o dia ' + inicio + ', na CLÍNICA POMERODE.'

    const rawphone = pacientes.filter(valor => valor.id_paciente == objpaciente.id_paciente).map(item => item.telefone).pop();
    let cleanphone = rawphone.replace("(", "");
    cleanphone = cleanphone.replace(")", "");
    cleanphone = cleanphone.replace("-", "");
    cleanphone = cleanphone.replace(" ", "");
    cleanphone = "55" + cleanphone;

    fetch(gzappy_url_envia_mensagem, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user_token_id': USER_TOKEN_ID
      },
      body: JSON.stringify({
        instance_id: instance_id,
        instance_token: instance_token,
        message: [message],
        phone: [cleanphone]
      })
    })
  }

  // lista de atendimentos.
  const ListaDeAtendimentos = useCallback(() => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: window.innerHeight < 450 ? '70%' : '80%',
        }}
      >
        <div id="scroll atendimentos com pacientes"
          className="scroll"
          style={{
            display: arrayatendimentos.length > 0 ? "flex" : "none",
            justifyContent: "flex-start",
            width: 'calc(100% - 20px)',
          }}
        >
          <div className="button" style={{ margin: 10, marginTop: 5, width: '60%', alignSelf: 'center' }}
            onClick={() => setviewopcoesatividades(1)}
          >
            {selectedatividade}
          </div>
          {
            arrayatendimentos
              .filter(item => item.situacao == selectedatividade)
              .sort((a, b) => (moment(a.data_inicio) > moment(b.data_inicio) ? 1 : -1))
              .map((item) => (
                <div key={"pacientes" + item.id_atendimento} style={{ width: '100%' }}>
                  <div
                    className="row"
                    style={{
                      position: "relative",
                      margin: 2.5, padding: 0,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      className="button-yellow"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        marginRight: 0,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        minHeight: 100,
                        height: 100,
                        width: 80, minWidth: 80, maxWidth: 80,
                        backgroundColor: '#006666'
                      }}
                    >
                      <div
                        className="text2"
                        style={{ margin: 0, padding: 0, fontSize: 14 }}
                      >
                        {moment(item.data_inicio).format('DD/MM/YY')}
                      </div>
                      <div
                        className="text2"
                        style={{ margin: 0, padding: 0, fontSize: 14 }}
                      >
                        {moment(item.data_inicio).format('HH:mm')}
                      </div>
                    </div>
                    <div
                      id={"atendimento " + item.id_atendimento}
                      className="button"
                      style={{
                        flex: 3,
                        marginLeft: 0,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        minHeight: 100,
                        height: 100,
                        width: '100%',
                      }}
                      onClick={() => {
                        setviewlista(0);
                        setunidade(parseInt(item.id_unidade));
                        setatendimento(item.id_atendimento);
                        setpaciente(parseInt(item.id_paciente));
                        setobjpaciente(item);
                        setfotinho(pacientes.filter(valor => valor.id_paciente == item.id_paciente).map(valor => valor.foto));
                        getAllData(item.id_paciente, item.id_atendimento);
                        setidprescricao(0);
                        if (pagina == -2) {
                          selector("scroll atendimentos com pacientes", "atendimento " + item.id_atendimento, 100);
                        }
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          padding: 5,
                        }}
                      >
                        {pacientes.filter(
                          (valor) => valor.id_paciente == item.id_paciente
                        )
                          .map((valor) => valor.nome_paciente.length > 20 ? valor.nome_paciente.slice(0, 20) + '...' : valor.nome_paciente)}
                        <div>
                          {moment().diff(
                            moment(
                              pacientes
                                .filter(
                                  (valor) => valor.id_paciente == item.id_paciente
                                )
                                .map((item) => item.dn_paciente)
                            ),
                            "years"
                          ) + " ANOS"}
                        </div>
                      </div>
                    </div>
                    <div
                      id="informações do paciente"
                      style={{
                        position: "absolute",
                        right: -5,
                        bottom: -25,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <div id="botões para finalizar atendimento e reagendar consulta"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignContent: "center",
                          backgroundColor: "rgba(242, 242, 242)",
                          borderColor: "rgba(242, 242, 242)",
                          borderRadius: 5,
                          borderStyle: 'solid',
                          borderWidth: 3,
                          padding: 2,
                          margin: 2,
                        }}
                      >
                        <div
                          id="botão encerrar"
                          className="button"
                          title="ENCERRAR CONSULTA"
                          onClick={() => {
                            modal(setdialogo, 'TEM CERTEZA QUE DESEJA FINALIZAR A CONSULTA?', updateConsulta, [item, selectedatividade + ' - CONCLUÍDO']);
                          }}
                          style={{
                            display: "flex",
                            borderColor: "#f2f2f2",
                            backgroundColor: "rgb(82, 190, 128, 1)",
                            width: 20,
                            minWidth: 20,
                            height: 20,
                            minHeight: 20,
                            margin: 0,
                            padding: 7.5,
                          }}
                        >
                          <img alt="" src={flag} style={{ width: 25, height: 25 }}></img>
                        </div>
                        <div
                          id="botão encerrar"
                          className="button"
                          title="CANCELAR CONSULTA"
                          onClick={() => {
                            modal(setdialogo, 'TEM CERTEZA QUE DESEJA CANCELAR A CONSULTA?', updateConsulta, [item, 5]);
                          }}
                          style={{
                            display: "flex",
                            borderColor: "#f2f2f2",
                            backgroundColor: "#EC7063",
                            width: 20,
                            minWidth: 20,
                            height: 20,
                            minHeight: 20,
                            margin: 0, marginLeft: 5,
                            padding: 7.5,
                          }}
                        >
                          <img alt="" src={flag} style={{ width: 25, height: 25 }}></img>
                        </div>
                        <div
                          id="botão agendar nova consulta"
                          className="button"
                          title="AGENDAR NOVA CONSULTA"
                          onClick={() => {
                            setviewlista(0);
                            setunidade(parseInt(item.id_unidade));
                            setatendimento(item.id_atendimento);
                            setpaciente(parseInt(item.id_paciente));
                            setobjpaciente(item);
                            getAllData(item.id_paciente, item.id_atendimento);
                            setidprescricao(0);
                            setviewagendamento(1);
                            if (pagina == -1) {
                              selector("scroll atendimentos com pacientes", "atendimento " + item.id_atendimento, 100);
                            }
                          }}
                          style={{
                            display: "flex",
                            borderColor: "#f2f2f2",
                            backgroundColor: "rgb(82, 190, 128, 1)",
                            width: 20,
                            minWidth: 20,
                            height: 20,
                            minHeight: 20,
                            margin: 0, marginLeft: 5,
                            padding: 7.5,
                          }}
                        >
                          <img alt="" src={clock} style={{ width: 30, height: 30 }}></img>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
        <div id="scroll atendimento vazio"
          style={{
            display: arrayatendimentos.length < 1 ? "flex" : "none",
            justifyContent: "flex-start",
            width: 'calc(100% - 20px)',
          }}
        >
          <div className="text3" style={{ opacity: 0.5 }}>
            SEM PACIENTES CADASTRADOS PARA ESTA UNIDADE
          </div>
        </div>
      </div>
    );
    // eslint-disable-next-line
  }, [arrayatendimentos, allprecaucoes, setarrayitensprescricao, selectedatividade]);

  // identificação do paciente na versão mobile, na view dos cards.
  function CabecalhoPacienteMobile() {
    return (
      <div
        id="mobile_pacientes"
        style={{
          position: "sticky",
          marginTop: 0,
          top: 0,
          left: 0,
          right: 0,
          display: window.innerWidth < mobilewidth ? "flex" : "none",
          flexDirection: "row",
          justifyContent: "center",
          flex: 1,
          backgroundColor: "#f2f2f2",
          borderColor: "#f2f2f2",
          borderRadius: 5,
          zIndex: 30,
          minWidth: "calc(90vw - 10px)",
          width: "calc(90vw - 10px)",
        }}
      >
        <div
          id="botão de retorno"
          className="button-red"
          style={{
            display: window.innerWidth < mobilewidth ? "flex" : "none",
            opacity: 1,
            backgroundColor: "#ec7063",
            alignSelf: "center",
          }}
          onClick={card == "" ? () => setviewlista(1) : () => setcard(0)}
        >
          <img alt="" src={back} style={{ width: 30, height: 30 }}></img>
        </div>
        {arrayatendimentos
          .filter((item) => item.id_atendimento == atendimento)
          .map((item) => (
            <div
              className="row"
              key={"paciente selecionado " + item.id_atendimento}
              style={{
                margin: 0,
                padding: 0,
                flex: 1,
                justifyContent: "space-around",
                width: "100%",
                backgroundColor: "transparent",
              }}
            >
              <div
                className="button-grey"
                style={{
                  margin: 5,
                  marginRight: 0,
                  marginLeft: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              >
                {item.leito}
              </div>
              <div
                className="button"
                style={{
                  flex: 1,
                  marginLeft: 0,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                <div style={{ width: "100%" }}>
                  {pacientes.filter(
                    (valor) => valor.id_paciente == item.id_paciente
                  )
                    .map((valor) => valor.nome_paciente)}
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  // estado para retorno do balanço hídrico acumulado.
  const [balancoacumulado, setbalancoacumulado] = useState(0);
  // carregando todas as informações do atendimento.
  const getAllData = (paciente, atendimento) => {
    // Dados relacionados ao paciente.
    // alergias.
    setbusyalergias(1);
    axios
      .get(html + "paciente_alergias/" + paciente)
      .then((response) => {
        setalergias(response.data.rows);
        setbusyalergias(0);
      })
      .catch(function (error) {
        if (error.response == undefined) {
          toast(
            settoast,
            "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
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
    // lesões.
    axios
      .get(html + "paciente_lesoes/" + paciente)
      .then((response) => {
        setlesoes(response.data.rows);
      })
      .catch(function (error) {
        console.log(error);
      });
    // precauções.
    axios
      .get(html + "paciente_precaucoes/" + paciente)
      .then((response) => {
        setprecaucoes(response.data.rows);
      })
      .catch(function (error) {
        console.log(error);
      });

    // riscos.
    setbusyriscos(1);
    axios
      .get(html + "paciente_riscos/" + paciente)
      .then((response) => {
        setriscos(response.data.rows);
        setbusyriscos(0);
      })
      .catch(function (error) {
        console.log(error);
      });
    // Dados relacionados ao atendimento.
    // antibióticos.
    loadItensPrescricao(atendimento);
    // dietas.
    setbusydieta(1);
    axios
      .get(html + "list_dietas/" + atendimento)
      .then((response) => {
        setdietas(response.data.rows);
        setbusydieta(0);
      })
      .catch(function (error) {
        console.log(error);
      });
    // evoluções.
    axios
      .get(html + "list_evolucoes/" + atendimento)
      .then((response) => {
        setevolucoes(response.data.rows);
        setarrayevolucoes(response.data.rows);
      })
      .catch(function (error) {
        console.log(error);
      });
    // invasões.
    axios
      .get(html + "list_invasoes/" + atendimento)
      .then((response) => {
        setinvasoes(response.data.rows);
      })
      .catch(function (error) {
        console.log(error);
      });
    // propostas.
    setbusypropostas(1);
    axios
      .get(html + "list_propostas/" + atendimento)
      .then((response) => {
        setpropostas(response.data.rows);
        setbusypropostas(0);
      })
      .catch(function (error) {
        console.log(error);
      });
    // sinais vitais.
    setbusysinaisvitais(0);
    axios
      .get(html + "list_sinais_vitais/" + atendimento)
      .then((response) => {
        var x = response.data.rows;
        var arraybalancos = [];
        setbusysinaisvitais(0);
        setsinaisvitais(response.data.rows);
        // cálculo do balanço acumulado.
        x.map((item) => {
          if (isNaN(parseFloat(item.balanco.replace(" ", ""))) == true) {
            console.log(
              "VALOR INVÁLIDO PARA CÁLCULO DO BALANÇO ACUMULADO: " +
              item.balanco
            );
          } else {
            arraybalancos.push(parseFloat(item.balanco.replace(" ", "")));
          }
          return null;
        });
        function soma(total, num) {
          return total + num;
        }
        setbalancoacumulado(arraybalancos.reduce(soma, 0));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // estado para alternância entre lista de pacientes e conteúdo do passômetro para versão mobile.
  const [viewlista, setviewlista] = useState(1);

  // função busy.
  const [busyalergias, setbusyalergias] = useState(0);
  const [busypropostas, setbusypropostas] = useState(0);
  const [busyriscos, setbusyriscos] = useState(0);
  const [busysinaisvitais, setbusysinaisvitais] = useState(0);
  const [busydieta, setbusydieta] = useState(0);

  const loading = () => {
    return (
      <div
        className="destaque"
        style={{ marginTop: 20 }}
      >
        <Logo height={20} width={20}></Logo>
      </div>
    );
  };

  // função para renderização dos cards fechados.
  let yellow = "#F9E79F";
  const cartao = (sinal, titulo, opcao, busy) => {
    return (
      <div style={{ display: 'flex' }}>
        <div
          className="card-fechado cor3"
          style={{
            display:
              titulo.includes(filtercartoes) == true &&
                card == "" &&
                atendimento != null
                ? "flex"
                : "none",
            pointerEvents: opcao == null ? 'none' : 'auto',
            backgroundColor: sinal != null && sinal.length > 0 ? yellow : "",
            borderColor: "transparent",
            margin: 5,
            height: window.innerWidth < mobilewidth ? '35vw' : '15vw',
            minHeight: window.innerWidth < mobilewidth ? '32vw' : '15vw',
            minWidth: window.innerWidth < mobilewidth ? '32vw' : '15vw',
            maxWidth: window.innerWidth < mobilewidth ? '' : '15vw',
            alignSelf: 'center',
          }}
          onClick={() => {
            if (card == opcao) {
              setcard("");
            } else {
              setcard(opcao);
            }
          }}
        >
          <div className="text3">{titulo}</div>
          <div
            style={{
              display: busy == 1 ? "none" : "flex",
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div id="RESUMO PRECAUÇÕES"
              style={{ display: opcao == "card-precaucoes" ? "flex" : "none" }}
            >
              <img
                alt=""
                src={prec_padrao}
                style={{
                  display:
                    precaucoes.filter((item) => item.precaucao == "PADRÃO")
                      .length > 0
                      ? "flex"
                      : "none",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: window.innerWidth < mobilewidth ? 20 : 40,
                  width: window.innerWidth < mobilewidth ? 20 : 40,
                  padding: 5,
                }}
              ></img>
              <img
                alt=""
                src={prec_contato}
                style={{
                  display:
                    precaucoes.filter((item) => item.precaucao == "CONTATO")
                      .length > 0
                      ? "flex"
                      : "none",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: window.innerWidth < mobilewidth ? 30 : 50,
                  width: window.innerWidth < mobilewidth ? 30 : 50,
                }}
              ></img>
              <img
                alt=""
                src={prec_respiratorio}
                style={{
                  display:
                    precaucoes.filter(
                      (item) =>
                        item.precaucao == "AEROSSOL" ||
                        item.precaucao == "GOTÍCULA"
                    ).length > 0
                      ? "flex"
                      : "none",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: window.innerWidth < mobilewidth ? 30 : 50,
                  width: window.innerWidth < mobilewidth ? 30 : 50,
                }}
              ></img>
            </div>
            <div id="RESUMO DIETA"
              style={{
                display: opcao == "card-dietas" ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="textcard" style={{ margin: 0, padding: 0 }}>
                {dietas.map((item) => item.tipo)}
              </div>
              <div
                className="textcard"
                style={{
                  display:
                    dietas.filter(
                      (item) => item.tipo != "ORAL" && item.tipo != "NÃO DEFINIDA"
                    ).length > 0
                      ? "flex"
                      : "none",
                  margin: 0,
                  padding: 0,
                }}
              >
                {dietas.map((item) => item.infusao + " ml/h")}
              </div>
            </div>
            <div id="RESUMO PROPOSTAS"
              style={{
                display: opcao == "card-propostas" ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                className="textcard"
                style={{ display: "flex", margin: 0, padding: 0 }}
              >
                {"PENDENTES: " +
                  propostas.filter((item) => item.data_conclusao == null).length}
              </div>
            </div>
            <div id="RESUMO SINAIS VITAIS"
              style={{
                display:
                  opcao == "card-sinaisvitais" && sinaisvitais.length > 0
                    ? "flex"
                    : "none",
                flexDirection: "column",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    margin: 5,
                  }}
                >
                  <div
                    className="textcard"
                    style={{ margin: 0, padding: 0, opacity: 0.5 }}
                  >
                    {"PAM"}
                  </div>
                  <div className="textcard" style={{ margin: 0, padding: 0 }}>
                    {sinaisvitais.length > 0
                      ? Math.ceil(
                        (2 *
                          parseInt(
                            sinaisvitais.slice(-1).map((item) => item.pad)
                          ) +
                          parseInt(
                            sinaisvitais.slice(-1).map((item) => item.pas)
                          )) /
                        3
                      )
                      : null}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    margin: 5,
                  }}
                >
                  <div
                    className="textcard"
                    style={{ margin: 0, padding: 0, opacity: 0.5 }}
                  >
                    {"FC"}
                  </div>
                  <div className="textcard" style={{ margin: 0, padding: 0 }}>
                    {sinaisvitais.slice(-1).map((item) => item.fc)}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    margin: 5,
                  }}
                >
                  <div
                    className="textcard"
                    style={{ margin: 0, padding: 0, opacity: 0.5 }}
                  >
                    {"TAX"}
                  </div>
                  <div className="textcard" style={{ margin: 0, padding: 0 }}>
                    {sinaisvitais.slice(-1).map((item) => item.tax)}
                  </div>
                </div>
                <div
                  style={{
                    display: window.innerWidth < mobilewidth ? "none" : "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    margin: 5,
                  }}
                >
                  <div
                    className="textcard"
                    style={{ margin: 0, padding: 0, opacity: 0.5 }}
                  >
                    {"DIURESE"}
                  </div>
                  <div className="textcard" style={{ margin: 0, padding: 0 }}>
                    {sinaisvitais.slice(-1).map((item) => item.diurese)}
                  </div>
                </div>
                <div
                  style={{
                    display: window.innerWidth < mobilewidth ? "none" : "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    margin: 5,
                  }}
                >
                  <div
                    className="textcard"
                    style={{ margin: 0, padding: 0, opacity: 0.5 }}
                  >
                    {"BALANÇO ACUMULADO"}
                  </div>
                  <div className="textcard" style={{ margin: 0, padding: 0 }}>
                    {balancoacumulado}
                  </div>
                </div>
              </div>
            </div>
            <div id="RESUMO ALERGIA"
              style={{
                display: opcao == "card-alergias" ? "flex" : "none",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                className="textcard"
                style={{
                  display: "flex",
                  flexDirection: 'column',
                  margin: 0,
                  padding: 0,
                  fontSize: 16,
                }}
              >
                {alergias.slice(-3).map(item => (<div className="textcard" style={{ margin: 0, padding: 0 }}>{item.alergia}</div>))}
              </div>
            </div>
            <div id="RESUMO RISCOS"
              style={{ display: opcao == "card-riscos" ? "flex" : "none" }}
            >
              <div>
                {riscos.slice(-3).map((item) => (
                  <div
                    key={"atb " + item.id_risco}
                    className="textcard"
                    style={{ margin: 0, padding: 0 }}
                  >
                    {item.risco}
                  </div>
                ))}
              </div>
            </div>
            <div id="RESUMO BONECO"
              style={{
                display: opcao == "card-boneco" ? "flex" : "none",
              }}
            >
              <img
                id="corpo"
                alt=""
                src={body}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: window.innerWidth < mobilewidth ? "20vw" : "8vw",
                }}
              ></img>
            </div>
          </div>
          <div
            style={{
              display: busy == 1 ? "flex" : "none",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            {loading()}
          </div>
        </div>
      </div>
    );
  };

  const [cartoes] = useState([
    "DIAS DE INTERNAÇÃO",
    "ALERGIAS",
    "PRECAUÇÕES",
    "ADMISSÃO",
    "EVOLUÇÃO",
    "RECEITA",
    "ATESTADO MÉDICO",
    "RISCOS",
    "PROPOSTAS",
    "SINAIS VITAIS",
    "VENTILAÇÃO MECÂNICA",
    "INFUSÕES",
    "DIETA",
    "CULTURAS",
    "ANTIBIÓTICOS",
    "LABORATÓRIO E RX",
    "EXAMES DE IMAGEM",
    "PRESCRIÇÃO",
    "INVASÕES",
    "LESÕES",
    "BONECO",
  ]);
  const [arraycartoes, setarraycartoes] = useState([
    "DIAS DE INTERNAÇÃO",
    "ALERGIAS",
    "PRECAUÇÕES",
    "ADMISSÃO",
    "EVOLUÇÃO",
    "RECEITA",
    "ATESTADO MÉDICO",
    "RISCOS",
    "PROPOSTAS",
    "SINAIS VITAIS",
    "VENTILAÇÃO MECÂNICA",
    "INFUSÕES",
    "DIETA",
    "CULTURAS",
    "ANTIBIÓTICOS",
    "LABORATÓRIO E RX",
    "EXAMES DE IMAGEM",
    "PRESCRIÇÃO",
    "INVASÕES",
    "LESÕES",
    "BONECO",
  ]);

  const [filtercartoes, setfiltercartoes] = useState("");
  var searchcartoes = "";
  const filterCartoes = () => {
    clearTimeout(timeout);
    document.getElementById("inputCartao").focus();
    searchcartoes = document.getElementById("inputCartao").value.toUpperCase();

    timeout = setTimeout(() => {
      if (searchcartoes == "") {
        setfiltercartoes("");
        setarraycartoes(cartoes);
        document.getElementById("inputCartao").value = "";
        setTimeout(() => {
          document.getElementById("inputCartao").focus();
        }, 100);
      } else {
        setfiltercartoes(
          document.getElementById("inputCartao").value.toUpperCase()
        );
        setarraycartoes(cartoes.filter((item) => item.includes(searchcartoes)));
        document.getElementById("inputCartao").value = searchcartoes;
        setTimeout(() => {
          document.getElementById("inputCartao").focus();
        }, 100);
      }
    }, 1000);
  };
  // filtro de paciente por nome.
  function FilterCartoes() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder={window.innerWidth < mobilewidth ? "BUSCAR ATIVIDADE..." : "BUSCAR..."}
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) =>
          window.innerWidth < mobilewidth
            ? (e.target.placeholder = "BUSCAR TAREFA...")
            : "BUSCAR..."
        }
        onKeyUp={() => filterCartoes()}
        type="text"
        id="inputCartao"
        defaultValue={filtercartoes}
        maxLength={100}
        style={{
          width: window.innerWidth < mobilewidth ? '70vw' : 500,
          margin: 10, display: card == '' ? 'flex' : 'none',
          alignSelf: 'center'
        }}
      ></input>
    );
  }

  // AGENDAMENTO DE CONSULTA PELO PROFISSIONAL.

  // DATEPICKER (CALENDÁRIO);
  // preparando a array com as datas.
  var arraydate = [];
  const [arraylist, setarraylist] = useState([]);
  // preparando o primeiro dia do mês.
  const [startdate] = useState(moment().startOf('month'));
  // descobrindo o primeiro dia do calendário (último domingo do mês anteior).
  const firstSunday = (x, y) => {
    while (x.weekday() > 0) {
      x.subtract(1, 'day');
      y.subtract(1, 'day');
    }
    // se o primeiro domingo da array ainda cair no mês atual:
    if (x.month() == startdate.month()) {
      x.subtract(7, 'days');
      y.subtract(7, 'days');
    }
  }
  // criando array com 42 dias a partir da startdate.
  const setArrayDate = (x, y) => {
    arraydate = [x.format('DD/MM/YYYY')];
    while (y.diff(x, 'days') > 1) {
      x.add(1, 'day');
      arraydate.push(x.format('DD/MM/YYYY').toString());
    }
  }
  // criando a array de datas baseada no mês atual.
  const currentMonth = () => {
    var x = moment(startdate, 'DD/MM/YYYY');
    var y = moment(startdate).add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // percorrendo datas do mês anterior.
  const previousMonth = () => {
    startdate.subtract(1, 'month');
    var x = moment(startdate);
    var y = moment(startdate).add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  // percorrendo datas do mês seguinte.
  const nextMonth = () => {
    startdate.add(1, 'month');
    var month = moment(startdate).format('MM');
    var year = moment(startdate).format('YYYY');
    var x = moment('01/' + month + '/' + year, 'DD/MM/YYYY');
    var y = moment('01/' + month + '/' + year, 'DD/MM/YYYY').add(42, 'days');
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
  }
  const [selectdate, setselectdate] = useState(null);
  const DatePicker = useCallback(() => {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={"janela"}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignSelf: 'center',
          margin: 5,
          padding: window.innerWidth < mobilewidth ? 0 : 5,
          paddingBottom: window.innerWidth < mobilewidth ? 5 : 10,
          width: window.innerWidth < mobilewidth ? '100vw' : 400,
          borderRadius: window.innerWidth < 426 ? 0 : 5,
          backgroundColor: 'white'
        }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
          }}>
            <button
              className="button"
              onClick={(e) => { previousMonth(); e.stopPropagation(); }}
              id="previous"
              style={{
                width: 50,
                height: 50,
                margin: 2.5,
                color: '#ffffff',
              }}
              title={'MÊS ANTERIOR'}
            >
              {'◄'}
            </button>
            <p
              className="text1"
              style={{
                flex: 1,
                fontSize: 16,
                margin: 2.5
              }}>
              {startdate.format('MMMM').toUpperCase() + ' ' + startdate.year()}
            </p>
            <button
              className="button"
              onClick={(e) => { nextMonth(); e.stopPropagation(); }}
              id="next"
              style={{
                width: 50,
                height: 50,
                margin: 2.5,
                color: '#ffffff',
              }}
              title={'PRÓXIMO MÊS'}
            >
              {'►'}
            </button>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            width: window.innerWidth < 426 ? '85vw' : 400,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            padding: 0, margin: 0,
          }}>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>DOM</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>SEG</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>TER</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>QUA</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>QUI</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>SEX</p>
            <p className="text1" style={{ width: window.innerWidth < 426 ? 33 : 50, fontSize: 10, margin: 2.5, padding: 0 }}>SAB</p>
          </div>
          <div
            id="LISTA DE DATAS"
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              margin: 0,
              padding: 0,
              height: window.innerWidth < 426 ? 340 : '',
              width: window.innerWidth < 426 ? 300 : 400,
              boxShadow: 'none'
            }}
          >
            {arraylist.map((item) => (
              <button
                key={'dia ' + item}
                id={'dia ' + item}
                className={selectdate == item ? "button-selected" : "button"}
                onClick={(e) => {
                  setselectdate(item);
                  localStorage.setItem('selectdate', item);
                  selector('LISTA DE DATAS', 'dia ' + item, 300);
                  mountHorarios(item);
                  e.stopPropagation()
                }}
                style={{
                  height: 50,
                  margin: 2.5,
                  color: '#ffffff',
                  width: window.innerWidth < 426 ? 33 : 50,
                  minWidth: window.innerWidth < 426 ? 33 : 50,
                  opacity: item.substring(3, 5) === moment(startdate).format('MM') ? 1 : 0.5,
                  position: 'relative',
                }}
                title={item}
              >
                {item.substring(0, 2)}
                <div id='botão para buscar horários...'
                  style={{
                    display: 'flex',
                    borderRadius: 50,
                    backgroundColor: 'rgb(82, 190, 128, 1)',
                    borderWidth: 3,
                    borderStyle: 'solid',
                    borderColor: 'rgba(242, 242, 242)',
                    width: 20, height: 20,
                    position: 'absolute',
                    bottom: -5, right: -5,
                    alignContent: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                  onClick={() => setviewopcoeshorarios(1)}
                >
                  <div>+</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [arraylist, startdate, selectdate]);

  const ListaDeConsultas = useCallback(() => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: "column",
          alignSelf: "center",
        }}
      >
        <div id="scroll atendimentos com pacientes"
          className={window.innerWidth < mobilewidth ? "" : "grid2"}
          style={{
            marginTop: 5,
            alignSelf: 'center',
            width: '90vw'
          }}
        >
          {arrayatendimentos
            // uma lista para cada tipo de atividade...
            .filter(item => item.situacao == selectedatividade && moment(item.data_inicio).format('DD/MM/YYYY') == selectdate && item.id_profissional == usuario.id)
            .sort((a, b) => (moment(a.data_inicio) > moment(b.data_inicio) ? 1 : -1))
            .map((item) => (
              <div key={"pacientes" + item.id_atendimento} style={{ width: '100%' }}>
                <div
                  className="row"
                  style={{
                    position: "relative",
                    margin: 2.5, padding: 0,
                  }}
                >
                  <div
                    id={"atendimento " + item.id_atendimento}
                    className="button-grey"
                    style={{
                      flex: 1,
                      marginRight: 0,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}>
                    {moment(item.data_inicio).format('HH:mm') + ' ÀS ' + moment(item.data_termino).format('HH:mm')}
                  </div>
                  <div
                    id={"atendimento " + item.id_atendimento}
                    className="button"
                    style={{
                      flex: 3,
                      marginLeft: 0,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}                    >
                    <div style={{
                      display: 'flex', flexDirection: 'row',
                      justifyContent: window.innerWidth < mobilewidth ? 'center' : 'space-between',
                      width: '100%', flexWrap: 'wrap'
                    }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          padding: 5,
                          alignSelf: 'center',
                          marginLeft: window.innerWidth < mobilewidth ? '' : 10,
                        }}
                      >
                        <div style={{ marginRight: 5 }}>
                          {pacientes.filter(
                            (valor) => valor.id_paciente == item.id_paciente
                          )
                            .map((valor) => valor.nome_paciente)}
                        </div>
                      </div>
                      <div id="btn deletar agendamento de consulta"
                        title="DESMARCAR CONSULTA"
                        className="button-yellow"
                        onClick={() => {
                          modal(
                            setdialogo,
                            "TEM CERTEZA QUE DESEJA DESMARCAR A CONSULTA?",
                            deleteAtendimento,
                            item.id_atendimento
                          );
                        }}
                        style={{ width: 50, height: 50, alignSelf: 'flex-end' }}
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
                </div>
              </div>
            ))
          }
        </div>
        <div id="scroll atendimento vazio"
          className="scroll"
          style={{
            display: arrayatendimentos.length > 0 ? "none" : "flex",
            justifyContent: "flex-start",
            height: "calc(100vh - 200px)",
            width: '60vw',
            margin: 5,
          }}
        >
          <div className="text3" style={{ opacity: 0.5 }}>
            SELECIONE UMA DATA
          </div>
        </div>
      </div >
    );
    // eslint-disable-next-line
  }, [arrayatendimentos, selectdate, selectedatividade]);

  const [arrayhorarios, setarrayhorarios] = useState([]);
  const mountHorarios = (selectdate) => {
    let array = [];
    let inicio = moment(selectdate, 'DD/MM/YYYY').startOf('day').add(7, 'hours');
    array.push(inicio.format('DD/MM/YYYY - HH:mm'))
    for (var i = 0; i < 24; i++) {
      array.push(inicio.add(30, 'minutes').format('DD/MM/YYYY - HH:mm'));
    }
    setarrayhorarios(array);
  }
  const [viewopcoeshorarios, setviewopcoeshorarios] = useState(0);
  const ViewOpcoesHorarios = () => {
    return (
      <div
        className="fundo"
        style={{ display: viewopcoeshorarios == 1 ? "flex" : "none" }}
        onClick={() => {
          setviewopcoeshorarios(0);
        }}
      >
        <div className="janela scroll"
          style={{
            display: 'flex', flexDirection: 'column', justifyItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '90vw',
            height: '85vh',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div id="botão para sair da tela de seleção dos horários"
              className="button-yellow" style={{
                maxHeight: 50, maxWidth: 50,
                position: 'sticky', top: 10, right: 10, alignSelf: 'flex-end'
              }}
              onClick={() => {
                setviewopcoeshorarios(0);
              }}>
              <img
                alt=""
                src={back}
                style={{ width: 30, height: 30 }}
              ></img>
            </div>
            <div className='text1' style={{ fontSize: 18, marginBottom: 0 }}>HORÁRIOS DISPONÍVEIS</div>
          </div>
          <div className='text1' style={{ marginTop: 0 }}>{'DATA: ' + localStorage.getItem('selectdate')}</div>
          <div
            className={window.innerWidth < mobilewidth ? "grid2" : "grid3"}
            style={{ width: '100%' }}
          >
            {arrayhorarios.map(item => (
              <div className='button'
                style={{
                  opacity: arrayatendimentos.filter(valor => (moment(valor.data_inicio).format('DD/MM/YYYY - HH:mm') == item && valor.situacao == selectedatividade) || (moment(valor.data_inicio).format('DD/MM/YYYY - HH:mm') == item && valor.id_paciente == paciente)).length > 0 ? 0.3 : 1,
                  pointerEvents: arrayatendimentos.filter(valor => (moment(valor.data_inicio).format('DD/MM/YYYY - HH:mm') == item && valor.situacao == selectedatividade) || (moment(valor.data_inicio).format('DD/MM/YYYY - HH:mm') == item && valor.id_paciente == paciente)).length > 0 ? 'none' : 'auto',
                  height: 100, flexGrow: 'inherit',
                }}
                onClick={() => { insertAtendimento(item); setviewopcoeshorarios(0) }}
              >
                {moment(item, 'DD/MM/YYYY - HH:mm').format('HH:mm')}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // seletor de atividades para agendamento.
  const [viewopcoesatividades, setviewopcoesatividades] = useState(0);
  function AtividadesSelector() {
    return (
      <div className="fundo"
        onClick={() => setviewopcoesatividades(0)}
        style={{
          display: viewopcoesatividades == 1 ? 'flex' : 'none',
          justifyContent: window.innerWidth < mobilewidth ? 'center' : 'center',
          flexDirection: window.innerWidth < mobilewidth ? 'column' : 'row',
          width: window.innerWidth < mobilewidth ? '100vw' : '',
          height: '100vh',
        }}>
        <div className="janela" style={{ display: 'flex', flexDirection: 'column' }}>
          {
            //eslint-disable-next-line
            arrayatividades.map((item) => (
              <div className="button"
                style={{ width: 200 }}
                onClick={() => setselectedatividade(item)}
              >
                {item}
              </div>
            ))}
        </div>
      </div>
    )
  }

  // janela para que o médico possa agendar suas consultas.
  function MinhasConsultas() {
    return (
      <div style={{
        position: 'absolute',
        display: objpaciente != null && viewagendamento == 1 ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: '100vw',
        height: '100vh',
      }}>
        <div className="janela scroll"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 'calc(100vw - 10px)',
            height: 'calc(100vh - 10px)',
            justifyContent: 'flex-start',
            backgroundColor: 'white',
            borderColor: 'white',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < mobilewidth ? 'column' : 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
            <div style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'center',
              marginTop: window.innerWidth < mobilewidth ? 90 : '',
            }}>
              <div id="botão para sair da tela de agendamento de atividades e consultas"
                className="button-yellow"
                style={{
                  maxHeight: 50, maxWidth: 50, alignSelf: 'center', marginRight: 0,
                }}
                onClick={() => {
                  setviewagendamento(0);
                }}>
                <img
                  alt=""
                  src={back}
                  style={{ width: 30, height: 30 }}
                ></img>
              </div>
              <div id="botão seletor da atividade"
                className="button"
                onClick={() => setviewopcoesatividades(1)}
                style={{
                  width: 200,
                }}
              >
                {selectedatividade}
              </div>
            </div>
            <div className="text1"
              style={{
                fontSize: window.innerWidth < mobilewidth ? '' : '16',
              }}>
              {objpaciente != null ? 'AGENDAR ' + selectedatividade + ' PARA ' + objpaciente.nome_paciente + '.' : ''}
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
            <DatePicker></DatePicker>
            <ListaDeConsultas></ListaDeConsultas>
            <ViewOpcoesHorarios></ViewOpcoesHorarios>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="main"
      style={{ display: pagina == -2 ? "flex" : "none" }}
    >
      <div
        className="chassi"
        id="conteúdo do prontuário para todos os pacientes"
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
          position: 'relative',
        }}
      >
        <div id="usuário, botões, busca de paciente e lista de pacientes"
          style={{
            display: window.innerWidth < mobilewidth && viewlista == 0 ? "none" : "flex",
            flexDirection: 'column', justifyContent: 'center',
            position: 'sticky', top: 5,
            width: window.innerWidth < mobilewidth ? '90vw' : '30vw',
            height: '95vh',
            alignSelf: 'center',
          }}
        >
          <Usuario></Usuario>
          <ListaDeAtendimentos></ListaDeAtendimentos>
        </div>
        <div id="conteúdo cheio (cards)"
          style={{
            display: atendimento != null && card == 0 && viewlista == 0 ? 'flex' : 'none',
            flexDirection: "row",
            justifyContent: 'center',
            alignContent: 'flex-start',
            flexWrap: "wrap",
            width: window.innerWidth < mobilewidth ? '90vw' : '65vw',
          }}
        >
          <CabecalhoPacienteMobile></CabecalhoPacienteMobile>
          <FilterCartoes></FilterCartoes>
          <div id="cards (cartões) visão desktop"
            style={{
              display: window.innerWidth < mobilewidth ? 'none' : 'flex',
              width: '100%', alignSelf: 'center', justifyContent: 'center',
              flexDirection: 'row', flexWrap: 'wrap',
            }}>
            <div onClick={() => setcard("card-camera")}
              className="card-fechado cor3"
              style={{
                margin: 5,
                height: window.innerWidth < mobilewidth ? '35vw' : '15vw',
                minHeight: window.innerWidth < mobilewidth ? '32vw' : '15vw',
                minWidth: window.innerWidth < mobilewidth ? '32vw' : '15vw',
                maxWidth: window.innerWidth < mobilewidth ? '' : '15vw',
                alignSelf: 'center',
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                margin: 0, padding: 0,
                alignSelf: 'center',
                // backgroundColor: 'red'
              }}>
                <img
                  alt=""
                  src={fotinho != 1 ? fotinho : dots_teal}
                  style={{
                    margin: 10,
                    height: '100%',
                    width: '100%',
                    alignSelf: 'center',
                    borderRadius: 5,
                  }}
                ></img>
              </div>
            </div>
            {cartao(null, "DIAS DE INTERNAÇÃO: " +
              atendimentos
                .filter((item) => item.id_atendimento == atendimento)
                .map((item) => moment().diff(item.data_inicio, "days")),
              null, null
            )}
            {cartao(alergias, "ALERGIAS", "card-alergias", busyalergias)}
            {cartao(null, "DIAGNÓSTICOS", "card-diagnosticos", null)}
            {cartao(null, "ADMISSÃO", "card-documento-admissao", null)}
            {cartao(null, "EVOLUÇÃO", "card-documento-evolucao", null)}
            {cartao(null, 'EVOLUÇÃO HOME CARE', 'card-evolucao-mobile', null)}
            {cartao(null, "RECEITA MÉDICA", "card-documento-receita", null)}
            {cartao(null, "SUMÁRIO DE ALTA", "card-documento-alta", null)}
            {cartao(propostas.filter((item) => item.status == 0), "PROPOSTAS", "card-propostas", busypropostas)}
            {cartao(precaucoes, "PRECAUÇÕES", "card-precaucoes", null)}
            {cartao(riscos, "RISCOS", "card-riscos", busyriscos)}
            {cartao(null, "ALERTAS", "card-alertas", null)}
            {cartao(null, "SINAIS VITAIS", "card-sinaisvitais", busysinaisvitais)}
            {cartao(null, 'INVASÕES E LESÕES', "card-boneco", null)}
            {cartao(null, "DIETA", "card-dietas", busydieta)}
            {cartao(null, 'MONITORAMENTO HOME CARE', "card-feedback", null)}
            {cartao(null, 'ESCALAS ASSISTENCIAIS', 'card-escalas_assistenciais', null)}
            {cartao(null, 'MEDICAÇÕES', 'card-receita', null)}
            {cartao(null, 'PRESCRIÇÃO', 'card-prescricao-easy', null)}
          </div>
          <div id="cards (cartões) visão mobile"
            className={arraycartoes.length == cartoes.length ? "grid2" : "grid1"}
            style={{
              display: window.innerWidth < mobilewidth ? 'grid' : 'none',
              width: '100%',
            }}>
            <div onClick={() => setcard("card-camera")}
              className="card-fechado cor3"
              style={{
                margin: 5,
                height: window.innerWidth < mobilewidth ? '35vw' : '15vw',
                minHeight: window.innerWidth < mobilewidth ? '32vw' : '15vw',
                minWidth: window.innerWidth < mobilewidth ? '32vw' : '15vw',
                maxWidth: window.innerWidth < mobilewidth ? '' : '15vw',
                alignSelf: 'center',
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                margin: 0, padding: 0,
                alignSelf: 'center',
                // backgroundColor: 'red'
              }}>
                <img
                  alt=""
                  src={fotinho != 1 ? fotinho : lupa}
                  style={{
                    margin: 10,
                    height: '100%',
                    width: '100%',
                    alignSelf: 'center',
                    borderRadius: 5,
                  }}
                ></img>
              </div>
            </div>
            {cartao(null, "DIAS DE INTERNAÇÃO: " +
              atendimentos
                .filter((item) => item.id_atendimento == atendimento)
                .map((item) => moment().diff(item.data_inicio, "days")),
              null, null
            )}
            {cartao(alergias, "ALERGIAS", "card-alergias", busyalergias)}
            {cartao(null, "DIAGNÓSTICOS", "card-diagnosticos", null)}
            {cartao(null, 'EVOLUÇÃO HOME CARE', 'card-evolucao-mobile', null)}
            {cartao(propostas.filter((item) => item.status == 0), "PROPOSTAS", "card-propostas", busypropostas)}
            {cartao(precaucoes, "PRECAUÇÕES", "card-precaucoes", null)}
            {cartao(riscos, "RISCOS", "card-riscos", busyriscos)}
            {cartao(null, "ALERTAS", "card-alertas", null)}
            {cartao(null, "SINAIS VITAIS", "card-sinaisvitais", busysinaisvitais)}
            {cartao(null, 'INVASÕES E LESÕES', "card-boneco", null)}
            {cartao(null, "DIETA", "card-dietas", busydieta)}
            {cartao(null, 'MONITORAMENTO HOME CARE', "card-feedback", null)}
            {cartao(null, 'ESCALAS ASSISTENCIAIS', 'card-escalas_assistenciais', null)}
            {cartao(null, 'MEDICAÇÕES', 'card-receita', null)}
            {cartao(null, 'PRESCRIÇÃO', 'card-prescricao-easy', null)}
          </div>
        </div>
        <div id="conteúdo cheio (componentes)"
          style={{
            display: atendimento != null && viewlista == 0 && card != 0 ? 'flex' : 'none',
            flexDirection: "row",
            justifyContent: 'center',
            alignContent: 'center',
            flexWrap: "wrap",
            width: window.innerWidth < mobilewidth ? '90vw' : '65vw',
          }}
        >
          <Camera></Camera>
          <Alergias></Alergias>
          <Diagnosticos></Diagnosticos>
          <Documentos></Documentos>
          <Boneco></Boneco>
          <Propostas></Propostas>
          <SinaisVitais></SinaisVitais>
          <Infusoes></Infusoes>
          <Dieta></Dieta>
          <Precaucoes></Precaucoes>
          <Riscos></Riscos>
          <Alertas></Alertas>
          <Prescricao></Prescricao>
          <EvolucaoMobile></EvolucaoMobile>
          <Feedback></Feedback>
          <EscalasAssistenciais></EscalasAssistenciais>
          <Medicacoes></Medicacoes>
          <MedicacoesCheck></MedicacoesCheck>
        </div>
        <div id="conteúdo vazio"
          style={{
            display: window.innerWidth < mobilewidth ? "none" : atendimento == null ? "flex" : "none",
            flexDirection: "row",
            justifyContent: 'center',
            flexWrap: "wrap",
            width: '65vw',
          }}
        >
          <img className="lupa"
            alt=""
            src={lupa}
            style={{
              margin: 10,
              height: 150,
              width: 150,
              opacity: 0.1,
              alignSelf: 'center'
            }}
          ></img>
        </div>
      </div>
      <MinhasConsultas></MinhasConsultas>
      <AtividadesSelector></AtividadesSelector>
    </div>
  );
}

export default Consultas;