
const API_URL = 'http://localhost:3000';
const userId = localStorage.getItem('usuarioId');

async function salvarNovaSenha() {
    const servico = document.getElementById('servico').value;
    const pass = document.getElementById('senha_servico').value;


    const userId = localStorage.getItem('usuarioId');

    if (!userId) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "/login.html";
        return;
    }

    await fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servico, pass, userId })
    });
}

async function salvarSenha() {
    const servico = document.getElementById('servico').value;
    const pass = document.getElementById('pass').value;

    if (!servico || !pass) return;

    try {
        const res = await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ servico, pass, userId })
        });

        if (res.ok) {
            document.getElementById('servico').value = '';
            document.getElementById('pass').value = '';
            listarSenhas();
        }
    } catch (err) {
        console.error("Erro:", err);
    }
}

async function deletePass(id) {

    try {
        const res = await fetch(`${API_URL}/delete/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            Swal.fire({
                position: 'top-center',
                icon: 'trash',
                title: 'Excluido com sucesso!',
                showConfirmButton: false,
                timer: 500,
                background: '#1a1a1a',
                color: '#fff'
            }).then(() => {
                listarSenhas();
            })

        } else {
            alert("Erro ao excluir.");
        }
    } catch (err) {
        console.error("Erro na conexão:", err);
    }
}

function logout() {

    localStorage.removeItem('usuarioId');

    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Você saiu com segurança!',
        showConfirmButton: false,
        timer: 2000,
        background: '#1a1a1a',
        color: '#fff'
    }).then(() => {
        window.location.replace("/login");
    });

}

async function listarSenhas() {

    const userId = localStorage.getItem('usuarioId');

    if (!userId) {
        window.location.href = "/login";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/passwords/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                
                'user-id': userId 
            }
        });

        const dados = await res.json();
        console.log("Dados recebidos da API:", dados);
        const listaSenhasContainer = document.getElementById('lista-senhas');
        listaSenhasContainer.innerHTML = '';

        const listaForRender = Array.isArray(dados) ? dados : dados.senhas;

        if (!listaForRender || listaForRender.length === 0) {
            listaSenhasContainer.innerHTML = '<p style="color: #52525b; font-size: 0.75rem; text-align: center; margin-top: 20px;">Nenhum registro encontrado.</p>';
            return;
        }

        listaForRender.forEach(item => {
            const divItem = document.createElement('div');
            divItem.className = 'senha-item';

            divItem.innerHTML = `
                <div class="info">
                    <strong>${item.servico.toUpperCase()}</strong>
                    <span id="txt-${item.id}" class="senha-mask">••••••••</span>
                </div>
                <div class="actions">
                    <button class="btn-reveal" onclick="revelar('${item.id}', '${item.encryptedHash}')">
                        Ver
                    </button>
                    <button class="pass-delete" onclick="deletePass('${item.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            `;

            listaSenhasContainer.appendChild(divItem);
        });
    } catch (err) {
        console.error("Erro:", err);
    }
}

async function revelar(id, hash) {
    try {
        const res = await fetch(`${API_URL}/decrypt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hash })
        });

        const data = await res.json();
        const span = document.getElementById(`txt-${id}`);

        if (span.innerText === "••••••••") {
            span.innerText = data.realPass;
            span.style.color = "white";
        } else {
            span.innerText = "••••••••";
            span.style.color = "var(--text-gray)";
        }
    } catch (err) {
        alert("Falha na descriptografia");
    }
}

listarSenhas();
