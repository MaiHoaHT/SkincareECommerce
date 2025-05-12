export const convertToSeoAlias = (text) => {
  if (!text) return '';
  
  // Convert to lowercase
  let str = text.toLowerCase();
  
  // Replace Vietnamese characters
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  
  // Remove special characters
  str = str.replace(/[^a-z0-9 ]/g, "");
  
  // Replace spaces with hyphens
  str = str.replace(/\s+/g, "-");
  
  // Remove consecutive hyphens
  str = str.replace(/-+/g, "-");
  
  // Remove leading and trailing hyphens
  str = str.replace(/^-+|-+$/g, "");
  
  return str;
}; 