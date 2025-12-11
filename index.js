const usuarios = [
      {
        tipo: "aluno",
        cpf: "12345678900",
        escola: "escola_sol_nascente",
        estado: "SP",
        senha: "aluno123"
      },
      {
        tipo: "professor",
        cpf: "98765432100",
        escola: "colegio_estrela_do_saber",
        estado: "RJ",
        senha: "prof123"
      }
    ];

    document.getElementById("loginForm").addEventListener("submit", function(e) {
      e.preventDefault();

      const cpf = document.getElementById("cpf").value.trim();
      const escola = document.getElementById("escola").value;
      const estado = document.getElementById("et").value;
      const senha = document.getElementById("senha").value;

      const user = usuarios.find(u =>
        u.cpf === cpf && u.escola === escola && u.estado === estado && u.senha === senha
      );

      if (user) {
        alert(`✅ Login bem-sucedido! Bem-vindo, ${user.tipo}.`);
        if (user.tipo === "aluno") {
          window.location.href = "../Aluno/LoginAluno.html";
        } else {
          window.location.href = "../Professor/LoginProfessor.html";
        }
      } else {
        alert("❌ Dados incorretos. Verifique e tente novamente.");
      }
    });