document.getElementById("meuFormulario").addEventListener("submit", function (e) {
      e.preventDefault();
      alert("✅ Obrigado pelo seu feedback! Sua mensagem foi enviada com sucesso.");
      this.reset();
    });