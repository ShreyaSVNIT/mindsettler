'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

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
    <div className="relative w-full h-full transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]" style={{ perspective: '1200px' }}>
      <div
        className="relative w-full h-full transition-transform duration-700 ease-out group-hover:rotate-y-180"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-3"
          style={{
            backgroundColor: 'var(--color-bg-app)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="font-title text-3xl sm:text-4xl md:text-5xl mb-1 text-[var(--color-primary)]">
            {data.letter}
          </div>
          <div className="font-body text-xs sm:text-sm md:text-base lg:text-lg font-medium line-clamp-1">{data.term}</div>
          <div className="font-body text-xs opacity-60 line-clamp-1">({data.hindi})</div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 flex items-center justify-center p-2 sm:p-3"
          style={{
            backgroundColor: 'var(--color-bg-lavender)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <p className="font-body text-xs sm:text-sm md:text-base text-center leading-tight sm:leading-snug text-[var(--color-text-secondary)]">
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

  // Logic to calculate start position (center explosion)
  // We approximate visual center of the grid to be around row index 1.5
  // and col index approx 3.
  const cardVariants = {
    hidden: (custom: { r: number; c: number; rowLen: number }) => {
      // Calculate distance from center
      const centerR = 1.5;
      const centerC = (custom.rowLen - 1) / 2;

      const dy = (custom.r - centerR) * 100; // Vertical distance
      const dx = (custom.c - centerC) * 100; // Horizontal distance

      return {
        opacity: 0,
        scale: 0.5, // Start slightly visible/larger for subtler effect
        x: -dx * 0.4, // Drastically reduced travel distance (was 1.5)
        y: -dy * 0.4,
      };
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100 // Slightly softer spring
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  return (
    <section className="relative py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 overflow-hidden bg-[var(--color-bg-card)]">
      <div className="relative w-full flex flex-col items-center">
        {/* TITLE - Centered for symmetry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-6 sm:mb-8 md:mb-12 text-center px-2"
        >
          <SectionHeader
            subheader="Emotional Alphabet"
            title={<>When feelings don't scream,<br />they <em>whisper</em>.</>}
            bodyText="A gentle A–Z of emotions — explore, pause, breathe."
            alignment="center"
            decoration="whiskers"
            layout="single"
          />
        </motion.div>

        {/* GRID - Centered with equal side spacing */}
        <motion.div
          className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3 w-full md:snap-none snap-y snap-mandatory overflow-y-auto md:overflow-visible"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px", amount: 0.2 }}
        >
          {rows.map((row, r) => (
            <div
              key={r}
              className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 w-full snap-start"
            >
              {row.map((term, c) => (
                <motion.div
                  key={term.letter}
                  custom={{ r, c, rowLen: row.length }}
                  variants={cardVariants}
                  className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40"
                  viewport={{ once: true, amount: 0.3 }}
                  initial="hidden"
                  whileInView="visible"
                >
                  <HexagonCard data={term} />
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
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