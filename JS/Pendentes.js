 // Funcionalidade para seleção do card (destaque)
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.card').forEach(c => c.classList.remove('selecionada'));
        card.classList.add('selecionada');
      });

      // Botão Aprovar
      const approveBtn = card.querySelector('.approve');
      if (approveBtn) {
        approveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const badge = card.querySelector('.badge');
          badge.textContent = 'Aprovado';
          badge.className = 'badge status-aprovado';
          alert('Reserva aprovada.');
        });
      }

      // Botão Rejeitar
      const rejectBtn = card.querySelector('.reject');
      if (rejectBtn) {
        rejectBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const badge = card.querySelector('.badge');
          badge.textContent = 'Rejeitado';
          badge.className = 'badge status-rejeitado';
          alert('Reserva rejeitada.');
        });
      }

      // Botão Ver detalhes
      const detailsBtn = card.querySelector('.btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          alert(card.querySelector('.details').textContent);
        });
      }
    });

    // Dropdown do usuário
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');
    dropbtn.addEventListener('click', function(event) {
      event.stopPropagation();
      dropdownContent.classList.toggle('show');
    });
    document.addEventListener('click', () => {
      dropdownContent.classList.remove('show');
    });

  