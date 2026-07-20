export function HubIllustration({ id }) {
    const cls = "w-[44px] h-[44px] sm:w-[80px] sm:h-[80px] drop-shadow-sm select-none";
    switch (id) {
        case "learn":
            return (<svg viewBox="0 0 100 100" className={cls} xmlns="http://www.w3.org/2000/svg">
          <path d="M 18,72 Q 50,84 82,72 L 82,62 Q 50,74 18,62 Z" fill="#F97316"/>
          <path d="M 82,62 L 82,72 L 84,72 L 84,62 Z" fill="#EA580C"/>
          <path d="M 22,60 Q 50,70 78,60 L 78,50 Q 50,60 22,50 Z" fill="#F8FAFC"/>
          <path d="M 22,60 L 22,50 L 20,50 L 20,60 Z" fill="#94A3B8"/>
          <path d="M 78,50 L 78,60 L 80,60 L 80,50 Z" fill="#CBD5E1"/>
          <path d="M 24,48 Q 50,57 76,48 L 76,40 Q 50,49 24,40 Z" fill="#3B82F6"/>
          <path d="M 76,40 L 76,48 L 78,48 L 78,40 Z" fill="#2563EB"/>
          <path d="M 50,16 L 86,28 L 50,40 L 14,28 Z" fill="#1E1B4B"/>
          <path d="M 32,32 L 32,46 C 32,52 68,52 68,46 L 68,32" fill="#312E81"/>
          <path d="M 50,28 L 76,34 L 76,46" stroke="#FBBF24" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <circle cx="76" cy="48" r="3.5" fill="#F59E0B"/>
        </svg>);
        case "healthy_futures":
            return (<svg viewBox="0 0 100 100" className={cls} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill="#FFE4E6" fillOpacity="0.3"/>
          <path d="M 50,86 C 50,86 10,54 10,32 C 10,16 26,8 38,20 C 44,26 50,34 50,34 C 50,34 56,26 62,20 C 74,8 90,16 90,32 C 90,54 50,86 50,86 Z" fill="#EC4899"/>
          <path d="M 50,82 C 50,82 14,51 14,32 C 14,19 27,12 37,23 L 50,36 L 63,23 C 73,12 86,19 86,32 C 86,51 50,82 50,82 Z" fill="#F43F5E"/>
          <path d="M 18,36 L 36,36 L 42,20 L 48,56 L 54,30 L 60,42 L 66,36 L 82,36" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>);
        case "stay_safe":
            return (<svg viewBox="0 0 100 100" className={cls} xmlns="http://www.w3.org/2000/svg">
          <path d="M 50,12 C 72,12 84,18 84,18 L 84,48 C 84,72 50,88 50,88 C 50,88 16,72 16,48 L 16,18 C 16,18 28,12 50,12 Z" fill="#3B82F6"/>
          <path d="M 50,17 C 68,17 78,22 78,22 L 78,48 C 78,68 50,82 50,82 C 50,82 22,68 22,48 L 22,22 C 22,22 32,17 50,17 Z" fill="#2563EB"/>
          <rect x="36" y="44" width="28" height="20" rx="4" fill="#FFFFFF"/>
          <path d="M 42,44 L 42,33 C 42,28 45,25 50,25 C 55,25 58,28 58,33 L 58,44" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
          <circle cx="50" cy="54" r="3.5" fill="#2563EB"/>
        </svg>);
        case "challenges":
            return (<svg viewBox="0 0 100 100" className={cls} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="38" fill="#FEF3C7" fillOpacity="0.4"/>
          <path d="M 30,16 Q 50,16 70,16 L 66,48 Q 50,56 34,48 Z" fill="#FBBF24"/>
          <path d="M 34,16 L 38,46 Q 50,52 62,46 L 66,16 Z" fill="#F59E0B"/>
          <path d="M 30,22 Q 18,24 22,34 Q 26,42 34,40" stroke="#F59E0B" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M 70,22 Q 82,24 78,34 Q 74,42 66,40" stroke="#F59E0B" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <rect x="44" y="48" width="12" height="18" fill="#D97706"/>
          <ellipse cx="50" cy="66" rx="22" ry="7" fill="#B45309"/>
          <ellipse cx="50" cy="66" rx="20" ry="5" fill="#CA8A04"/>
          <path d="M 50,24 L 53,29 L 59,29 L 54,33 L 56,38 L 50,35 L 44,38 L 46,33 L 41,29 L 47,29 Z" fill="#FFFFFF"/>
        </svg>);
        case "leadership":
            return (<svg viewBox="0 0 100 100" className={cls} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="38" fill="#E0F2FE" fillOpacity="0.4"/>
          <path d="M 50,8 L 62,34 L 90,34 L 68,52 L 76,78 L 50,62 L 24,78 L 32,52 L 10,34 L 38,34 Z" fill="#0D9488"/>
          <path d="M 50,14 L 60,36 L 84,36 L 64,51 L 71,73 L 50,59 L 29,73 L 36,51 L 16,36 L 40,36 Z" fill="#14B8A6"/>
          <circle cx="50" cy="42" r="6" fill="#FFFFFF" fillOpacity="0.4"/>
        </svg>);
        case "need_help":
            return (<svg viewBox="0 0 100 100" className={cls} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="38" fill="#FCE7F3" fillOpacity="0.4"/>
          <circle cx="50" cy="50" r="32" stroke="#FDA4AF" strokeWidth="15" fill="none"/>
          <circle cx="50" cy="50" r="32" stroke="#F43F5E" strokeWidth="15" fill="none" strokeDasharray="25 25"/>
          <circle cx="50" cy="50" r="24.5" stroke="#FFFFFF" strokeWidth="2.5" fill="none"/>
          <circle cx="50" cy="50" r="39.5" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 4" fill="none"/>
        </svg>);
        default:
            return null;
    }
}
