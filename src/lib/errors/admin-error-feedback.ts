type AdminAction = "saveProject" | "togglePublish" | "loginMagicLink";

const normalize = (value?: string) => (value || "").toLowerCase();

export const getAdminErrorFeedback = (
  status: number,
  apiMessage?: string,
  action: AdminAction = "saveProject"
) => {
  const raw = normalize(apiMessage);

  if (status === 400) {
    if (raw.includes("title is required")) {
      return "El título es obligatorio. Completalo antes de guardar.";
    }

    if (raw.includes("description is required")) {
      return "La descripción es obligatoria. Completala antes de guardar.";
    }

    if (raw.includes("url") || raw.includes("http")) {
      return "Revisá los enlaces: deben comenzar con http:// o https://.";
    }

    return "Hay datos inválidos en el formulario. Revisá los campos e intentá nuevamente.";
  }

  if (status === 401) {
    return "Tu sesión expiró. Volvé a iniciar sesión para continuar.";
  }

  if (status === 403) {
    return "No tenés permisos para realizar esta acción.";
  }

  if (status === 404) {
    return "No encontramos el proyecto. Puede haber sido eliminado o movido.";
  }

  if (status === 409) {
    return "Ya existe un proyecto con ese slug. Probá con otro slug o título.";
  }

  if (action === "togglePublish") {
    return "No pudimos actualizar la publicación del proyecto. Intentá nuevamente.";
  }

  if (action === "loginMagicLink") {
    return "No pudimos enviar el Magic Link. Verificá el correo e intentá otra vez.";
  }

  return "No fue posible guardar el proyecto en este momento. Intentá nuevamente.";
};

export const getMagicLinkErrorFeedback = (rawMessage?: string) => {
  const raw = normalize(rawMessage);

  if (raw.includes("invalid") && raw.includes("email")) {
    return "El correo ingresado no es válido.";
  }

  if (raw.includes("rate") || raw.includes("too many")) {
    return "Demasiados intentos en poco tiempo. Esperá un momento e intentá nuevamente.";
  }

  return getAdminErrorFeedback(500, rawMessage, "loginMagicLink");
};
