if (localStorage.getItem('usuarioId')) {
    
    window.location.replace("/"); 
}

const API_URL = '';

async function cadastrarUsuario() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value;
    const passwordc = passwordInput.value;

    
    if (!email || !passwordc) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/cadastro`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
           
            body: JSON.stringify({ email, passwordc })
        });

        const data = await res.json();

        if (res.ok) {
            
            window.location.href = "/login";
        } else {
            alert("Erro: " + data.erro);
        }

    } catch (err) {
        console.error("Erro na requisição:", err);
        alert("Não foi possível conectar ao servidor.");
    }
}