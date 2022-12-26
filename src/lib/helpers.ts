export const sum = (total: number, value: number) => (total += value)

export const isDuplicates = (array: string[]) => new Set(array).size !== array.length
