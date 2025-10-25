declare module '@mapbox/polyline' {
  export function decode(encoded: string): number[][];
  export function encode(coordinates: number[][]): string;
  const polyline: { decode: typeof decode; encode: typeof encode };
  export default polyline;
}
