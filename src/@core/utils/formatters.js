import { isToday } from './index'

export const avatarText = value => {
  if (!value)
    return ''
  const nameArray = value.split(' ')
  
  return nameArray.map(word => word.charAt(0).toUpperCase()).join('')
}

// TODO: Try to implement this: https://twitter.com/fireship_dev/status/1565424801216311297
export const kFormatter = num => {
  const regex = /\B(?=(\d{3})+(?!\d))/g
  
  return Math.abs(num) > 9999 ? `${Math.sign(num) * +((Math.abs(num) / 1000).toFixed(1))}k` : Math.abs(num).toFixed(0).replace(regex, ',')
}

/**
 * Format and return date in Humanize format
 * Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 * Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Intl.DateTimeFormatOptions} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value)
    return value
  
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 * Return short human friendly month representation of date
 * Can also convert date to only time if date is of today (Better UX)
 * @param {String} value date to format
 * @param {Boolean} toTimeForCurrentDay Shall convert to time if day is today/current
 */
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }
  if (toTimeForCurrentDay && isToday(date))
    formatting = { hour: 'numeric', minute: 'numeric' }
  
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

export const formatDateMySql = value => {
  if(!value) return ''
const date = new Date(value)
const day = date.getDate().toString().padStart(2, '0'); // padStart untuk menambahkan leading zero pada tanggal jika diperlukan
const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 karena bulan dimulai dari 0
const year = date.getFullYear();

// return `${day}/${month}/${year}`;
return `${year}-${month}-${day}`;
}

export const formatUang = (val) => {
  let rupiah = new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val);

  return rupiah;
};

export const formatRibuan = (value) => {
  const angkaStr = parseFloat(value).toFixed(2); // Membatasi 2 digit desimal
  const [integerPart, decimalPart] = angkaStr.split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formattedValue = decimalPart
    ? `${formattedInteger},${decimalPart}`
    : formattedInteger;

  return formattedValue;
};


export const rawToFormattedNumber = (value) => {
  // Hapus semua karakter kecuali angka, titik, dan koma
  let sanitizedValue = value.replace(/[^0-9.,]/g, "");

  // Jika ada lebih dari satu koma, hanya pertahankan yang pertama
  const commaIndex = sanitizedValue.indexOf(",");
  if (commaIndex !== -1) {
    sanitizedValue =
      sanitizedValue.slice(0, commaIndex + 1) + // Bagian sebelum dan termasuk koma pertama
      sanitizedValue.slice(commaIndex + 1).replace(/,/g, ""); // Hapus koma berikutnya
  }

  // Ganti titik (.) dengan kosong dan koma (,) menjadi titik (.)
  const rawValue = sanitizedValue.replace(/\./g, "").replace(",", ".");

  // Pisahkan bagian integer dan desimal
  const [integerPart, decimalPart] = rawValue.split(".");

  // Format bagian integer dengan thousand separator
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Gabungkan kembali integer dan desimal dengan format yang benar
  const formattedValue =
    decimalPart !== undefined
      ? `${formattedInteger},${decimalPart}`
      : formattedInteger;

  return { raw: rawValue, formatted: formattedValue };
};

