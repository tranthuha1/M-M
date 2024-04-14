import moment from 'moment';

export const formatDate = (dateString: number) => {
  const timestamp = moment(dateString * 1000).unix();
  return timestamp;
};
export const formatDateUnix = (dateString:number) => {
  const timestamp = moment(dateString).unix();
  return timestamp;
};
export const converTimeStampToDate = (dateTimestamp: number) => {
  const date = moment.unix(dateTimestamp).format('DD/MM/YYYY HH:mm');
  return date;
};
export const convertToDatePicker = (dateTimestamp: number) => {
  const datePicker = new Date(dateTimestamp * 1000);
  return datePicker;
};
