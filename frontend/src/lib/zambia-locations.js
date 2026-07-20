// Zambia's 10 provinces and their districts, used for onboarding,
// profile and M&E reporting. Keep names in sync with backend M&E
// grouping (values are stored verbatim on User.province / User.district).

export const DISTRICTS_BY_PROVINCE = {
  Central: [
    "Chibombo", "Chisamba", "Chitambo", "Itezhi-Tezhi", "Kabwe",
    "Kapiri Mposhi", "Luano", "Mkushi", "Mumbwa", "Ngabwe", "Serenje",
    "Shibuyunji",
  ],
  Copperbelt: [
    "Chililabombwe", "Chingola", "Kalulushi", "Kitwe", "Luanshya",
    "Lufwanyama", "Masaiti", "Mpongwe", "Mufulira", "Ndola",
  ],
  Eastern: [
    "Chadiza", "Chasefu", "Chipangali", "Chipata", "Kasenengwa", "Katete",
    "Lumezi", "Lundazi", "Lusangazi", "Mambwe", "Nyimba", "Petauke",
    "Sinda", "Vubwi",
  ],
  Luapula: [
    "Chembe", "Chiengi", "Chifunabuli", "Chipili", "Kawambwa", "Lunga",
    "Mansa", "Milenge", "Mwansabombwe", "Mwense", "Nchelenge", "Samfya",
  ],
  Lusaka: ["Chilanga", "Chongwe", "Kafue", "Luangwa", "Lusaka", "Rufunsa"],
  Muchinga: [
    "Chama", "Chinsali", "Isoka", "Kanchibiya", "Lavushimanda", "Mafinga",
    "Mpika", "Nakonde", "Shiwang'andu",
  ],
  Northern: [
    "Chilubi", "Kaputa", "Kasama", "Lunte", "Lupososhi", "Luwingu",
    "Mbala", "Mporokoso", "Mpulungu", "Mungwi", "Nsama", "Senga Hill",
  ],
  "North-Western": [
    "Chavuma", "Ikelenge", "Kabompo", "Kalumbila", "Kasempa", "Manyinga",
    "Mufumbwe", "Mushindamo", "Mwinilunga", "Solwezi", "Zambezi",
  ],
  Southern: [
    "Chikankata", "Chirundu", "Choma", "Gwembe", "Kalomo", "Kazungula",
    "Livingstone", "Mazabuka", "Monze", "Namwala", "Pemba", "Siavonga",
    "Sinazongwe", "Zimba",
  ],
  Western: [
    "Kalabo", "Kaoma", "Limulunga", "Luampa", "Lukulu", "Mitete",
    "Mongu", "Mulobezi", "Mwandi", "Nalolo", "Nkeyema", "Senanga",
    "Sesheke", "Shangombo", "Sikongo", "Sioma",
  ],
};

export const PROVINCES = Object.keys(DISTRICTS_BY_PROVINCE);

export const DISABILITY_OPTIONS = [
  "None",
  "Visual impairment",
  "Hearing impairment",
  "Physical disability",
  "Intellectual / learning disability",
  "Other",
  "Prefer not to say",
];
