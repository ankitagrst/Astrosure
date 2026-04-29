import type { PlanetPosition } from "@/lib/astrology/kundali"

interface NorthIndianChartProps {
  planets: PlanetPosition[]
  ascendant: PlanetPosition
}

const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

const HOUSE_LABEL_POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 192, y: 44 },
  2: { x: 286, y: 88 },
  3: { x: 340, y: 160 },
  4: { x: 340, y: 246 },
  5: { x: 286, y: 318 },
  6: { x: 192, y: 358 },
  7: { x: 98, y: 318 },
  8: { x: 46, y: 246 },
  9: { x: 46, y: 160 },
  10: { x: 98, y: 88 },
  11: { x: 142, y: 44 },
  12: { x: 242, y: 44 },
}

export function NorthIndianChart({ planets, ascendant }: NorthIndianChartProps) {
  const size = 400
  const center = size / 2

  // Get planets in each house
  const getPlanetsInHouse = (houseNum: number) => {
    return planets.filter(p => p.house === houseNum)
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="border-2 border-orange-600 bg-white">
        {/* Outer square */}
        <rect x="0" y="0" width={size} height={size} fill="none" stroke="#ea580c" strokeWidth="2" />
        
        {/* Inner square (diamond) */}
        <polygon 
          points={`${center},0 ${size},${center} ${center},${size} 0,${center}`} 
          fill="none" 
          stroke="#ea580c" 
          strokeWidth="2" 
        />
        
        {/* Cross lines */}
        <line x1="0" y1="0" x2={size} y2={size} stroke="#ea580c" strokeWidth="1" />
        <line x1={size} y1="0" x2="0" y2={size} stroke="#ea580c" strokeWidth="1" />
        
        {/* House numbers and signs */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
          const pos = HOUSE_LABEL_POSITIONS[houseNum] ?? { x: center, y: center }
          const signIndex = (houseNum - 1 + Math.floor(ascendant.sign)) % 12
          
          return (
            <g key={houseNum}>
              {/* House number */}
              <text 
                x={pos.x}
                y={pos.y}
                fontSize="11"
                fontWeight="bold" 
                fill="#f97316"
              >
                {houseNum}
              </text>
              
              {/* Sign symbol */}
              <text 
                x={pos.x}
                y={pos.y + 14}
                fontSize="13"
                fill="#1f2937"
              >
                {SIGN_SYMBOLS[signIndex]}
              </text>
              
              {/* Planets in this house */}
              {getPlanetsInHouse(houseNum).map((planet, idx) => (
                <text
                  key={planet.planet}
                  x={pos.x}
                  y={pos.y + 28 + (idx * 12)}
                  fontSize="10"
                  fontWeight="bold"
                  fill={planet.isRetrograde ? "#dc2626" : "#000000"}
                >
                  {planet.planet}
                  {planet.isRetrograde && <tspan fontSize="8" dx="2">(R)</tspan>}
                </text>
              ))}
            </g>
          )
        })}
        
        {/* Center - Ascendant */}
        <circle cx={center} cy={center} r="25" fill="#fef3c7" stroke="#ea580c" strokeWidth="2" />
        <text 
          x={center} 
          y={center + 5} 
          textAnchor="middle" 
          fontSize="12" 
          fontWeight="bold" 
          fill="#ea580c"
        >
          Asc
        </text>
      </svg>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-700">
        <span className="font-medium">Planet labels are shown by name.</span>
        <span className="text-red-600">(R) = Retrograde</span>
      </div>
    </div>
  )
}
