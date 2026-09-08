export const toKhmerNumber = (num: number | string): string => {
  const khmerNumbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return num.toString().split('').map(char => {
    if (/[0-9]/.test(char)) {
      return khmerNumbers[parseInt(char)];
    }
    return char;
  }).join('');
};

export const KHMER_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];

export const getKhmerDateString = (date: Date): string => {
  const day = toKhmerNumber(date.getDate());
  const month = KHMER_MONTHS[date.getMonth()];
  const year = toKhmerNumber(date.getFullYear());
  return `ថ្ងៃទី${day} ខែ${month} ឆ្នាំ${year}`;
};
