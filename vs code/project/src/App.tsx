import { useState, useEffect, useRef } from 'react';
import './App.css';

function VinylPeek() {
  return (
    <div className="vinyl-peek">
      <svg width="150" height="150" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        {/* Outer vinyl disc - dark/black */}
        <circle cx="200" cy="200" r="198" fill="#1a1a1a" />
        
        {/* Grooves - multiple circles to simulate vinyl grooves */}
        {[...Array(40)].map((_, i) => (
          <circle
            key={`groove-${i}`}
            cx="200"
            cy="200"
            r={195 - i * 3.5}
            fill="none"
            stroke="#0a0a0a"
            strokeWidth="1.5"
            opacity="0.6"
          />
        ))}
        
        {/* Subtle highlight/reflection */}
        <circle cx="200" cy="200" r="198" fill="url(#vinyl-shine)" opacity="0.15" />
        
        {/* Center label - pink */}
        <circle cx="200" cy="200" r="70" fill="#ffc0cb" />
        
        {/* Label details */}
        <circle cx="200" cy="200" r="70" fill="url(#label-gradient)" opacity="0.3" />
        
        {/* Curved text "melon bread" on the vinyl */}
        <defs>
          <path id="circlePath" d="M 200,200 m -130,0 a 130,130 0 1,1 260,0 a 130,130 0 1,1 -260,0" />
        </defs>
        <text fill="white" fontSize="38" fontFamily="VT323" fontWeight="400">
          <textPath href="#circlePath" startOffset="25%">
            melon bread
          </textPath>
        </text>
        
        {/* Center hole */}
        <circle cx="200" cy="200" r="15" fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="2" />
        <circle cx="200" cy="200" r="8" fill="#0a0a0a" />
        
        <defs>
          <radialGradient id="vinyl-shine">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="60%" stopColor="white" stopOpacity="0.3" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          
          <radialGradient id="label-gradient">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('page1');
  const [meeksStrikes, setMeeksStrikes] = useState(0);
  const [diStrikes, setDiStrikes] = useState(0);
  const [meeksQ3Answer, setMeeksQ3Answer] = useState('');
  const [diQ2Answer, setDiQ2Answer] = useState('');
  const [meeksQ1Input, setMeeksQ1Input] = useState('');
  const [meeksQ2Input, setMeeksQ2Input] = useState('');
  const [diQ1Input, setDiQ1Input] = useState('');
  const [diQ3Input, setDiQ3Input] = useState('');
  const [envelopeOpening, setEnvelopeOpening] = useState('');
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio once
  useEffect(() => {
    const audio = new Audio('/melon-bread.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Music control - play when not on page1, stop on page1
  useEffect(() => {
    if (!audioRef.current) return;

    if (currentPage === 'page1') {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => console.log('Audio play failed:', err));
      }
    }
  }, [currentPage]);

  const showPage = (pageId: string) => {
    setCurrentPage(pageId);
  };

  const resetStrikes = () => {
    setMeeksStrikes(0);
    setDiStrikes(0);
  };

  const openEnvelope = (person: string) => {
    setEnvelopeOpening(person);
    setTimeout(() => {
      if (person === 'meeks') {
        showPage('meeks-q1');
      } else {
        showPage('di-q1');
      }
      setEnvelopeOpening('');
    }, 800);
  };

  const closeCard = () => {
    showPage('page1');
    resetStrikes();
    setMeeksQ1Input('');
    setMeeksQ2Input('');
    setDiQ1Input('');
    setDiQ3Input('');
    setMeeksQ3Answer('');
    setDiQ2Answer('');
  };

  const retryQuestion = (person: string, questionNum: number) => {
    if (person === 'meeks') {
      const newStrikes = meeksStrikes + 1;
      setMeeksStrikes(newStrikes);
      if (newStrikes >= 3) {
        showPage('three-strikes-meeks');
      } else {
        showPage(`meeks-q${questionNum}`);
      }
    } else {
      const newStrikes = diStrikes + 1;
      setDiStrikes(newStrikes);
      if (newStrikes >= 3) {
        showPage('three-strikes-di');
      } else {
        showPage(`di-q${questionNum}`);
      }
    }
  };

  const checkMeeksQ1 = () => {
    const answer = meeksQ1Input.trim().toLowerCase();
    if (answer.includes('zen')) {
      showPage('meeks-q1-success');
    } else {
      showPage('meeks-q1-wrong');
    }
  };

  const checkMeeksQ2 = () => {
    const answer = meeksQ2Input.trim().toLowerCase();
    if (answer.includes('6') || answer.includes('six')) {
      showPage('meeks-q2-success');
    } else {
      showPage('meeks-q2-wrong');
    }
  };

  const checkMeeksQ3 = () => {
    if (!meeksQ3Answer) {
      alert('Please select an answer!');
      return;
    }
    if (meeksQ3Answer === 'yes') {
      showPage('meeks-yes');
    } else {
      showPage('meeks-no-1');
      setTimeout(() => {
        showPage('meeks-no-2');
      }, 2500);
    }
  };

  const checkDiQ1 = () => {
    const answer = diQ1Input.trim().toLowerCase().replace(/\s/g, '');
    if (answer.includes('heartliming')) {
      showPage('di-q1-success');
    } else {
      showPage('di-q1-wrong');
    }
  };

  const checkDiQ2 = () => {
    if (!diQ2Answer) {
      alert('Please select an answer!');
      return;
    }
    if (diQ2Answer === 'koro-sensei') {
      showPage('di-q2-success');
    } else {
      showPage('di-q2-wrong');
    }
  };

  const checkDiQ3 = () => {
    const answer = diQ3Input.trim().toLowerCase();
    if (!answer) {
      alert('Please type an answer!');
      return;
    }

    const hasYou = answer.includes('you') || answer.includes('hadi');
    const hasPond = answer.includes('pond');
    const hasOverPond = answer.includes('over pond') || answer.includes('not pond') || answer.includes('instead of pond');
    const hasOverYou = answer.includes('over you') || answer.includes('not you') || answer.includes('instead of you');

    if (hasOverPond) {
      showPage('di-you');
    } else if (hasOverYou) {
      showPage('di-pond-1');
      setTimeout(() => {
        showPage('di-pond-2');
      }, 2500);
    } else if (hasPond && !hasYou) {
      showPage('di-pond-1');
      setTimeout(() => {
        showPage('di-pond-2');
      }, 2500);
    } else if (hasYou && !hasPond) {
      showPage('di-you');
    } else {
      showPage('di-q3-clarify');
    }
  };

  const diQ3Clarified = (choice: string) => {
    if (choice === 'you') {
      showPage('di-you');
    } else {
      showPage('di-pond-1');
      setTimeout(() => {
        showPage('di-pond-2');
      }, 2500);
    }
  };

  return (
    <div className="app">
      {currentPage === 'page1' && (
        <div className="page page1 active" onClick={() => setConfettiTrigger(t => t + 1)}>
          <div className="confetti-container">
            {[...Array(80)].map((_, i) => {
              const colors = ['#ff69b4', '#ff1493', '#ffb6c1', '#ff69f0', '#ff85c1', '#ffc0cb'];
              const size = 6 + Math.random() * 8;
              return (
                <div key={`${confettiTrigger}-${i}`} className="confetti" style={{
                  left: `${Math.random() * 100}%`,
                  top: `${-Math.random() * 20}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  background: colors[Math.floor(Math.random() * colors.length)],
                  width: `${size}px`,
                  height: `${size}px`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}></div>
              );
            })}
          </div>
          <h1 className="title">Happy Valentine's Day,<br />Fiancés!</h1>
          <button className="click-button" onClick={(e) => { e.stopPropagation(); showPage('page2'); }}>CLICK HERE</button>
        </div>
      )}

      {currentPage === 'page2' && (
        <div className="page page2 active">
          <div className="miku-container">
            <div className="miku-image">
              <img src="/Hatsune_Miku_Pixel_Art_Sticker.gif" alt="Miku" style={{width: '70%', height: '70%', objectFit: 'contain'}} />
            </div>
            <div className="choose-text">Choose your letter!</div>
          </div>
          <div className="envelopes">
            <div className={`envelope ${envelopeOpening === 'meeks' ? 'opening' : ''}`} onClick={() => openEnvelope('meeks')}>
              <div className="envelope-box">
                <img src="/1770472530506_image.png" className="envelope-img" alt="Closed envelope" />
                <img src="/1770472478749_image.png" className="envelope-open-img" alt="Open envelope" />
              </div>
              <div className="envelope-label">For my wife Meeks</div>
            </div>
            <div className={`envelope ${envelopeOpening === 'di' ? 'opening' : ''}`} onClick={() => openEnvelope('di')}>
              <div className="envelope-box">
                <img src="/1770472530506_image.png" className="envelope-img" alt="Closed envelope" />
                <img src="/1770472478749_image.png" className="envelope-open-img" alt="Open envelope" />
              </div>
              <div className="envelope-label">For my husband Di</div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'meeks-q1' && (
        <div className="page quiz-page active">
          <VinylPeek />
          <div className="quiz-box">
            
            <div className="quiz-title">Wait! I need to see if you're actually Meeks or if it's just Di trying to sneak a peek 👀</div>
            <div className="question">
              <div className="question-text">1. Who's your favourite character in Mystic Messenger?</div>
              <input
                type="text"
                className="text-input"
                placeholder="Type your answer..."
                value={meeksQ1Input}
                onChange={(e) => setMeeksQ1Input(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkMeeksQ1()}
              />
            </div>
            <button className="submit-btn" onClick={checkMeeksQ1}>SUBMIT</button>
          </div>
        </div>
      )}

      {currentPage === 'meeks-q1-success' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">You're one step closer to seeing your card~</div>
            <button className="continue-btn" onClick={() => showPage('meeks-q2')}>Continue</button>
          </div>
        </div>
      )}

      {currentPage === 'meeks-q1-wrong' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">Di, is that u? (͠≖~≖  ͡ ) </div>
            <button className="continue-btn" onClick={() => retryQuestion('meeks', 1)}>Try Again</button>
          </div>
        </div>
      )}

      {currentPage === 'meeks-q2' && (
        <div className="page quiz-page active">
          <VinylPeek />
          <div className="quiz-box">
            
            <div className="question">
              <div className="question-text">2. How old is Kiara?</div>
              <input
                type="text"
                className="text-input"
                placeholder="Type your answer..."
                value={meeksQ2Input}
                onChange={(e) => setMeeksQ2Input(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkMeeksQ2()}
              />
            </div>
            <button className="submit-btn" onClick={checkMeeksQ2}>SUBMIT</button>
          </div>
        </div>
      )}

      {currentPage === 'meeks-q2-success' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">Almooooost thereeee</div>
            <button className="continue-btn" onClick={() => showPage('meeks-q3')}>Continue</button>
          </div>
        </div>
      )}

      {currentPage === 'meeks-q2-wrong' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">Hmmmmm is this really Meeks trying to answer?</div>
            <button className="continue-btn" onClick={() => retryQuestion('meeks', 2)}>Try Again</button>
          </div>
        </div>
      )}

      {currentPage === 'meeks-q3' && (
        <div className="page quiz-page active">
          <VinylPeek />
          <div className="quiz-box">
            
            <div className="question">
              <div className="question-text">3. Did you text the fine shi u told me about?</div>
              <div className="choice-buttons">
                <button
                  className={`choice-btn ${meeksQ3Answer === 'yes' ? 'selected' : ''}`}
                  onClick={() => setMeeksQ3Answer('yes')}
                >
                  Yes
                </button>
                <button
                  className={`choice-btn ${meeksQ3Answer === 'no' ? 'selected' : ''}`}
                  onClick={() => setMeeksQ3Answer('no')}
                >
                  No
                </button>
              </div>
            </div>
            <button className="submit-btn" onClick={checkMeeksQ3}>SUBMIT</button>
          </div>
        </div>
      )}

      {currentPage === 'meeks-yes' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">I'm so proud of you!! Give me the details ASAP!</div>
            <button className="continue-btn" onClick={() => showPage('meeks-card')}>Continue</button>
          </div>
        </div>
      )}

      {currentPage === 'meeks-no-1' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">You don't get to read my Valentine's Day card then :(</div>
          </div>
        </div>
      )}

      {currentPage === 'meeks-no-2' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">Jk, I love you. It's not like I went to talk to the cute restaurant guy. Here's your letter:</div>
            <button className="continue-btn" onClick={() => showPage('meeks-card')}>Continue</button>
          </div>
        </div>
      )}

      {currentPage === 'di-q1' && (
        <div className="page quiz-page active">
          <VinylPeek />
          <div className="quiz-box">
            
            <div className="quiz-title">Wait! I need to see if you're actually Di or if it's just Meeks trying to sneak a peek 👀</div>
            <div className="question">
              <div className="question-text">1. What is the name of the ship from Moonlight Chicken that I love?</div>
              <input
                type="text"
                className="text-input"
                placeholder="Type your answer..."
                value={diQ1Input}
                onChange={(e) => setDiQ1Input(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkDiQ1()}
              />
            </div>
            <button className="submit-btn" onClick={checkDiQ1}>SUBMIT</button>
          </div>
        </div>
      )}

      {currentPage === 'di-q1-success' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">You're one step closer to seeing your card~</div>
            <button className="continue-btn" onClick={() => showPage('di-q2')}>Continue</button>
          </div>
        </div>
      )}

      {currentPage === 'di-q1-wrong' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">Meeks, is that u? (͠≖~≖  ͡ ) </div>
            <button className="continue-btn" onClick={() => retryQuestion('di', 1)}>Try Again</button>
          </div>
        </div>
      )}

      {currentPage === 'di-q2' && (
        <div className="page quiz-page active">
          <VinylPeek />
          <div className="quiz-box">
            
            <div className="question">
              <div className="question-text">2. Which of the figurines you own am I most jealous of?</div>
              <div className="choice-buttons">
                <button
                  className={`choice-btn ${diQ2Answer === 'koro-sensei' ? 'selected' : ''}`}
                  onClick={() => setDiQ2Answer('koro-sensei')}
                >
                  Koro-sensei
                </button>
                <button
                  className={`choice-btn ${diQ2Answer === 'ryuuk' ? 'selected' : ''}`}
                  onClick={() => setDiQ2Answer('ryuuk')}
                >
                  Ryuuk
                </button>
                <button
                  className={`choice-btn ${diQ2Answer === 'loid' ? 'selected' : ''}`}
                  onClick={() => setDiQ2Answer('loid')}
                >
                  Loid
                </button>
              </div>
            </div>
            <button className="submit-btn" onClick={checkDiQ2}>SUBMIT</button>
          </div>
        </div>
      )}

      {currentPage === 'di-q2-success' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">Almooooost thereeee</div>
            <button className="continue-btn" onClick={() => showPage('di-q3')}>Continue</button>
          </div>
        </div>
      )}

      {currentPage === 'di-q2-wrong' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">Hmmmmm is this really Di trying to answer?</div>
            <button className="continue-btn" onClick={() => retryQuestion('di', 2)}>Try Again</button>
          </div>
        </div>
      )}

      {currentPage === 'di-q3' && (
        <div className="page quiz-page active">
          <VinylPeek />
          <div className="quiz-box">
            
            <div className="question">
              <div className="question-text">
                3. If both me and Pond ask you for a dance at the same time at a very grand ball, who would you pick?
                <br />
                <span style={{ fontSize: '20px' }}>(P.S, it would crush my soul if you didn't pick me)</span>
              </div>
              <input
                type="text"
                className="text-input"
                placeholder="Type your answer..."
                value={diQ3Input}
                onChange={(e) => setDiQ3Input(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkDiQ3()}
              />
            </div>
            <button className="submit-btn" onClick={checkDiQ3}>SUBMIT</button>
          </div>
        </div>
      )}

      {currentPage === 'di-q3-clarify' && (
        <div className="page message-page active">
          <div className="message-box">
            <img src="/1770474826629_image.png" className="warning-icon" alt="Warning" />
            <div className="message-text">
              Dude, can you clarify what u meant lmao. This code isn't smart enough to account for answers like that.
              <br /><br />
              So: Pond, or me?
            </div>
            <div className="choice-buttons" style={{ justifyContent: 'center', marginTop: '20px' }}>
              <button className="choice-btn" onClick={() => diQ3Clarified('you')}>You</button>
              <button className="choice-btn" onClick={() => diQ3Clarified('pond')}>Pond</button>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'di-you' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">AWWWWWWWW I LOVE YOU SO MUCH DI</div>
            <button className="continue-btn" onClick={() => showPage('di-card')}>Continue</button>
          </div>
        </div>
      )}

      {currentPage === 'di-pond-1' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">
              Wow, fuck you :&lt;
              <br /><br />
              No Valentine's Day card for you!
            </div>
          </div>
        </div>
      )}

      {currentPage === 'di-pond-2' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">
              yk what that's actually valid, I mean I would've picked Han if both him and you had asked me to the dance. I get u Di, dw you can read your card
            </div>
            <button className="continue-btn" onClick={() => showPage('di-card')}>Continue</button>
          </div>
        </div>
      )}

      {currentPage === 'three-strikes-meeks' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">Alr Di, pack it up</div>
            <button className="continue-btn" onClick={() => { showPage('page2'); resetStrikes(); }}>Back to Letters</button>
          </div>
        </div>
      )}

      {currentPage === 'three-strikes-di' && (
        <div className="page message-page active">
          <div className="message-box">
            <div className="message-text">Alr Meeks, pack it up</div>
            <button className="continue-btn" onClick={() => { showPage('page2'); resetStrikes(); }}>Back to Letters</button>
          </div>
        </div>
      )}

      {currentPage === 'meeks-card' && (
        <div className="page card-page active">
          <div className="card-box">
            <div className="card-title">
              <img src="/pixel-heart.png" className="heart-img" alt="heart" />
              For My Beautiful Wife
              <img src="/pixel-heart.png" className="heart-img" alt="heart" />
            </div>
            <div className="card-content">
              Happy valentine's day love. 
              {'\n\n'}
              I hope you know you mean the world to me.
              {'\n\n'}
              I'm so, so glad to have you in my life,
              {'\n\n'}
               and I wish I could be present with you.
              {'\n\n'}
              I want to give you warm hugs and bake 
              {'\n\n'}
              chocolates together like we did many valentines ago
            </div>
            <button className="back-home-btn" onClick={closeCard}>Close Letter</button>
          </div>
        </div>
      )}

      {currentPage === 'di-card' && (
        <div className="page card-page active">
          <div className="card-box">
            <div className="card-title">
              <img src="/pixel-heart.png" className="heart-img" alt="heart" />
              For My Amazing Husband
              <img src="/pixel-heart.png" className="heart-img" alt="heart" />
            </div>
            <div className="card-content">
              Hey Kiddo, I'm proud of ya, and I love ya. 
              {'\n\n'}
              And I hope you love me as much as you do bokuaka, gemini4rth, earthmix,
              Snail Pond Robber, and the ineffable husbands.
              {'\n\n'}
              And I shall promise to love you as much as I do soukoku, skz, anime, genshin impact etc
              {'\n\n'}
              Toasting to the yaoi that connects us - Cheers! And
              {'\n\n'}
              Happy Valentine's Day!
            </div>
            <button className="back-home-btn" onClick={closeCard}>Close Letter</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
