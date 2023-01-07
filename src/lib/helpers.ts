export const sum = (total: number, value: number) => (total += value)

export const isEven = (n: number) => n % 2 === 0

export const isDuplicates = (array: string[]) => new Set(array).size !== array.length
