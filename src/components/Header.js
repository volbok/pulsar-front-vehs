/* eslint eqeqeq: "off" */

import React, { useContext } from 'react';
import Context from '../pages/Context';
import moment from "moment";
import logo from "../images/logo_vehs.png";

function Header() {

  const {
    cliente,
    pacientes,
    paciente,
    unidade, unidades,
    atendimentos, // todos os registros de atendimento para a unidade selecionada.
    atendimento, // corresponde ao id_atendimento das tabela "atendimento".
    selecteddocumento,
    tipodocumento,
    alergias,
  } = useContext(Context);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column', justifyContent: 'center',
      fontFamily: 'Helvetica',
      breakInside: 'avoid',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
      }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center' }}>
          <img
            alt=""
            src={logo}
            style={{
              margin: 0,
              width: 100, height: 60,
              marginRight: 20,
            }}
          ></img>
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            alignSelf: 'center',
            fontSize: 10, marginRight: 10
          }}>
            <div className='text1'>{cliente.razao_social}</div>
            <div className='text1'>{cliente.cnpj}</div>
            <div className='text1'>{cliente.texto1}</div>
            <div className='text1'>{cliente.texto2}</div>
          </div>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
          borderRadius: 5, backgroundColor: 'gray', color: 'white',
          padding: 10
        }}>
          <div>
            {moment(selecteddocumento.data).format('DD/MM/YY - HH:mm')}
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            fontSize: 20,
            marginBottom: 10,
          }}>
            {'LEITO: ' + atendimentos.filter(valor => valor.id_paciente == paciente && valor.situacao == 1).map(valor => valor.leito)}
          </div>
          <div>{'UNIDADE: ' + unidades.filter(item => item.id_unidade == unidade).map(item => item.nome_unidade)}</div>
          <div>{'ATENDIMENTO: ' + atendimento}</div>
          <div>{'PRONTUÁRIO: ' + paciente}</div>
        </div>
      </div>
      <div style={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 20, marginTop: 10 }}>
        {'NOME CIVIL: ' + atendimentos.filter(valor => valor.id_atendimento == atendimento).map(valor => valor.nome_paciente)}
      </div>
      <div style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>
        {'DN: ' + pacientes.filter(valor => valor.id_paciente == atendimentos.filter(valor => valor.id_atendimento == atendimento).map(valor => valor.id_paciente)).map(valor => moment(valor.dn_paciente).format('DD/MM/YYYY'))}
      </div>
      <div style={{ fontFamily: 'Helvetica', fontWeight: 'bold' }}>
        {'NOME DA MÃE: ' + pacientes.filter(valor => valor.id_paciente == atendimentos.filter(valor => valor.id_atendimento == atendimento).map(valor => valor.id_paciente)).map(valor => valor.nome_mae_paciente)}
      </div>
      <div
        style={{
          display: alergias.length > 0 ? 'flex' : 'none',
          fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: 16, marginTop: 10, color: 'red', textDecoration: 'underline'
        }}>
        {'ALERGIAS: ' + alergias.map(item => ' ' + item.alergia + ' ')}
      </div>
      <div style={{ fontFamily: 'Helvetica', fontWeight: 'bold', width: '100%', fontSize: 22, marginTop: 20, textAlign: 'center' }}>
        {tipodocumento}
      </div>
    </div>
  )
}

export default Header;
