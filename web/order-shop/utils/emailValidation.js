// installed emailvalid packages

export function emailValidation(inputEmail) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(inputEmail);
}

//for testing only
console.log(emailValidation("devshaiya23@gmail.com"));
