import React from 'react'

const generateDate = (startYear) => {
  const currentYear = new Date().getFullYear()
  return {
    year: Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => startYear + i
    ).reverse(),
    month: Array.from({ length: 12 }, (_, i) => i + 1),
    day: Array.from({ length: 31 }, (_, i) => i + 1)
  };
}

export default generateDate