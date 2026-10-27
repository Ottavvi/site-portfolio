// Carregado em todas as páginas: ajusta o menu conforme a pessoa está logada ou não

// Troca "Entrar" por "Minha área" quando a pessoa já está logada.
// As páginas em inglês (pasta en/) informam os textos e os endereços pelos atributos data-*.
const authLink = document.getElementById('authLink');
const logoutBtn = document.getElementById('logoutBtn');

// O Firebase pesa mais de 100 KB, então só é baixado quando faz diferença: nas páginas de conta
// ou se este navegador já entrou alguma vez (a marca "sessao" é gravada abaixo, ao detectar o login)
let lembrado = false;
try {
  lembrado = localStorage.getItem('sessao') === '1';
} catch {}
if (lembrado || logoutBtn || document.querySelector('.auth-page')) iniciar();

async function iniciar() {
  const [{ auth }, { onAuthStateChanged, signOut }] = await Promise.all([
    import('../firebase.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js')
  ]);

  onAuthStateChanged(auth, user => {
    try {
      if (user) localStorage.setItem('sessao', '1');
      else localStorage.removeItem('sessao');
    } catch {}
    if (!authLink) return;
    const {
      entrar = 'Entrar',
      area = 'Minha área',
      urlEntrar = 'login.html',
      urlArea = 'area.html'
    } = authLink.dataset;
    authLink.textContent = user ? area : entrar;
    authLink.href = user ? urlArea : urlEntrar;
  });

  // Botão "Sair" (área de membros e painel de admin)
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut(auth);
      window.location.href = 'index.html';
    });
  }
}
