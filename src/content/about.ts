import { education } from "./education";
import type { AboutBlock, AboutVideo, Meet } from "./types";

export const aboutMeta = {
  title: "About",
  description:
    "Beyond the code: moving from Colombia to Canada at 16, working through college, my animals, my family and competitive powerlifting.",
};

export const aboutSettings = {
  // Placeholder photo boxes always show in development. Set true to also show them on the live site.
  showPlaceholdersInProduction: false,
};

export const aboutHeader = {
  command: "cat about.md",
  title: "About me",
  subtitle: "The person behind the projects.",
};

// DRAFT: wording below is a first pass for the owner's review.
export const who: AboutBlock & { draft: boolean } = {
  draft: true,
  paragraphs: [
    "I'm the extrovert in the room: social, always up for a conversation, and usually the one cracking the joke. I'm also a good listener, which turns out to matter a lot when your job is figuring out what someone actually needs.",
    "I'm a software developer, but I'd like to be remembered as a person first: curious about how systems work, and even more curious about the people who use them.",
  ],
  photos: [
    {
      file: "portrait.jpg",
      aspect: "4/5",
      alt: "Daniel in a white t-shirt holding a woven striped scarf while the wind blows his long hair",
      ready: true,
    },
  ],
};

export const colombia: AboutBlock = {
  paragraphs: [
    "I grew up in Armenia, Quindío, Colombia, and I lived my whole life under my mother's roof until I was 16, when I moved to Canada in 2018.",
    "Suddenly I was running my own life, and almost everything about it was hard: missing my family, the financial pressure, never having enough time. I won't pretend otherwise.",
    "With time and dedication it got easier. Not all at once, but little by little: a routine here, a small win there, until the things that scared me became things I could handle. I'm proud of that, and I carry it into everything else.",
  ],
  chips: ["Armenia, Quindío, Colombia", "Moved to Canada in 2018"],
  chipsLabel: "Where I'm from",
  photos: [
    {
      file: "colombia.jpg",
      aspect: "3/2",
      alt: "Daniel smiling in a selfie, wearing a wide-brimmed woven hat and a striped poncho beside a bamboo bench in a green forest",
      ready: true,
    },
  ],
};

const program = education[0];

export const school: AboutBlock = {
  paragraphs: [
    `I studied ${program.field} at ${program.org}, and for my entire time there I worked either full-time or part-time to cover tuition and living costs.`,
    "For a full year I worked full-time at AMJ Campbell while studying. It meant learning to protect my time, plan ahead and show up prepared, because there was never room to catch up later.",
  ],
  bullets: [
    "Classes, work and deadlines all had to fit into the same week, so I learned to prioritize early and stick to it.",
    "I finished with an 87% average in my major coursework while working.",
    "Discipline and time management stopped being buzzwords for me. They were how I got through each week.",
  ],
  photos: [
    {
      file: "school.jpg",
      aspect: "4/5",
      alt: "Daniel smiling and giving a thumbs up in front of a large window with a city view and holiday decorations",
      ready: true,
    },
    {
      file: "work.jpg",
      aspect: "4/5",
      alt: "Daniel sitting at a desk with a laptop and monitors, making hand gestures at the camera",
      ready: true,
    },
  ],
};

export const animals: AboutBlock = {
  paragraphs: [
    "I love animals, and I've been lucky to share my life with a lot of them: 8 dogs and 5 cats so far. Four dogs and two cats are still with me, and they definitely run the house.",
    "The ones who are no longer here were family, too. Each of them left something behind, and I think about them often.",
  ],
  chips: ["8 dogs", "5 cats", "4 dogs and 2 cats still with me"],
  chipsLabel: "Pets",
  photos: [
    {
      file: "dogs.jpg",
      aspect: "4/5",
      alt: "Daniel lying on a tiled floor next to a large sleeping husky",
      ready: true,
    },
    {
      file: "dogs-2.jpg",
      aspect: "4/5",
      alt: "A smiling woman hugging a large black dog with its tongue out",
      ready: true,
    },
    {
      file: "cats.jpg",
      aspect: "4/3",
      alt: "Daniel's cats",
    },
  ],
};

// Update the number of years each year.
export const family: AboutBlock = {
  paragraphs: [
    "Family is the reason leaving was so hard, and the reason I go back whenever I can. I visit my mom and my close family in Colombia as often as life allows.",
    "I'm engaged to my fiancée, and we've been together for seven years. She's been there through school, work and everything in between.",
  ],
  photos: [
    {
      file: "proposal.jpg",
      aspect: "4/5",
      alt: "Black-and-white photo of the proposal: Daniel kneeling with an open ring box in front of his fiancée, who is covering her face, surrounded by balloons",
      ready: true,
    },
    {
      file: "family.jpg",
      aspect: "4/5",
      alt: "Daniel with three family members standing in a blue and pink wooden doorway",
      ready: true,
    },
  ],
};

const instagramProfile = "https://www.instagram.com/latinnatty/";

export const powerlifting = {
  since: 2023,
  intro: [
    "I started lifting in 2023 and fell for powerlifting: three lifts, three attempts each, and an honest number at the end. It teaches the same things school and work did: show up, stay consistent and be patient.",
    "My first meet ended in a DQ. I'm including it on purpose, because it's the one that taught me the most.",
  ],
  openPowerlifting: {
    url: "https://www.openpowerlifting.org/u/danielmedinalopez",
    title: "OpenPowerlifting",
    description: "Every meet result, from the public record.",
  },
  youtube: {
    url: "https://www.youtube.com/@LatinNatty",
    title: "YouTube @LatinNatty",
    description: "Meet recaps and training clips.",
  },
  instagram: {
    url: instagramProfile,
    title: "Instagram @latinnatty",
    description: "Meet photos and videos.",
  },
};

// Results come from the public OpenPowerlifting record. Leave a field out to hide it.
export const meets: Meet[] = [
  {
    slug: "liftmass",
    name: "Apex Liftmass 2",
    host: "Apex Barbell Club",
    date: "2024-12-07",
    federation: "WRPF Canada",
    equipment: "Raw",
    division: "Junior",
    weightClassKg: 82.5,
    squat: 140,
    bench: "none",
    deadlift: 155,
    total: "none",
    placing: "DQ",
    story: [
      "My first meet didn't go the way I planned. I made my squat and my deadlift, but I missed all three bench attempts, which means no total and an official DQ.",
      "It wasn't the debut I wanted. But I treated it as information instead of a verdict: what happened on the platform, what I would change, and what I needed to work on before the next one.",
    ],
    instagramUrl: instagramProfile,
    photo: {
      file: "liftmass.jpg",
      aspect: "4/5",
      alt: "Daniel competing at Apex Liftmass 2",
    },
  },
  {
    slug: "maple-city-classic",
    name: "Maple City Classic 2",
    host: "Maple City Power",
    date: "2025-05-10",
    federation: "WRPF Canada",
    equipment: "Raw",
    division: "Junior",
    weightClassKg: 82.5,
    squat: 145,
    bench: 97.5,
    deadlift: 160,
    total: 402.5,
    dots: 275.1,
    placing: "1st",
    story: [
      "Five months later I was back. Nine attempts, nine good lifts, a 402.5 kg total and first place.",
    ],
    instagramUrl: instagramProfile,
    photo: {
      file: "maple-city.jpg",
      aspect: "4/5",
      alt: "Daniel competing at Maple City Classic 2",
    },
  },
  {
    slug: "defenders-of-faith",
    name: "Defenders of Faith",
    host: "Free Bird",
    date: "2025-12-06",
    federation: "WRPF Canada",
    equipment: "Raw",
    division: "Junior",
    weightClassKg: 82.5,
    squat: 155,
    bench: 105,
    deadlift: 170,
    total: 430,
    dots: 292.08,
    placing: "1st",
    story: [
      "Seven months after that I added 27.5 kg to my total and finished at 430 kg, with another first place. I also took shots at heavier bench and deadlift attempts on my last tries.",
    ],
    instagramUrl: "https://www.instagram.com/p/DTRqz__DQIW/",
    photo: {
      file: "defenders.jpg",
      aspect: "4/5",
      alt: "Daniel competing at Defenders of Faith",
    },
  },
];

export const videos: AboutVideo[] = [
  { id: "7WCyFNVeIJw", title: "Defenders of the Faith: Meet Recap" },
  { id: "e_PKv8bWR8M", title: "2 year Powerlifting transformation" },
  { id: "xzm_k2_IFKk", title: "Practicing sumo deadlift" },
  { id: "PY5cZTHdlIc", title: "140kgs / 308lbs x1 Beltless" },
];
