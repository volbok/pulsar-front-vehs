/* eslint eqeqeq: "off" */
import React, { useContext, useEffect } from 'react';
import Context from '../pages/Context';
// imagens.
import EscalasAssistenciaisComponent from '../components/EscalasAssistenciaisComponent';

function EscalasAssistenciais() {

  // context.
  const {
    card,
    paciente,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-escalas_assistenciais') {
      
    }
    // eslint-disable-next-line
  }, [card, paciente]);

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
      </div>
    </div >
  )
}

export default EscalasAssistenciais;