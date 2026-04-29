import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { PlanetPosition } from './kundali'
import { Dosha, DashaPeriod, Prediction, CharacterTrait } from './comprehensive-kundali'

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@react-pdf/font@0.1.2/fonts/Helvetica.ttf', fontWeight: 'normal' },
    { src: 'https://cdn.jsdelivr.net/npm/@react-pdf/font@0.1.2/fonts/Helvetica-Bold.ttf', fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ea580c',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ea580c',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    backgroundColor: '#fef3c7',
    padding: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    padding: 8,
    fontSize: 11,
  },
  tableHeader: {
    backgroundColor: '#f97316',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
  },
  value: {
    fontSize: 11,
    color: '#6b7280',
  },
  text: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 4,
  },
  positive: {
    color: '#059669',
  },
  negative: {
    color: '#dc2626',
  },
  highSeverity: {
    color: '#dc2626',
  },
  mediumSeverity: {
    color: '#f59e0b',
  },
  lowSeverity: {
    color: '#059669',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
})

interface KundaliPDFProps {
  name: string
  dob: string
  tob: string | null
  place: string
  planets: PlanetPosition[]
  ascendant: PlanetPosition
  chartId: string
  doshas: Dosha[]
  dashas: DashaPeriod[]
  predictions: Prediction[]
  characterTraits: CharacterTrait[]
  remedies: string[]
  mahakaalInfo?: {
    location: string
    latitude: number
    longitude: number
    timezone: number
    description: string
  } | null
}

export function KundaliPDF({ 
  name, dob, tob, place, planets, ascendant, chartId, 
  doshas, dashas, predictions, characterTraits, remedies, mahakaalInfo 
}: KundaliPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AstroSure - Comprehensive Kundali Report</Text>
          <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
        </View>

        {/* Basic Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Details</Text>
          <View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { width: '30%' }]}>
                <Text style={styles.label}>Name:</Text>
              </View>
              <View style={[styles.tableCell, { width: '70%' }]}>
                <Text style={styles.value}>{name}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { width: '30%' }]}>
                <Text style={styles.label}>Date of Birth:</Text>
              </View>
              <View style={[styles.tableCell, { width: '70%' }]}>
                <Text style={styles.value}>{dob}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { width: '30%' }]}>
                <Text style={styles.label}>Time of Birth:</Text>
              </View>
              <View style={[styles.tableCell, { width: '70%' }]}>
                <Text style={styles.value}>{tob || 'Unknown'}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { width: '30%' }]}>
                <Text style={styles.label}>Place of Birth:</Text>
              </View>
              <View style={[styles.tableCell, { width: '70%' }]}>
                <Text style={styles.value}>{place}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Mahakaal Time Information */}
        {mahakaalInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Calculation Method - Mahakaal Standard Time</Text>
            <View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, { width: '30%' }]}>
                  <Text style={styles.label}>Reference Location:</Text>
                </View>
                <View style={[styles.tableCell, { width: '70%' }]}>
                  <Text style={styles.value}>{mahakaalInfo.location}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, { width: '30%' }]}>
                  <Text style={styles.label}>Latitude:</Text>
                </View>
                <View style={[styles.tableCell, { width: '70%' }]}>
                  <Text style={styles.value}>{mahakaalInfo.latitude}°N</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, { width: '30%' }]}>
                  <Text style={styles.label}>Longitude:</Text>
                </View>
                <View style={[styles.tableCell, { width: '70%' }]}>
                  <Text style={styles.value}>{mahakaalInfo.longitude}°E</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, { width: '30%' }]}>
                  <Text style={styles.label}>Timezone:</Text>
                </View>
                <View style={[styles.tableCell, { width: '70%' }]}>
                  <Text style={styles.value}>UTC+{mahakaalInfo.timezone} (IST)</Text>
                </View>
              </View>
            </View>
            <Text style={[styles.text, { marginTop: 8, fontSize: 10, fontStyle: 'italic' }]}>
              {mahakaalInfo.description}
            </Text>
          </View>
        )}

        {/* Ascendant */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ascendant (Lagna)</Text>
          <View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { width: '30%' }]}>
                <Text style={styles.label}>Sign:</Text>
              </View>
              <View style={[styles.tableCell, { width: '70%' }]}>
                <Text style={styles.value}>{ascendant.signName}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, { width: '30%' }]}>
                <Text style={styles.label}>Nakshatra:</Text>
              </View>
              <View style={[styles.tableCell, { width: '70%' }]}>
                <Text style={styles.value}>{ascendant.nakshatra} (Pada {ascendant.pada})</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Planetary Positions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planetary Positions</Text>
          <View>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, { width: '20%' }]}>
                <Text>Planet</Text>
              </View>
              <View style={[styles.tableCell, { width: '20%' }]}>
                <Text>Sign</Text>
              </View>
              <View style={[styles.tableCell, { width: '15%' }]}>
                <Text>House</Text>
              </View>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>Nakshatra</Text>
              </View>
              <View style={[styles.tableCell, { width: '20%' }]}>
                <Text>Status</Text>
              </View>
            </View>
            {planets.map((planet) => (
              <View key={planet.planet} style={styles.tableRow}>
                <View style={[styles.tableCell, { width: '20%' }]}>
                  <Text style={styles.label}>{planet.planet}</Text>
                </View>
                <View style={[styles.tableCell, { width: '20%' }]}>
                  <Text style={styles.value}>{planet.signName}</Text>
                </View>
                <View style={[styles.tableCell, { width: '15%' }]}>
                  <Text style={styles.value}>{planet.house}</Text>
                </View>
                <View style={[styles.tableCell, { width: '25%' }]}>
                  <Text style={styles.value}>{planet.nakshatra} (P{planet.pada})</Text>
                </View>
                <View style={[styles.tableCell, { width: '20%' }]}>
                  <Text style={[styles.value, { color: planet.isRetrograde ? '#dc2626' : '#059669' }]}>
                    {planet.isRetrograde ? 'Retrograde' : 'Direct'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Doshas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dosha Analysis</Text>
          {doshas.length > 0 ? (
            doshas.map((dosha, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableCell, { width: '30%' }]}>
                    <Text style={styles.label}>{dosha.name}</Text>
                  </View>
                  <View style={[styles.tableCell, { width: '20%' }]}>
                    <Text style={[dosha.severity === 'high' ? styles.highSeverity : dosha.severity === 'medium' ? styles.mediumSeverity : styles.lowSeverity]}>
                      {dosha.severity.toUpperCase()}
                    </Text>
                  </View>
                  <View style={[styles.tableCell, { width: '50%' }]}>
                    <Text style={styles.value}>{dosha.present ? 'Present' : 'Not Present'}</Text>
                  </View>
                </View>
                <Text style={styles.text}>{dosha.description}</Text>
                <Text style={[styles.label, { marginTop: 4 }]}>Remedies:</Text>
                {dosha.remedies.map((remedy, i) => (
                  <Text key={i} style={styles.text}>• {remedy}</Text>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.text}>No major doshas detected in your chart.</Text>
          )}
        </View>

        {/* Dasha Periods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vimshottari Dasha Periods</Text>
          <View>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, { width: '25%' }]}>
                <Text>Planet</Text>
              </View>
              <View style={[styles.tableCell, { width: '35%' }]}>
                <Text>Start Date</Text>
              </View>
              <View style={[styles.tableCell, { width: '35%' }]}>
                <Text>End Date</Text>
              </View>
            </View>
            {dashas.map((dasha, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, { width: '25%' }]}>
                  <Text style={dasha.isCurrent ? [styles.label, { color: '#ea580c' }] : styles.label}>{dasha.planet}{dasha.isCurrent && ' (Current)'}</Text>
                </View>
                <View style={[styles.tableCell, { width: '35%' }]}>
                  <Text style={styles.value}>{dasha.startDate}</Text>
                </View>
                <View style={[styles.tableCell, { width: '35%' }]}>
                  <Text style={styles.value}>{dasha.endDate}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Predictions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Life Predictions</Text>
          {predictions.map((prediction, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={[styles.label, { fontSize: 12 }]}>{prediction.category} - {prediction.title}</Text>
              <Text style={styles.text}>{prediction.description}</Text>
            </View>
          ))}
        </View>

        {/* Character Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Character Analysis</Text>
          {characterTraits.map((trait, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, { width: '40%' }]}>
                <Text style={styles.label}>{trait.trait}</Text>
              </View>
              <View style={[styles.tableCell, { width: '60%' }]}>
                <Text style={styles.value}>{trait.description} (Strength: {trait.strength}/10)</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Remedies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Remedies</Text>
          {remedies.map((remedy, index) => (
            <Text key={index} style={styles.text}>• {remedy}</Text>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.section}>
          <Text style={{ fontSize: 10, color: '#9ca3af', fontStyle: 'italic' }}>
            Disclaimer: This kundali report is generated based on Vedic astrology principles. 
            For detailed analysis and guidance, please consult with a professional astrologer.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Chart ID: {chartId} | © {new Date().getFullYear()} AstroSure. All rights reserved.</Text>
          <Text>This is a computer-generated report. For personalized consultation, visit astrosure.com</Text>
        </View>
      </Page>
    </Document>
  )
}
