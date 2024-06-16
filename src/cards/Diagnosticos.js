/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from 'moment';
// funções.
import modal from '../functions/modal';
import Cid10 from '../functions/cid10';
// imagens.
import deletar from '../images/deletar.svg';
import novo from '../images/novo.svg';
import back from '../images/back.svg';

function Diagnosticos() {

  // context.
  const {
    html,
    setdialogo,
    diagnosticos, setdiagnosticos,
    paciente,
    card, setcard,
    mobilewidth,
    usuario,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-diagnosticos') {
      loadDiagnosticos();
    }
    // eslint-disable-next-line
  }, [card]);

  // atualizar lista de alergias.
  const loadDiagnosticos = () => {
    axios.get(html + 'list_diagnosticos/' + paciente).then((response) => {
      setdiagnosticos(response.data.rows);
    })
  }

  // deletar diagnóstico.
  const deleteDiagnostico = (id) => {
    axios.get(html + 'delete_diagnostico/' + id).then(() => {
      loadDiagnosticos();
    })
  }

  // inserir diagnóstico.
  const insertDiagnostico = (cid, descricao) => {
    var obj = {
      id_paciente: paciente,
      cid: cid,
      diagnostico: descricao.toUpperCase(),
      data: moment(),
      profissional: usuario.nome_usuario,
    }
    console.log(obj);
    axios.post(html + 'insert_diagnostico', obj).then(() => {
      loadDiagnosticos();
      setviewseletorcid10(0);
    })
  }

  // SELEÇÃO DE CID PARA ATESTADO MÉDICO.
  const [viewseletorcid10, setviewseletorcid10] = useState(0);
  function SeletorCid10() {
    const [cid10] = useState(Cid10());
    const [arraycid10, setarraycid10] = useState([]);
    // filtro de paciente por nome.
    function FilterCid10() {
      var timeout = null;
      var searchcid10 = "";
      const [filtercid10, setfiltercid10] = useState("");
      const filterCid10 = () => {
        clearTimeout(timeout);
        searchcid10 = document.getElementById("inputCid10").value;
        document.getElementById("inputCid10").focus();
        timeout = setTimeout(() => {
          if (searchcid10 == "") {
            searchcid10 = "";
            setarraycid10([]);
            document.getElementById("inputCid10").value = "";
            setTimeout(() => {
              document.getElementById("inputCid10").focus();
            }, 100);
          } else {
            setfiltercid10(searchcid10);
            setTimeout(() => {
              setarraycid10(cid10.filter((item) => item.DESCRICAO.toUpperCase().includes(searchcid10) || item.DESCRICAO.includes(searchcid10)));
              document.getElementById("inputCid10").value = searchcid10;
              document.getElementById("inputCid10").focus();
            }, 100);
          }
        }, 1000);
      };
      return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
          <input
            className="input"
            autoComplete="off"
            placeholder={
              window.innerWidth < mobilewidth ? "BUSCAR DOENÇA..." : "BUSCAR..."
            }
            onFocus={(e) => (e.target.placeholder = "")}
            onBlur={(e) =>
              window.innerWidth < mobilewidth
                ? (e.target.placeholder = "BUSCAR DOENÇA...")
                : "BUSCAR..."
            }
            onKeyUp={() => filterCid10()}
            type="text"
            id="inputCid10"
            maxLength={100}
            defaultValue={filtercid10}
            style={{ width: '100%' }}
          ></input>
        </div>
      );
    }
    return (
      <div
        style={{ display: viewseletorcid10 == 1 ? 'flex' : 'none' }}
        className='fundo' onClick={() => setviewseletorcid10(0)}>
        <div
          className='janela scroll'
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            width: window.innerWidth < mobilewidth ? '90vw' : '40vw',
            height: window.innerWidth < mobilewidth ? '90vh' : '70vh'
          }}>
          <FilterCid10></FilterCid10>
          {arraycid10.map(item => (
            <div className='button'
              style={{ width: 'calc(100% - 20px)' }}
              onClick={() => {
                localStorage.setItem("cid", item.CAT);
                localStorage.setItem("diagnostico", item.DESCRICAO.toUpperCase());
                setTimeout(() => {
                  insertDiagnostico(item.CAT, item.DESCRICAO);
                  setviewseletorcid10(0);
                }, 200);
              }}
            >
              {item.CAT + ' - ' + item.DESCRICAO.toUpperCase()}
            </div>
          ))}
        </div>
      </div >
    )
  }

  function Botoes() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
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
          <div id="btninputdiagnostico"
            className='button-green'
            onClick={(e) => { setviewseletorcid10(1); e.stopPropagation() }}
            style={{
              display: 'flex',
              alignSelf: 'center',
            }}
          >
            <img
              alt=""
              src={novo}
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
    <div id="scroll-diagnosticos"
      className='card-aberto'
      style={{ display: card == 'card-diagnosticos' ? 'flex' : 'none' }}
    >
      <div className="text3">DIAGNÓSTICOS</div>
      <Botoes></Botoes>
      <div
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          flexWrap: 'wrap', width: '100%'
        }}>
        {diagnosticos.map(item => (
          <div className='button' key={'alergia ' + item.id_alergia}
            style={{ width: 200, maxWidth: 200 }}>
            <div style={{ width: '100%' }}>
              {item.cid + ' - ' + item.diagnostico}
            </div>
            <div className='button-yellow'
              style={{ width: 25, minWidth: 25, height: 25, minHeight: 25 }}
              onClick={(e) => {
                modal(setdialogo, 'CONFIRMAR EXCLUSÃO DO DIAGNÓSTICO ' + item.diagnostico + '?', deleteDiagnostico, item.id);
                e.stopPropagation();
              }}>
              <img
                alt=""
                src={deletar}
                style={{
                  margin: 10,
                  height: 25,
                  width: 25,
                }}
              ></img>
            </div>
          </div>
        ))}
      </div>
      <SeletorCid10></SeletorCid10>
    </div>
  )
}

export default Diagnosticos;
