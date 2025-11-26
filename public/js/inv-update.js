const form = document.querySelector("#updateForm")
if (form) {
  const submitBtn = form.querySelector("button[type='submit']")
  if (submitBtn) submitBtn.setAttribute("disabled", "")

  form.addEventListener("change", function () {
    if (submitBtn) submitBtn.removeAttribute("disabled")
  })
}