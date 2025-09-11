export const openWhatsapp = (phone: string, sms: string) => {
  const url = `
    https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    sms
  )}`;
  window.open(url, "_blank");
};
