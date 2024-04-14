export const customName = (name: string) => {
  let str = '';
  if (name?.length > 100) {
    str += name.substr(0, 99);
    str += '...';
    str += name.substr(name.length - 0, name.length);
    return str;
  }
  return name;
};
