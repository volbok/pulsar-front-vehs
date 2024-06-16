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
    paciente,
    card, setcard,
    pacientes,
  } = useContext(Context);

  useEffect(() => {
    if (card == 'card-camera') {
      startvideo();
    }
    // eslint-disable-next-line
  }, [card]);

  const updatePaciente = (imagem) => {
    // eslint-disable-next-line
    pacientes.filter(valor => valor.id_paciente == paciente).map(item => {
      var obj = {
        nome_paciente: item.nome_paciente,
        nome_mae_paciente: item.nome_mae_paciente,
        dn_paciente: item.dn_paciente,
        antecedentes_pessoais: item.antecedentes_pessoais,
        medicacoes_previas: item.medicacoes_previas,
        exames_previos: item.exames_previos,
        exames_atuais: item.tipo_documento,
        tipo_documento: item.tipo_documento,
        numero_documento: item.numero_documento,
        cns: item.cns,
        endereco: item.endereco,
        logradouro: item.logradouro,
        bairro: item.bairro,
        localidade: item.localidade,
        uf: item.uf,
        cep: item.cep,
        telefone: item.telefone,
        email: item.email,
        nome_responsavel: item.nome_responsavel,
        sexo: item.sexo,
        nacionalidade: item.nacionalidade,
        cor: item.cor,
        etnia: item.etnia,
        orgao_emissor: item.orgao_emissor,
        endereco_numero: item.endereco_numero,
        endereco_complemento: item.endereco_complemento,
        foto: imagem,
      };
      console.log(obj);
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

  let startvideo = null;
  function Capture() {
    startvideo = () => {
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
        video.srcObject = stream;
        console.log('INICIADO STREAM')
      });
    }

    const getimage = () => {
      canvas.getContext('2d').drawImage(video, 150, 100, 300, 300, 0, 0, 300, 300);
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
        }}>
        <div style={{
          display: 'flex', flexDirection: 'row',
          justifyContent: 'center', alignSelf: 'center',
          position: 'relative',
        }}>
          <div id="painel esquerdo"
            style={{
              display: 'none',
              position: 'absolute',
              top: 0, bottom: 0, left: 0,
              width: 150,
              backgroundColor: 'black', zIndex: 1,
            }}>
          </div>
          <video id="video" autoplay='true' muted='true' width='300' height='300' style={{ objectFit: 'cover', borderRadius: 5 }}></video>
          <div id="painel direito"
            style={{
              display: 'none',
              position: 'absolute',
              top: 0, bottom: 0, right: 0,
              width: 150,
              backgroundColor: 'black', zIndex: 1,
            }}>
          </div>
        </div>
        <canvas id="canvas" height='300' width='300' style={{ display: 'none', backgroundColor: 'green', alignSelf: 'center' }}></canvas>
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
