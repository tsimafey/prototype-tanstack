import randomWords from 'random-words';

export type Status = 'Needs review' | 'Incomplete' | 'Changes requested' | 'Pending approval' | 'Approved';

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const genStatus = (chance: number): Status => {
    if (chance < 0.05) {
        return 'Needs review'
    }
    if (chance < 0.25) {
        return 'Incomplete'
    }
    if (chance < 0.35) {
        return 'Changes requested'
    }
    if (chance < 0.65) {
        return 'Pending approval'
    }
    return 'Approved'
}

const genTerms = (chance: number) => {
    if (chance < 0.4) {
        return 'Net 0'
    }
    if (chance < 0.8) {
        return 'Net 30'
    }
    return 'Net 15'
}

const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

const newCompany = () => {
  const statusChance = Math.random();
  const termsChance = Math.random();
  return {
    company: randomWords({ min: 3, max: 5, join: ' ', formatter: (word, index)=> {
        return index === 0 ? word.slice(0,1).toUpperCase().concat(word.slice(1)) : word;
    }}),
    status: genStatus(statusChance),
    creditLimit: Math.floor(Math.random() * 1000),
    terms: genTerms(termsChance),
    lastUpdate: `${randomDate(new Date(2020, 0, 1), new Date())}`,
  }
}

export function makeData(len: number) {
    return range(len).map(() => {
      return {
        ...newCompany(),
      }
    })
  }
