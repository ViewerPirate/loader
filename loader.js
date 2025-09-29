document.addEventListener("DOMContentLoaded", () => {
    // --- CONFIGURAÇÃO IMPORTANTE ---
    // !!! Substitua pela URL real da sua aplicação no Render !!!
    const RENDER_APP_URL = 'https://artbyte-studio.onrender.com'; 

    const PING_INTERVAL_MS = 2500; // A cada 2.5 segundos
    const TIMEOUT_SECONDS = 45; // Tempo máximo de espera em segundos

    // --- Elementos do DOM ---
    const progressBar = document.getElementById('progress-bar');
    const percentageText = document.getElementById('progress-percentage');
    const statusMessage = document.getElementById('status-message');

    let intervalId = null;
    const startTime = Date.now();

    // Função que tenta contatar o servidor
    const pingServer = async () => {
        try {
            // Usamos 'no-cors' pois não precisamos ler a resposta, apenas saber que o servidor respondeu.
            // Isso evita problemas de CORS entre o GitHub Pages e o Render.
            await fetch(`${RENDER_APP_URL}/ping`, { mode: 'no-cors' });
            
            // Se a linha acima não deu erro, o servidor está no ar!
            console.log("Servidor respondeu!");
            clearInterval(intervalId); // Para o loop de verificação

            // Animação final e redirecionamento
            statusMessage.textContent = 'Conectado! Redirecionando...';
            progressBar.style.width = '100%';
            percentageText.textContent = '100%';
            
            setTimeout(() => {
                window.location.href = RENDER_APP_URL;
            }, 500); // Um pequeno delay para o usuário ver o 100%

        } catch (error) {
            // Isso é esperado enquanto o servidor está "acordando"
            console.log('Servidor ainda não respondeu, tentando novamente...');
        }
    };

    // Função que atualiza a barra de progresso
    const updateProgress = () => {
        const elapsedSeconds = (Date.now() - startTime) / 1000;

        // Verifica se o tempo limite foi atingido
        if (elapsedSeconds >= TIMEOUT_SECONDS) {
            clearInterval(intervalId);
            statusMessage.textContent = 'O servidor demorou muito para responder.';
            percentageText.textContent = 'Erro';
            return;
        }

        // Simula o progresso com base no tempo
        // Chega a 99% perto do tempo limite para dar a sensação de que está quase lá
        const progress = Math.min(Math.round((elapsedSeconds / TIMEOUT_SECONDS) * 100), 99);
        progressBar.style.width = `${progress}%`;
        percentageText.textContent = `${progress}%`;
    };

    // Inicia o processo
    intervalId = setInterval(() => {
        updateProgress();
        pingServer();
    }, PING_INTERVAL_MS);

    // Faz uma verificação inicial imediata
    updateProgress();
    pingServer();
});