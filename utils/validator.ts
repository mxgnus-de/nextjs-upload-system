function validateURL(url: string): boolean {
   let urlreg =
      /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
   return urlreg.test(url);
}

export { validateURL };
