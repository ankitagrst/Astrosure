import { NorthIndianChart } from "@/components/astrology/north-indian-chart"
import type { DivisionalChartData, DivisionalChartKey } from "@/lib/astrology/kundali"
import type { Language } from "@/lib/translations/kundali"

type ChartTabContentProps = {
  language: Language
  allDivisionalCharts: Array<{ key: DivisionalChartKey; data: DivisionalChartData }>
  selectedDivisionalChart: DivisionalChartKey
  onSelectDivisionalChart: (key: DivisionalChartKey) => void
  buildDivisionalNarrative: (key: DivisionalChartKey, data: DivisionalChartData) => string
  localizePlanetName: (name: string) => string
  localizeSignByIndex: (index: number) => string
}

export function ChartTabContent({
  language,
  allDivisionalCharts,
  selectedDivisionalChart,
  onSelectDivisionalChart,
  buildDivisionalNarrative,
  localizePlanetName,
  localizeSignByIndex,
}: ChartTabContentProps) {
  const selectedChartData = allDivisionalCharts.find((item) => item.key === selectedDivisionalChart)?.data ?? allDivisionalCharts[0]?.data

  if (!selectedChartData) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 p-1 shadow-xl">
        <div className="rounded-xl bg-white p-6">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            {selectedChartData.key} - {selectedChartData.label} Chart
          </h3>
          <p className="mb-4 text-sm text-gray-600">{selectedChartData.description}</p>
          <div className="flex justify-center">
            <div className="relative">
              <NorthIndianChart planets={selectedChartData.planets} ascendant={selectedChartData.ascendant} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {language === "hi" ? "वर्ग कुंडलियां (Varga)" : "Divisional Charts (Varga)"}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allDivisionalCharts.map(({ key, data }) => {
            const isActive = key === selectedDivisionalChart
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectDivisionalChart(key)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  isActive
                    ? "border-orange-300 bg-orange-50 ring-2 ring-orange-200"
                    : "border-gray-200 bg-gray-50 hover:bg-orange-50/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {data.key} - {data.label}
                  </h4>
                  {isActive && <span className="text-xs font-medium text-orange-600">Viewing</span>}
                </div>
                <p className="mt-1 text-xs text-gray-600">{data.description}</p>
                <p className="mt-2 text-xs text-gray-500">{buildDivisionalNarrative(key, data)}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {language === "hi" ? "वर्ग कुंडली विवरण" : "Divisional Chart Details"}
        </h3>
        <div className="space-y-4">
          {allDivisionalCharts.map(({ key, data }) => (
            <div key={key} className="rounded-lg border border-green-100 bg-green-50/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  {data.key} - {data.label}
                </p>
                <span className="rounded bg-white px-2 py-1 text-xs text-gray-600">{data.description}</span>
              </div>
              <p className="mt-2 text-xs text-gray-600">{buildDivisionalNarrative(key, data)}</p>
              <div className="mt-3 overflow-x-auto rounded border bg-white">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left">{language === "hi" ? "ग्रह" : "Planet"}</th>
                      <th className="px-2 py-2 text-left">{language === "hi" ? "राशि" : "Sign"}</th>
                      <th className="px-2 py-2 text-left">{language === "hi" ? "भाव" : "House"}</th>
                      <th className="px-2 py-2 text-left">{language === "hi" ? "देशांश" : "Longitude"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.planets.map((planet) => (
                      <tr key={`${key}-${planet.planet}`}>
                        <td className="px-2 py-2 font-medium text-gray-900">{localizePlanetName(planet.planet)}</td>
                        <td className="px-2 py-2 text-gray-700">{localizeSignByIndex(planet.sign)}</td>
                        <td className="px-2 py-2 text-gray-700">{planet.house}</td>
                        <td className="px-2 py-2 text-gray-700">{planet.longitude.toFixed(2)}°</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
