import { Supplement, EvidenceLevel } from '../types';

export const topSupplements: Supplement[] = [
  {
    id: '1',
    name: 'NMN (Nicotinamide Mononucleotide)',
    scientificName: 'β-Nicotinamide Mononucleotide',
    description: 'NMN is a precursor to NAD+, a coenzyme essential for cellular energy production and DNA repair. NAD+ levels decline with age, and boosting them may help counteract age-related cellular dysfunction.',
    benefits: [
      'Supports cellular energy production',
      'Promotes DNA repair mechanisms',
      'May improve insulin sensitivity',
      'Potential cardiovascular benefits',
      'Supports mitochondrial function'
    ],
    dosage: '250-1200mg daily',
    warnings: [
      'Limited long-term human studies',
      'May interact with medications affecting liver function',
      'Expensive compared to other supplements'
    ],
    evidence: EvidenceLevel.Moderate,
    image: '/images/supplements/nmn.jpg',
    slug: 'nmn'
  },
  {
    id: '2',
    name: 'Resveratrol',
    scientificName: '3,5,4′-trihydroxy-trans-stilbene',
    description: 'Resveratrol is a polyphenol found in red wine, grapes, and berries. It activates sirtuins, particularly SIRT1, which regulate cellular health, metabolism, and aging processes.',
    benefits: [
      'Activates longevity pathways (sirtuins)',
      'Antioxidant properties',
      'Supports cardiovascular health',
      'May improve insulin sensitivity',
      'Potential neuroprotective effects'
    ],
    dosage: '100-500mg daily',
    warnings: [
      'Poor bioavailability when taken orally',
      'May interact with blood thinners',
      'Can inhibit certain enzymes that metabolize medications'
    ],
    evidence: EvidenceLevel.Moderate,
    image: '/images/supplements/resveratrol.jpg',
    slug: 'resveratrol'
  },
  {
    id: '3',
    name: 'Spermidine',
    scientificName: 'N-(3-aminopropyl)butane-1,4-diamine',
    description: 'Spermidine is a naturally occurring polyamine that induces autophagy, the cellular "cleaning" process that removes damaged components. Autophagy declines with age, and enhancing it may promote longevity.',
    benefits: [
      'Induces autophagy (cellular cleaning)',
      'Supports cardiovascular health',
      'May improve cognitive function',
      'Potential immune system benefits',
      'Supports mitochondrial function'
    ],
    dosage: '1-5mg daily',
    warnings: [
      'Limited commercial availability of high-quality supplements',
      'Optimal human dosage still being researched',
      'May interact with certain medications'
    ],
    evidence: EvidenceLevel.Moderate,
    image: '/images/supplements/spermidine.jpg',
    slug: 'spermidine'
  },
  {
    id: '4',
    name: 'Fisetin',
    scientificName: '3,3′,4′,7-Tetrahydroxyflavone',
    description: 'Fisetin is a flavonoid with senolytic properties, meaning it can selectively eliminate senescent (zombie) cells that accumulate with age and promote inflammation and tissue dysfunction.',
    benefits: [
      'Senolytic (removes senescent cells)',
      'Strong anti-inflammatory properties',
      'Neuroprotective effects',
      'Antioxidant properties',
      'May improve cognitive function'
    ],
    dosage: '100-500mg daily for 2-3 days every few months',
    warnings: [
      'Optimal dosing protocol still being researched',
      'May have blood-thinning effects',
      'Limited long-term human studies'
    ],
    evidence: EvidenceLevel.Moderate,
    image: '/images/supplements/fisetin.jpg',
    slug: 'fisetin'
  },
  {
    id: '5',
    name: 'Berberine',
    scientificName: 'Berberine hydrochloride',
    description: 'Berberine is a bioactive compound found in several plants. It activates AMPK, an enzyme that regulates metabolism and is considered a key target for longevity interventions.',
    benefits: [
      'Activates AMPK (longevity pathway)',
      'Improves insulin sensitivity',
      'Supports cardiovascular health',
      'May help regulate lipid metabolism',
      'Potential gut health benefits'
    ],
    dosage: '500-1500mg daily, divided into 2-3 doses',
    warnings: [
      'May interact with medications metabolized by CYP enzymes',
      'Can cause digestive discomfort in some people',
      'Should be used cautiously with diabetes medications'
    ],
    evidence: EvidenceLevel.Strong,
    image: '/images/supplements/berberine.jpg',
    slug: 'berberine'
  }
];

export const allSupplements: Supplement[] = [
  ...topSupplements,
  {
    id: '6',
    name: 'Quercetin',
    scientificName: '3,3′,4′,5,7-Pentahydroxyflavone',
    description: 'Quercetin is a flavonoid with senolytic properties that can help eliminate senescent cells. It also has antioxidant and anti-inflammatory effects.',
    benefits: [
      'Senolytic (removes senescent cells)',
      'Potent antioxidant',
      'Anti-inflammatory properties',
      'May support immune function',
      'Potential allergy relief'
    ],
    dosage: '500-1000mg daily for 2-3 days every few months (senolytic protocol) or 50-500mg daily (general use)',
    warnings: [
      'May interact with certain antibiotics and medications',
      'Can inhibit some enzymes involved in drug metabolism',
      'High doses may cause headaches in some people'
    ],
    evidence: EvidenceLevel.Moderate,
    image: '/images/supplements/quercetin.jpg',
    slug: 'quercetin'
  },
  {
    id: '7',
    name: 'CoQ10 (Ubiquinol)',
    scientificName: 'Coenzyme Q10',
    description: 'CoQ10 is a coenzyme vital for energy production in cells. Levels decline with age, and supplementation may support mitochondrial function and cardiovascular health.',
    benefits: [
      'Supports mitochondrial energy production',
      'Potent antioxidant',
      'Promotes cardiovascular health',
      'May reduce statin-related muscle pain',
      'Supports cellular energy metabolism'
    ],
    dosage: '100-300mg daily (preferably ubiquinol form)',
    warnings: [
      'May interact with blood thinners and some other medications',
      'Can cause mild digestive discomfort in some people',
      'Absorption is enhanced when taken with fatty foods'
    ],
    evidence: EvidenceLevel.Strong,
    image: '/images/supplements/coq10.jpg',
    slug: 'coq10'
  },
  {
    id: '8',
    name: 'Alpha-Lipoic Acid',
    scientificName: '1,2-dithiolane-3-pentanoic acid',
    description: 'Alpha-lipoic acid is a powerful antioxidant that can regenerate other antioxidants like vitamins C and E. It supports mitochondrial function and may help combat oxidative stress.',
    benefits: [
      'Universal antioxidant (works in both water and fat-soluble environments)',
      'Supports mitochondrial function',
      'May improve insulin sensitivity',
      'Potential neuroprotective effects',
      'Helps regenerate other antioxidants'
    ],
    dosage: '300-600mg daily',
    warnings: [
      'May lower blood sugar levels',
      'Can interact with diabetes medications',
      'May interfere with thyroid hormone medications'
    ],
    evidence: EvidenceLevel.Moderate,
    image: '/images/supplements/alpha-lipoic-acid.jpg',
    slug: 'alpha-lipoic-acid'
  }
];
