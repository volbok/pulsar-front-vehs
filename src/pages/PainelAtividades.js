/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Context from "./Context";
import moment from "moment";
import back from "../images/back.svg";

// router.
import { useHistory } from "react-router-dom";
import selector from "../functions/selector";

function PainelAtividades() {
  // context.
  const {
    html,
    pagina,
    setpagina,
    setatendimentos, atendimentos,
    toast, settoast,
    arrayatividades,
    mobilewidth,
    setpacientes,
    pacientes,
  } = useContext(Context);

  // history (router).
  let history = useHistory();

  const [selectdate, setselectdate] = useState(null);
  useEffect(() => {
    if (pagina == 'painel_atividades') {
      currentMonth();
      loadPacientes();
      loadAtendimentos();
    }

    // eslint-disable-next-line
  }, [pagina]);


  const loadPacientes = () => {
    axios
      .get(html + "list_pacientes")
      .then((response) => {
        setpacientes(response.data.rows);
      });
  }

  const loadAtendimentos = () => {
    axios
      .get(html + "all_atendimentos")
      .then((response) => {
        let x = response.data.rows;
        setatendimentos(x);
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

  // usecallback...
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
          padding: 7.5, marginRight: 5,
          borderRadius: 5,
          backgroundColor: 'white',
          marginTop: 5,
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
                id={'dia ' + item}
                className={selectdate == item ? "button-selected" : "button"}
                onClick={(e) => {
                  setselectdate(item);
                  localStorage.setItem('selectdate', item);
                  e.stopPropagation();
                  selector("LISTA DE DATAS", 'dia ' + item, 300);
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
    // eslint-disable-next-line
  }, [arraylist, startdate]);

  const [selectedatividade, setselectedatividade] = useState(null)
  function CardsAtividades() {
    return (
      <div className="janela scroll"
        style={{
          display: selectedatividade == null ? 'flex' : 'none',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginRight: 5,
          padding: 2.5,
          alignSelf: 'center',
          marginTop: 5,
          width: '85vw',
          overflowX: 'visible',
          overflowY: 'hidden',
        }}>
        <div
          id="botão de retorno"
          className="button-yellow"
          style={{
            display: "flex",
            opacity: 1,
            alignSelf: "center",
          }}
          onClick={() => {
            setpagina(0);
            history.push("/");
          }}
        >
          <img alt="" src={back} style={{ width: 30, height: 30 }}></img>
        </div>
        {arrayatividades.map(item =>
          <div className="button" style={{
            minHeight: 100, minWidth: 100,
            width: 100
          }}
            onClick={() => setselectedatividade(item)}
          >
            {item}
          </div>
        )}
      </div>
    )
  }

  const ListaDeConsultas = useCallback(() => {
    return (
      <div
        style={{
          display: selectedatividade != null ? 'flex' : 'none',
          flexDirection: "column",
          alignSelf: "center",
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div
            id="botão de retorno"
            className="button-yellow"
            style={{
              display: "flex",
              opacity: 1,
              alignSelf: "center",
            }}
            onClick={() => {
              setpagina(0);
              history.push("/");
            }}
          >
            <img alt="" src={back} style={{ width: 30, height: 30 }}></img>
          </div>
          <div className="button"
            style={{ paddingLeft: 15, paddingRight: 15, marginLeft: 0 }}
            onClick={() => setselectedatividade(null)}
          >
            {selectedatividade}
          </div>
        </div>

        <div id="scroll atendimentos com pacientes"

          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: window.innerWidth < mobilewidth ? '85vw' : '95vw',
            marginTop: 5, marginRight: 5,
          }}
        >
          {atendimentos
            // uma lista para cada tipo de atividade...
            .filter(item => item.situacao == selectedatividade && moment(item.data_inicio).format('DD/MM/YYYY') == localStorage.getItem('selectdate'))
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
            display: atendimentos.length > 0 ? "none" : "flex",
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
  }, [selectdate, selectedatividade]);

  return (
    <div
      className="main"
      style={{
        display: pagina == "painel_atividades" ? "flex" : "none",
        flexDirection: "column",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        className="chassi"
        id="conteúdo do prontuário"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
      >
        <DatePicker></DatePicker>
        <CardsAtividades></CardsAtividades>
        <ListaDeConsultas></ListaDeConsultas>
      </div>
    </div>
  );
}

export default PainelAtividades;
