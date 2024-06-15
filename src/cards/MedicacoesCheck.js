/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from 'moment';
// imagens.
import back from '../images/back.svg';
import print from '../images/imprimir.svg';
// componentes.
import Header from '../components/Header';

function MedicacoesCheck() {

  // context.
  const {
    card, setcard,
    paciente,
    html,
    setselecteddocumento,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-prescricao-easy') {
      loadMedicacoes();
      setselecteddocumento('CHECKLIST DE MEDICAÇÕES');
    }
    // eslint-disable-next-line
  }, [card, paciente]);

  const [medicacoes, setmedicacoes] = useState([]);
  const loadMedicacoes = () => {
    axios.get(html + 'list_medicamentos/' + paciente).then((response) => {
      setmedicacoes(response.data.rows);
    })
  }

  const arraydata = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  const arraydata1 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'];
  const arraydata2 = ['16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
  function TabelaDeMedicacoes() {
    return (
      <div className='scroll'
        style={{
          display: 'none', flexDirection: 'column',
          overflowX: 'scroll', overflowY: 'scroll',
          width: '60vw', height: '75vh'
        }}>
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
          width: '100%', marginLeft: 180,
        }}>
          {arraydata.map(data => (
            <div
              style={{
                display: 'flex',
                width: 100, minWidth: 100,
                borderStyle: 'solid', borderWidth: 5, borderColor: 'transparent',
                margin: 2.5, borderRadius: 5, padding: 2.5,
                fontWeight: 'bold',
              }}
            >
              {data}
            </div>
          ))}
        </div>
        <div id="medicamentos prescritos para o horário."
          style={{
            display: 'flex', flexDirection: 'column',
          }}
        >
          {medicacoes.sort((a, b) => parseInt(a.hora) > parseInt(b.hora) ? 1 : -1).map(item => (
            <div id="linha da medicação"
              style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
              }}>
              <div style={{
                display: 'flex', flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: 0, margin: 10
              }}>
                <div
                  style={{
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'flex-start',
                    width: 150, height: '100%',
                    borderStyle: 'solid', borderWidth: 5, borderColor: '#66b2b280',
                    backgroundColor: '#66b2b280',
                    margin: 2.5, borderRadius: 5, padding: 2.5,
                    fontWeight: 'bold', color: 'white', fontSize: 12,
                  }}>
                  <div>{item.medicamento}</div>
                  <div>{item.quantidade + ' ' + item.tipo + ' ÀS ' + item.hora + 'H'}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {arraydata.map(data => (
                    <div
                      style={{
                        display: 'flex', flexDirection: 'flex-start',
                        width: 100, height: '100%',
                        borderStyle: 'solid', borderWidth: 5, borderColor: '#66b2b280',
                        margin: 2.5, borderRadius: 5, padding: 2.5,
                        color: 'gray', fontSize: 12,
                      }}
                    >
                      {data}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    )
  }

  // IMPRESSÃO DO DOCUMENTO.
  function printDiv(periodo) {
    console.log('PREPARANDO DOCUMENTO PARA IMPRESSÃO');
    if (periodo == 1) {
      let printdocument = document.getElementById("IMPRESSÃO - CHECKLIST DE MEDICAÇÕES 1").innerHTML;
      var a = window.open();
      a.document.write('<html>');
      a.document.write(printdocument);
      a.document.write('</html>');
      a.print();
      a.close();
    } else {
      let printdocument = document.getElementById("IMPRESSÃO - CHECKLIST DE MEDICAÇÕES 2").innerHTML;
      a = window.open();
      a.document.write('<html>');
      a.document.write(printdocument);
      a.document.write('</html>');
      a.print();
      a.close();
    }
  }
  function PrintDocumento1() {
    return (
      <div id="IMPRESSÃO - CHECKLIST DE MEDICAÇÕES 1"
        className="print"
      >
        <table style={{ width: '100%', breakInside: 'auto' }}>
          <thead style={{ width: '100%' }}>
            <tr style={{ width: '100%' }}>
              <td style={{ width: '100%' }}>
                <Header></Header>
              </td>
            </tr>
          </thead>
          <tbody style={{ width: '100%' }}>
            <tr style={{ width: '100%' }}>
              <td style={{ width: '100%' }}>
                <div id="checklist"
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignSelf: 'center',
                    width: '100%', height: '100%',
                    fontFamily: 'Helvetica',
                    breakInside: 'auto',
                    whiteSpace: 'pre-wrap',
                  }}>
                  <div>{selectedmes.toUpperCase()}</div>
                  <div id="PRIMEIROS 15 DIAS"
                    style={{
                      display: 'flex', flexDirection: 'column',
                      breakInside: 'auto',
                    }}>
                    <div style={{
                      display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
                      width: '100%', marginLeft: 162,
                    }}>
                      {arraydata1.map(data => (
                        <div
                          style={{
                            display: 'flex',
                            borderStyle: 'solid', borderColor: 'transparent',
                            width: 72, borderWidth: 1, margin: 1, borderRadius: 5, padding: 5,
                            fontWeight: 'bold',
                          }}
                        >
                          {data}
                        </div>
                      ))}
                    </div>
                    <div id="medicamentos prescritos para o horário."
                      style={{
                        display: 'flex', flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      {medicacoes.sort((a, b) => parseInt(a.hora) > parseInt(b.hora) ? 1 : -1).map(item => (
                        <div id="linha da medicação"
                          style={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
                            height: '100%',
                            fontSize: 14,
                            breakInside: 'avoid',
                          }}>
                          <div style={{
                            display: 'flex', flexDirection: 'row',
                            justifyContent: 'flex-start',
                            padding: 0, margin: 0, height: '100%',
                          }}>
                            <div
                              style={{
                                display: 'flex', flexDirection: 'column',
                                justifyContent: 'flex-start',
                                height: '100%',
                                borderStyle: 'solid', borderColor: 'black',
                                width: 150, borderWidth: 1, margin: 1, borderRadius: 5, padding: 5,
                              }}>
                              <div>{item.medicamento}</div>
                              <div>{item.quantidade + ' ' + item.tipo}</div>
                              <div>{item.hora + 'H'}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                              {arraydata1.map(data => (
                                <div
                                  style={{
                                    display: 'flex', flexDirection: 'flex-start',
                                    borderStyle: 'solid', borderColor: 'black',
                                    width: 72, borderWidth: 1, margin: 1, borderRadius: 5, padding: 5,
                                    color: 'gray',
                                  }}
                                >
                                  {data}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 50,
                    breakInside: 'avoid',
                  }}>
                    <div style={{ marginTop: 20 }}>________________________________________________________________</div>
                    <div style={{ marginTop: 10 }}>ASSINATURA DO ENFERMEIRO RESPONSÁVEL</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  };
  function PrintDocumento2() {
    return (
      <div id="IMPRESSÃO - CHECKLIST DE MEDICAÇÕES 2"
        className="print"
      >
        <table style={{ width: '100%', breakInside: 'auto' }}>
          <thead style={{ width: '100%' }}>
            <tr style={{ width: '100%' }}>
              <td style={{ width: '100%' }}>
                <Header></Header>
              </td>
            </tr>
          </thead>
          <tbody style={{ width: '100%' }}>
            <tr style={{ width: '100%' }}>
              <td style={{ width: '100%' }}>
                <div id="checklist"
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignSelf: 'center',
                    width: '100%', height: '100%',
                    fontFamily: 'Helvetica',
                    breakInside: 'auto',
                    whiteSpace: 'pre-wrap',
                  }}>
                  <div>{selectedmes.toUpperCase()}</div>
                  <div id="ÚLTIMOS 15 DIAS"
                    style={{
                      display: 'flex', flexDirection: 'column',
                      breakInside: 'auto',
                    }}>
                    <div style={{
                      display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
                      width: '100%', marginLeft: 162,
                    }}>
                      {arraydata2.map(data => (
                        <div
                          style={{
                            display: 'flex',
                            borderStyle: 'solid', borderColor: 'transparent',
                            width: 72, borderWidth: 1, margin: 1, borderRadius: 5, padding: 5,
                            fontWeight: 'bold',
                          }}
                        >
                          {data}
                        </div>
                      ))}
                    </div>
                    <div id="medicamentos prescritos para o horário."
                      style={{
                        display: 'flex', flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      {medicacoes.sort((a, b) => parseInt(a.hora) > parseInt(b.hora) ? 1 : -1).map(item => (
                        <div id="linha da medicação"
                          style={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
                            height: '100%',
                            fontSize: 14,
                            breakInside: 'avoid',
                          }}>
                          <div style={{
                            display: 'flex', flexDirection: 'row',
                            justifyContent: 'flex-start',
                            padding: 0, margin: 0, height: '100%',
                          }}>
                            <div
                              style={{
                                display: 'flex', flexDirection: 'column',
                                justifyContent: 'flex-start',
                                height: '100%',
                                borderStyle: 'solid', borderColor: 'black',
                                width: 150, borderWidth: 1, margin: 1, borderRadius: 5, padding: 5,
                              }}>
                              <div>{item.medicamento}</div>
                              <div>{item.quantidade + ' ' + item.tipo}</div>
                              <div>{item.hora + 'H'}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                              {arraydata2.map(data => (
                                <div
                                  style={{
                                    display: 'flex', flexDirection: 'flex-start',
                                    borderStyle: 'solid', borderColor: 'black',
                                    width: 72, borderWidth: 1, margin: 1, borderRadius: 5, padding: 5,
                                    color: 'gray',
                                  }}
                                >
                                  {data}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 50,
                    breakInside: 'avoid',
                  }}>
                    <div style={{ marginTop: 20 }}>________________________________________________________________</div>
                    <div style={{ marginTop: 10 }}>ASSINATURA DO ENFERMEIRO RESPONSÁVEL</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  };

  function Botoes() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
        <div id="botão de retorno"
          className="button-yellow"
          style={{
            display: 'flex',
            alignSelf: 'center',
          }}
          onClick={() => setcard('')}>
          <img
            alt=""
            src={back}
            style={{ width: 30, height: 30 }}
          ></img>
        </div>
        <div id="botão de impressão"
          className="button-green"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
          onClick={() => printDiv(1)}>
          <img
            alt=""
            src={print}
            style={{ width: 30, height: 30 }}
          ></img>
          <div>PARTE 1</div>
        </div>
        <div id="botão de impressão"
          className="button-green"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
          onClick={() => printDiv(2)}>
          <img
            alt=""
            src={print}
            style={{ width: 30, height: 30 }}
          ></img>
          <div>PARTE 2</div>
        </div>
      </div>
    );
  }

  const [selectedmes, setselectedmes] = useState(moment().format('MMMM/YY'));
  let arraymes = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

  const [viewmesselector, setviewmesselector] = useState(0);
  function MesSelector() {
    return (
      <div className="fundo"
        style={{ display: viewmesselector == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="janela">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row', flexWrap: 'wrap'
            }}>
            {arraymes.map(item => (
              <div className='button'
                style={{ width: 200 }}
                onClick={() => { setselectedmes(moment(item, 'MMM').format('MMM/YY').toUpperCase()); setviewmesselector(0) }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="scroll-receita"
      className='card-aberto'
      style={{ display: card == 'card-prescricao-easy' ? 'flex' : 'none' }}
    >
      <div className="text3">
        MEDICAMENTOS
      </div>
      <div id="visualizador do mês a checar"
        className='button'
        style={{ width: 200, alignSelf: 'center' }}
        onClick={() => setviewmesselector(1)}
      >
        {selectedmes.toUpperCase()}
      </div>
      <div
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-start',
          flex: 1
        }}>
        <MesSelector></MesSelector>
        <div className='text2'>PARA IMPRIMIR AS PLANILHAS DE CHECAGEM DAS MEDICAÇÕES, UTILIZE OS BOTÕES ABAIXO</div>
        <TabelaDeMedicacoes></TabelaDeMedicacoes>
        <Botoes></Botoes>
        <PrintDocumento1></PrintDocumento1>
        <PrintDocumento2></PrintDocumento2>
      </div>
    </div >
  )
}

export default MedicacoesCheck;