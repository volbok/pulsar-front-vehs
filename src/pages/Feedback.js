/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Context from "./Context";
import back from "../images/back.svg";
import emojihappy from "../images/emojihappy.svg";
import emojineutral from "../images/emojineutral.svg";
import emojisad from "../images/emojisad.svg";
import moment from "moment";

function Feedback() {
  // context.
  const {
    html,
    pacientes,
    paciente,
    card, setcard,
    mobilewidth,
  } = useContext(Context);

  const [selectedpaciente, setselectedpaciente] = useState([]);
  useEffect(() => {
    if (card == 'card-feedback') {
      let x = pacientes.filter(item => item.id_paciente == paciente);
      setselectedpaciente(x);
      loadFeedback();
    }
    // eslint-disable-next-line
  }, [card]);

  const [feedback, setfeedback] = useState([]);
  const [lastfeedback, setlastfeedback] = useState([]);
  const loadFeedback = () => {
    axios.get(html + 'list_feedback').then((response) => {
      var x = [];
      var y = [];
      x = response.data.rows;
      y = x.filter(item => item.id_pcte == paciente);
      setfeedback(y);
      // último registro de feedback;
      setlastfeedback(y.slice(-1));
    })
  }

  // card de monitorização do cliente em home care.
  function Status() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div className="text2" style={{ fontSize: 16, marginBottom: 10 }}>{'STATUS ATUAL DE ' + selectedpaciente.map(item => item.nome_paciente) + ':'}</div>
        <div
          id="emoji atual"
          style={{
            display: "flex",
            opacity: 1,
            alignSelf: "center",
            backgroundColor: lastfeedback.face == 'sad' ? '#EC7063' : lastfeedback.face == 'neutral' ? '#F7DC6F' : 'rgb(82, 190, 128, 1)',
            borderRadius: 5,
          }}
        >
          <img alt="" src={lastfeedback.face == 'sad' ? emojisad : lastfeedback.face == 'neutral' ? emojineutral : emojihappy}
            style={{ width: 150, height: 150 }}></img>
        </div>
      </div>
    )
  }

  function ListaFeedback() {
    return (
      <div
        style={{
          width: window.innerWidth < mobilewidth ? '90vw' : '60vw',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignContent: 'center', alignItems: 'center', alignSelf: 'center',
        }}>
        {feedback.map(item => (
          <div style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'center',
            backgroundColor: 'white', borderRadius: 5, padding: 5, margin: 5,
            alignContent: 'center', width: '100%'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: 15 }}>
              <div
                id="emoji atual"
                style={{
                  display: "flex",
                  opacity: 1,
                  alignSelf: "center",
                  backgroundColor: item.face == 'sad' ? '#EC7063' : item.face == 'neutral' ? '#F7DC6F' : 'rgb(82, 190, 128, 1)',
                  borderRadius: 5,
                }}
              >
                <img alt="" src={item.face == 'sad' ? emojisad : item.face == 'neutral' ? emojineutral : emojihappy}
                  style={{ width: 60, height: 60 }}>
                </img>
              </div>
              <div className="text1" style={{ marginBottom: 0 }}>{moment(item.dn_paciente).format('DD/MM/YY')}</div>
              <div className="text1" style={{ marginTop: 0, paddingTop: 0 }}>{moment(item.dn_paciente).format('HH:mm')}</div>
            </div>
            <div className="text1" style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              textAlign: 'left',
              alignSelf: 'flex-start',
              width: '100%',
            }}>{item.comentario}</div>
          </div>
        ))}
      </div>
    )
  }

  function Back() {
    return (
      <div className="button-yellow"
        onClick={() => {
          setcard('');
        }}
        style={{
          display: 'flex',
          marginRight: 10,
          maxWidth: 50, maxHeight: 50,
          alignSelf: 'center',
        }}>
        <img
          alt=""
          src={back}
          style={{ width: 30, height: 30 }}
        ></img>
      </div>
    )
  }

  return (
    <div id="scroll-evoluções"
      className='card-aberto'
      style={{ display: card == 'card-feedback' ? 'flex' : 'none' }}
    >
      <Back></Back>
      <Status></Status>
      <div className="text2" style={{ marginBottom: 10, fontSize: 14 }}>HISTÓRICO DE FEEDBACKS</div>
      <ListaFeedback></ListaFeedback>
    </div>
  );
}

export default Feedback;
