function readTriple(n: number, showZeroHundred: boolean): string {
  const units = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const hundred = Math.floor(n / 100);
  const ten = Math.floor((n % 100) / 10);
  const unit = n % 10;
  let res = "";

  if (hundred > 0 || showZeroHundred) {
    res += units[hundred] + " trăm ";
    if (ten === 0 && unit > 0) {
      res += "lẻ ";
    }
  }

  if (ten > 0) {
    if (ten === 1) {
      res += "mười ";
    } else {
      res += units[ten] + " mươi ";
    }
  }

  if (unit > 0) {
    if (ten > 1 && unit === 1) {
      res += "mốt ";
    } else if (ten > 0 && unit === 5) {
      res += "lăm ";
    } else if (ten > 1 && unit === 4) {
      res += "tư ";
    } else if (ten === 0 && hundred === 0 && !showZeroHundred) {
      res += units[unit] + " ";
    } else if (ten === 0 && (hundred > 0 || showZeroHundred)) {
      res += units[unit] + " ";
    } else {
      res += units[unit] + " ";
    }
  }

  return res.trim();
}

export function numberToVietnameseWords(num: number): string {
  if (num === 0) return "Không đồng";
  if (num < 0) return "Âm " + numberToVietnameseWords(Math.abs(num)).toLowerCase();

  const scales = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];
  let n = Math.floor(num);
  const triples: number[] = [];

  while (n > 0) {
    triples.push(n % 1000);
    n = Math.floor(n / 1000);
  }

  let words: string[] = [];

  for (let i = triples.length - 1; i >= 0; i--) {
    const val = triples[i];
    if (val === 0) continue;
    const showZeroHundred = i < triples.length - 1 && triples[i + 1] > 0;
    const read = readTriple(val, showZeroHundred);
    if (read) {
      words.push(read + (scales[i] ? " " + scales[i] : ""));
    }
  }

  const result = words.join(" ").trim() + " đồng";
  return result.charAt(0).toUpperCase() + result.slice(1);
}
