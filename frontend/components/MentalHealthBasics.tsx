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
  // Replace row-sliced layout with a responsive CSS grid to keep heights consistent
  const itemVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 22, stiffness: 120 } }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 md:px-8 overflow-hidden bg-[var(--color-bg-card)]">
      <div className="max-w-6xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-12 sm:mb-16 md:mb-20 text-center px-2 mx-auto"
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

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {mentalHealthBasics.map((term, i) => (
            <motion.div key={term.letter} variants={itemVariants} className="w-full">
              <div className="aspect-square w-full">
                <HexagonCard data={term} />
              </div>
            </motion.div>
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