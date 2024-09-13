import Swal from "sweetalert2";

export default {
  name: "functions",
  formatDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // เดือนจะต้อง +1 เพราะ getMonth() เริ่มนับจาก 0
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${year}${month}${day} ${hours}:${minutes}`;
},
formatDateFormat(val){
  console.log(val.length, 'length')
  if(val.length == 0 || val == undefined) return ''
  return `${val.substring(6,8)}/${val.substring(4,6)}/${val.substring(0,4)} ${val.substring(8)}`
},
  distinctArray(val){
  let desired_output = (val) => {
      let unique_values = [
          ...new Set(val.map((element) => element.division_desc)),
      ];
      return unique_values;
  };
  let array = []
  desired_output(val).forEach((element) => {
    array.push({
      division_desc: element
    })
});
  return array
  },
  async alertDialog(
    icon,
    title,
    text,
    cancelBtn = false,
    confirmText,
    cancelColor = "#d33",
    confirmColor = "#1F5680"
  ) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: cancelBtn,
      confirmButtonColor: confirmColor,
      cancelButtonColor: cancelColor,
      confirmButtonText: confirmText,
    });
  },
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
 
  calDay(sysdate, expire) {
    const sDate = new Date(
      sysdate.toString().substring(0, 4),
      sysdate.toString().substring(5, 7) - 1,
      sysdate.toString().substring(8)
    );
    const aDate = new Date(
      expire.toString().substring(0, 4),
      expire.toString().substring(5, 7) - 1,
      expire.toString().substring(8)
    );
    const daysDiff = Math.round((aDate - sDate) / 86400000); // 2022-09-15T03:32:40.984+0000
    return daysDiff;
  },
  timeConverter(UNIX_timestamp) {
    var a = new Date(Number(UNIX_timestamp) * 1000);
    var months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    var year = Number(a.getFullYear()) + 543;
    var month = months[a.getMonth()];
    var date = a.getDate();
    var formatDate = `${year}${month}${date.toString().padStart(2, "0")}`;
    var time = this.getDateFormat(formatDate).long;
    return time;
  },
  getDateFormat(date) {
    let day = "-";
    let month = {
      digit: "-",
      long: "-",
      short: "-",
    };
    let year = "-";
    let long = "-";
    let short = "-";
    let shortEn = "-";
    let format = {
      day,
      month,
      year,
      long,
      short,
      shortEn,
    };
    if (date === 0) {
      return format;
    }
    if (date.length == 6) {
      return `${date.substring(0, 4)}/${date.substring(4)}`;
    }
    if (`${date}`.length !== 8) {
      long = date;
      short = date;
      return format;
    }
    day = date % 100;
    if (day === 0) {
      day = "";
    }
    year = Math.floor(date / 10000);
    let m = Math.floor(date / 100) % 100;
    if (m === 0) {
      m = "";
    }
    shortEn = `${year}/${m.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    m = this.getThaiMonth(m);
    month = {
      digit: m.digit,
      long: m.long,
      short: m.short,
    };
    long = `${day} ${m.long} ${year}`;
    short = `${day} ${m.short} ${year}`;

    format = {
      day,
      month,
      year,
      long,
      short,
      shortEn,
    };
    return format;
  },
  ConvertDDMMYYYY(val){
    const spDate = val.split("/")
    if(spDate.length == 3) return  `${spDate[2]}/${spDate[1]}/${spDate[0]}`;
    return  '-';
  },
  yyyymmddConvertDDMMYYYY(val){
    return  `${val.substring(6,8)}/${val.substring(4,6)}/${val.substring(0,4)}`;
  },
  DateYYYYMMDD_HHMM(val){
    return  `${val.substring(6,8)}/${val.substring(4,6)}/${val.substring(0,4)} ${val.substring(8)}`;
  },
  getThaiMonth(m) {
    let mShort = "";
    let mLong = "";
    switch (m) {
      case 1:
        mLong = "มกราคม";
        mShort = "ม.ค.";
        break;
      case 2:
        mLong = "กุมภาพันธ์";
        mShort = "ก.พ.";
        break;
      case 3:
        mLong = "มีนาคม";
        mShort = "มี.ค.";
        break;
      case 4:
        mLong = "เมษายน";
        mShort = "เม.ย.";
        break;
      case 5:
        mLong = "พฤษภาคม";
        mShort = "พ.ค.";
        break;
      case 6:
        mLong = "มิถุนายน";
        mShort = "มิ.ย.";
        break;
      case 7:
        mLong = "กรกฎาคม";
        mShort = "ก.ค.";
        break;
      case 8:
        mLong = "สิงหาคม";
        mShort = "ส.ค.";
        break;
      case 9:
        mLong = "กันยายน";
        mShort = "ก.ย.";
        break;
      case 10:
        mLong = "ตุลาคม";
        mShort = "ต.ค.";
        break;
      case 11:
        mLong = "พฤศจิกายน";
        mShort = "พ.ย.";
        break;
      case 12:
        mLong = "ธันวาคม";
        mShort = "ธ.ค.";
        break;
      default:
    }
    return {
      digit: m,
      long: mLong,
      short: mShort,
    };
  },
  mixDateFormat(inputDate, addDay) {
    const d = new Date(inputDate);
    d.setDate(d.getDate() + addDay);
    let mkMonth = d.getMonth() + 1;
    if (mkMonth.toString().length === 1) {
      mkMonth = `0${mkMonth}`;
    }
    let mkDay = d.getDate();
    if (mkDay.toString().length === 1) {
      mkDay = `0${mkDay}`;
    }
    const mkYear = d.getFullYear();
    return `${mkYear}-${mkMonth}-${mkDay}`
  },
  minDateFormat(inputDate, daysBefore) {
    const date = new Date(inputDate);
    date.setDate(date.getDate() - daysBefore);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    return `${year}-${month}-${day}`;
  },
  getSysDate() {
    const diffTime = localStorage.getItem('system-date:diff-time')
    const serverDateTime = new Date(Date.now() + ((diffTime != null) ? Number(diffTime) : 0))

    const date = serverDateTime.getDate()
    const month = serverDateTime.getMonth() + 1
    let year = serverDateTime.getFullYear()

    let format = ''
    format += year
    format += month < 10 ? `0${month}` : month
    format += date < 10 ? `0${date}` : date

    return {
      date,
      month,
      year,
      format,
    }
  },
  getSysTime() {
    const diffTime = localStorage.getItem('system-date:diff-time')
    const serverDateTime = new Date(Date.now() + ((diffTime != null) ? Number(diffTime) : 0))
    let m = serverDateTime.getMinutes().toString()
    if (m.length === 1) m = `0${m}`
    let s = serverDateTime.getSeconds().toString()
    if (s.length === 1) s = `0${s}`
    return {
      hour: serverDateTime.getHours(),
      minute: m,
      second: s,
    }
  },
  removeLastDigit(number) {
    return Math.floor(number / 10);
  }
};
