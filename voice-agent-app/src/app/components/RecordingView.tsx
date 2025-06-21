"use client";

import {useRef, useState, useEffect} from "react";

declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

export default function RecordingView() {
    
    const [transcript, setTranscript] = useState<string>("");
    const [response, setResponse] = useState<string>("");

    const recognitionRef = useRef<any>(null);
    
    const sendToGroq = async (text: string) => {
        const res = await fetch('/api/groq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text }),
        });
        const data = await res.json();
        setResponse(data.response);
    };
    
    const startRecording = () => {
        

        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onstart = () => {
            console.log("Recording started");
        }   

        recognitionRef.current.onresult = (event: any) => {
            const {transcript} = event.results[event.results.length - 1][0];
            setTranscript(transcript);
            sendToGroq(transcript);
        };

        recognitionRef.current.onend = () => {
            console.log("Recording ended");
        }

    recognitionRef.current.start();

};    


const stopRecording = () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
};

// Cleanup effect when the component unmounts
useEffect(() => {
    return () => {
      // Stop the speech recognition if it's active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

    return <div className="w-full">
        <pre>{transcript}</pre>
        <pre>{response}</pre>
        <button onClick={startRecording} className="bg-blue-500 text-white p-2 rounded">Start Recording</button>
        <button onClick={stopRecording} className="bg-red-500 text-white p-2 rounded ml-2">Stop Recording</button>
    </div>
}