document.addEventListener("DOMContentLoaded", () => {
    const urlBase = "https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com";
    const container = document.querySelector('.content');

    const formCadastro = document.getElementById("form-cadastro");
    formCadastro.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("cadastro-email").value;
        const senha = document.getElementById("cadastro-senha").value;
        const confirmar = document.getElementById("cadastro-confirmar").value;
        const msg = document.getElementById("mensagem-cadastro");

        msg.textContent = "";
        msg.classList.remove("error", "success");

        if (senha !== confirmar) {
            msg.textContent = "As senhas não coincidem!";
            msg.classList.add("error");
            return;
        }

        try {
            const response = await fetch(`${urlBase}/Autenticacao/registar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    Email: email, 
                    Senha: senha, 
                    SenhaConfirmada: confirmar 
                }),
            });

            if (response.ok) {
                msg.textContent = "Cadastro realizado com sucesso!";
                msg.classList.add("success");
                
                setTimeout(() => {
                    container.classList.remove('show-signup');
                    formCadastro.reset();
                }, 2000);
            } else {
                const errorData = await response.json().catch(() => ({}));
                msg.textContent = errorData.message || "Erro no cadastro. Status: " + response.status;
                msg.classList.add("error");
            }
        } catch (error) {
            console.error("Erro no cadastro:", error);
            msg.textContent = "Erro na conexão com o servidor: " + error.message;
            msg.classList.add("error");
        }
    });


    const formLogin = document.getElementById("form-login");
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const senha = document.getElementById("login-senha").value;
        const msg = document.getElementById("mensagem-login");

        msg.textContent = "";
        msg.classList.remove("error", "success");

        try {
            const response = await fetch(`${urlBase}/Autenticacao/autenticar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: email,  
                    senha: senha   
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro na autenticação");
            }

            const data = await response.json();

            localStorage.setItem("email", data.email);
            localStorage.setItem("token", data.token);
            localStorage.setItem("expiraEm", data.expiraEm);

            window.location.href = "welcome.html";
        } catch (error) {
            console.error("Erro no login:", error);
            msg.textContent = error.message || "Erro na conexão com o servidor.";
            msg.classList.add("error");
        }
    });

    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');

    signUpButton.addEventListener('click', () => {
        container.classList.add('show-signup');
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove('show-signup');
    });
});