export type ResourceType = 'blog' | 'article' | 'video' | 'link';

export interface Resource {
    id: string;
    type: ResourceType;
    title: string;
    description: string;
    content?: string; // Markdown/HTML for Blogs/Articles
    imageUrl: string;
    videoUrl?: string; // For videos
    externalUrl?: string; // For Links
    date: string;
    author?: string;
}

export const resources: Resource[] = [
    // --- BLOGS (Long form) ---
    {
        id: 'blog-1',
        type: 'blog',
        title: 'The Art of Mindful Living',
        description: 'Discover how daily mindfulness practices can transform your mental clarity and emotional resilience. A deep dive into ancient techniques for modern life.',
        imageUrl: '/img8.jpg',
        date: 'October 12, 2023',
        author: 'Dr. Sarah Jenkins',
        content: `
      <p>Mindfulness is more than just a buzzword; it's a way of being that can radically shift your perspective on life. In this comprehensive guide, we will explore the foundations of mindful living.</p>
      <h3>What is Mindfulness?</h3>
      <p>At its core, mindfulness is the ability to be fully present, aware of where we are and what we’re doing, and not overly reactive or overwhelmed by what’s going on around us.</p>
      <h3>The Science Behind It</h3>
      <p>Research suggests that mindfulness practices are useful in the treatment of pain, stress, depression, and addiction. By focusing on the here and now, many people who practice mindfulness find that they are less likely to get caught up in worries about the future or regrets over the past.</p>
      <h3>Practical Steps</h3>
      <ol>
        <li>Start with 5 minutes of focused breathing.</li>
        <li>Pay attention to your senses during daily activities.</li>
        <li>Practice non-judgmental observation of your thoughts.</li>
      </ol>
      <p>Keep coming back to your breath. It's an anchor that is always with you.</p>
    `
    },
    {
        id: 'blog-2',
        type: 'blog',
        title: 'Understanding Anxiety Triggers',
        description: 'A comprehensive guide to identifying and managing the hidden triggers that spark anxiety in your daily life.',
        imageUrl: '/img9.jpg',
        date: 'November 05, 2023',
        author: 'Mark Thompson, LMFT',
        content: `
      <p>Anxiety often feels like it comes out of nowhere, but it usually has specific triggers. Learning to identify them is the first step towards reclamation.</p>
      <h3>Common Triggers</h3>
      <p>Caffeine, lack of sleep, stress at work, and social conflict are common culprits. However, more subtle triggers like specific smells or sounds can also play a role.</p>
      <h3>Journaling for Clarity</h3>
      <p>Keeping a trigger journal can be immensely helpful. Note down what was happening right before you felt a spike in anxiety.</p>
    `
    },
    {
        id: 'blog-3',
        type: 'blog',
        title: 'The Power of Sleep on Mental Health',
        description: 'Why sleep is the foundation of emotional stability and how to fix your sleep hygiene starting tonight.',
        imageUrl: '/img10.jpg',
        date: 'December 20, 2023',
        author: 'Dr. Emily Chen',
        content: `
      <p>Sleep is when our brain processes emotions. Without it, we are more reactive and less resilient.</p>
      <h3>Sleep Hygiene Tips</h3>
      <p>Avoid screens an hour before bed. Keep your room cool and dark. Stick to a consistent schedule.</p>
    `
    },
    {
        id: 'blog-4',
        type: 'blog',
        title: 'Navigating Grief and Loss',
        description: 'Processing loss is never linear. This article explores the stages of grief and healthy coping mechanisms.',
        imageUrl: '/img11.jpg',
        date: 'January 15, 2024',
        author: 'Rebecca Solnit',
        content: `
      <p>Grief is a natural response to loss. It’s the emotional suffering you feel when something or someone you love is taken away.</p>
    `
    },

    // --- ARTICLES (Shorter, punchier) ---
    {
        id: 'article-1',
        type: 'article',
        title: '5 Quick Stress Busters',
        description: 'Instant techniques to lower your cortisol levels in under 5 minutes.',
        imageUrl: '/img8.jpg',
        date: 'Feb 10, 2024',
        author: 'MindSettler Team',
        content: '<p>1. Deep Breathing. 2. Progressive Muscle Relaxation. 3. Visualization. 4. Sensory Grounding. 5. Stretching.</p>'
    },
    {
        id: 'article-2',
        type: 'article',
        title: 'Foods that Boost Mood',
        description: 'Nutritional psychiatry explains how your diet affects your emotions.',
        imageUrl: '/img9.jpg',
        date: 'Feb 12, 2024',
        author: 'Nutritionist Jane',
        content: '<p>Include more Omega-3s, fermented foods, and colorful vegetables in your diet to support gut health and mood.</p>'
    },
    {
        id: 'article-3',
        type: 'article',
        title: 'Digital Detox Benefits',
        description: 'What happens to your brain when you unplug for a weekend.',
        imageUrl: '/img10.jpg',
        date: 'March 01, 2024',
        author: 'Tech Wellness',
        content: '<p>Reduced anxiety, better sleep, and improved focus are just a few benefits of stepping away from screens.</p>'
    },
    {
        id: 'article-4',
        type: 'article',
        title: 'The Psychology of Color',
        description: 'How your surroundings influence your mental state.',
        imageUrl: '/img11.jpg',
        date: 'March 05, 2024',
        author: 'Design Psych',
        content: '<p>Blue calms, red excites, green balances. Choose your environment wisely.</p>'
    },

    // --- VIDEOS ---
    {
        id: 'video-1',
        type: 'video',
        title: '10 Minute Guided Meditation',
        description: 'A simple guided session for beginners to find calm.',
        imageUrl: '/img8.jpg',
        videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM', // Example embed
        date: '2023',
        author: 'Mindfulness Coach'
    },
    {
        id: 'video-2',
        type: 'video',
        title: 'Understanding CBT',
        description: 'What is Cognitive Behavioral Therapy and how does it work?',
        imageUrl: '/img9.jpg',
        videoUrl: 'https://www.youtube.com/embed/9c_Bv_FBE-c',
        date: '2023',
        author: 'Dr. Ali Mattu'
    },
    {
        id: 'video-3',
        type: 'video',
        title: 'Yoga for Anxiety',
        description: 'Gentle movements to release physical tension caused by stress.',
        imageUrl: '/img10.jpg',
        videoUrl: 'https://www.youtube.com/embed/hJbRpHZr_d0',
        date: '2023',
        author: 'Yoga with Adriene'
    },
    {
        id: 'video-4',
        type: 'video',
        title: 'The Science of Happiness',
        description: 'An experiment in gratitude.',
        imageUrl: '/img11.jpg',
        videoUrl: 'https://www.youtube.com/embed/oHv6vTKD6lg',
        date: '2013',
        author: 'SoulPancake'
    },

    // --- LINKS ---
    {
        id: 'link-1',
        type: 'link',
        title: 'NIMH - Mental Health Info',
        description: 'Official National Institute of Mental Health resources.',
        imageUrl: '/img8.jpg',
        externalUrl: 'https://www.nimh.nih.gov/',
        date: 'Updated Daily',
        author: 'NIMH'
    },
    {
        id: 'link-2',
        type: 'link',
        title: 'Psychology Today',
        description: 'Find a therapist and read the latest psychology news.',
        imageUrl: '/img9.jpg',
        externalUrl: 'https://www.psychologytoday.com/',
        date: 'Live',
        author: 'Psychology Today'
    },
    {
        id: 'link-3',
        type: 'link',
        title: 'Headspace',
        description: 'Meditation and sleep made simple.',
        imageUrl: '/img10.jpg',
        externalUrl: 'https://www.headspace.com/',
        date: 'App',
        author: 'Headspace'
    },
    {
        id: 'link-4',
        type: 'link',
        title: 'Crisis Text Line',
        description: 'Text HOME to 741741 to connect with a Crisis Counselor.',
        imageUrl: '/img11.jpg',
        externalUrl: 'https://www.crisistextline.org/',
        date: '24/7',
        author: 'Crisis Text Line'
    }
];
