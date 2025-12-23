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
  { letter: 'J', term: 'Jealousy', hindi: 'जलन', explanation: 'Feeling insecure about losing someones attention' },
  { letter: 'K', term: 'Kindness', hindi: 'दया', explanation: 'Gentle to self and others' },
  { letter: 'L', term: 'Loneliness', hindi: 'अकेलापन', explanation: 'Feeling disconnected, reminds need for connection.' },
  { letter: 'M', term: 'Mindfulness', hindi: 'सचेतन', explanation: 'Being fully present in the moment' },
  { letter: 'N', term: 'Nervousness', hindi: 'घबराहट', explanation: 'Temporary unease before important things' },
  { letter: 'O', term: 'Overthinking', hindi: 'बहुत ज़्यादा सोचना', explanation: 'Thinking too much about the same thing' },
  { letter: 'P', term: 'Pleasure', hindi: 'आनंद', explanation: 'Enjoyment or satisfaction from positive experiences' },
  { letter: 'Q', term: 'Queer', hindi: 'विचित्र', explanation: 'An umbrella term for diverse sexualities' },
  { letter: 'R', term: 'Resistance', hindi: 'प्रतिरोध', explanation: 'Hesitating or pushing back against change' },
  { letter: 'S', term: 'Stress', hindi: 'तनाव', explanation: 'Feeling overwhelmed by lifes heavy pressures' },
  { letter: 'T', term: 'Trauma', hindi: 'सदमा', explanation: 'Lasting emotional pain from distressing events' },
  { letter: 'U', term: 'Uncertain', hindi: 'संदेहयुक्त', explanation: 'Not knowing what might happen next' },
  { letter: 'V', term: 'Vulnerable', hindi: 'नाजुक', explanation: 'Opening up and showing your true self' },
  { letter: 'W', term: 'Worth', hindi: 'लायक', explanation: 'Believing in your own inherent value' },
  { letter: 'X', term: 'Xenophobia', hindi: 'विदेशी लोगों को न पसन्द करना', explanation: 'Fear or hatred of perceived strangers' },
  { letter: 'Y', term: 'Yourself', hindi: 'स्वयं', explanation: 'The core person who you are' },
  { letter: 'Z', term: 'Zen', hindi: 'सुकुन', explanation: 'A state of calm, peaceful focus' }
];

const HexagonCard: React.FC<{ data: TermData }> = ({ data }) => {
  return (
    <div className="relative w-full h-full transition-all duration-700 ease-out group"
      style={{ perspective: '1000px' }}>
      <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:rotate-y-180"
        style={{ transformStyle: 'preserve-3d' }}>
        {/* Front side */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-3"
          style={{
            backgroundColor: 'var(--color-bg-app)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-title mb-1" style={{ color: 'var(--color-primary)' }}>
              {data.letter}
            </div>
            <div className="font-body text-xs sm:text-sm" style={{ color: 'var(--color-text-body)' }}>
              {data.term}
            </div>
            <div className="font-body text-xs opacity-75 mt-0.5" style={{ color: 'var(--color-text-body)' }}>
              ({data.hindi})
            </div>
          </div>
        </div>

        {/* Back side */}
        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3"
          style={{
            backgroundColor: 'var(--color-bg-subtle)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}>
          <p className="font-body text-xs sm:text-sm leading-relaxed text-center" style={{ color: 'var(--color-text-body)' }}>
            {data.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};

const MentalHealthBasics: React.FC = () => {
  // Create rows for honeycomb pattern - more balanced
  const rows = [
    mentalHealthBasics.slice(0, 6),   // A-F (6)
    mentalHealthBasics.slice(6, 13),  // G-M (7)
    mentalHealthBasics.slice(13, 19), // N-S (6)
    mentalHealthBasics.slice(19, 26)  // T-Z (7)
  ];

  return (
    <section 
      className="py-12 md:py-16 px-4 md:px-8"
      style={{ backgroundColor: 'var(--color-bg-card)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-title text-2xl md:text-3xl mb-3" style={{ color: 'var(--color-text-body)' }}>
            The Language Of Feelings
          </h2>
          <p className="font-body text-base md:text-lg max-w-2xl mx-auto opacity-80" style={{ color: 'var(--color-text-body)' }}>
            The journey from Anxiety to Zen
          </p>
        </div>

        {/* Honeycomb Grid */}
        <div className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3">
          {rows.map((row, rowIndex) => (
            <div 
              key={rowIndex}
              className={`flex justify-center gap-1 sm:gap-2 md:gap-3 ${rowIndex % 2 === 1 ? 'ml-7 sm:ml-8 md:ml-9' : ''}`}
            >
              {row.map((term) => (
                <div 
                  key={term.letter}
                  className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36"
                >
                  <HexagonCard data={term} />
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>

      {/* Add CSS for the flip animation */}
      <style>{`
        .group:hover .group-hover\\:rotate-y-180 {
          transform: rotateY(180deg);
        }
        @media (max-width: 768px) {
          .group:active .group-hover\\:rotate-y-180 {
            transform: rotateY(180deg);
          }
        }
      `}</style>
    </section>
  );
};

export default MentalHealthBasics;