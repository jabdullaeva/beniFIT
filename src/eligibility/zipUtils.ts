/**
 * Validates and derives New York county and locality from a 5-digit ZIP code.
 */

export interface NyZipInfo {
  zip: string;
  isValidNy: boolean;
  county: string;
  region: string;
  city: string;
}

const NY_ZIP_PREFIX_MAP: Record<string, { county: string; region: string; city: string }> = {
  // Manhattan
  '100': { county: 'New York (Manhattan)', region: 'New York City', city: 'New York' },
  '101': { county: 'New York (Manhattan)', region: 'New York City', city: 'New York' },
  '102': { county: 'New York (Manhattan)', region: 'New York City', city: 'New York' },
  // Staten Island
  '103': { county: 'Richmond (Staten Island)', region: 'New York City', city: 'Staten Island' },
  // Bronx
  '104': { county: 'Bronx', region: 'New York City', city: 'Bronx' },
  // Westchester & Hudson Valley
  '105': { county: 'Westchester', region: 'Hudson Valley', city: 'White Plains' },
  '106': { county: 'Westchester', region: 'Hudson Valley', city: 'White Plains' },
  '107': { county: 'Westchester', region: 'Hudson Valley', city: 'Yonkers' },
  '108': { county: 'Westchester', region: 'Hudson Valley', city: 'New Rochelle' },
  '109': { county: 'Rockland', region: 'Hudson Valley', city: 'Nyack' },
  // Western Queens / Nassau
  '110': { county: 'Nassau / Queens', region: 'Long Island / NYC', city: 'Floral Park' },
  // Queens
  '111': { county: 'Queens', region: 'New York City', city: 'Long Island City' },
  '113': { county: 'Queens', region: 'New York City', city: 'Flushing' },
  '114': { county: 'Queens', region: 'New York City', city: 'Jamaica' },
  '116': { county: 'Queens', region: 'New York City', city: 'Far Rockaway' },
  // Brooklyn
  '112': { county: 'Kings (Brooklyn)', region: 'New York City', city: 'Brooklyn' },
  // Nassau
  '115': { county: 'Nassau', region: 'Long Island', city: 'Mineola' },
  '117': { county: 'Suffolk', region: 'Long Island', city: 'Huntington' },
  '118': { county: 'Nassau', region: 'Long Island', city: 'Hicksville' },
  '119': { county: 'Suffolk', region: 'Long Island', city: 'Riverhead' },
  // Capital District & Mid-Hudson
  '120': { county: 'Albany / Saratoga', region: 'Capital Region', city: 'Albany' },
  '121': { county: 'Rensselaer', region: 'Capital Region', city: 'Troy' },
  '122': { county: 'Albany', region: 'Capital Region', city: 'Albany' },
  '123': { county: 'Schenectady', region: 'Capital Region', city: 'Schenectady' },
  '124': { county: 'Ulster', region: 'Mid-Hudson', city: 'Kingston' },
  '125': { county: 'Dutchess', region: 'Mid-Hudson', city: 'Poughkeepsie' },
  '126': { county: 'Dutchess', region: 'Mid-Hudson', city: 'Poughkeepsie' },
  '127': { county: 'Sullivan', region: 'Catskills', city: 'Monticello' },
  '128': { county: 'Warren / Washington', region: 'Adirondacks', city: 'Glens Falls' },
  '129': { county: 'Clinton / Essex', region: 'North Country', city: 'Plattsburgh' },
  // Central NY & Southern Tier
  '130': { county: 'Onondaga / Cortland', region: 'Central NY', city: 'Syracuse' },
  '131': { county: 'Cayuga / Oswego', region: 'Central NY', city: 'Auburn' },
  '132': { county: 'Onondaga', region: 'Central NY', city: 'Syracuse' },
  '133': { county: 'Oneida / Herkimer', region: 'Mohawk Valley', city: 'Utica' },
  '134': { county: 'Oneida', region: 'Mohawk Valley', city: 'Utica' },
  '135': { county: 'Oneida', region: 'Mohawk Valley', city: 'Utica' },
  '136': { county: 'Jefferson / St. Lawrence', region: 'North Country', city: 'Watertown' },
  '137': { county: 'Broome / Chenango', region: 'Southern Tier', city: 'Binghamton' },
  '138': { county: 'Otsego / Delaware', region: 'Southern Tier', city: 'Oneonta' },
  '139': { county: 'Broome', region: 'Southern Tier', city: 'Binghamton' },
  // Western NY & Finger Lakes
  '140': { county: 'Erie', region: 'Western NY', city: 'Buffalo' },
  '141': { county: 'Erie / Niagara', region: 'Western NY', city: 'Tonawanda' },
  '142': { county: 'Erie', region: 'Western NY', city: 'Buffalo' },
  '143': { county: 'Niagara', region: 'Western NY', city: 'Niagara Falls' },
  '144': { county: 'Ontario / Wayne', region: 'Finger Lakes', city: 'Canandaigua' },
  '145': { county: 'Monroe / Livingston', region: 'Finger Lakes', city: 'Rochester' },
  '146': { county: 'Monroe', region: 'Finger Lakes', city: 'Rochester' },
  '147': { county: 'Chautauqua / Cattaraugus', region: 'Western NY', city: 'Jamestown' },
  '148': { county: 'Steuben / Chemung', region: 'Southern Tier', city: 'Corning' },
  '149': { county: 'Chemung', region: 'Southern Tier', city: 'Elmira' },
};

export function lookupNyZip(zipInput: string | number): NyZipInfo {
  const clean = String(zipInput).trim().slice(0, 5);
  const isValidFormat = /^\d{5}$/.test(clean);

  if (!isValidFormat) {
    return {
      zip: clean,
      isValidNy: false,
      county: 'Unknown',
      region: 'Unknown',
      city: 'Unknown',
    };
  }

  const prefix3 = clean.slice(0, 3);
  const info = NY_ZIP_PREFIX_MAP[prefix3];

  if (!info) {
    // Check general NY range 10001 - 14925
    const num = parseInt(clean, 10);
    const isNyNumRange = num >= 10001 && num <= 14925;
    return {
      zip: clean,
      isValidNy: isNyNumRange,
      county: isNyNumRange ? 'New York State' : 'Out of State',
      region: isNyNumRange ? 'New York State' : 'Out of State',
      city: isNyNumRange ? 'New York' : 'Unknown',
    };
  }

  return {
    zip: clean,
    isValidNy: true,
    county: info.county,
    region: info.region,
    city: info.city,
  };
}
