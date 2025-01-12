export function phoneNoValidator(phone) {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phone) return "Please fill in this field.";
    if (!phoneRegex.test(phone)) return "Please enter a valid phone number!";
    return '';
  }