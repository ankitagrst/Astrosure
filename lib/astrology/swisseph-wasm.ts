// Swiss Ephemeris WASM integration
// Re-exports kundali engine which now uses a real WASM-backed Swiss wrapper.

export { calculateKundali } from './kundali'
export type { PlanetPosition } from './kundali'
