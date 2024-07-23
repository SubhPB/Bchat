// Byimaan

const base64Encode = (str: string): string => {
    return btoa(str);
}
  
  const base64Decode = (str: string): string => {
    return atob(str);
};

export {base64Encode, base64Decode}