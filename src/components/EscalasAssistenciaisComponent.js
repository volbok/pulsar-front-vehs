/* eslint eqeqeq: "off" */
import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import Context from '../pages/Context';
// imagens.
import salvar from '../images/salvar.svg';
import deletar from "../images/deletar.svg";

function EscalasAssistenciaisComponent() {

  // context.
  const {
    html,
    card,
    paciente,
  } = useContext(Context);

  const [listaescalas, setlistaescalas] = useState([]);
  const loadEscalas = () => {
    axios.get(html + 'list_escalas_assistenciais/' + paciente).then((response) => {
      setlistaescalas(response.data.rows);
    })
  }

  useEffect(() => {
    if (card == 'card-escalas_assistenciais') {
      loadEscalas();
    }
    // eslint-disable-next-line
  }, [card, paciente]);

  let arrayscale = [];
  const escalaselector = (escala, pergunta, alternativas) => {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
      }}>
        <div className="text1" style={{ marginTop: 20 }}>{pergunta}</div>
        <div id={"lista de alternativas: " + pergunta}
          style={{
            display: 'flex', flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          {
            // eslint-disable-next-line
            alternativas.map(item => (
              <div id={"alternativa: " + pergunta + ' - ' + item.resposta}
                className="button"
                style={{ padding: 10 }}
                onClick={() => {
                  let obj =
                  {
                    escala: escala,
                    pergunta: pergunta,
                    resposta: item.resposta,
                    valor: item.valor
                  }
                  if (arrayscale.filter(valor => valor.pergunta == pergunta && valor.resposta == item.resposta).length > 0) {
                    arrayscale.pop();
                    document.getElementById("alternativa: " + pergunta + ' - ' + item.resposta).className = "button"
                  } else {
                    arrayscale.push(obj);
                    document.getElementById("alternativa: " + pergunta + ' - ' + item.resposta).className = "button-selected"
                  }
                  console.log(arrayscale);
                }}
              >
                {item.resposta}
              </div>
            ))
          }
        </div>
      </div>
    )
  }
  const escalasoma = (escala) => {
    let valor = 0;
    console.log(arrayscale);
    arrayscale.filter(item => item.escala == escala).map(item => valor = valor + item.valor);
    let obj = {
      id_paciente: paciente,
      escala: escala,
      data: moment(),
      valor: valor,
    }
    console.log(valor);
    axios.post(html + "insert_escala_assistencial", obj).then(() => {
      loadEscalas();
    });
  }

  const deleteEscala = (id) => {
    axios.get(html + 'delete_escala_assistencial/' + id).then(() => {
      loadEscalas();
    });
  }

  const [escala, setescala] = useState(null);

  /* 
  MNA: mini escala nutricional.
  GDS: depressão no idoso.
  MORSE: risco de queda.
  */

  const arrayescalas = ['MNA', 'DEPRESSÃO', 'MORSE']
  function EscalaOpcoes() {
    return (
      <div className="grid3"
        style={{
          flexDirection: 'row', flexWrap: 'wrap',
          padding: 5, backgroundColor: 'white', borderRadius: 5
        }}>
        {arrayescalas.map((item) => (
          <div className={escala == item ? "button-selected" : "button"}
            style={{ flexGrow: 'inherit' }}
            onClick={() => setescala(item)}
          >
            {item}
          </div>
        ))}
      </div>
    )
  }

  function ViewEscalas() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {arrayescalas.map(item => (
          <div style={{ display: item == escala ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="text2" style={{ fontSize: 20, margin: 10 }}>{item}</div>
            <div className="scroll" style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap',
              minHeight: 220, width: '100%',
            }}>
              {listaescalas.filter(valor => valor.escala == item).map(valor => (
                <div className="button"
                  style={{
                    position: 'relative',
                    minWidth: 100, minHeight: 100, maxWidth: 100, maxHeight: 100,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  }}>
                  <div>{valor.escala}</div>
                  <div>{valor.valor}</div>
                  <div>{moment(valor.data).format('DD/MM/YY')}</div>
                  <div className="button red"
                    style={{
                      position: 'absolute', bottom: -10, right: -10, padding: 5,
                      maxWidth: 20, maxHeight: 20, minWidth: 20, minHeight: 20
                    }}
                    onClick={() => deleteEscala(valor.id)}
                  >
                    <img
                      alt=""
                      src={deletar}
                      style={{
                        margin: 10,
                        height: 20,
                        width: 20,
                      }}
                    ></img>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ESCALA MINI NUTRICIONAL ASSESSMENT (MNA)
  let MNA_pergunta1 = [
    {
      escala: 'MNA',
      resposta: 'DIMINUIÇÃO GRAVE DA INGESTA',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'DIMINUIÇÃO MODERADA DA INGESTA',
      valor: 1
    },
    {
      escala: 'MNA',
      resposta: 'SEM DIMINUIÇÃO DA INGESTA',
      valor: 2
    },
  ]
  let MNA_pergunta2 = [
    {
      escala: 'MNA',
      resposta: 'SUPERIOR A 3KG',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'NÃO SABE INFORMAR',
      valor: 1
    },
    {
      escala: 'MNA',
      resposta: 'ENTRE 1 E 3KG',
      valor: 2
    },
    {
      escala: 'MNA',
      resposta: 'SEM PERDA DE PESO',
      valor: 3
    },
  ]
  let MNA_pergunta3 = [
    {
      escala: 'MNA',
      resposta: 'RESTRITO AO LEITO OU À CADEIRA DE RODAS',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'DEAMBULA, MAS NÃO É CAPAZ DE SAIR DE CASA',
      valor: 1
    },
    {
      escala: 'MNA',
      resposta: 'NORMAL',
      valor: 2
    },
  ]
  let MNA_pergunta4 = [
    {
      escala: 'MNA',
      resposta: 'SIM',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'NÃO',
      valor: 1
    },
  ]
  let MNA_pergunta5 = [
    {
      escala: 'MNA',
      resposta: 'DEMÊNCIA OU DEPRESSÃO GRAVE',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'DEMÊNCIA LIGEIRA',
      valor: 1
    },
    {
      escala: 'MNA',
      resposta: 'SEM PROBLEMAS PSICOLÓGICOS',
      valor: 2
    },
  ]
  let MNA_pergunta6 = [
    {
      escala: 'MNA',
      resposta: 'IMC < 19',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'IMC DE 19 A 20',
      valor: 1
    },
    {
      escala: 'MNA',
      resposta: 'IMC DE 21 A 22',
      valor: 2
    },
    {
      escala: 'MNA',
      resposta: 'IMC > 22',
      valor: 3
    },
  ]
  let MNA_pergunta7 = [
    {
      escala: 'MNA',
      resposta: 'SIM',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'NÃO',
      valor: 1
    },
  ]
  let MNA_pergunta8 = [
    {
      escala: 'MNA',
      resposta: 'SIM',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'NÃO',
      valor: 1
    },
  ]
  let MNA_pergunta9 = [
    {
      escala: 'MNA',
      resposta: 'SIM',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'NÃO',
      valor: 1
    },
  ]
  let MNA_pergunta10 = [
    {
      escala: 'MNA',
      resposta: 'UMA REFEIÇÃO',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'DUAS REFEIÇÕES',
      valor: 1
    },
    {
      escala: 'MNA',
      resposta: 'TRÊS REFEIÇÕES',
      valor: 2
    },
  ]
  let MNA_pergunta11 = [
    {
      escala: 'MNA',
      resposta: 'PELO MENOS UMA PORÇÃO DIÁRIA DE LEITE OU DERIVADOS?',
      valor: 0.5
    },
    {
      escala: 'MNA',
      resposta: 'DUAS OU MAIS PORÇÕES SEMANAIS DE LEGUMINOSAS OU OVOS?',
      valor: 0.5
    },
    {
      escala: 'MNA',
      resposta: 'CARNE, PEIXE OU AVES TODOS OS DIAS?',
      valor: 0.5
    },
  ]
  let MNA_pergunta12 = [
    {
      escala: 'MNA',
      resposta: 'NÃO',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'SIM',
      valor: 1
    },
  ]
  let MNA_pergunta13 = [
    {
      escala: 'MNA',
      resposta: 'MENOS DE TRÊS COPOS',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'TRÊS A CINCO COPOS',
      valor: 0.5
    },
    {
      escala: 'MNA',
      resposta: 'MAIS DE CINCO COPOS',
      valor: 1
    },
  ]
  let MNA_pergunta14 = [
    {
      escala: 'MNA',
      resposta: 'NÃO É CAPAZ DE ALIMENTAR-SE SOZINHO',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'ALIMENTA-SE SOZINHO, PORÉM COM DIFICULDADE',
      valor: 1
    },
    {
      escala: 'MNA',
      resposta: 'ALIMENTA-SE SOZINHO, SEM DIFICULDADE',
      valor: 2
    },
  ]
  let MNA_pergunta15 = [
    {
      escala: 'MNA',
      resposta: 'ACREDITA ESTAR DESNUTRIDO',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'NÃO SABE DIZER',
      valor: 1
    },
    {
      escala: 'MNA',
      resposta: 'ACREDITA NÃO TER PROBLEMA NUTRICIONAL',
      valor: 2
    },
  ]
  let MNA_pergunta16 = [
    {
      escala: 'MNA',
      resposta: 'PIOR',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'NÃO SABE',
      valor: 0.5
    },
    {
      escala: 'MNA',
      resposta: 'IGUAL',
      valor: 1
    },
    {
      escala: 'MNA',
      resposta: 'MELHOR',
      valor: 2
    },
  ]
  let MNA_pergunta17 = [
    {
      escala: 'MNA',
      resposta: 'PB < 21',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'PB > 20 E < 23',
      valor: 0.5
    },
    {
      escala: 'MNA',
      resposta: 'PB > 22',
      valor: 1
    },
  ]
  let MNA_pergunta18 = [
    {
      escala: 'MNA',
      resposta: 'PP < 31',
      valor: 0
    },
    {
      escala: 'MNA',
      resposta: 'PP > 30',
      valor: 1
    },
  ]
  function EscalaMNA() {
    return (
      <div style={{ display: escala == 'MNA' ? 'flex' : 'none', flexDirection: 'column', alignContent: 'center', alignSelf: 'center' }}>
        <div className="text2" style={{ fontSize: 14, marginTop: 20 }}>{'MINI ESCALA NUTRICIONAL (MINI NUTRICIONAL ASSESSMENT)'}</div>
        {escalaselector('MNA', 'NOS ÚLTIMOS 3 MESES, HOUVE DIMINUIÇÃO DA INGESTA ALIMENTAR DEVIDO A PERDA DE APETITE, PROBLEMAS DIGESTIVOS OU DIFICULDADE PARA MASTIGAR OU DEGLUTIR?', MNA_pergunta1)}
        {escalaselector('MNA', 'PERDA DE PESO NOS ÚLTIMOS 3 MESES', MNA_pergunta2)}
        {escalaselector('MNA', 'MOBILIDADE', MNA_pergunta3)}
        {escalaselector('MNA', 'PASSOU POR ALGUM STRESS PSICOLÓGICO OU DOENÇA AGUDA NOS ÚLTIMOS 3 MESES?', MNA_pergunta4)}
        {escalaselector('MNA', 'PROBLEMAS NEUROPSICOLÓGICOS', MNA_pergunta5)}
        {escalaselector('MNA', 'ÍNDICE DE MASSA CORPORAL - IMC', MNA_pergunta6)}
        {escalaselector('MNA', 'O PACIENTE VIVE NA SUA PRÓPRIA CASA?', MNA_pergunta7)}
        {escalaselector('MNA', 'UTILIZA MAIS DE 3 MEDICAMENTOS DIFERENTES POR DIA?', MNA_pergunta8)}
        {escalaselector('MNA', 'LESÕES DE PELE OU ESCARAS?', MNA_pergunta9)}
        {escalaselector('MNA', 'QUANTAS REFEIÇÕES FAZ POR DIA?', MNA_pergunta10)}
        {escalaselector('MNA', 'O PACIENTE CONSOME:', MNA_pergunta11)}
        {escalaselector('MNA', 'O PACIENTE CONSOME DUAS OU MAIS PORÇÕES DIÁRIAS DE FRUTA OU PRODUTOS HORTÍCOLAS?', MNA_pergunta12)}
        {escalaselector('MNA', 'QUANTOS COPOS DE LÍQUIDOS O PACIENTE CONSOME POR DIA?', MNA_pergunta13)}
        {escalaselector('MNA', 'MODO DE SE ALIMENTAR?', MNA_pergunta14)}
        {escalaselector('MNA', 'O PACIENTE ACREDITA TER ALGUM PROBLEMA NUTRICIONAL?', MNA_pergunta15)}
        {escalaselector('MNA', 'EM COMPARAÇÃO COM OUTRAS PESSOAS DA MESMA IDADE, COMO CONSIDERA O PACIENTE A SUA PRÓPRIA SAÚDE?', MNA_pergunta16)}
        {escalaselector('MNA', 'PERÍMETRO BRAQUIAL (PB) EM CENTÍMETROS', MNA_pergunta17)}
        {escalaselector('MNA', 'PERÍMETRO DA PERNA (PP) EM CENTÍMETROS', MNA_pergunta18)}



        <div
          className="button"
          onClick={() => escalasoma('MNA')}
          style={{ alignSelf: 'center' }}
        >
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
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <EscalaOpcoes></EscalaOpcoes>
      <ViewEscalas></ViewEscalas>
      <div className="text1"
        style={{
          display: escala != null ? 'flex' : 'none',
          padding: 10, width: 200, marginTop: 20,
          color: 'white',
          textDecoration: 'underline'
        }}>
        PREENCHER ESCALA
      </div>
      <EscalaMNA></EscalaMNA>
    </div >
  )
}

export default EscalasAssistenciaisComponent;
