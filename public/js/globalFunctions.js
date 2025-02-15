// globalFunctions.js

/********** Text-to-Speech **********/
function speakText(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Optionally, set the language, voice, rate, pitch, etc.
      // utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-Speech is not supported in this browser.');
    }
  }
  
  /********** Speech-to-Text **********/
  function startSpeechRecognition(callback) {
    // Check for browser support (most Chrome browsers support webkitSpeechRecognition)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition is not supported in this browser.');
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;       // Stop automatically after one phrase
    recognition.interimResults = false;     // Only final results
    recognition.lang = 'en-US';             // Set language (change as needed)
    
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      if (typeof callback === 'function') {
        callback(transcript);
      }
    };
    
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
    };
    
    recognition.start();
  }
  
  /********** Translation **********/
  // This function uses LibreTranslate (a free translation API) for demonstration.
  // You can replace the endpoint and parameters with any translation API of your choice.
  function translateText(text, targetLang, callback) {
    // targetLang should be a language code, e.g., 'es' for Spanish, 'fr' for French, etc.
    fetch('https://libretranslate.com/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'en',      // assuming source language is English
        target: targetLang,
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      if (typeof callback === 'function') {
        callback(data.translatedText);
      }
    })
    .catch(error => {
      console.error('Translation error:', error);
    });
  }
  
  /********** Example Usage **********/
  // You can remove or modify these examples later as needed.
  
  // Example: Speak some text on page load
  // speakText("Welcome to our telemedicine application!");
  
  // Example: Start speech recognition and log the result
  // startSpeechRecognition(function(result) {
  //   console.log("Recognized speech:", result);
  // });
  
  // Example: Translate text to Spanish and log the result
  // translateText("Hello, how are you?", "es", function(translated) {
  //   console.log("Translated text:", translated);
  // });
  