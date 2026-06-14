
/**
 * Node imports
 */
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

/**
 * Icons
 */
import { FaMicrophone } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";


const SpeechInput = () => {
    const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>SpeechInput</div>
  )
}

export default SpeechInput