export const dateFormats = {
  ISO8601: "iso8601",
  DDMMYYYY: "ddmmyyyy"
};

export const formatDate = (date, format) => {
  const d = new Date(date);
  let month = d.getMonth() + 1;
  let year = d.getFullYear();
  let day = d.getDate();
  switch (format) {
    case dateFormats.ISO8601: {
        if(month < 10) month = `0${month}`
        if(day < 10) day = `0${day}`
        return `${year}-${month}-${day}`
    }
    case dateFormats.DDMMYYYY: {
        if(month < 10) month = `0${month}`
        if(day < 10) day = `0${day}`
        return `${day}/${month}/${year}`
    }

    default:
      break;
  }
};
