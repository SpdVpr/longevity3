export interface Study {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  url: string;
  findings: string;
}

export interface Supplement {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  benefits: string[];
  dosage: string;
  safetyProfile: string;
  interactions: string;
  imageUrl: string;
  studies: Study[];
}

export const topSupplements: Supplement[] = [
  {
    id: "vitamin-d",
    name: "Vitamin D3",
    scientificName: "Cholecalciferol",
    description: "Vitamin D is a fat-soluble vitamin that plays a crucial role in calcium absorption, immune function, and cellular health. While it can be synthesized in the skin upon exposure to sunlight, many people have insufficient levels due to limited sun exposure, age, or geographical location.",
    benefits: [
      "Supports bone health and reduces fracture risk",
      "Enhances immune system function",
      "May reduce risk of certain cancers",
      "Associated with lower all-cause mortality",
      "May improve cognitive function and mood"
    ],
    dosage: "1,000-4,000 IU daily, with higher doses sometimes recommended based on blood levels. Optimal blood levels are generally considered to be 30-50 ng/mL (75-125 nmol/L).",
    safetyProfile: "Generally safe at recommended doses. Toxicity is rare but possible with long-term high-dose supplementation (>10,000 IU daily for extended periods).",
    interactions: "May interact with certain medications including statins, steroids, and weight loss drugs. Those with sarcoidosis, hyperparathyroidism, or kidney disease should consult a healthcare provider.",
    imageUrl: "/images/supplements/vitamin-d.jpg",
    studies: [
      {
        title: "Vitamin D and mortality: meta-analysis of individual participant data from a large consortium of cohort studies from Europe and the United States",
        authors: "Schöttker B, et al.",
        journal: "BMJ",
        year: 2014,
        doi: "10.1136/bmj.g3656",
        url: "https://www.bmj.com/content/348/bmj.g3656",
        findings: "This meta-analysis found that the lowest 25(OH)D quartile was associated with increased all-cause mortality, cardiovascular mortality, and cancer mortality."
      },
      {
        title: "Effect of Vitamin D Supplementation on Cardiovascular Disease Risk",
        authors: "Barbarawi M, et al.",
        journal: "JAMA Cardiology",
        year: 2019,
        doi: "10.1001/jamacardio.2019.1870",
        url: "https://jamanetwork.com/journals/jamacardiology/fullarticle/2735646",
        findings: "This meta-analysis of 21 randomized clinical trials found that vitamin D supplementation was not associated with reduced risk of major adverse cardiovascular events, but may have benefits for specific populations."
      }
    ]
  },
  {
    id: "omega-3",
    name: "Omega-3 Fatty Acids",
    scientificName: "EPA (Eicosapentaenoic acid) and DHA (Docosahexaenoic acid)",
    description: "Omega-3 fatty acids are essential polyunsaturated fats primarily found in fatty fish, algae, and some plant oils. They are critical components of cell membranes and have significant anti-inflammatory properties.",
    benefits: [
      "Reduces inflammation throughout the body",
      "Supports cardiovascular health and may lower triglycerides",
      "May improve brain health and cognitive function",
      "Supports eye health and retinal function",
      "May help reduce symptoms of metabolic syndrome"
    ],
    dosage: "1-3 grams of combined EPA and DHA daily. Higher doses (2-4g) may be recommended for specific conditions like high triglycerides.",
    safetyProfile: "Generally recognized as safe. Minor side effects may include fishy aftertaste or mild digestive issues.",
    interactions: "May interact with blood-thinning medications. Those on anticoagulants should consult a healthcare provider before supplementing.",
    imageUrl: "/images/supplements/omega-3.jpg",
    studies: [
      {
        title: "Marine Omega-3 Supplementation and Cardiovascular Disease: An Updated Meta-Analysis of 13 Randomized Controlled Trials Involving 127,477 Participants",
        authors: "Hu Y, et al.",
        journal: "Journal of the American Heart Association",
        year: 2019,
        doi: "10.1161/JAHA.119.013543",
        url: "https://www.ahajournals.org/doi/10.1161/JAHA.119.013543",
        findings: "This meta-analysis found that marine omega-3 supplementation was associated with reduced risk of myocardial infarction, coronary heart disease death, total coronary heart disease, and cardiovascular disease death."
      },
      {
        title: "Effect of Omega-3 Fatty Acids on the Blood-Brain Barrier Function in Mild Cognitive Impairment",
        authors: "Freund-Levi Y, et al.",
        journal: "Journal of Internal Medicine",
        year: 2014,
        doi: "10.1111/joim.12190",
        url: "https://onlinelibrary.wiley.com/doi/10.1111/joim.12190",
        findings: "This study found that omega-3 supplementation may help maintain blood-brain barrier integrity in patients with early Alzheimer's disease."
      }
    ]
  },
  {
    id: "magnesium",
    name: "Magnesium",
    scientificName: "Various forms including magnesium citrate, glycinate, and malate",
    description: "Magnesium is an essential mineral involved in over 300 enzymatic reactions in the body. It plays crucial roles in energy production, DNA synthesis, muscle function, and nervous system regulation.",
    benefits: [
      "Supports cardiovascular health and may help regulate blood pressure",
      "Improves sleep quality and may help with insomnia",
      "Helps regulate blood glucose and insulin sensitivity",
      "Supports bone health and density",
      "May reduce frequency and intensity of migraines"
    ],
    dosage: "300-400 mg daily for adults. Different forms have varying bioavailability, with magnesium citrate, glycinate, and malate generally being better absorbed.",
    safetyProfile: "Generally safe at recommended doses. Higher doses may cause digestive upset or loose stools, which can be used therapeutically for constipation.",
    interactions: "May interact with certain antibiotics, diuretics, and medications for osteoporosis. Those with kidney disease should consult a healthcare provider before supplementing.",
    imageUrl: "/images/supplements/magnesium.jpg",
    studies: [
      {
        title: "Circulating and dietary magnesium and risk of cardiovascular disease: a systematic review and meta-analysis of prospective studies",
        authors: "Del Gobbo LC, et al.",
        journal: "American Journal of Clinical Nutrition",
        year: 2013,
        doi: "10.3945/ajcn.112.053132",
        url: "https://academic.oup.com/ajcn/article/98/1/160/4578315",
        findings: "This meta-analysis found that higher circulating magnesium levels were associated with a 30% lower risk of cardiovascular disease, and higher dietary magnesium intake was associated with a 22% lower risk of ischemic heart disease."
      },
      {
        title: "The effect of magnesium supplementation on primary insomnia in elderly: A double-blind placebo-controlled clinical trial",
        authors: "Abbasi B, et al.",
        journal: "Journal of Research in Medical Sciences",
        year: 2012,
        doi: "10.1155/2012/980318",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3703169/",
        findings: "This clinical trial found that magnesium supplementation improved subjective measures of insomnia, sleep efficiency, sleep time, and early morning awakening in elderly participants."
      }
    ]
  },
  {
    id: "nad-boosters",
    name: "NAD+ Boosters",
    scientificName: "Nicotinamide Riboside (NR) or Nicotinamide Mononucleotide (NMN)",
    description: "NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme found in all living cells that plays a crucial role in energy metabolism and cellular repair. NAD+ levels decline with age, and boosting them may help mitigate aspects of aging.",
    benefits: [
      "Supports cellular energy production",
      "May improve mitochondrial function",
      "Potentially activates sirtuins, proteins involved in longevity",
      "May support healthy aging and cellular repair processes",
      "Could help maintain neurological function"
    ],
    dosage: "For NR: 250-500 mg daily. For NMN: 250-1000 mg daily. Optimal dosing is still being researched.",
    safetyProfile: "Generally well-tolerated in studies to date. Long-term safety data is still being collected.",
    interactions: "Limited data on drug interactions. Those with medical conditions should consult a healthcare provider before supplementing.",
    imageUrl: "/images/supplements/nad-boosters.jpg",
    studies: [
      {
        title: "Chronic nicotinamide riboside supplementation is well-tolerated and elevates NAD+ in healthy middle-aged and older adults",
        authors: "Martens CR, et al.",
        journal: "Nature Communications",
        year: 2018,
        doi: "10.1038/s41467-018-03421-7",
        url: "https://www.nature.com/articles/s41467-018-03421-7",
        findings: "This clinical trial found that nicotinamide riboside supplementation safely increased NAD+ levels in healthy middle-aged and older adults."
      },
      {
        title: "Nicotinamide mononucleotide increases muscle insulin sensitivity in prediabetic women",
        authors: "Yoshino J, et al.",
        journal: "Science",
        year: 2021,
        doi: "10.1126/science.abe9985",
        url: "https://www.science.org/doi/10.1126/science.abe9985",
        findings: "This study found that NMN supplementation improved muscle insulin sensitivity and other metabolic parameters in prediabetic women."
      }
    ]
  },
  {
    id: "coq10",
    name: "Coenzyme Q10",
    scientificName: "Ubiquinone or Ubiquinol",
    description: "Coenzyme Q10 (CoQ10) is a naturally occurring antioxidant that plays a vital role in energy production within cells. It is particularly concentrated in tissues with high energy demands like the heart, liver, and kidneys. CoQ10 levels naturally decline with age and may be depleted by certain medications, particularly statins.",
    benefits: [
      "Supports cellular energy production",
      "Acts as a powerful antioxidant protecting cells from oxidative damage",
      "May support cardiovascular health and function",
      "May reduce statin-related muscle pain",
      "Potentially beneficial for migraine prevention"
    ],
    dosage: "100-200 mg daily for general health. Higher doses (300-600 mg) may be used for specific conditions. Ubiquinol form may be better absorbed, particularly in older adults.",
    safetyProfile: "Extremely well-tolerated with minimal side effects. Occasional mild digestive upset may occur.",
    interactions: "May interact with blood thinners, insulin, and some chemotherapy drugs. Those on statins may benefit from CoQ10 supplementation due to statin-induced depletion.",
    imageUrl: "/images/supplements/coq10.jpg",
    studies: [
      {
        title: "Effect of coenzyme Q10 supplementation on heart failure: a meta-analysis",
        authors: "Lei L, Liu Y",
        journal: "American Journal of Clinical Nutrition",
        year: 2017,
        doi: "10.3945/ajcn.117.152579",
        url: "https://academic.oup.com/ajcn/article/106/1/106/4569837",
        findings: "This meta-analysis found that CoQ10 supplementation improved ejection fraction and cardiac output in heart failure patients, and reduced mortality compared to placebo."
      },
      {
        title: "Coenzyme Q10 supplementation reduces oxidative stress and increases antioxidant enzyme activity in patients with coronary artery disease",
        authors: "Lee BJ, et al.",
        journal: "Nutrition",
        year: 2012,
        doi: "10.1016/j.nut.2011.06.004",
        url: "https://www.sciencedirect.com/science/article/abs/pii/S0899900711002024",
        findings: "This study found that CoQ10 supplementation reduced oxidative stress and increased antioxidant enzyme activities in patients with coronary artery disease."
      }
    ]
  }
];
