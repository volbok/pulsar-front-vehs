/* eslint eqeqeq: "off" */
import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import Context from '../pages/Context';
// imagens.
import salvar from '../images/salvar.svg';
import deletar from "../images/deletar.svg";
import back from '../images/back.svg';

function EscalasAssistenciaisComponent() {

  // context.
  const {
    html,
    card, setcard,
    paciente,
    mobilewidth
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

  const arrayescalas = ['MNA', 'DEPRESSÃO', 'MORSE', 'BARTHEL']
  function EscalaOpcoes() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
        <div className="grid3"
          style={{
            flexDirection: 'row', flexWrap: 'wrap',
            padding: 5, backgroundColor: 'white', borderRadius: 5,
            width: '100%'
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
      </div>
    )
  }

  function ViewEscalas() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {arrayescalas.map(item => (
          <div style={{ display: item == escala ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="text2" style={{ fontSize: 20, margin: 10 }}>{item}</div>
            <div className={window.innerWidth < mobilewidth ? "grid2" : "grid3"}>
              {listaescalas.filter(valor => valor.escala == item).map(valor => (
                <div className="button"
                  style={{
                    position: 'relative',
                    flexGrow: 'inherit',
                    minHeight: 100, maxHeight: 100,
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

  // MINI ESCALA NUTRICIONAL ASSESSMENT (MNA)
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

  // ESCALA MORSE.
  let MORSE_pergunta1 = [
    {
      escala: 'MORSE',
      resposta: 'NÃO',
      valor: 0
    },
    {
      escala: 'MORSE',
      resposta: 'SIM',
      valor: 25
    },
  ]
  let MORSE_pergunta2 = [
    {
      escala: 'MORSE',
      resposta: 'NÃO',
      valor: 0
    },
    {
      escala: 'MORSE',
      resposta: 'SIM',
      valor: 15
    },
  ]
  let MORSE_pergunta3 = [
    {
      escala: 'MORSE',
      resposta: 'ACAMADO/AUXILIADO POR PROFISSIONAL DA SAÚDE',
      valor: 0
    },
    {
      escala: 'MORSE',
      resposta: 'MULETAS/BENGALA/ANDADOR',
      valor: 15
    },
    {
      escala: 'MORSE',
      resposta: 'MOBILIÁRIO/PAREDE',
      valor: 30
    },
  ]
  let MORSE_pergunta4 = [
    {
      escala: 'MORSE',
      resposta: 'NÃO',
      valor: 0
    },
    {
      escala: 'MORSE',
      resposta: 'SIM',
      valor: 20
    },
  ]
  let MORSE_pergunta5 = [
    {
      escala: 'MORSE',
      resposta: 'NORMAL/ACAMADO/CADEIRA DE RODAS',
      valor: 0
    },
    {
      escala: 'MORSE',
      resposta: 'FRACA',
      valor: 10
    },
    {
      escala: 'MORSE',
      resposta: 'COMPROMETIDA/CAMBALEANTE',
      valor: 20
    },
  ]
  let MORSE_pergunta6 = [
    {
      escala: 'MORSE',
      resposta: 'ORIENTADO/CAPAZ QUANTO A SUA CAPACIDADE DE LIMITAÇÃO',
      valor: 0
    },
    {
      escala: 'MORSE',
      resposta: 'SUPERESTIMA CAPACIDADE/ESQUECE LIMITAÇÕES',
      valor: 15
    },
  ]
  function EscalaMORSE() {
    return (
      <div style={{ display: escala == 'MORSE' ? 'flex' : 'none', flexDirection: 'column', alignContent: 'center', alignSelf: 'center' }}>
        <div className="text2" style={{ fontSize: 14, marginTop: 20 }}>{'ESCALA MORSE (RISCO DE QUEDA)'}</div>
        {escalaselector('MORSE', 'HISTÓRICO DE QUEDAS', MORSE_pergunta1)}
        {escalaselector('MORSE', 'DIAGNÓSTICO SECUNDÁRIO', MORSE_pergunta2)}
        {escalaselector('MORSE', 'AUXÍLIO NA DEAMBULAÇÃO', MORSE_pergunta3)}
        {escalaselector('MORSE', 'TERAPIA ENDOVENOSA', MORSE_pergunta4)}
        {escalaselector('MORSE', 'MARCHA', MORSE_pergunta5)}
        {escalaselector('MORSE', 'ESTADO MENTAL', MORSE_pergunta6)}
        <div
          className="button"
          onClick={() => escalasoma('MORSE')}
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

  // ESCALA DE BARTHEL
  let BARTHEL_alimentação = [
    {
      escala: 'BARTHEL',
      resposta: 'DEPENDENTE. PRECISA SER ALIMENTADO.',
      valor: 1
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA ATIVA DURANTE TODA A TAREFA.',
      valor: 2
    },
    {
      escala: 'BARTHEL',
      resposta: 'SUPERVISÃO NA REFEIÇÃO E ASSISTÊNCIA PARA TAREFAS ASSOCIADAS (SAL, MANTEIGA, FAZER O PRATO).',
      valor: 3
    },
    {
      escala: 'BARTHEL',
      resposta: 'INDEPENDENTE, EXCETO PARA TAREFAS COMPLEXAS COMO CORTAR A CARNE E ABRIR LEITE.',
      valor: 4
    },
    {
      escala: 'BARTHEL',
      resposta: 'INDEPENDENTE. COME SOZINHO, QUANDO SE PÕE A COMIDA AO SEU ALCANCE. DEVE SER CAPAZ DE FAZER AS AJUDAS TÉCNICAS QUANDO NECESSÁRIO.',
      valor: 5
    },
  ]
  let BARTHEL_higiene = [
    {
      escala: 'BARTHEL',
      resposta: 'DEPENDENTE. INCAPAZ DE ENCARREGAR-SE DA HIGIENE PESSOAL.',
      valor: 1
    },
    {
      escala: 'BARTHEL',
      resposta: 'ALGUMA ASSISTÊNCIA EM TODOS OS PASSOS DAS TAREFAS.',
      valor: 2
    },
    {
      escala: 'BARTHEL',
      resposta: 'ALGUMA ASSISTÊNCIA EM UM OU MAIS PASSOS DAS TAREFAS.',
      valor: 3
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA MÍNIMA ANTES E/OU DEPOIS DAS TAREFAS.',
      valor: 4
    },
    {
      escala: 'BARTHEL',
      resposta: 'INDEPENDENTE PARA TODAS AS TAREFAS COMO LAVAR SEU ROSTO E MÃOS, PENTEAR-SE, ESCOVAR OS DENTES, E FAZER A BARBA. INCLUSIVE USAR UM BARBEADOR ELÉTRICO OU DE LÂMINA, COLOCAR A LÂMINA OU LIGAR O BARBEADOR, ASSIM COMO ALCANÇÁ-LAS DO ARMÁRIO. AS MULHERES DEVEM CONSEGUIR SE MAQUIAR E FAZER PENTEADOS, SE USAR.',
      valor: 5
    },
  ]
  let BARTHEL_banheiro = [
    {
      escala: 'BARTHEL',
      resposta: 'DEPENDENTE. INCAPAZ DE REALIZAR ESTA TAREFA. NÃO PARTICIPA.',
      valor: 1
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA EM TODOS OS ASPECTOS DAS TAREFAS.',
      valor: 2
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA EM ALGUNS ASPECTOS COMO NAS TRANSFERÊNCIAS, MANUSEIO DAS ROUPAS, LIMPAR-SE, LAVAR AS MÃOS.',
      valor: 3
    },
    {
      escala: 'BARTHEL',
      resposta: 'INDEPENDENTE COM SUPERVISÃO. PODE UTILIZAR QUALQUER BARRA NA PAREDE OU QUALQUER SUPORTE SE O NECESSITAR. USO DE URINOL À NOITE, MAS NÃO É CAPAZ DE ESVAZIÁ-LO E LIMPÁ-LO.',
      valor: 4
    },
    {
      escala: 'BARTHEL',
      resposta: 'INDEPENDENTE EM TODOS OS PASSOS. SE FOR NECESSÁRIO O USO DE URINOL, DEVE SER CAPAZ DE COLOCÁ-LO, ESVAZIÁ-LO E LIMPÁ-LO.',
      valor: 5
    },
  ]
  let BARTHEL_banho = [
    {
      escala: 'BARTHEL',
      resposta: 'DEPENDENTE EM TODOS OS PASSOS. NÃO PARTICIPA.',
      valor: 1
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA EM TODOS OS ASPECTOS.',
      valor: 2
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA EM ALGUNS PASSOS COMO A TRANSFERÊNCIA, PARA LAVAR OU ENXUGAR OU PARA COMPLETAR ALGUMAS TAREFAS.',
      valor: 3
    },
    {
      escala: 'BARTHEL',
      resposta: 'SUPERVISÃO PARA SEGURANÇA, AJUSTAR TEMPERATURA OU NA TRANSFERÊNCIA.',
      valor: 4
    },
    {
      escala: 'BARTHEL',
      resposta: 'INDEPENDENTE. DEVE SER CAPAZ DE EXECUTAR TODOS OS PASSOS NECESSÁRIOS SEM QUE NENHUMA OUTRA PESSOA ESTEJA PRESENTE.',
      valor: 5
    },
  ]
  let BARTHEL_fecal = [
    {
      escala: 'BARTHEL',
      resposta: 'INCONTINENTE.',
      valor: 1
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA PARA ASSUMIR A POSIÇÃO APROPRIADA E PARA AS TÉCNICAS FACILITATÓRIA DE EVACUAÇÃO.',
      valor: 2
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA PARA USO DAS TÉCNICAS FACILITATÓRIA E PARA LIMPAR-SE. FREQÜENTEMENTE TEM EVACUAÇÕES ACIDENTAIS.',
      valor: 3
    },
    {
      escala: 'BARTHEL',
      resposta: 'SUPERVISÃO OU AJUDA PARA POR O SUPOSITÓRIO OU ENEMA. TEM ALGUM ACIDENTE OCASIONAL.',
      valor: 4
    },
    {
      escala: 'BARTHEL',
      resposta: 'O PACIENTE É CAPAZ DE CONTROLAR O ESFÍNCTER ANAL SEM ACIDENTES. PODE USAR UM SUPOSITÓRIO OU ENEMAS QUANDO FOR NECESSÁRIO.',
      valor: 5
    },
  ]
  let BARTHEL_vesical = [
    {
      escala: 'BARTHEL',
      resposta: 'INCONTINENTE. USO DE CARÁTER INTERNO.',
      valor: 1
    },
    {
      escala: 'BARTHEL',
      resposta: 'INCONTINENTE, MAS CAPAZ DE AJUDAR COM UM DISPOSITIVO INTERNO OU EXTERNO.',
      valor: 2
    },
    {
      escala: 'BARTHEL',
      resposta: 'PERMANECE SECO DURANTE O DIA, MAS NÃO À NOITE, NECESSITANDO DE ASSISTÊNCIA DE DISPOSITIVOS.',
      valor: 3
    },
    {
      escala: 'BARTHEL',
      resposta: 'TEM APENAS ACIDENTES OCASIONAIS. NECESSITA DE AJUDA PARA MANUSEAR O DISPOSITIVO INTERNO OU EXTERNO (SONDA OU CATÉTER).',
      valor: 4
    },
    {
      escala: 'BARTHEL',
      resposta: 'CAPAZ DE CONTROLAR SEU ESFÍNCTER DE DIA E DE NOITE. INDEPENDENTE NO MANEJO DOS DISPOSITIVOS INTERNOS E EXTERNOS.',
      valor: 5
    },
  ]
  let BARTHEL_vestir = [
    {
      escala: 'BARTHEL',
      resposta: 'INCAPAZ DE VESTIR-SE SOZINHO. NÃO PARTICIPA DA TAREFA.',
      valor: 1
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA EM TODOS OS ASPECTOS, MAS PARTICIPA DE ALGUMA FORMA.',
      valor: 2
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA É REQUERIDA PARA COLOCAR E/OU REMOVER ALGUMA ROUPA.',
      valor: 3
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA APENAS PARA FECHAR BOTÕES, ZÍPERES, AMARRAS SAPATOS, SUTIÃ, ETC.',
      valor: 4
    },
    {
      escala: 'BARTHEL',
      resposta: 'O PACIENTE PODE VESTIR-SE, AJUSTAR-SE E ABOTOAR TODA A POUPA E DAR LAÇO (INCLUI O USO DE ADAPTAÇÕES). ESTA ATIVIDADE INCLUI O COLOCAR DE ÓRTESES. PODEM USAR SUSPENSÓRIOS, CALÇADEIRAS OU ROUPAS ABERTAS.',
      valor: 5
    },
  ]
  let BARTHEL_transferencias = [
    {
      escala: 'BARTHEL',
      resposta: 'DEPENDENTE. NÃO PARTICIPA DA TRANSFERÊNCIA. NECESSITA DE AJUDA (DUAS PESSOAS).',
      valor: 1
    },
    {
      escala: 'BARTHEL',
      resposta: 'PARTICIPA DA TRANSFERÊNCIA, MAS NECESSITA DE AJUDA MÁXIMA EM TODOS OS ASPECTOS DA TRANSFERÊNCIA.',
      valor: 2
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA EM ALGUM DOS PASSOS DESTA ATIVIDADE.',
      valor: 3
    },
    {
      escala: 'BARTHEL',
      resposta: 'PRECISA SER SUPERVISIONADO OU RECORDADO DE UM OU MAIS PASSOS.',
      valor: 4
    },
    {
      escala: 'BARTHEL',
      resposta: 'INDEPENDENTE EM TODAS AS FASES DESTA ATIVIDADE. O PACIENTE PODE APROXIMAR DA CAMA (COM SUA CADEIRA DE RODAS), BLOQUEAR A CADEIRA, LEVANTAR OS PEDAIS, PASSAR DE FORMA SEGURA PARA A CAMA, VIRAR-SE, SENTAR-SE NA CAMA, MUDAR DE POSIÇÃO A CADEIRA DE RODAS, SE FOR NECESSÁRIO PARA VOLTAR E SENTAR-SE NELA E VOLTAR À CADEIRA DE RODAS.',
      valor: 5
    },
  ]
  let BARTHEL_escadas = [
    {
      escala: 'BARTHEL',
      resposta: 'INCAPAZ DE USAR DEGRAUS.',
      valor: 1
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA EM TODOS OS ASPECTOS.',
      valor: 2
    },
    {
      escala: 'BARTHEL',
      resposta: 'SOBE E DESCE, MAS PRECISA DE ASSISTÊNCIA DURANTE ALGUNS PASSOS DESTA TAREFA.',
      valor: 3
    },
    {
      escala: 'BARTHEL',
      resposta: 'NECESSITA DE SUPERVISÃO PARA SEGURANÇA OU EM SITUAÇÕES DE RISCO.',
      valor: 4
    },
    {
      escala: 'BARTHEL',
      resposta: 'CAPAZ DE SUBIR E DESCER ESCADAS DE FORMA SEGURA E SEM SUPERVISÃO. PODE USAR CORRIMÃO, BENGALAS E MULETAS, SE FOR NECESSÁRIO. DEVE SER CAPAZ DE LEVAR O AUXÍLIO TANTO AO SUBIR QUANTO AO DESCER.',
      valor: 5
    },
  ]
  let BARTHEL_deambulacao = [
    {
      escala: 'BARTHEL',
      resposta: 'DEPENDENTE NA DEAMBULAÇÃO. NÃO PARTICIPA.',
      valor: 1
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA POR UMA OU MAIS PESSOAS DURANTE TODA A DEAMBULAÇÃO.',
      valor: 2
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA NECESSÁRIA PARA ALCANÇAR APOIO E DEAMBULAR.',
      valor: 3
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA MÍNIMA OU SUPERVISÃO NAS SITUAÇÕES DE RISCO OU PERÍODO DURANTE O PERCURSO DE 50 METROS.',
      valor: 4
    },
    {
      escala: 'BARTHEL',
      resposta: 'INDEPENDENTE. PODE CAMINHAR, AO MENOS 50 METROS, SEM AJUDA OU SUPERVISÃO. PODE USAR ÓRTESE, BENGALAS, ANDADORES OU MULETAS. DEVE SER CAPAZ DE BLOQUEAR E DESBLOQUEAR AS ÓRTESES, LEVANTAR-SE E SENTAR-SE UTILIZANDO AS CORRESPONDENTES AJUDAS TÉCNICAS E COLOCAR OS AUXÍLIOS NECESSÁRIOS NA POSIÇÃO DE USO.',
      valor: 5
    },
  ]
  let BARTHEL_cadeira = [
    {
      escala: 'BARTHEL',
      resposta: 'DEPENDENTE NA AMBULAÇÃO EM CADEIRA DE RODAS.',
      valor: 1
    },
    {
      escala: 'BARTHEL',
      resposta: 'PROPULSIONA A CADEIRA POR CURTAS DISTÂNCIAS, SUPERFÍCIES PLANAS. ASSISTÊNCIA EM TODO O MANEJO DA CADEIRA.',
      valor: 2
    },
    {
      escala: 'BARTHEL',
      resposta: 'ASSISTÊNCIA PARA MANIPULAR A CADEIRA PARA A MESA, CAMA, BANHEIRO, ETC.',
      valor: 3
    },
    {
      escala: 'BARTHEL',
      resposta: 'PROPULSIONA EM TERRENOS IRREGULARES. ASSISTÊNCIA MÍNIMA EM SUBIR E DESCER DEGRAUS, GUIAS.',
      valor: 4
    },
    {
      escala: 'BARTHEL',
      resposta: 'INDEPENDENTE NO USO DE CADEIRA DE RODAS. FAZ AS MANOBRAS NECESSÁRIAS PARA SE DESLOCAR E PROPULSIONA A CADEIRA POR PELO MENOS 50 METROS. ',
      valor: 5
    },
  ]
  function EscalaBARTHEL() {
    return (
      <div style={{ display: escala == 'BARTHEL' ? 'flex' : 'none', flexDirection: 'column', alignContent: 'center', alignSelf: 'center' }}>
        <div className="text2" style={{ fontSize: 14, marginTop: 20 }}>{'ÍNDICE DE BARTHEL (FUNCIONALIDADE)'}</div>
        {escalaselector('BARTHEL', 'ALIMENTAÇÃO', BARTHEL_alimentação)}
        {escalaselector('BARTHEL', 'HIGIENE PESSOAL', BARTHEL_higiene)}
        {escalaselector('BARTHEL', 'USO DO BANHEIRO', BARTHEL_banheiro)}
        {escalaselector('BARTHEL', 'BANHO', BARTHEL_banho)}
        {escalaselector('BARTHEL', 'CONTINÊNCIA DO ESFÍNCTER ANAL', BARTHEL_fecal)}
        {escalaselector('BARTHEL', 'CONTINÊNCIA DO ESFÍNCTER VESICAL', BARTHEL_vesical)}
        {escalaselector('BARTHEL', 'VESTIR-SE', BARTHEL_vestir)}
        {escalaselector('BARTHEL', 'TRANSFERÊNCIAS (CAMA E CADEIRA)', BARTHEL_transferencias)}
        {escalaselector('BARTHEL', 'SUBIR E DESCER ESCADAS', BARTHEL_escadas)}
        {escalaselector('BARTHEL', 'DEAMBULAÇÃO', BARTHEL_deambulacao)}
        {escalaselector('BARTHEL', 'MANUSEIO DA CADEIRA DE RODAS', BARTHEL_cadeira)}
        <div
          className="button"
          onClick={() => escalasoma('BARTHEL')}
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

  // ESCALA DE DEPRESSÃO GERIÁTRICA (GDS)
  let GDS_1 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 0
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 1
    },
  ]
  let GDS_2 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 1
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 0
    },
  ]
  let GDS_3 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 1
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 0
    },
  ]
  let GDS_4 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 1
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 0
    },
  ]
  let GDS_5 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 0
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 1
    },
  ]
  let GDS_6 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 1
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 0
    },
  ]
  let GDS_7 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 0
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 1
    },
  ]
  let GDS_8 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 1
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 0
    },
  ]
  let GDS_9 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 1
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 0
    },
  ]
  let GDS_10 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 1
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 0
    },
  ]
  let GDS_11 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 0
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 1
    },
  ]
  let GDS_12 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 1
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 0
    },
  ]
  let GDS_13 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 0
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 1
    },
  ]
  let GDS_14 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 1
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 0
    },
  ]
  let GDS_15 = [
    {
      escala: 'DEPRESSÃO',
      resposta: 'SIM',
      valor: 1
    },
    {
      escala: 'DEPRESSÃO',
      resposta: 'NÃO',
      valor: 0
    },
  ]
  function EscalaDepressao() {
    return (
      <div style={{ display: escala == 'DEPRESSÃO' ? 'flex' : 'none', flexDirection: 'column', alignContent: 'center', alignSelf: 'center' }}>
        <div className="text2" style={{ fontSize: 14, marginTop: 20 }}>{'ESCALA DE DEPRESSÃO GERIÁTRICA (GDS)'}</div>
        {escalaselector('DEPRESSÃO', 'ESTÁ SATISFEITO(A) COM SUA VIDA?', GDS_1)}
        {escalaselector('DEPRESSÃO', 'INTERROMPEU MUITAS DE SUAS ATIVIDADES?', GDS_2)}
        {escalaselector('DEPRESSÃO', 'ACHA SUA VIDA VAZIA?', GDS_3)}
        {escalaselector('DEPRESSÃO', 'ABORRECE-SE COM FREQUÊNCIA?', GDS_4)}
        {escalaselector('DEPRESSÃO', 'SENTE-SE BEM COM A VIDA NA MAIOR PARTE DO TEMPO?', GDS_5)}
        {escalaselector('DEPRESSÃO', 'TEME QUE ALGO RUIM LHE ACONTEÇA?', GDS_6)}
        {escalaselector('DEPRESSÃO', 'SENTE-SE ALEGRE A MAIOR PARTE DO TEMPO?', GDS_7)}
        {escalaselector('DEPRESSÃO', 'SENTE-SE DESAMPARADO COM FREQUÊNCIA?', GDS_8)}
        {escalaselector('DEPRESSÃO', 'PREFERE FICAR EM CASA A SAIR E FAZER COISAS NOVAS?', GDS_9)}
        {escalaselector('DEPRESSÃO', 'ACHA QUE TEM MAIS PROBLEMAS DE MEMÓRIA QUE OUTRAS PESSOAS?', GDS_10)}
        {escalaselector('DEPRESSÃO', 'ACHA QUE É MARAVILHOSO ESTAR VIVO(A)?', GDS_11)}
        {escalaselector('DEPRESSÃO', 'SENTE-SE INÚTIL?', GDS_12)}
        {escalaselector('DEPRESSÃO', 'SENTE-SE CHEIO(A) DE ENERGIA?', GDS_13)}
        {escalaselector('DEPRESSÃO', 'SENTE-SE SEM ESPERANÇA?', GDS_14)}
        {escalaselector('DEPRESSÃO', 'ACHA QUE OS OUTROS TÊM MAIS SORTE QUE VOCÊ?', GDS_15)}
        
        <div
          className="button"
          onClick={() => escalasoma('DEPRESSÃO')}
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
      <EscalaMORSE></EscalaMORSE>
      <EscalaBARTHEL></EscalaBARTHEL>
      <EscalaDepressao></EscalaDepressao>
    </div >
  )
}

export default EscalasAssistenciaisComponent;
