import type { PlanetPosition } from "@/lib/astrology/kundali"
import type { Language } from "@/lib/translations/kundali"
import type { AshtakavargaMatrix } from "@/lib/astrology/comprehensive-kundali"

const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"]

type HouseTabContentProps = {
  language: Language
  planets: PlanetPosition[]
  ascendantSign: number
  localizeSignByIndex: (index: number) => string
  localizePlanetName: (name: string) => string
  buildHouseNarrative: (houseNum: number) => string
  getHouseInfluenceScore: (planet: string, house: number) => number
  ashtakavarga?: AshtakavargaMatrix
}

export function HouseTabContent({
  language,
  planets,
  ascendantSign,
  localizeSignByIndex,
  localizePlanetName,
  buildHouseNarrative,
  getHouseInfluenceScore,
  ashtakavarga,
}: HouseTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{language === "hi" ? "भाव विश्लेषण" : "Houses Analysis"}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === "hi" ? "भाव" : "House"}</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === "hi" ? "राशि" : "Sign"}</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === "hi" ? "राशि स्वामी" : "Sign Lord"}</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">{language === "hi" ? "ग्रह" : "Planets"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.from({ length: 12 }, (_, i) => {
                const houseNum = i + 1
                const planetsInHouse = planets.filter((p) => p.house === houseNum)
                const houseSign = (ascendantSign + i) % 12
                return (
                  <tr key={houseNum}>
                    <td className="px-3 py-2 font-medium text-gray-900">{houseNum}</td>
                    <td className="px-3 py-2 text-gray-700">{localizeSignByIndex(houseSign)}</td>
                    <td className="px-3 py-2 text-gray-700">{localizePlanetName(SIGN_LORDS[houseSign])}</td>
                    <td className="px-3 py-2 text-gray-700">
                      {planetsInHouse.map((p) => localizePlanetName(p.planet)).join(", ") || "-"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{language === "hi" ? "भाव-दर-भाव विश्लेषण" : "House-by-House Analysis"}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 12 }, (_, idx) => idx + 1).map((houseNum) => (
            <div key={houseNum} className="rounded-lg border border-blue-100 bg-blue-50/40 p-4">
              <p className="text-sm font-semibold text-gray-900">{language === "hi" ? `भाव ${houseNum}` : `House ${houseNum}`}</p>
              <p className="mt-2 text-xs text-gray-600">{buildHouseNarrative(houseNum)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
          {language === "hi" ? "ग्रह-भाव प्रभाव मैट्रिक्स (डायनेमिक)" : "Planet-House Influence Matrix (Dynamic)"}
        </h3>
        <p className="mb-2 text-xs text-gray-500">
          {language === "hi"
            ? "यह मैट्रिक्स वास्तविक ग्रह स्थिति, भाव दूरी और वक्री/मार्गी स्थिति के आधार पर निकाला गया है।"
            : "This matrix is derived from actual planet positions, house distance, and retrograde/direct status."}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left font-semibold text-gray-700">{language === "hi" ? "ग्रह" : "Planet"}</th>
                {Array.from({ length: 12 }, (_, i) => (
                  <th key={i} className="px-2 py-2 text-center font-semibold text-gray-700">{i + 1}</th>
                ))}
                <th className="px-2 py-2 text-center font-semibold text-gray-700">{language === "hi" ? "कुल" : "Total"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Asc"].map((planet) => (
                <tr key={planet}>
                  <td className="px-2 py-2 font-medium text-gray-900">{planet === "Asc" ? "Asc" : localizePlanetName(planet)}</td>
                  {Array.from({ length: 12 }, (_, i) => {
                    const score = getHouseInfluenceScore(planet, i + 1)
                    return (
                      <td key={i} className={`px-2 py-2 text-center text-gray-700 ${score >= 5 ? "bg-green-50 font-semibold" : score <= 2 ? "bg-red-50" : ""}`}>
                        {score}
                      </td>
                    )
                  })}
                  <td className="px-2 py-2 text-center font-bold text-gray-900">
                    {Array.from({ length: 12 }, (_, i) => getHouseInfluenceScore(planet, i + 1)).reduce((acc, val) => acc + val, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {ashtakavarga ? (
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
            {language === "hi" ? "अष्टकवर्ग बिंदु मैट्रिक्स (डायनेमिक)" : "Ashtakavarga Bindu Matrix (Dynamic)"}
          </h3>
          <p className="mb-2 text-xs text-gray-500">
            {language === "hi"
              ? `सर्वाष्टकवर्ग के अनुसार सबसे मजबूत भाव: ${ashtakavarga.strongestHouse}, सबसे कमजोर भाव: ${ashtakavarga.weakestHouse}`
              : `Strongest house by Sarvashtakavarga: ${ashtakavarga.strongestHouse}, weakest house: ${ashtakavarga.weakestHouse}`}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">{language === "hi" ? "ग्रह" : "Planet"}</th>
                  {Array.from({ length: 12 }, (_, i) => (
                    <th key={i} className="px-2 py-2 text-center font-semibold text-gray-700">{i + 1}</th>
                  ))}
                  <th className="px-2 py-2 text-center font-semibold text-gray-700">{language === "hi" ? "कुल" : "Total"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ashtakavarga.rows.map((row) => (
                  <tr key={row.planet}>
                    <td className="px-2 py-2 font-medium text-gray-900">{localizePlanetName(row.planet)}</td>
                    {row.bindus.map((v, i) => (
                      <td key={i} className={`px-2 py-2 text-center ${v > 0 ? "bg-green-50 font-semibold text-green-700" : "text-gray-400"}`}>
                        {v}
                      </td>
                    ))}
                    <td className="px-2 py-2 text-center font-bold text-gray-900">{row.total}</td>
                  </tr>
                ))}
                <tr className="bg-orange-50">
                  <td className="px-2 py-2 font-bold text-gray-900">{language === "hi" ? "सर्वाष्टकवर्ग" : "Sarvashtakavarga"}</td>
                  {ashtakavarga.sarvashtakavarga.map((v, i) => (
                    <td key={i} className="px-2 py-2 text-center font-bold text-orange-700">{v}</td>
                  ))}
                  <td className="px-2 py-2 text-center font-bold text-orange-700">
                    {ashtakavarga.sarvashtakavarga.reduce((s, v) => s + v, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}
