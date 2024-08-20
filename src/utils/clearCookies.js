const clearCookies = res => {
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
};

export default clearCookies;
