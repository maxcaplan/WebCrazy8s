/**
 * Generates a random hexadecimal id string
 * @param [length=8] - The number of digits to generate for the id
 */
export function generateId(length = 8): string {
  const values = "0123456789ABCDEF".split("");
  let id = "";

  for (let i = 0; i < 8; i++) {
    const idx = Math.round(Math.random() * Date.now()) % values.length;
    id += values[idx];
  }

  return id;
}
