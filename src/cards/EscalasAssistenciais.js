/* eslint eqeqeq: "off" */
import React, { useContext, useEffect } from 'react';
import Context from '../pages/Context';
// imagens.
import back from '../images/back.svg';
import EscalasAssistenciaisComponent from '../components/EscalasAssistenciaisComponent';

function EscalasAssistenciais() {

  // context.
  const {
    card, setcard,
    paciente,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-escalas_assistenciais') {
      
    }
    // eslint-disable-next-line
  }, [card, paciente]);

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
      </div>
    );
  }

  return (
    <div id="scroll-escalas_assistenciais"
      className='card-aberto'
      style={{ display: card == 'card-escalas_assistenciais' ? 'flex' : 'none' }}
    >
      <div className="text3">
        ESCALAS ASSISTENCIAIS
      </div>
      <div
        style={{
          position: 'relative', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-start',
          flex: 1
        }}>
        <EscalasAssistenciaisComponent></EscalasAssistenciaisComponent>
        <Botoes></Botoes>
      </div>
    </div >
  )
}

export default EscalasAssistenciais;