/* eslint eqeqeq: "off" */
import React, { useContext, useEffect } from 'react';
import Context from '../pages/Context';
import axios from 'axios';
// componentes.
// funções.
import toast from '../functions/toast';
// imagens.
import back from '../images/back.svg';

function Camera() {

  // context.
  const {
    html,
    settoast,
    objpaciente,
    paciente,
    card, setcard,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-camera') {
    }
    // eslint-disable-next-line
  }, [card]);

  const updatePaciente = (imagem) => {
    var obj = {
      nome_paciente: objpaciente.nome_paciente,
      nome_mae_paciente: objpaciente.nome_mae_paciente,
      dn_paciente: objpaciente.dn_paciente,
      antecedentes_pessoais: objpaciente.antecedentes_pessoais,
      medicacoes_previas: objpaciente.medicacoes_previas,
      exames_previos: objpaciente.exames_previos,
      exames_atuais: objpaciente.tipo_documento,
      tipo_documento: objpaciente.tipo_documento,
      numero_documento: objpaciente.numero_documento,
      cns: objpaciente.cns,
      endereco: objpaciente.endereco,
      logradouro: objpaciente.logradouro,
      bairro: objpaciente.bairro,
      localidade: objpaciente.localidade,
      uf: objpaciente.uf,
      cep: objpaciente.cep,
      telefone: objpaciente.telefone,
      email: objpaciente.email,
      nome_responsavel: objpaciente.nome_responsavel,
      sexo: objpaciente.sexo,
      nacionalidade: objpaciente.nacionalidade,
      cor: objpaciente.cor,
      etnia: objpaciente.etnia,
      orgao_emissor: objpaciente.orgao_emissor,
      endereco_numero: objpaciente.endereco_numero,
      endereco_complemento: objpaciente.endereco_complemento,
      foto: imagem,
    };
    axios
      .post(html + "update_paciente/" + paciente, obj)
      .then(() => {
        toast(
          settoast,
          "PACIENTE ATUALIZADO COM SUCESSO NA BASE PULSAR",
          "rgb(82, 190, 128, 1)",
          3000
        );
      })
      .catch(function () {
        toast(
          settoast,
          "ERRO DE CONEXÃO, REINICIANDO APLICAÇÃO.",
          "black",
          5000
        );
      });
  };

  // registro de alergia por voz.
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
        </div>
      </div>
    );
  }

  let video = null;
  let canvas = null;
  function Capture() {
    const startvideo = () => {
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
        video.srcObject = stream;
        console.log('INICIADO STREAM')
      });
    }

    const getimage = () => {
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      let image = canvas.toDataURL('image/jpeg');
      console.log(image);
      updatePaciente(image);
    }

    return (
      <div class="camera"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignSelf: 'center',
          width: '100%'
        }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <video id="video" autoplay loop muted style={{ width: 300, height: 400, backgroundColor: 'red' }}></video>
          <img id="foto" alt="" style={{ width: 300, height: 400, backgroundColor: 'blue' }}></img>
        </div>
        <canvas id="canvas" style={{ width: 300, height: 400, backgroundColor: 'green', alignSelf: 'center' }}></canvas>
        <div className='button' style={{ width: 200, alignSelf: 'center', marginTop: 10 }}
          onClick={() => startvideo()}
        >
          INICIAR
        </div>
        <div className='button' style={{ width: 200, alignSelf: 'center', marginTop: 10 }}
          onClick={() => getimage()}
        >
          CAPTURAR
        </div>
      </div >
    )
  }

  return (
    <div id="foto"
      className='card-aberto'
      style={{ display: card == 'card-camera' ? 'flex' : 'none' }}
    >
      <div className="text3">CAPTURAR FOTO DO PACIENTE</div>
      <Botoes></Botoes>
      <div
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          alignContent: 'center', alignSelf: 'center',
          flexWrap: 'wrap', width: '100%'
        }}>
        <Capture></Capture>
      </div>
    </div>
  )
}

export default Camera;
