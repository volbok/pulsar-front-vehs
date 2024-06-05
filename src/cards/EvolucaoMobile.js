/* eslint eqeqeq: "off" */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
import moment from "moment";
// componentes.
import Gravador from '../components/Gravador';
// funções.
import modal from '../functions/modal';
import toast from '../functions/toast';
// imagens.
import deletar from '../images/deletar.svg';
import salvar from '../images/salvar.svg';
import novo from '../images/novo.svg';
import back from '../images/back.svg';

function EvolucaoMobile() {

  // context.
  const {
    html,
    settoast,
    setdialogo,
    paciente,
    card, setcard,
    mobilewidth,
    documentos, setdocumentos,
    usuario,
    atendimento,
    pacientes,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-evolucao-mobile') {
      loadDocumentos();
    }
    // eslint-disable-next-line
  }, [card]);

  // atualizar lista de documentos.
  const loadDocumentos = () => {
    axios.get(html + "list_documentos/" + atendimento).then((response) => {
      var x = response.data.rows;
      setdocumentos(x.sort((a, b) => moment(a.data) < moment(b.data) ? 1 : -1));
    })
  }

  // deletar documento.
  const deleteDocumento = (id) => {
    axios.get(html + 'delete_documento/' + id).then(() => {
      loadDocumentos();
    })
  }

  const insertDocumento = (texto, tipodocumento) => {
    var obj = {
      id_paciente: paciente,
      nome_paciente: pacientes.filter(item => item.id_paciente == paciente).map(item => item.nome_paciente).pop(),
      id_atendimento: atendimento,
      data: moment(),
      texto: texto,
      status: 0,
      tipo_documento: tipodocumento,
      profissional: usuario.nome_usuario,
      conselho: usuario.conselho + ': ' + usuario.n_conselho,
      id_profissional: usuario.id,
    }
    console.log(obj);
    console.log(usuario);
    axios.post(html + 'insert_documento', obj).then(() => {
      loadDocumentos();
    })
  }

  // componente para adição da evolução.
  const [viewinsertevolucao, setviewinsertevolucao] = useState();
  const InsertEvolucaoMobile = useCallback(() => {
    return (
      <div className="fundo"
        onClick={(e) => { setviewinsertevolucao(0); e.stopPropagation() }}
        style={{ display: viewinsertevolucao == 1 ? 'flex' : 'none' }}>
        <div className="janela"
          onClick={(e) => e.stopPropagation()}
          style={{ flexDirection: 'column' }}>
          <div className='text3'>EVOLUÇÃO</div>
          <textarea
            className="textarea"
            autoComplete="off"
            placeholder="EVOLUÇÃO..."
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'EVOLUÇÃO...')}
            style={{
              width: window.innerWidth < mobilewidth ? '50vw' : '80vw',
              height: window.innerWidth < mobilewidth ? '' : '50vh',
              margin: 5,
            }}
            type="text"
            id="inputEvolucao"
            maxLength={100}
          ></textarea>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div id="botão de retorno"
              className="button-yellow"
              style={{
                display: 'flex',
                alignSelf: 'center',
              }}
              onClick={() => { setviewinsertevolucao(0); setcard('') }}>
              <img
                alt=""
                src={back}
                style={{ width: 30, height: 30 }}
              ></img>
            </div>
            <div id="btnsalvarevolucao"
              className='button-green'
              onClick={() => {
                if (document.getElementById("inputEvolucao").value == '') {
                  toast(settoast, 'CAMPO DA EVOLUÇÃO EM BRANCO', '#EC7063', 2000);
                } else {
                  insertDocumento(document.getElementById("inputEvolucao").value.toUpperCase(), 'EVOLUÇÃO HOME CARE');
                  setviewinsertevolucao(0);
                }
              }}
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
          </div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  }, [viewinsertevolucao]);

  // registro de evolução por voz.
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
          <Gravador funcao={insertDocumento} continuo={false} ></Gravador>
          <div id="btninputevolucao"
            className='button-green'
            onClick={(e) => { setviewinsertevolucao(1); e.stopPropagation() }}
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
    <div id="scroll-evoluções"
      className='card-aberto'
      style={{ display: card == 'card-evolucao-mobile' ? 'flex' : 'none' }}
    >
      <div className="text3">EVOLUÇÕES</div>
      <Botoes></Botoes>
      <div
        id="lista de evoluções mobile"
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          flexWrap: 'wrap', width: '100%'
        }}>
        {documentos.filter(item => item.tipo_documento == 'EVOLUÇÃO HOME CARE' || item.tipo_documento == 'EVOLUÇÃO').map(item => (
          <div className='button' key={'evolução ' + item.id}
            style={{
              width: '90vw', maxWidth: '90vw',
              display: 'flex', flexDirection: 'column',
            }}
            onClick={() => {
              if (document.getElementById('doc ' + item.id).style.display == 'flex') {
                document.getElementById('doc ' + item.id).style.display = 'none';
              } else {
                document.getElementById('doc ' + item.id).style.display = 'flex';
              }
            }}
          >
            <div className='button red'
              style={{ width: '95%', height: 30, maxHeight: 30, minHeight: 30 }}>
              {moment(item.data).format('DD/MM/YY - HH:mm')}
            </div>
            <div style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}>
              <div style={{ marginLeft: 5 }}>{item.profissional + ' - ' + item.conselho}</div>
              <div className='button-yellow'
                style={{
                  display: usuario.id == item.id_profissional ? 'flex' : 'none',
                  width: 25, minWidth: 25, height: 25, minHeight: 25
                }}
                onClick={(e) => {
                  modal(setdialogo, 'CONFIRMAR EXCLUSÃO DA EVOLUÇÃO ?', deleteDocumento, item.id);
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

            <div id={'doc ' + item.id}
              className='textarea'
              style={{
                display: 'none', backgroundColor: 'white', borderRadius: 5,
                width: 'calc(100% - 30px)',
                height: '50vh',
                marginTop: 10,
                textAlign: 'left',
                alignItems: 'flex-start'
              }}>
              {item.texto}
            </div>
          </div>
        ))}
      </div>
      <InsertEvolucaoMobile></InsertEvolucaoMobile>
    </div >
  )
}

export default EvolucaoMobile;
