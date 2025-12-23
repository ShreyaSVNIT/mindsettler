'use client';

import React from 'react';

interface TermData {
  letter: string;
  term: string;
  hindi: string;
  explanation: string;
}

const mentalHealthBasics: TermData[] = [
  { letter: 'A', term: 'Anxiety', hindi: 'चिंता', explanation: 'Constant worry that feels hard to control' },
  { letter: 'B', term: 'Boundaries', hindi: 'सीमाएँ', explanation: 'Clear limits that protect your well-being' },
  { letter: 'C', term: 'Consent', hindi: 'सहमति', explanation: 'A clear, willing agreement between people' },
  { letter: 'D', term: 'Depression', hindi: 'अवसाद', explanation: 'Ongoing feelings of deep, heavy sadness' },
  { letter: 'E', term: 'Empathy', hindi: 'समानुभूति', explanation: 'Understanding and feeling what others experience' },
  { letter: 'F', term: 'Feelings', hindi: 'भावनाएं', explanation: 'Your internal reactions to the world' },
  { letter: 'G', term: 'Grief', hindi: 'दुःख', explanation: 'The heavy process of navigating loss' },
  { letter: 'H', term: 'Healing', hindi: 'उपचारात्मक', explanation: 'The journey toward feeling whole again' },
  { letter: 'I', term: 'Identity', hindi: 'पहचान', explanation: 'Your sense of who you are' },
  { letter: 'J', term: 'Jealousy', hindi: 'जलन', explanation: 'Feeling insecure about losing attention' },
  { letter: 'K', term: 'Kindness', hindi: 'दया', explanation: 'Gentleness toward self and others' },
  { letter: 'L', term: 'Loneliness', hindi: 'अकेलापन', explanation: 'A quiet need for connection' },
  { letter: 'M', term: 'Mindfulness', hindi: 'सचेतन', explanation: 'Being fully present in the moment' },
  { letter: 'N', term: 'Nervousness', hindi: 'घबराहट', explanation: 'Temporary unease before important moments' },
  { letter: 'O', term: 'Overthinking', hindi: 'बहुत ज़्यादा सोचना', explanation: 'Thoughts looping endlessly' },
  { letter: 'P', term: 'Pleasure', hindi: 'आनंद', explanation: 'Moments of joy and satisfaction' },
  { letter: 'Q', term: 'Queer', hindi: 'विचित्र', explanation: 'A spectrum of identities and love' },
  { letter: 'R', term: 'Resistance', hindi: 'प्रतिरोध', explanation: 'Pushing back against change' },
  { letter: 'S', term: 'Stress', hindi: 'तनाव', explanation: 'Mental and emotional overload' },
  { letter: 'T', term: 'Trauma', hindi: 'सदमा', explanation: 'Lingering emotional wounds' },
  { letter: 'U', term: 'Uncertain', hindi: 'संदेहयुक्त', explanation: 'Living with the unknown' },
  { letter: 'V', term: 'Vulnerable', hindi: 'नाजुक', explanation: 'Allowing yourself to be seen' },
  { letter: 'W', term: 'Worth', hindi: 'लायक', explanation: 'Your inherent value' },
  { letter: 'X', term: 'Xenophobia', hindi: 'विदेशी लोगों से भय', explanation: 'Fear of the unfamiliar' },
  { letter: 'Y', term: 'Yourself', hindi: 'स्वयं', explanation: 'Your truest self' },
  { letter: 'Z', term: 'Zen', hindi: 'सुकून', explanation: 'Deep calm and clarity' }
];

const HexagonCard: React.FC<{ data: TermData }> = ({ data }) => (
  <div className="w-full h-full breathing-hex group">
    <div className="relative w-full h-full" style={{ perspective: '1200px' }}>
      <div
        className="relative w-full h-full transition-transform duration-700 ease-out group-hover:rotate-y-180"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-3"
          style={{
            backgroundColor: 'var(--color-bg-app)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="font-title text-3xl mb-1 text-[var(--color-primary)]">
            {data.letter}
          </div>
          <div className="font-body text-sm font-medium">{data.term}</div>
          <div className="font-body text-xs opacity-60">({data.hindi})</div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 flex items-center justify-center p-4"
          style={{
            backgroundColor: 'var(--color-bg-subtle)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <p className="font-body text-[11px] md:text-xs text-center leading-tight">
            {data.explanation}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function MentalHealthBasics() {
  // Balanced rows for a centered look
  const rows = [
    mentalHealthBasics.slice(0, 7),
    mentalHealthBasics.slice(7, 13),
    mentalHealthBasics.slice(13, 20),
    mentalHealthBasics.slice(20, 26)
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-[var(--color-bg-card)]">
      <div className="relative max-w-7xl mx-auto flex flex-col items-center">
        {/* TITLE - Centered for symmetry */}
        <div className="max-w-3xl mb-20 text-center">
          <p className="uppercase tracking-widest text-xs mb-4 opacity-70 font-body">
            Emotional Alphabet
          </p>
          <h2 className="font-title text-4xl md:text-5xl leading-tight mb-6">
            When feelings don’t scream,<br />
            they <em>whisper</em>.
          </h2>
          <p className="font-body text-lg opacity-80">
            A gentle A–Z of emotions — explore, pause, breathe.
          </p>
        </div>

        {/* GRID - Centered with equal side spacing */}
        <div className="flex flex-col items-center gap-4 w-full">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex flex-wrap justify-center gap-3 md:gap-4 w-full"
            >
              {row.map(term => (
                <div
                  key={term.letter}
                  className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40"
                >
                  <HexagonCard data={term} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        .breathing-hex {
          animation: breathe 5.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}