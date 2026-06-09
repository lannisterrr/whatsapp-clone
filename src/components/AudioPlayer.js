import { memo, useReducer, useRef, useEffect } from 'react';
import './AudioPlayer.css';
import { CircularProgress } from '@material-ui/core';
import { PauseRounded, PlayArrowRounded } from '@material-ui/icons';
import audioReducer from '../audioReducer';

const initialState = {
  isPlaying: false,
  isMediaLoaded: false,
  isLoaded: false,
  isMetaDataLoaded: false,
  sliderValue: 0,
  duration: '',
};

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function AudioPlayer({ sender, audioUrl, id, setAudioId, audioId }) {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const totalDurationRef = useRef('');

  useEffect(() => {
    if (!audioUrl || audioUrl === 'uploading') return undefined;

    const audioEl = new Audio(audioUrl);
    audioRef.current = audioEl;
    totalDurationRef.current = '';
    dispatch({ type: 'UPDATE_LOADING' });

    const onCanPlay = () => {
      if (!totalDurationRef.current) {
        dispatch({ type: 'UPDATE_MEDIALOADED' });
        const time = formatTime(audioEl.duration);
        totalDurationRef.current = time;
        dispatch({ type: 'UPDATE_DURATION', payload: time });
      }
    };

    const onEnded = () => {
      clearInterval(intervalRef.current);
      dispatch({ type: 'UPDATE_DURATION', payload: totalDurationRef.current });
      dispatch({ type: 'RESET_SOME' });
    };

    audioEl.addEventListener('canplaythrough', onCanPlay);
    audioEl.addEventListener('ended', onEnded);
    audioEl.load();

    return () => {
      audioEl.pause();
      audioEl.removeEventListener('canplaythrough', onCanPlay);
      audioEl.removeEventListener('ended', onEnded);
      audioEl.src = '';
      clearInterval(intervalRef.current);
      audioRef.current = null;
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioId !== id && audioRef.current) {
      audioRef.current.pause();
      dispatch({ type: 'UPDATE_PLAYING', payload: false });
    }
  }, [audioId, id]);

  function updateSlider() {
    const audioEl = audioRef.current;
    if (!audioEl || typeof audioEl.duration !== 'number') return;
    const sliderPosition = audioEl.currentTime * (100 / audioEl.duration);
    dispatch({ type: 'UPDATE_SLIDERVALUE', payload: sliderPosition });
    dispatch({ type: 'UPDATE_DURATION', payload: formatTime(audioEl.currentTime) });
  }

  function playAudio() {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    dispatch({ type: 'UPDATE_PLAYING', payload: true });
    audioEl.play();
    if (audioId !== id) setAudioId(id);
    intervalRef.current = setInterval(updateSlider, 100);
  }

  function stopAudio() {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    audioEl.pause();
    clearInterval(intervalRef.current);
    dispatch({ type: 'UPDATE_PLAYING', payload: false });
    dispatch({ type: 'UPDATE_DURATION', payload: totalDurationRef.current });
  }

  function scrubAudio(event) {
    const audioEl = audioRef.current;
    if (!audioEl || !state.isMediaLoaded) return;
    const value = event.target.value;
    audioEl.currentTime = audioEl.duration * (value / 100);
    dispatch({ type: 'UPDATE_SLIDERVALUE', payload: value });
  }

  if (audioUrl === 'uploading') {
    return (
      <>
        <div className={`audioplayer ${sender ? '' : 'audioplayer__alt'}`}>
          <CircularProgress />
        </div>
        <span className="chat__timestamp audioplayer__timer" />
      </>
    );
  }

  return (
    <>
      <div className={`audioplayer ${sender ? '' : 'audioplayer__alt'}`}>
        {!state.isMediaLoaded ? (
          <CircularProgress />
        ) : state.isPlaying ? (
          <PauseRounded onClick={stopAudio} className="pause" />
        ) : (
          <PlayArrowRounded onClick={playAudio} />
        )}

        <div>
          <span
            style={{ width: `${state.sliderValue}%` }}
            className="audioplayer__slider--played"
          />
          <input
            type="range"
            min="1"
            max="100"
            value={state.sliderValue}
            onChange={scrubAudio}
            className="audioplayer__slider"
          />
        </div>
      </div>
      <span className="chat__timestamp audioplayer__timer">{state.duration}</span>
    </>
  );
}

export default memo(AudioPlayer);
