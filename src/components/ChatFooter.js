import {
  CancelRounded,
  CheckCircleRounded,
  MicRounded,
  Send,
} from '@material-ui/icons';
import { useState, useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import './ChatFooter.css';
import recordAudio from './recordAudio';
import { db, createTimeStamp, audioStorage, storage } from '../firebase';
// for recording live audio two properties are necessary
// navigator.mediaDevices and window.MediaRecorder

export default function ChatFooter({
  handleSendMessage,
  handleOnChange,
  input,
  user,
  room,
  roomID,
  image,
  setAudioId,
}) {
  const [isRecording, setRecording] = useState(false);
  const [duration, setDuration] = useState('00:00');

  const timerInterval = useRef();
  const recordingEl = useRef();
  const record = useRef();
  const inputRef = useRef();

  async function handleStartRecording(event) {
    event.preventDefault();
    record.current = await recordAudio();
    inputRef.current.focus(); //clicking on the button should open input audio recorder

    inputRef.current.style.width = 'calc(100% - 56px)'; // to show approve or disapprove button
    setRecording(true);
    setAudioId('');
  }

  function pad(value) {
    return String(value).length < 2 ? `0${value}` : value;
  }

  async function handleStopRecording() {
    inputRef.current.focus();
    clearInterval(timerInterval.current);
    const audio = record.current.stop();
    recordingEl.current.style.opacity = '0';
    setRecording(false);
    inputRef.current.style.width = 'calc(100% - 112px)';
    setDuration('00:00');
    return audio;
  }

  async function handleFinishRecordingAndUpload() {
    const audio = await handleStopRecording();
    const { audioFile, audioName } = await audio;
    sendAudio(audioFile, audioName);
  }

  async function sendAudio(audioFile, audioName) {
    db.collection('users')
      .doc(user.uid)
      .collection('chats')
      .doc(roomID)
      .set({
        name: room.name,
        photoURL: room.photoURL || null,
        timestamp: createTimeStamp(),
      });

    const doc = await db
      .collection('rooms')
      .doc(roomID)
      .collection('messages')
      .add({
        name: user.displayName,
        uid: user.uid,
        timestamp: createTimeStamp(),
        time: new Date().toUTCString(),
        audioUrl: 'uploading',
        audioName,
      });

    await audioStorage.child(audioName).put(audioFile);
    const url = await audioStorage.child(audioName).getDownloadURL();
    db.collection('rooms')
      .doc(roomID)
      .collection('messages')
      .doc(doc.id)
      .update({
        audioUrl: url,
      });
  }

  function handleAudioInputChange(event) {
    const audioFile = event.target.files[0];
    if (audioFile) {
      setAudioId('');
      sendAudio(audioFile, uuid());
    }
  }

  useEffect(() => {
    if (isRecording) {
      recordingEl.current.style.opacity = '1';
      startTimer();
      record.current.start();
    }
    function startTimer() {
      const start = Date.now();
      timerInterval.current = setInterval(setTime, 100);

      // we are doing this because setInterval is not reliable ,
      // we are checking for perfect time every 10th of a second
      function setTime() {
        const timeElapsed = Date.now() - start; // use of clousure , so we always get the start value
        const totalSeconds = Math.floor(timeElapsed / 1000);
        const minutes = pad(parseInt(totalSeconds / 60));
        const seconds = pad(parseInt(totalSeconds % 60)); // 0-59
        const duration = `${minutes}:${seconds}`;
        setDuration(duration);
      }
    }
  }, [isRecording]);

  const btnIcons = (
    <>
      <Send
        style={{
          width: 20,
          height: 20,
          color: 'white',
        }}
      />

      <MicRounded
        style={{
          width: 24,
          height: 24,
          color: 'white',
        }}
      />
    </>
  );

  const canRecord = navigator.mediaDevices.getUserMedia && window.MediaRecorder;

  return (
    <div className="chat__footer">
      <form>
        <input
          ref={inputRef}
          value={input}
          onChange={!isRecording ? handleOnChange : null}
          type="text"
          placeholder="Type a message"
        />
        {canRecord ? (
          <button
            onClick={
              input.trim() || (input === '' && image)
                ? handleSendMessage
                : handleStartRecording
            }
            type="submit"
            className="send__btn"
          >
            {btnIcons}
          </button>
        ) : (
          <>
            <label htmlFor="capture" className="send__btn">
              {btnIcons}
            </label>
            <input
              style={{ display: 'none' }}
              type="file"
              id="capture"
              accept="audio/*"
              onChange={handleAudioInputChange}
              capture
            />
          </>
        )}
      </form>
      {isRecording && (
        <div ref={recordingEl} className="record">
          <CancelRounded
            style={{
              width: 30,
              height: 30,
              color: '#f20519',
            }}
            onClick={handleStopRecording}
          />
          <div>
            <div className="record__redcircle"></div>
            <div className="record__duration">{duration}</div>
          </div>

          <CheckCircleRounded
            style={{
              width: 30,
              height: 30,
              color: '#41bf49',
            }}
            onClick={handleFinishRecordingAndUpload}
          />
        </div>
      )}
    </div>
  );
}
