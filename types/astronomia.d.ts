// astronomia(https://github.com/commenthol/astronomia)는 TypeScript 타입을 제공하지 않아서
// 이 프로젝트에서 실제로 쓰는 최소 API 표면만 직접 선언한다.
declare module "astronomia/planetposition" {
  export interface VSOP87PlanetData {
    name: string;
    type?: string;
  }
  export interface Coord {
    lon: number;
    lat: number;
    range: number;
  }
  export class Planet {
    constructor(data: VSOP87PlanetData);
    position(jde: number): Coord;
    position2000(jde: number): Coord;
  }
  const planetposition: { Planet: typeof Planet };
  export default planetposition;
}

declare module "astronomia/solar" {
  export interface SolarCoord {
    lon: number;
    lat: number;
    range: number;
  }
  export function apparentVSOP87(
    planet: import("astronomia/planetposition").Planet,
    jde: number
  ): SolarCoord;
  const solar: { apparentVSOP87: typeof apparentVSOP87 };
  export default solar;
}

declare module "astronomia/deltat" {
  export function deltaT(decimalYear: number): number;
}

declare module "astronomia/data/vsop87Bearth" {
  import type { VSOP87PlanetData } from "astronomia/planetposition";
  const vsop87Bearth: VSOP87PlanetData;
  export default vsop87Bearth;
}
