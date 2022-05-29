import {
  CancelRounded,
  CheckCircleRounded,
  MicRounded,
  Send,
} from '@material-ui/icons';
import { useState, useRef } from 'react';
import './ChatFooter.css';

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
  setImage,
}) {
  const [isRecording, setRecording] = useState(false);
  const inputRef = useRef();

  function handleStartRecording(event) {
    event.preventDefault();
    inputRef.current.focus(); //clicking on the button should open input audio recorder
  }

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
              capture
            />
          </>
        )}
      </form>
      {isRecording && (
        <div className="record">
          <CancelRounded
            style={{
              width: 30,
              height: 30,
              color: '#f20519',
            }}
          />
          <div>
            <div className="record__redcircle"></div>
            <div className="record__duration"></div>
          </div>

          <CheckCircleRounded
            style={{
              width: 30,
              height: 30,
              color: '#41bf49',
            }}
          />
        </div>
      )}
    </div>
  );
}
