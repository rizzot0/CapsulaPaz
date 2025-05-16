import { useState, useEffect, useRef } from 'react';

const sounds = [
  { name: "Lluvia", file: "/sounds/lluvia.mp3" },
  { name: "Mar", file: "/sounds/mar.mp3" },
  { name: "Chimenea", file: "/sounds/chimenea.mp3" },
  { name: "Bosque", file: "/sounds/bosque.mp3" },
  { name: "Home", file: "/sounds/home.mp3" }
];

const frases = [
  "Respira profundo, estás haciendo lo mejor que puedes.",
  "Hoy es un buen día para regalarte calma.",
  "No tienes que poder con todo, solo contigo.",
  "Eres valiosa tal como eres.",
  "Permítete descansar, sin culpa.",
  "Todo está bien en este momento.",
  "Tu paz es prioridad.",
  "Cierra los ojos, el mundo puede esperar un momento."
];

const carta = `
Querida alma valiente,

Sé que a veces el mundo puede ser abrumador, y que llevas más peso del que muchos imaginan. Esta pequeña cápsula no es más que un recordatorio: mereces paz, calma y momentos solo para ti.

Gracias por existir, por resistir y por seguir siendo tú.

Con mucho cariño,
Tu persona especial 💙
`;

export default function CapsulaDePaz() {
  const [players, setPlayers] = useState({});
  const [volumes, setVolumes] = useState({});
  const [frase, setFrase] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [showCarta, setShowCarta] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const newPlayers = {};
    const newVolumes = {};
    sounds.forEach(sound => {
      const audio = new Audio(sound.file);
      audio.loop = true;
      newPlayers[sound.name] = audio;
      newVolumes[sound.name] = 0.5;
    });
    setPlayers(newPlayers);
    setVolumes(newVolumes);

    setFrase(frases[Math.floor(Math.random() * frases.length)]);
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopAll();
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft]);

  const toggleSound = (name) => {
    const player = players[name];
    if (!player) return;
    if (player.paused) player.play();
    else player.pause();
  };

  const stopAll = () => {
    Object.values(players).forEach(player => player.pause());
  };

  const setVolume = (name, value) => {
    const newVolume = parseFloat(value.target.value);
    players[name].volume = newVolume;
    setVolumes({ ...volumes, [name]: newVolume });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="min-h-screen w-full grid place-items-center px-4 py-12 text-white font-sans"
      style={{
        background: "linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #0f0c29)",
        backgroundSize: "400% 400%",
        animation: "gradientFlow 30s ease infinite"
      }}
    >
      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .fade-in {
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">🌙 Cápsula de Paz</h1>
        <p className="mb-6 italic text-lg text-center">{frase}</p>

        <div className="flex justify-center mb-6">
          <img src="/lofi-girl.png" alt="Lofi Girl" className="w-60 h-auto rounded-lg shadow-lg border border-white/20" />
        </div>

        {sounds.map(sound => (
          <div key={sound.name} className="mb-6 p-4 rounded-xl shadow-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <h2 className="text-xl font-semibold mb-2">{sound.name}</h2>
            <button
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded mb-2"
              onClick={() => toggleSound(sound.name)}
            >
              Play / Pause
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumes[sound.name] || 0.5}
              onChange={(e) => setVolume(sound.name, e)}
              className="w-full accent-pink-500"
            />
          </div>
        ))}

        <div className="mt-10 text-center">
          <h3 className="text-lg mb-2">⏳ Temporizador de relajación</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[5, 10, 15, 30].map(min => (
              <button
                key={min}
                onClick={() => setTimeLeft(min * 60)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                {min} min
              </button>
            ))}
          </div>
          {timeLeft !== null && (
            <p className="mt-4 text-lg">Tiempo restante: {formatTime(timeLeft)}</p>
          )}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setShowCarta(!showCarta)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            {showCarta ? "Ocultar mensaje especial" : "💌 Ver mensaje especial"}
          </button>

          {showCarta && (
            <div className="fade-in mt-6 p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-left w-full">
              <pre className="whitespace-pre-wrap text-white text-md">{carta}</pre>
            </div>
          )}
        </div>

        <footer className="mt-16 text-sm opacity-60 text-center">
          Hecho con 💙 para alguien muy especial.
        </footer>
      </div>
    </div>
  );
}
