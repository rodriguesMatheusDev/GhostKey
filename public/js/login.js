if (localStorage.getItem('usuarioId')) {
    
    window.location.replace("/"); 
}

async function fazerLogin(e) {

    if (e) e.preventDefault();


    const email = document.getElementById('email').value;
    const passwordc = document.getElementById('password').value;

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, passwordc })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('usuarioId', data.userId);

            await Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Logado com sucesso!',
                showConfirmButton: false,
                timer: 1500,
                background: '#1a1a1a',
                color: '#fff'
            });

    
            window.location.replace("/"); 

        } else {
            console.log('error');
        }
    } catch (err) {
        
        console.error("Erro:", err);
        window.location.replace("/");
    }
}
    