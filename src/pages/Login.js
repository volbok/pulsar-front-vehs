/* eslint eqeqeq: "off" */
import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "./Context";
// funções.
import toast from "../functions/toast";
import checkinput from "../functions/checkinput";
// imagens.
import salvar from "../images/salvar.svg";
import back from "../images/back.svg";
import power from "../images/power.svg";
// componentes.
import Logo from "../components/Logo";
import logo_vehs from "../images/logo_vehs.png";
// router.
import { useHistory } from "react-router-dom";

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(5);

function Login() {
  // context.
  const {
    html,
    setsettings,
    pagina,
    setpagina,
    settoast,
    sethospital,
    setunidade,
    unidades,
    setunidades,
    setusuario,
    usuario,
    setusuarios,
    cliente,
    mobilewidth,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  useEffect(() => {
    if (pagina == 0) {
      sethospital(cliente.id_cliente);
      loadUnidades();
      loadUsuarios();

      if (usuario.id != undefined) {
        // setusuario(JSON.parse(localStorage.getItem('obj_usuario')));
        loadAcessos(usuario.id);
        loadUnidades();
        setviewlistaunidades(1);
      } else {
        setviewlistaunidades(0);
        loadUnidades();
        loadUsuarios();
      }
    }
    // eslint-disable-next-line
  }, [pagina]);

  // carregar configurações do usuário logado.
  // eslint-disable-next-line
  const [tema, settema] = useState(1);
  const loadSettings = (usuario) => {
    axios.get(html + "settings/" + usuario).then((response) => {
      var x = [];
      x = response.data.rows;
      changeTema(x.map((item) => item.tema));
      settema(x.map((item) => item.tema));
      setsettings(response.data.rows);
      if (x.length < 1) {
        var obj = {
          id_usuario: usuario,
          tema: 1,
          card_diasinternacao: 1,
          card_alergias: 1,
          card_anamnese: 1,
          card_evolucoes: 1,
          card_propostas: 1,
          card_precaucoes: 1,
          card_riscos: 1,
          card_alertas: 1,
          card_sinaisvitais: 1,
          card_body: 1,
          card_vm: 1,
          card_infusoes: 1,
          card_dieta: 1,
          card_culturas: 1,
          card_antibioticos: 1,
          card_interconsultas: 1,
        };
        axios
          .post(html + "insert_settings", obj)
          .then(() => {
            toast(
              settoast,
              "CONFIGURAÇÕES PESSOAIS ARMAZENADAS NA BASE PULSAR",
              "rgb(82, 190, 128, 1)",
              3000
            );
            axios
              .get(html + "settings/" + usuario)
              .then((response) => {
                setsettings(response.data.rows);
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  };

  // carregando o tema de cores da aplicação.
  // função para seleção de esquemas de cores (temas) da aplicação.
  const changeTema = (tema) => {
    if (tema == 1) {
      // tema AZUL.
      document.documentElement.style.setProperty(
        "--cor1",
        "rgba(64, 74, 131, 0.7)"
      );
      document.documentElement.style.setProperty(
        "--cor1hover",
        "rgba(64, 74, 131, 1)"
      );
      document.documentElement.style.setProperty(
        "--cor2",
        "rgba(242, 242, 242)"
      );
      document.documentElement.style.setProperty(
        "--cor3",
        "rgba(215, 219, 221)"
      );
      document.documentElement.style.setProperty(
        "--texto1",
        "rgba(97, 99, 110, 1)"
      );
      document.documentElement.style.setProperty("--texto2", "#ffffff");
      document.documentElement.style.setProperty(
        "--texto3",
        "rgba(64, 74, 131, 1)"
      );
      document.documentElement.style.setProperty(
        "--placeholder",
        "rgb(97, 99, 110, 0.6)"
      );
      document.documentElement.style.setProperty("--cor0", "white");
    } else if (tema == 2) {
      // tema VERDE.
      document.documentElement.style.setProperty(
        "--cor1",
        "rgba(26, 188, 156, 0.7)"
      );
      document.documentElement.style.setProperty(
        "--cor1hover",
        "rgba(26, 188, 156, 1)"
      );
      document.documentElement.style.setProperty(
        "--cor2",
        "rgba(242, 242, 242)"
      );
      document.documentElement.style.setProperty(
        "--cor3",
        "rgba(215, 219, 221)"
      );
      document.documentElement.style.setProperty(
        "--texto1",
        "rgba(97, 99, 110, 1)"
      );
      document.documentElement.style.setProperty("--texto2", "#ffffff");
      document.documentElement.style.setProperty("--texto3", "#48C9B0");
      document.documentElement.style.setProperty(
        "--placeholder",
        "rgb(97, 99, 110, 0.6)"
      );
      document.documentElement.style.setProperty("--cor0", "white");
    } else if (tema == 3) {
      // tema PRETO.
      document.documentElement.style.setProperty(
        "--cor1",
        "rgb(86, 101, 115, 0.6)"
      );
      document.documentElement.style.setProperty(
        "--cor1hover",
        "rgb(86, 101, 115, 1)"
      );
      document.documentElement.style.setProperty(
        "--cor2",
        "rgb(23, 32, 42, 1)"
      );
      document.documentElement.style.setProperty("--cor3", "black");
      document.documentElement.style.setProperty("--texto1", "#ffffff");
      document.documentElement.style.setProperty("--texto2", "#ffffff");
      document.documentElement.style.setProperty("--texto3", "#ffffff");
      document.documentElement.style.setProperty(
        "--placeholder",
        "rgb(255, 255, 255, 0.5)"
      );
      document.documentElement.style.setProperty("--cor0", "#000000");
    } else {
      document.documentElement.style.setProperty(
        "--cor1",
        "rgba(64, 74, 131, 0.7)"
      );
      document.documentElement.style.setProperty(
        "--cor1hover",
        "rgba(64, 74, 131, 1)"
      );
      document.documentElement.style.setProperty(
        "--cor2",
        "rgba(242, 242, 242)"
      );
      document.documentElement.style.setProperty(
        "--cor3",
        "rgba(215, 219, 221)"
      );
      document.documentElement.style.setProperty(
        "--texto1",
        "rgba(97, 99, 110, 1)"
      );
      document.documentElement.style.setProperty("--texto2", "#ffffff");
      document.documentElement.style.setProperty(
        "--texto3",
        "rgba(64, 74, 131, 1)"
      );
      document.documentElement.style.setProperty(
        "--placeholder",
        "rgb(97, 99, 110, 0.6)"
      );
      document.documentElement.style.setProperty("--cor0", "white");
    }
  };

  // recuperando registros de unidades cadastradas na aplicação.
  const loadUnidades = () => {
    axios
      .get(html + "list_unidades")
      .then((response) => {
        setunidades(response.data.rows);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const loadUsuarios = () => {
    axios
      .get(html + "list_usuarios")
      .then((response) => {
        setusuarios(response.data.rows);
        /*
        ACESSOS AOS MÓDULOS DE USUÁRIO (tabela usuarios):
        10 - MÉDICO(A)
        11 - ENFERMEIRO(A)
        12 - TÉCNICO(A) DE ENFERMAGEM
        13 - FISIOTERAPEUTA
        14 - FONOAUDIOLOGO(A)
        15 - TERAPEUTA OCUPACIONAL
        16 - ASSISTENTE SOCIAL
        17 - PSICOLOGO(A)
        18 - RADIOLOGIA
        20 - GERENTE
        21 - ADMINISTRATIVO
        */
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // recuperando registros de acessos do usuário logado.
  const [acessos, setacessos] = useState([]);
  const loadAcessos = (id_usuario) => {
    var obj = {
      id_usuario: id_usuario,
    };
    axios
      .post(
        html + "getunidades",
        obj
        /*
        Forma de passar o token pelo header (deve ser repetida em toda endpoint).
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
        */
      )
      .then((response) => {
        setacessos(response.data.rows);
        setviewlistaunidades(1);
        setviewalterarsenha(0);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // checando se o usuário inserido está registrado no sistema.
  let password = null;
  var timeout = null;
  const checkLogin = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      password = document.getElementById("inputSenha").value;
      let usuario = localStorage.getItem('usuario');
      let senha = localStorage.getItem('senha');
      if (bcrypt.compareSync(password, senha) == true) {
        var obj = {
          usuario: parseInt(usuario),
        };
        axios
          .post(html + "grant", obj)
          .then((response) => {
            var x = [];
            x = response.data;
            // armazenando o token no localStorage.
            localStorage.setItem("token", x.token);
            setAuthToken(x.token);
            if (x.auth == true) {

              /*
              toast(
                settoast,
                "OLÁ, " + usuario.nome.split(" ", 1),
                "rgb(82, 190, 128, 1)",
                3000
              );
              */

              // eslint-disable-next-line
              setviewlistaunidades(1);
              setviewcliente(1);
              loadAcessos(x.id.usuario);
              loadSettings(x.id.usuario);
            } else {
              toast(
                settoast,
                "USUÁRIO OU SENHA INCORRETOS",
                "rgb(231, 76, 60, 1)",
                3000
              );
            }
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
              setusuario({})
              history.push("/");
            }, 5000);
          });
      } else {
        toast(settoast, 'USUÁRIO E SENHA NÃO CONFEREM', 'red', 1000);
      }

    }, 1000);
  };

  // forma mais inteligente de adicionar o token ao header de todas as requisições.
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    } else delete axios.defaults.headers.common["Authorization"];
  };

  const checkUsuario = (usuario) => {
    var obj = { usuario: usuario }
    axios.post(html + "checknomeusuario", obj)
      .then((response) => {
        var x = response.data;
        // salvando os dados do usuário logado.
        var obj = {
          id: x.id,
          nome_usuario: x.nome,
          dn_usuario: x.dn,
          cpf_usuario: x.cpf,
          email_usuario: x.email,
          senha: x.senha,
          login: x.login,
          conselho: x.conselho,
          n_conselho: x.n_conselho,
          tipo_usuario: x.tipo_usuario,
          paciente: x.paciente,
          prontuario: x.prontuario,
          laboratorio: x.laboratorio,
          farmacia: x.farmacia,
          faturamento: x.faturamento,
          usuarios: x.usuarios,
          primeiro_acesso: x.primeiro_acesso,
        }

        setusuario(obj);
        localStorage.setItem('obj_usuario', JSON.stringify(obj));
        localStorage.setItem('usuario', x.id);
        localStorage.setItem('senha', x.senha);
        if (x.id != undefined && x.primeiro_acesso != 1) {
          setviewcriarsenha(1);
        } else if (x.id == undefined) {
          document.getElementById("inputSenha").style.opacity = 0.3;
          document.getElementById("inputSenha").style.pointerEvents = 'none';
          toast(settoast, 'USUÁRIO INEXISTENTE', 'red', 1000);
        } else {
          document.getElementById("inputSenha").style.opacity = 1;
          document.getElementById("inputSenha").style.pointerEvents = 'auto';
        }
      })
  };

  // inputs para login e senha.
  const [viewlistaunidades, setviewlistaunidades] = useState(0);
  const [viewcliente, setviewcliente] = useState(0);
  const [viewalterarsenha, setviewalterarsenha] = useState(0);
  const Inputs = useCallback(() => {
    var timeout = null;
    return (
      <div
        style={{
          display:
            viewlistaunidades == 1 || viewalterarsenha == 1 ? "none" : "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
          marginTop: 20,
        }}
      >
        <input
          autoComplete="off"
          placeholder="USUÁRIO"
          className="input"
          type="text"
          id="inputUsuario"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "USUÁRIO")}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
          onKeyUp={() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              localStorage.setItem('documento', document.getElementById("inputUsuario").value);
              checkUsuario(document.getElementById("inputUsuario").value);
            }, 2000);
          }}
        ></input>
        <input
          autoComplete="off"
          placeholder="SENHA"
          className="input"
          type="password"
          id="inputSenha"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "SENHA")}
          onChange={() => {
            checkLogin();
          }}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
            opacity: 0.3,
            pointerEvents: 'none'
          }}
        ></input>
      </div>
    );
    // eslint-disable-next-line
  }, [viewlistaunidades, viewalterarsenha]);

  let termo =
    'TERMO DE CONFIDENCIALIDADE\n\n' +
    'AO CADASTRAR SUA SENHA DE ACESSO AO SISTEMA PULSAR, VOCÊ DECLARA QUE PROTEGERÁ SUA SENHA E NÃO A REPASSARÁ PARA TERCEIROS, ' +
    'BEM COMO NÃO DIVULGARÁ AS INFORMAÇÕES RELACIONADAS AOS PACIENTES DISPONIBILIZADAS NA APLICAÇÃO, ' +
    'GARANTINDO ASSIM A CONFIDENCIALIDADE DOS DADOS SENSÍVEIS ARMAZENADOS NA PLATAFORMA.'

  const [viewcriarsenha, setviewcriarsenha] = useState(0);

  const updateHashPasswordUsuario = (hash) => {
    var obj = {
      nome_usuario: usuario.nome_usuario,
      dn_usuario: usuario.dn_usuario,
      cpf_usuario: usuario.cpf_usuario,
      email_usuario: usuario.email_usuario,
      senha: hash,
      login: usuario.cpf_usuario,
      conselho: usuario.conselho,
      n_conselho: usuario.n_conselho,
      tipo_usuario: usuario.tipo_usuario,
      paciente: usuario.paciente,
      prontuario: usuario.prontuario,
      laboratorio: usuario.laboratorio,
      farmacia: usuario.farmacia,
      faturamento: usuario.faturamento,
      usuarios: usuario.usuarios,
      primeiro_acesso: 1,
    };
    axios
      .post(html + "update_usuario/" + usuario.id, obj)
      .then(() => {
        setviewcriarsenha(0);
        toast(
          settoast,
          "SENHA ATUALIZADA COM SUCESSO NA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          3000
        );
        setTimeout(() => {
          setpagina(null)
          setTimeout(() => {
            setpagina(0);
          }, 100);
        }, 3100);
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


  function CriarSenha() {
    return (
      <div className="fundo"
        style={{ display: viewcriarsenha == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="janela" style={{ height: '80vh' }}>
          <div className="text1">{'BEM-VINDO À PLATAFORMA PULSAR, ' + usuario.nome_usuario + '.'}</div>
          <div className="textarea scroll"
            style={{
              marginBottom: 10, width: '50vw', height: 200, justifyContent: 'flex-start',
              whiteSpace: 'pre-wrap', textAlign: 'center',
            }}>
            {termo}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="text1">
                DIGITE A SENHA
              </div>
              <input
                autoComplete="off"
                placeholder="SENHA"
                className="input"
                type="password"
                id="inputPrimeiraSenha"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "NOVA SENHA")}
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  width: 200,
                  height: 50,
                  alignSelf: "center",
                }}
              ></input>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="text1">
                CONFIRME A NOVA SENHA
              </div>
              <input
                autoComplete="off"
                placeholder="REPITA A SENHA"
                className="input"
                type="password"
                id="inputConfirmaPrimeiraSenha"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "REPITA SENHA")}
                onKeyUp={() => {
                  clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    var primeirasenha = document.getElementById("inputPrimeiraSenha").value;
                    var confirmaprimeirasenha = document.getElementById("inputConfirmaPrimeiraSenha").value;
                    if (primeirasenha == confirmaprimeirasenha) {
                      document.getElementById("btngerarsenha").style.opacity = 1;
                      document.getElementById("btngerarsenha").style.pointerEvents = 'auto';
                    } else {
                      document.getElementById("inputPrimeiraSenha").value = '';
                      document.getElementById("inputConfirmaPrimeiraSenha").value = '';
                      toast(settoast, 'AS SENHAS NÃO CONFEREM', 'red', 2000);
                      setTimeout(() => {
                        document.getElementById("inputPrimeiraSenha").focus();
                      }, 2100);
                    }
                  }, 3000);
                }}
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  width: 200,
                  height: 50,
                  alignSelf: "center",
                }}
              ></input>
            </div>
          </div>
          <div
            id="btngerarsenha"
            className="button"
            style={{
              display: 'flex',
              margin: 5,
              width: 150,
              padding: 20,
              minWidth: 150,
              opacity: 0.3,
              pointerEvents: 'none'
            }}
            onClick={() => {
              // gerando senha criptografada com o bcrypt.
              var password = document.getElementById("inputPrimeiraSenha").value;
              var hash = bcrypt.hashSync(password, salt);
              updateHashPasswordUsuario(hash);
            }}
          >
            ACEITO OS TERMOS. GERAR ACESSO
          </div>
        </div>
      </div >
    )
  }

  // lista de unidades disponiveis para o usuário logado.

  function ListaDeUnidadesAssistenciais() {
    return (
      <div
        style={{
          display: viewlistaunidades == 1 ? "flex" : "none",
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
            flexWrap: "wrap",
          }}
        >
          <div
            className="button"
            style={{
              display: "flex",
              padding: 10,
              margin: 5,
              minWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              maxWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              height: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              minHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              maxHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              color: 'white',
            }}
            onClick={() => {
              setpagina(-1);
              history.push("/prontuario_todos_pacientes");
              console.log(usuario);
            }}
          >
            PRONTUÁRIO
          </div>
          <div
            className="button"
            style={{
              display: "flex",
              padding: 10,
              margin: 5,
              minWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              maxWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              height: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              minHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              maxHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              color: 'white',
            }}
            onClick={() => {
              setpagina(-2);
              history.push("/consultas");
            }}
          >
            CONSULTAS E ATIVIDADES
          </div>
          <div
            className="button"
            style={{
              display: "flex",
              padding: 10,
              margin: 5,
              minWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              maxWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              height: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              minHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              maxHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              color: 'white',
            }}
            onClick={() => {
              setpagina('painel_atividades');
              history.push("/painel_atividades");
            }}
          >
            PAINEL DE ATIVIDADES
          </div>
          <div style={{ display: 'none' }}>
            {acessos.map((item) => (
              <div
                key={"ACESSO: " + item.id_acesso}
                className="button"
                style={{
                  display: "flex",
                  padding: 10,
                  margin: 5,
                  minWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
                  maxWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
                  height: window.innerWidth < mobilewidth ? "30vw" : "15vw",
                  minHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
                  maxHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
                  color: 'white',
                }}
                onClick={() => {
                  setunidade(item.id_unidade);
                  if (item.id_unidade == 4) { // card para acesso à tela de triagem.
                    setpagina(30);
                    history.push("/triagem");
                  } else {
                    setpagina(1);
                    history.push("/prontuario");
                    localStorage.setItem("viewlistaunidades", 1);
                    localStorage.setItem("viewlistamodulos", 1);
                  }
                }}
              >
                {unidades
                  .filter((valor) => valor.id_unidade == item.id_unidade)
                  .map(
                    (valor) => valor.nome_cliente + " - " + valor.nome_unidade
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  const montaModuloDeApoio = (titulo, acesso, rota, pagina) => {
    return (
      <div
        className="button"
        style={{
          display: acesso != 0 || acesso != null ? "flex" : "none",
          minWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
          maxWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
          height: window.innerWidth < mobilewidth ? "30vw" : "15vw",
          minHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
          maxHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
          padding: 10,
        }}
        onClick={() => {
          history.push(rota);
          setpagina(pagina);
          localStorage.setItem("viewlistaunidades", 1);
          localStorage.setItem("viewlistamodulos", 1);
        }}
      >
        {titulo}
      </div>
    );
  };
  function ListaDeUnidadesDeApoio() {
    return (
      <div
        style={{
          display: viewlistaunidades == 1 && window.innerWidth > mobilewidth ? "flex" : "none",
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
            flexWrap: "wrap",
          }}
        >
          {montaModuloDeApoio(
            "CADASTRO E MOVIMENTAÇÃO DE PACIENTES",
            usuario.paciente,
            "/cadastro",
            2
          )}
          {montaModuloDeApoio(
            "CADASTRO DE USUÁRIOS",
            usuario.usuarios,
            "/usuarios",
            5
          )}
        </div>
      </div>
    );
  }

  // ## TROCA DE SENHA ## //
  // atualizar usuário.
  const updateUsuario = () => {
    let novasenha = document.getElementById("inputNovaSenha").value;
    let repetesenha = document.getElementById("inputConfirmaSenha").value;

    if (novasenha == repetesenha) {
      var obj = {
        nome_usuario: usuario.nome_usuario,
        dn_usuario: usuario.dn_usuario,
        cpf_usuario: usuario.cpf_usuario,
        email_usuario: usuario.email_usuario,
        senha: novasenha,
        login: usuario.cpf_usuario,
        conselho: usuario.conselho,
        n_conselho: usuario.n_conselho,
        tipo_usuario: usuario.tipo_usuario,
        paciente: usuario.paciente,
        prontuario: usuario.prontuario,
        laboratorio: usuario.laboratorio,
        farmacia: usuario.farmacia,
        faturamento: usuario.faturamento,
        usuarios: usuario.usuarios,
        primeiro_acesso: usuario.primeiro_acesso,
        almoxarifado: usuario.almoxarifado,
      };
      axios
        .post(html + "update_usuario/" + usuario.id, obj)
        .then(() => {
          setviewalterarsenha(0);
          toast(
            settoast,
            "SENHA ATUALIZADA COM SUCESSO NA BASE PULSAR",
            "rgb(82, 190, 128, 1)",
            3000
          );
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
    } else {
      document.getElementById("inputNovaSenha").value = "";
      document.getElementById("inputConfirmaSenha").value = "";
      document.getElementById("inputNovaSenha").focus();
      toast(
        settoast,
        "SENHA REPETIDA NÃO CONFERE",
        "rgb(231, 76, 60, 1)",
        3000
      );
    }
  };

  // componente para alteração da senha:
  function AlterarSenha() {
    return (
      <div
        style={{
          display: viewalterarsenha == 1 ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <div className="text3" style={{ color: "white", fontSize: 16 }}>
          {usuario.nome_usuario}
        </div>
        <div className="text1" style={{ color: "white" }}>
          DIGITE A NOVA SENHA
        </div>
        <input
          autoComplete="off"
          placeholder="NOVA SENHA"
          className="input"
          type="password"
          id="inputNovaSenha"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "NOVA SENHA")}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
            alignSelf: "center",
          }}
        ></input>
        <div className="text1" style={{ color: "white" }}>
          CONFIRME A NOVA SENHA
        </div>
        <input
          autoComplete="off"
          placeholder="REPITA SENHA"
          className="input"
          type="password"
          id="inputConfirmaSenha"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "REPITA SENHA")}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
            alignSelf: "center",
          }}
        ></input>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div
            id="btnTrocarSenha"
            title="ALTERAR SENHA"
            className="button-green"
            onClick={() => {
              checkinput(
                "input",
                settoast,
                ["inputNovaSenha", "inputConfirmaSenha"],
                "btnTrocarSenha",
                updateUsuario,
                []
              );
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
          <div
            id="btnCancelaTrocarSenha"
            title="CANCELAR ALTERAÇÃO DA SENHA"
            className="button-red"
            onClick={() => {
              setviewalterarsenha(0);
              setviewlistaunidades(1);
            }}
            style={{ width: 50, height: 50, alignSelf: "center" }}
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
        </div>
      </div>
    );
  }

  return (
    <div
      className="main"
      style={{ display: pagina == 0 ? "flex" : "none" }}
    >
      <div
        className="chassi"
        id="conteúdo do login"
      >
        <div
          className="button-red"
          style={{
            display: viewlistaunidades == 0 ? "none" : "flex",
            position: "sticky",
            top: 10,
            right: 10,
            alignSelf: 'flex-end'
          }}
          title="FAZER LOGOFF."
          onClick={() => {
            setusuario({});
            setacessos([]);
            setviewlistaunidades(0);
            setviewalterarsenha(0);
          }}
        >
          <img
            alt=""
            src={power}
            style={{
              margin: 0,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <div
          className="text2 popin"
          style={{
            margin: 20,
            display:
              window.innerWidth < mobilewidth && viewalterarsenha == 1
                ? "none"
                : "flex",
          }}
        >
          <img
            alt=""
            src={logo_vehs}
            style={{
              margin: 0,
              height: window.innerWidth < mobilewidth ? '30vw' : '20vh',
            }}
          ></img>
        </div>

        <div
          style={{
            display: "none",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <a
            className="text2"
            style={{ cursor: "pointer" }}
            href="/site/index.html"
            target="_blank"
            rel="noreferrer"
          >
            SAIBA MAIS
          </a>
        </div>
        <div
          className="text1"
          style={{
            display: "none",
            textDecoration: "underline",
            color: "white",
            marginTop:
              window.innerWidth < mobilewidth && viewalterarsenha == 1 ? 20 : 0,
          }}
          onClick={() => {
            if (viewalterarsenha == 1) {
              setviewalterarsenha(0);
              setviewlistaunidades(1);
            } else {
              setviewalterarsenha(1);
              setviewlistaunidades(0);
            }
          }}
        >
          ALTERAR SENHA
        </div>
        <Inputs></Inputs>
        <div
          style={{
            display: usuario.tipo_usuario != 'CLIENTE' ? 'flex' : 'none',
            flexDirection: 'column', justifyContent: 'center',
          }}>
          <ListaDeUnidadesAssistenciais></ListaDeUnidadesAssistenciais>
          <ListaDeUnidadesDeApoio></ListaDeUnidadesDeApoio>
        </div>
        <div
          style={{
            display: usuario.tipo_usuario == 'CLIENTE' && viewcliente == 1 ? 'flex' : 'none',
            flexDirection: 'column', justifyContent: 'center',
          }}>
          <div
            className="button"
            style={{
              display: "flex",
              padding: 10,
              margin: 5,
              minWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              maxWidth: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              height: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              minHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              maxHeight: window.innerWidth < mobilewidth ? "30vw" : "15vw",
              color: 'white',
              alignSelf: 'center',
            }}
            onClick={() => {
              setpagina('cliente');
              history.push("/cliente");
            }}
          >
            ACESSAR MEU PRONTUÁRIO
          </div>
        </div>
        <CriarSenha></CriarSenha>
        <AlterarSenha></AlterarSenha>
        <div style={{
          display: viewlistaunidades == 0 ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'center',
          width: '100%', alignContent: 'center', alignItems: 'center',
          marginTop: 20,
          position: 'absolute',
          bottom: 5
        }}>
          <Logo href="/site/index.html" target="_blank" rel="noreferrer" height={40} width={40}></Logo>
          <div
            className="text2"
            style={{
              display:
                window.innerWidth < mobilewidth && viewalterarsenha == 1
                  ? "none"
                  : "flex",
              fontSize: 8,

            }}
          >
            PULSAR
          </div>
        </div>
      </div>
    </div >
  );
}

export default Login;
