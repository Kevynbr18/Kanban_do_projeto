document.querySelectorAll(".cancelar-btn").forEach(button => {
  button.addEventListener("click", function () {
    if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
      this.closest(".reserva").remove();
      alert("Reserva cancelada com sucesso!");
    }
  });
});
