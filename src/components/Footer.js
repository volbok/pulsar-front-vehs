/* eslint eqeqeq: "off" */

import React, { useContext } from 'react';
import Context from '../pages/Context';

function Footer() {
  const {
    dono_documento,
  } = useContext(Context);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      height: 100, width: '100%',
      fontFamily: 'Helvetica',
      breakInside: 'avoid',
    }}>
      <div className="text1">
        _______________________________________________
      </div>
      <div id="identificação - documento" className="text1">
        {dono_documento.nome}
      </div>
      <div id="identificação - prescrição" className="text1">
        {dono_documento.conselho}
      </div>
    </div>
  )
}

export default Footer;
