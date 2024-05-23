/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Context from "./Context";
import moment from "moment";
import back from "../images/back.svg";
import emojihappy from "../images/emojihappy.svg";
import emojineutral from "../images/emojineutral.svg";
import emojisad from "../images/emojisad.svg";

// router.
import { useHistory } from "react-router-dom";

function Cliente() {
  // context.
  const {
    html,
    pagina,
    setpagina,
    setatendimentos, atendimentos,
    toast, settoast,
    mobilewidth,
    setpacientes,
    pacientes,
    usuario,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  const [selectdate, setselectdate] = useState(null);
  useEffect(() => {
    if (pagina == 'cliente') {
      currentMonth();
      loadPacientes();
      // loadAtendimentos();
    }

    // eslint-disable-next-line
  }, [pagina]);

  const loadPacientes = () => {
    console.log(localStorage.getItem('documento'));
    axios.get(html + "list_pacientes").then((response) => {
      var x = response.data.rows;
      setpacientes(x.filter(item => item.numero_documento == localStorage.getItem('documento')));
      console.log(x.filter(item => item.numero_documento == localStorage.getItem('documento')));
      loadAtendimentos(x.filter(item => item.numero_documento == localStorage.getItem('documento')).map(item => item.id_paciente).pop());
    });
  }

  const loadAtendimentos = (id_paciente) => {
    axios
      .get(html + "all_atendimentos")
      .then((response) => {
        let x = response.data.rows;
        setatendimentos(x.filter(item => item.id_paciente == id_paciente));
        console.log(x.filter(item => item.id_paciente == id_paciente));
      })
      .catch(function (error) {
        if (error.response == undefined) {
          console.log(error.response);
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

  // card de boas vindas.
  const [faceselected, setfaceselected] = useState(null);
  const [viewmessage, setviewmessage] = useState(0);
  function BoasVindas() {
    return (
      <div style={{
        display: viewmessage == 0 && viewmenucliente == 0 ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div className="text2" style={{ fontSize: 20 }}>{'OLÁ, ' + usuario.nome_usuario + '!'}</div>
        <div className="text2">COMO VOCÊ ESTÁ SE SENTINDO HOJE?</div>
        <div id='emoji selector'
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
        >
          <div
            id="sad"
            style={{
              display: "flex",
              opacity: 1,
              alignSelf: "center",
              backgroundColor: '#EC7063',
              borderRadius: 5,
              margin: 2.5
            }}
            onClick={() => { setfaceselected('sad'); setviewmessage(1) }}
          >
            <img alt="" src={emojisad} style={{ width: 70, height: 70 }}></img>
          </div>
          <div
            id="neutral"
            style={{
              display: "flex",
              opacity: 1,
              alignSelf: "center",
              backgroundColor: '#F7DC6F',
              borderRadius: 5,
              margin: 2.5
            }}
            onClick={() => { setfaceselected('neutral'); setviewmessage(2) }}
          >
            <img alt="" src={emojineutral} style={{ width: 70, height: 70 }}></img>
          </div>
          <div
            id="happy"
            style={{
              display: "flex",
              opacity: 1,
              alignSelf: "center",
              backgroundColor: 'rgb(82, 190, 128, 1)',
              borderRadius: 5,
              margin: 2.5
            }}
            onClick={() => { setfaceselected('happy'); setviewmessage(3) }}
          >
            <img alt="" src={emojihappy} style={{ width: 70, height: 70 }}></img>
          </div>
        </div>
      </div>
    )
  }
  function Message() {
    return (
      <div style={{
        display: viewmessage != 0 && viewmenucliente == 0 ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div
          id="emoji selected"
          style={{
            display: "flex",
            opacity: 1,
            alignSelf: "center",
            backgroundColor: faceselected == 'sad' ? '#EC7063' : faceselected == 'neutral' ? '#F7DC6F' : 'rgb(82, 190, 128, 1)',
            borderRadius: 5,
          }}
          onClick={() => { setfaceselected(null); setviewmessage(0) }}
        >
          <img alt="" src={faceselected == 'sad' ? emojisad : faceselected == 'neutral' ? emojineutral : emojihappy}
            style={{ width: 60, height: 60 }}></img>
        </div>
        <div className="text2">
          {faceselected == 'sad' ? 'QUE PENA... DIGA-ME O QUE HÁ DE ERRADO E VAMOS TENTAR TE AJUDAR!' : faceselected == 'neutral' ? 'TUDO BEM! CONTE-NOS O QUE SENTE E PODEMOS TENTAR MELHORAR O SEU DIA!' : 'QUE MARAVILHA! COMPARTILHE CONOSCO O QUE ESTÁ BOM PARA CONTINUARMOS NO CAMINHO CERTO!'}
        </div>
        <textarea
          autoComplete="off"
          placeholder="MENSAGEM PARA A EQUIPE ASSISTENCIAL"
          className="textarea"
          type="text"
          id="inputFeedbackMessage"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "MENSAGEM PARA A EQUIPE ASSISTENCIAL")}
          defaultValue={''}
          style={{
            flexDirection: "center",
            justifyContent: "center",
            alignSelf: "center",
            width: '80vw',
            padding: 15,
            height: 150,
            minHeight: 150,
            maxHeight: 150,
          }}
        ></textarea>
        <div
          className="button"
          onClick={() => {
            setviewmenucliente(1);
            insertFeedback();
          }}
        >
          ACESSAR MENU DO CLIENTE
        </div>
      </div>
    )
  }

  const insertFeedback = () => {
    let obj = {
      nome_paciente: pacientes.map(item => item.nome_paciente).pop(),
      dn_paciente: pacientes.map(item => item.dn_paciente).pop(),
      face: faceselected,
      comentario: document.getElementById("inputFeedbackMessage").value.toUpperCase(),
      id_pcte: pacientes.map(item => item.id_paciente).pop(),
    }
    console.log(obj);
    
    axios.post(html + 'insert_feedback', obj).then(() => {
      console.log('foi');
    })
    
  }

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
    console.log(arraydate);
  }
  // percorrendo datas do mês anterior.
  const previousMonth = () => {
    startdate.subtract(1, 'month');
    var x = moment(startdate);
    var y = moment(startdate).add(42, 'days');
    console.log(y);
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
    console.log(y);
    firstSunday(x, y);
    setArrayDate(x, y);
    setarraylist(arraydate);
    console.log(arraydate);
  }

  function DatePicker() {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="janela"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignSelf: 'center',
          padding: 7.5, marginRight: 5,
          borderRadius: 5,
          backgroundColor: 'white',
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

          <div
            className="textarea"
            id="LISTA DE DATAS"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignSelf: 'center',
              margin: 0,
              padding: 0,
              boxShadow: 'none',
              overflowX: 'auto',
              minHeight: 70,
              height: 70,
              maxHeight: 70,
              width: window.innerWidth < mobilewidth ? '85vw' : '95vw',
            }}
          >
            {arraylist.map((item) => (
              <button
                key={'dia ' + item}
                className={selectdate == item ? "button-selected" : "button"}
                onClick={(e) => {
                  setselectdate(item);
                  e.stopPropagation();
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
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const AtividadesDoDia = useCallback(() => {
    return (
      <div
        className="fadein"
        style={{
          display: 'flex',
          flexDirection: "column",
          alignSelf: "center",
        }}
      >
        <div id="scroll atendimentos com pacientes"
          className="scroll"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            height: "calc(100vh - 200px)",
            width: window.innerWidth < mobilewidth ? '85vw' : '95vw',
            marginTop: 5, marginRight: 5,
          }}
        >
          {atendimentos
            // uma lista para cada tipo de atividade...
            .filter(item => isNaN(item.situacao) && moment(item.data_inicio).format('DD/MM/YYYY') == selectdate)
            .sort((a, b) => (moment(a.data_inicio) > moment(b.data_inicio) ? 1 : -1))
            .map((item) => (
              <div key={"pacientes" + item.id_atendimento}>
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
                      fontSize: 10
                    }}>
                    {moment(item.data_inicio).format('HH:mm') + ' ÀS ' + moment(item.data_termino).format('HH:mm')}
                  </div>
                  <div className="button green"
                    style={{
                      borderRadius: 0, marginLeft: 0, borderTopRightRadius: 5, borderBottomRightRadius: 5,
                      fontSize: 10, flex: 3
                    }}
                  >
                    {item.situacao}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
    // eslint-disable-next-line
  }, [selectdate]);

  const [viewmenucliente, setviewmenucliente] = useState(0);
  function MenuCliente() {
    return (
      <div
        style={{
          display: viewmenucliente == 0 ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div className="text2">O QUE DESEJA ACESSAR?</div>
        <div className="button"
          onClick={() => { setviewmessage(4); setviewmenucliente(0) }}
        >
          PAINEL DE ATIVIDADES
        </div>
        <div className="button"
          onClick={() => { setviewmessage(5); setviewmenucliente(0) }}
        >
          DADOS VITAIS
        </div>
      </div>
    )
  }

  function Back() {
    return (
      <div className="button green"
        onClick={() => { setviewmessage(0); setviewmenucliente(1) }}
        style={{
          display: viewmessage > 3 ? 'flex' : 'none',
          marginRight: 10,
          maxWidth: 50, maxHeight: 50,
          alignSelf: 'center',
        }}>
        <img
          alt=""
          src={back}
          style={{ width: 30, height: 30 }}
        ></img>
      </div>
    )
  }

  return (
    <div
      className="main"
      style={{
        display: pagina == "cliente" ? "flex" : "none",
        flexDirection: "column",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        className="chassi"
        id="conteúdo do prontuário"
        style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly',
          alignContent: 'center',
          alignSelf: 'center',
        }}
      >
        <MenuCliente></MenuCliente>

        <div style={{
          display: viewmessage == 4 ? 'flex' : 'none',
          flexDirection: 'column', justifyContent: 'space-evenly'
        }}>
          <DatePicker></DatePicker>
          <AtividadesDoDia></AtividadesDoDia>
        </div>

        <div style={{ display: viewmessage < 4 ? 'flex' : 'none', justifyContent: 'center' }}>
          <BoasVindas></BoasVindas>
          <Message></Message>
        </div>
        <Back></Back>
      </div>
    </div>
  );
}

export default Cliente;
