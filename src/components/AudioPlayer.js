import { useReducer, useRef, useEffect } from 'react';
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

export default function AudioPlayer({
  sender,
  audioUrl,
  id,
  setAudioId,
  audioId,
}) {
  const [state, dispatch] = useReducer(audioReducer, initialState);

  const totalDuration = useRef('');
  const audio = useRef(new Audio(audioUrl));
  const interval = useRef();
  const isUploading = useRef(audioUrl === 'uploading');

  useEffect(() => {
    if (isUploading.current && audioUrl !== 'uploading') {
      audio.current = new Audio(audioUrl);
      audio.current.load();
      dispatch({ type: 'UPDATE_LOADING' });
    } else if (isUploading.current === false) {
      dispatch({ type: 'UPDATE_LOADING' });
    }
  }, [audioUrl]);

  function getAudioDuration(media) {
    return new Promise(resolve => {
      media.onloadedmetadata = () => {
        media.currentTime = Number.MAX_SAFE_INTEGER;
        media.ontimeupdate = () => {
          media.ontimeupdate = () => {};
          media.currentTime = 0.1;
          resolve(media.duration);
        };
      };
    });
  }

  useEffect(() => {
    if (state.isLoaded) {
      getAudioDuration(audio.current).then(() => {
        dispatch({ type: 'UPDATE_METADATA' });
      });
    }
  }, [state.isLoaded]);

  useEffect(() => {
    if (state.isMetaDataLoaded) {
      audio.current.addEventListener('canplaythrough', () => {
        if (!totalDuration.current) {
          dispatch({ type: 'UPDATE_MEDIALOADED' });
          const time = formatTime(audio.current.duration);
          totalDuration.current = time;
          dispatch({ type: 'UPDATE_DURATION', payload: totalDuration.current });
        }
      });

      // when audio stops playing
      audio.current.addEventListener('ended', () => {
        clearInterval(interval.current);
        dispatch({ type: 'UPDATE_DURATION', payload: totalDuration.current });
        dispatch({ type: 'RESET_SOME' });
      });
    }
  }, [state.isMetaDataLoaded]);

  function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  function playAudio() {
    dispatch({ type: 'UPDATE_PLAYING', payload: true });
    audio.current.play();
    if (audioId !== id) {
      setAudioId(id);
    }
    interval.current = setInterval(updateSlider, 100);
  }

  function updateSlider() {
    let sliderPosition = 0;
    const { currentTime, duration } = audio.current;
    if (typeof duration === 'number') {
      sliderPosition = currentTime * (100 / duration);
      dispatch({ type: 'UPDATE_SLIDERVALUE', payload: sliderPosition });
      const time = formatTime(currentTime);
      dispatch({ type: 'UPDATE_DURATION', payload: time });
    }
  }

  function stopAudio() {
    audio.current.pause();
    clearInterval(interval.current);
    dispatch({ type: 'UPDATE_PLAYING', payload: false });
    dispatch({ type: 'UPDATE_DURATION', payload: totalDuration.current });
  }

  function scrubAudio(event) {
    const value = event.target.value; // get value b/w 1-100
    const { duration } = audio.current;

    if (state.isMediaLoaded) {
      const seekTo = duration * (value / 100);
      audio.current.currentTime = seekTo;
      dispatch({ type: 'UPDATE_SLIDERVALUE', payload: value });
    }
  }

  useEffect(() => {
    if (audioId !== id) {
      audio.current.pause();
      dispatch({ type: 'UPDATE_PLAYING', payload: false });
    }
  }, [audioId, id]);

  return (
    <>
      <div className={`audioplayer ${sender ? '' : 'audioplayer__alt'}`}>
        {!state.isMediaLoaded ? (
          <CircularProgress />
        ) : state.isPlaying ? (
          <PauseRounded onClick={stopAudio} className="pause" />
        ) : !state.isPlaying ? (
          <PlayArrowRounded onClick={playAudio} />
        ) : null}

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
      <span className="chat__timestamp audioplayer__timer">
        {state.duration}
      </span>
    </>
  );
}
