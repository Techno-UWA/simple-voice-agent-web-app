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
        <div className="pb-20">
            <pre>{"User:" + transcript}</pre>
            <pre>{"Agent:" + response}</pre>
        </div>
        <div className="fixed bottom-4 left-4 right-4 flex justify-center gap-2">
            <button onClick={startRecording} className="bg-blue-500 text-white p-2 rounded">Start Recording</button>
            <button onClick={stopRecording} className="bg-red-500 text-white p-2 rounded">Stop Recording</button>
        </div>
    </div>
}