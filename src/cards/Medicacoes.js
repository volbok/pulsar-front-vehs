/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
// funcoes.
import modal from '../functions/modal';
// imagens.
import back from '../images/back.svg';
import novo from '../images/novo.svg';
import salvar from '../images/salvar.svg';
import deletar from "../images/deletar.svg";

function Medicacoes() {

  // context.
  const {
    card, setcard,
    paciente,
    html,
    setdialogo,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-receita') {
      loadMedicacoes();
    }
    // eslint-disable-next-line
  }, [card, paciente]);

  const [medicacoes, setmedicacoes] = useState([]);
  const loadMedicacoes = () => {
    axios.get(html + 'list_medicamentos/' + paciente).then((response) => {
      console.log(response.data.rows);
      setmedicacoes(response.data.rows);
    })
  }

  const mounthora = (hora) => {
    return (
      <div style={{
        display: medicacoes.filter(item => item.hora == hora).length > 0 ? 'flex' : 'none',
        margin: 20,
        flexDirection: 'column', backgroundColor: 'white', borderRadius: 5, padding: 10
      }}>
        <div className='text1' style={{ fontSize: 20 }}>{'HORÁRIO: ' + hora}</div>
        <div className='grid3'>
          {medicacoes.filter(item => item.hora == hora).map((item) => (
            <div className='button' style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              position: 'relative', flexGrow: 'inherit', height: 150
            }}>
              <div>{item.medicamento}</div>
              <div>{item.quantidade + ' ' + item.tipo}</div>
              <div>{item.observacoes}</div>
              <div>{item.hora}</div>
              <div id="btn deletar medicamento"
                title="EXCLUIR MEDICAÇÃO"
                className="button orange"
                onClick={() => {
                  modal(
                    setdialogo,
                    "TEM CERTEZA QUE DESEJA EXCLUIR A MEDICAÇÃO?",
                    deleteMedicacao,
                    item.id
                  );
                }}
                style={{ width: 25, minWidth: 25, height: 25, minHeight: 25, position: 'absolute', bottom: -10, right: -10 }}
              >
                <img
                  alt=""
                  src={deletar}
                  style={{
                    margin: 5,
                    height: 20,
                    width: 20,
                  }}
                ></img>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const arrayhora = ['1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h', '0h']
  function Receita() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {arrayhora.map((item) => mounthora(item))}
      </div>
    )
  }

  const insertMedicacao = () => {
    let obj = {
      id_paciente: paciente,
      medicamento: document.getElementById("inputNomeMedicacao").value.toUpperCase(),
      hora: document.getElementById("inputHoraMedicacao").value.toUpperCase(),
      observacoes: document.getElementById("inputObservacoesMedicacao").value.toUpperCase(),
      quantidade: document.getElementById("inputQtdeMedicacao").value.toUpperCase(),
      tipo: document.getElementById("inputTipoMedicacao").value.toUpperCase(),
    }
    axios.post(html + 'insert_medicamento', obj).then(() => {
      console.log('MEDICAÇÃO REGISTRADA COM SUCESSO.');
      loadMedicacoes();
    })
  }

  const deleteMedicacao = (id) => {
    axios.get(html + 'delete_medicamento/' + id).then(() => {
      loadMedicacoes();
    })
  }

  // falta componente (formulário) para inserir a medicação.
  const [viewinsertmedicacao, setviewinsertmedicacao] = useState(0);
  function InsertMedicacao() {
    return (
      <div className="fundo"
        style={{ display: viewinsertmedicacao == 1 ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}
        onClick={() => setviewinsertmedicacao(0)}
      >
        <div className="janela" onClick={(e) => e.stopPropagation()}>
          <div id="NOME DA MEDICAÇÃO"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="text1">NOME DA MEDICAÇÃO</div>
            <textarea
              autoComplete="off"
              placeholder="NOME DO PACIENTE"
              className="textarea"
              type="text"
              id="inputNomeMedicacao"
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "NOME DA MEDICAÇÃO")}
              style={{
                flexDirection: "center",
                justifyContent: "center",
                alignSelf: "center",
                width: 400,
                padding: 15,
                height: 20,
                minHeight: 20,
                maxHeight: 20,
              }}
            ></textarea>
          </div>
          <div id="HORA DE ADMINISTRAÇÃO"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="text1">HORA DE ADMINISTRAÇÃO</div>
            <textarea
              autoComplete="off"
              placeholder="HORA"
              className="textarea"
              type="text"
              id="inputHoraMedicacao"
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "HORA DA MEDICAÇÃO")}
              style={{
                flexDirection: "center",
                justifyContent: "center",
                alignSelf: "center",
                width: 40,
                padding: 15,
                height: 20,
                minHeight: 20,
                maxHeight: 20,
              }}
            ></textarea>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div id="QUANTIDADE"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">QUANTIDADE</div>
              <textarea
                autoComplete="off"
                placeholder="QTDE"
                className="textarea"
                type="text"
                id="inputQtdeMedicacao"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "QTDE")}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: 40,
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
            <div id="TIPO"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="text1">TIPO</div>
              <textarea
                autoComplete="off"
                placeholder="TIPO"
                className="textarea"
                type="text"
                id="inputTipoMedicacao"
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "TIPO")}
                style={{
                  flexDirection: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  width: 40,
                  padding: 15,
                  height: 20,
                  minHeight: 20,
                  maxHeight: 20,
                }}
              ></textarea>
            </div>
          </div>
          <div id="OBSERVAÇÕES"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="text1">OBSERVAÇÕES</div>
            <textarea
              autoComplete="off"
              placeholder="OBSERVAÇÕES"
              className="textarea"
              type="text"
              id="inputObservacoesMedicacao"
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "OBSERVAÇÕES")}
              style={{
                flexDirection: "center",
                justifyContent: "center",
                alignSelf: "center",
                width: 400,
                padding: 15,
                height: 20,
                minHeight: 20,
                maxHeight: 20,
              }}
            ></textarea>
          </div>
          <div id="botão para salvar a medicação"
            className='button-green'
            style={{
              display: 'flex',
              alignSelf: 'center',
            }}
            onClick={() => insertMedicacao()}>
            <img
              alt=""
              src={salvar}
              style={{
                margin: 10,
                height: 25,
                width: 25,
              }}
            ></img>
          </div>
        </div>
      </div>
    )
  }

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
        <div id="btninsertmedicacao"
          className='button-green'
          onClick={(e) => { setviewinsertmedicacao(1); e.stopPropagation() }}
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
    );
  }

  return (
    <div id="scroll-receita"
      className='card-aberto'
      style={{ display: card == 'card-receita' ? 'flex' : 'none' }}
    >
      <div className="text3">
        MEDICAMENTOS
      </div>
      <div
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-start',
          flex: 1
        }}>
        <Receita></Receita>
        <InsertMedicacao></InsertMedicacao>
        <Botoes></Botoes>
      </div>
    </div >
  )
}

export default Medicacoes;