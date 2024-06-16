/* eslint eqeqeq: "off" */
import React, { useContext } from 'react';
import Context from '../pages/Context';
import moment from 'moment';
// imagens.
import back from '../images/back.svg';

function Alertas() {

  // context.
  const {
    invasoes,
    sinaisvitais,
    dietas,
    card, setcard,
    mobilewidth,
  } = useContext(Context);

  let lastsinaisvitais = sinaisvitais.sort((a, b) => moment(a.data_sinais_vitais) > moment(b.data_sinais_vitais) ? -1 : 1).slice(-1);
  let pas = lastsinaisvitais.map(item => item.pas);
  let pad = lastsinaisvitais.map(item => item.pad);
  let pam = Math.ceil((2 * parseInt(pad) + parseInt(pas)) / 3);
  let fc = lastsinaisvitais.map(item => item.fc);
  let fr = lastsinaisvitais.map(item => item.fr);
  let sao2 = lastsinaisvitais.map(item => item.sao2);
  let tax = lastsinaisvitais.map(item => item.tax);
  let diurese = lastsinaisvitais.map(item => item.diurese);
  // Pendência: criar alerta de hipoglicemia!
  // let glicemia = lastsinaisvitais.map(item => item.glicemia);
  let balanco = lastsinaisvitais.map(item => item.balanco);
  let estase = lastsinaisvitais.map(item => item.estase);

  let arrayevacuacao = [];
  let evacuacao = [];
  sinaisvitais.sort((a, b) => moment(a.data_sinais_vitais) > moment(b.data_sinais_vitais) ? -1 : 1).slice(-3).map(item => arrayevacuacao.push(item.evacuacao));
  evacuacao = arrayevacuacao.filter(item => item.includes('+') || item.includes('PRESENTE') || item > 0);

  function AlertaInvasoes() {
    if (invasoes.filter(item => item.data_retirada == null && moment().diff(item.data_implante, 'days') > 15).length > 0) {
      return (
        <div id='alerta_invasoes'>
          {invasoes.filter(item => item.data_retirada == null && moment().diff(item.data_implante, 'days') > 15).map(item => (
            <div className='button red' key={'invasoes ' + item.id_invasao} style={{ minHeight: 100 }}
            >
              {'TEMPO PROLONGADO DE INVASÃO: ' + item.dispositivo + ' (' + moment().diff(item.data_implante, 'days') + ' DIAS).'}
            </div>
          ))}
        </div>
      )
    } else {
      return null;
    }
  }
  function AlertaSepse() {
    if (pam < 70 && (fc > 100 || fr > 22 || tax < 36 || tax > 38 || diurese < 500)) {
      return (
        <div id='alerta_sepse'
          className='button red'
          style={{ display: 'flex', flexDirection: 'column', minHeight: 100 }}
        >
          <div>{'CRITÉRIOS DE SEPSE!'}</div>
          <div>
            <div style={{ display: pam < 70 ? 'flex' : 'none', justifyContent: 'center' }}>{'PAM: ' + pam + ' mmHg'}</div>
            <div style={{ display: fc > 100 ? 'flex' : 'none', justifyContent: 'center' }}>{'FC: ' + fc + ' bpm'}</div>
            <div style={{ display: fr > 22 ? 'flex' : 'none', justifyContent: 'center' }}>{'FR: ' + fr + ' irpm'}</div>
            <div style={{ display: tax < 36 || tax > 38 ? 'flex' : 'none', justifyContent: 'center' }}>{'TAX: ' + tax + 'ºC'}</div>
            <div style={{ display: diurese < 500 ? 'flex' : 'none', justifyContent: 'center' }}>{'DIURESE: ' + diurese + ' ml'}</div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
  function AlertaDadosVitais() {
    if (pam < 70 || pam > 100 || fc < 50 || fc > 130 || fr < 15 || fr > 24 || tax < 35 || tax > 38 || sao2 < 90) {
      return (
        <div id='alerta_dados'
          className='button yellow'
          style={{ minHeight: 100 }}
        >
          <div>
            <div style={{ display: pam < 70 ? 'flex' : 'none', justifyContent: 'center' }}>{'HIPOTENSÃO: PAM ' + pam + ' mmHg'}</div>
            <div style={{ display: pam > 100 ? 'flex' : 'none', justifyContent: 'center' }}>{'HIPERTENSÃO: PAM ' + pam + ' mmHg'}</div>
            <div style={{ display: fc < 50 ? 'flex' : 'none', justifyContent: 'center' }}>{'BRADICARDIA: FC ' + fc + ' bpm'}</div>
            <div style={{ display: fc > 130 ? 'flex' : 'none', justifyContent: 'center' }}>{'TAQUICARDIA: FC ' + fc + ' bpm'}</div>
            <div style={{ display: fr < 15 ? 'flex' : 'none', justifyContent: 'center' }}>{'BRADIPNÉIA: FR ' + fr + ' irpm'}</div>
            <div style={{ display: fr > 24 ? 'flex' : 'none', justifyContent: 'center' }}>{'TAQUIPNÉIA: FR ' + fr + ' irpm'}</div>
            <div style={{ display: tax < 35 ? 'flex' : 'none', justifyContent: 'center' }}>{'HIPOTERMIA: TAX ' + tax + 'ºC'}</div>
            <div style={{ display: tax > 38 ? 'flex' : 'none', justifyContent: 'center' }}>{'HIPERTERMIA TAX ' + tax + 'ºC'}</div>
            <div style={{ display: sao2 < 90 ? 'flex' : 'none', justifyContent: 'center' }}>{'DESSATURAÇÃO SAO2 ' + sao2 + '%'}</div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
  function AlertaDiureseBalanco() {
    return (
      <div id='alerta_diurese&balanco'
        className='button yellow'
        style={{ minHeight: 100 }}
      >
        <div>
          <div style={{ display: diurese < 500 ? 'flex' : 'none' }}>{'DÉBITO URINÁRIO REDUZIDO: ' + diurese + ' ml/12h'}</div>
          <div style={{ display: diurese > 1500 ? 'flex' : 'none' }}>{'DÉBITO URINÁRIO AUMENTADO: ' + diurese + ' ml/12h'}</div>
          <div style={{ display: balanco < -1500 ? 'flex' : 'none' }}>{'BALANÇO HÍDRICO MUITO NEGATIVO: ' + balanco + ' ml/12h'}</div>
          <div style={{ display: balanco > 1000 ? 'flex' : 'none' }}>{'BALANÇO HÍDRICO MUITO POSITIVO: ' + balanco + ' ml/12h'}</div>
        </div>
      </div>
    )
  }
  function AlertaEstaseEvacuacao() {
    if (estase > 200 || evacuacao.length == 0) {
      return (
        <div id='alerta_estase&evacuacao'
          className='button yellow'
          style={{ minHeight: 100 }}
        >
          <div>
            <div style={{ display: estase > 200 ? 'flex' : 'none' }}>{'ESTASE GÁSTRICA: ' + estase + ' ml/12h'}</div>
            <div style={{ display: dietas.map(item => item.tipo) == 'SNE' ? 'flex' : 'none' }}>{'CONSIDERAR REDUÇÃO OU SUSPENSÃO DA DIETA ENTERAL.'}</div>
            <div style={{ display: evacuacao.length == 0 ? 'flex' : 'none' }}>{'AUSÊNCIA DE EVACUAÇÃO HÁ 3 DIAS'}</div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  return (
    <div id="scroll-alertas"
      className='card-aberto'
      style={{ display: card == 'card-alertas' ? 'flex' : 'none' }}
    >
      <div className="text3">
        ALERTAS
      </div>
      <div className={window.innerWidth < mobilewidth ? '' : 'grid2'}>
        <AlertaInvasoes></AlertaInvasoes>
        <AlertaDadosVitais></AlertaDadosVitais>
        <AlertaDiureseBalanco></AlertaDiureseBalanco>
        <AlertaEstaseEvacuacao></AlertaEstaseEvacuacao>
        <AlertaSepse></AlertaSepse>
      </div>
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
    </div>
  )
}

export default Alertas;
