// audio.js

// 1. Definição dos sons em seções
const audioSections = {
    'Ritmo e Percussão': [
        { name: 'Batida 1', file: 'audios/bateria1.mp3', description: 'Uma batida de bateria simples e constante.' },

    ],
    'Baixo e Harmonia': [
        { name: 'Baixo 1', file: 'audios/baixo1.mp3', description: 'Uma linha de baixo profunda e melódica.' },

    ],
    'Melodia e Leads': [
        { name: 'Violão', file: 'audios/violao1.mp3', description: 'Melodia de violão acústico.' },

    ],
    'Efeitos e Texturas': [
        { name: 'Riser', file: 'audios/riser.mp3', description: 'Um efeito de tensão que cresce gradualmente.' },

    ]
};

// 2. Referências aos elementos HTML.
const soundSectionsContainer = document.getElementById('sound-sections');
const timelineContainer = document.getElementById('timeline');
const playAllButton = document.getElementById('play-all');
const stopAllButton = document.getElementById('stop-all');
const soundControlsPanel = document.getElementById('sound-controls-panel');
const totalEndTimeDisplay = document.getElementById('total-end-time');

// 3. Variáveis globais para o Web Audio API e para a linha do tempo.
let audioContext;
let audioBuffers = {};
let selectedTimelineItem = null;
let playingSources = [];

// 4. Funções auxiliares para efeitos de áudio.
function makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
        const x = i * 2 / n_samples - 1;
        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
}

// 5. Função principal para carregar os sons.
async function loadSounds() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        console.log("Iniciando o carregamento dos sons...");

        const allSounds = Object.values(audioSections).flat();
        const promises = allSounds.map(async (sound) => {
            const response = await fetch(sound.file);
            if (!response.ok) {
                throw new Error(`Erro ao carregar o arquivo: ${sound.file} - Status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            audioBuffers[sound.name] = await audioContext.decodeAudioData(arrayBuffer);
            console.log(`- Som "${sound.name}" carregado com sucesso.`);
        });

        await Promise.all(promises);
        
        console.log("Todos os sons foram carregados.");
        
        createSoundButtons();

    } catch (error) {
        console.error("Ocorreu um erro fatal ao carregar os sons:", error);
        soundSectionsContainer.innerHTML = '<p style="color:red;">Erro ao carregar os sons. Verifique o console para mais detalhes.</p>';
    }
}

// 6. Função para criar os botões na interface.
function createSoundButtons() {
    for (const section in audioSections) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'audio-section';
        sectionDiv.innerHTML = `<h3>${section}</h3><div class="section-buttons"></div>`;
        const buttonsContainer = sectionDiv.querySelector('.section-buttons');

        audioSections[section].forEach(sound => {
            const audioBuffer = audioBuffers[sound.name];
            const duration = audioBuffer ? audioBuffer.duration.toFixed(2) : '0';

            const button = document.createElement('button');
            button.className = 'sound-button';
            button.innerHTML = `
                <span>${sound.name} (${duration}s)</span>
                <p class="sound-description">${sound.description}</p>
                <button class="preview-btn">▶️</button>
            `;
            button.onclick = () => addSoundToTimeline(sound, duration);
            buttonsContainer.appendChild(button);

            const previewButton = button.querySelector('.preview-btn');
            previewButton.onclick = (event) => {
                event.stopPropagation();
                if (audioBuffers[sound.name]) {
                    const source = audioContext.createBufferSource();
                    source.buffer = audioBuffers[sound.name];
                    source.connect(audioContext.destination);
                    source.start();
                }
            };
        });

        soundSectionsContainer.appendChild(sectionDiv);
    }
    console.log("Botões criados.");
}

// 7. Função para adicionar um som à linha do tempo.
function addSoundToTimeline(sound, duration) {
    const soundItems = timelineContainer.querySelectorAll('.timeline-item');
    let newStartTime = 0;

    if (soundItems.length > 0) {
        const lastItem = soundItems[soundItems.length - 1];
        const lastItemEndTime = parseFloat(lastItem.dataset.startTime) + parseFloat(lastItem.dataset.duration);
        newStartTime = lastItemEndTime;
    }

    const soundItem = document.createElement('div');
    soundItem.className = 'timeline-item';
    soundItem.innerHTML = `
        <span>${sound.name} (${duration}s)</span>
        <button class="remove-btn">x</button>
    `;
    soundItem.dataset.soundName = sound.name;
    soundItem.dataset.duration = duration;
    soundItem.dataset.startTime = newStartTime;
    soundItem.dataset.volume = 1;
    soundItem.dataset.pan = 0;
    soundItem.dataset.lowpassFreq = 22000;
    soundItem.dataset.distortionAmount = 0;
    soundItem.dataset.compressorRatio = 12;
    soundItem.dataset.bandpassFreq = 10000;
    soundItem.dataset.trimStart = 0;
    soundItem.dataset.trimEnd = duration;

    soundItem.addEventListener('click', () => selectTimelineItem(soundItem));

    soundItem.querySelector('.remove-btn').onclick = (event) => {
        event.stopPropagation();
        timelineContainer.removeChild(soundItem);
        if (selectedTimelineItem === soundItem) {
            soundControlsPanel.innerHTML = '<p>Clique em um som na linha do tempo para editar.</p>';
        }
        updateTotalEndTime();
    };

    timelineContainer.appendChild(soundItem);
    updateTotalEndTime();
}

// 8. Função para selecionar um item e exibir os controles.
function selectTimelineItem(item) {
    if (selectedTimelineItem) {
        selectedTimelineItem.classList.remove('active');
    }

    selectedTimelineItem = item;
    selectedTimelineItem.classList.add('active');

    const soundName = item.dataset.soundName;
    const duration = parseFloat(item.dataset.duration);
    const startTime = parseFloat(item.dataset.startTime);
    const volume = parseFloat(item.dataset.volume);
    const pan = parseFloat(item.dataset.pan);
    const lowpassFreq = parseFloat(item.dataset.lowpassFreq);
    const distortionAmount = parseFloat(item.dataset.distortionAmount);
    const compressorRatio = parseFloat(item.dataset.compressorRatio);
    const bandpassFreq = parseFloat(item.dataset.bandpassFreq);
    const trimStart = parseFloat(item.dataset.trimStart);
    const trimEnd = parseFloat(item.dataset.trimEnd);

    soundControlsPanel.innerHTML = `
        <h3>${soundName}</h3>
        <label>
            Início (s): 
            <input type="number" value="${startTime}" min="0" step="0.1" id="start-time-input">
        </label>
        <p>Término: ${(startTime + parseFloat(duration)).toFixed(2)}s</p>
        <hr>
        <h4>Controles de Mixagem</h4>
        <label>
            Volume:
            <input type="range" min="0" max="2" value="${volume}" step="0.1" id="volume-slider">
        </label>
        <label>
            Panning:
            <input type="range" min="-1" max="1" value="${pan}" step="0.1" id="pan-slider">
        </label>
        <hr>
        <h4>Configurações de Áudio</h4>
        <label>
            Cortar Início (s):
            <input type="range" min="0" max="${duration.toFixed(2)}" value="${trimStart.toFixed(2)}" step="0.01" id="trim-start-slider">
        </label>
        <label>
            Cortar Fim (s):
            <input type="range" min="0" max="${duration.toFixed(2)}" value="${trimEnd.toFixed(2)}" step="0.01" id="trim-end-slider">
        </label>
        <hr>
        <h4>Efeitos de Áudio</h4>
        <label>
            Filtro (Lowpass): ${lowpassFreq.toFixed(0)} Hz
            <input type="range" min="0" max="22000" value="${lowpassFreq}" step="100" id="lowpass-slider">
        </label>
        <label>
            Filtro (Bandpass): ${bandpassFreq.toFixed(0)} Hz
            <input type="range" min="0" max="22000" value="${bandpassFreq}" step="100" id="bandpass-slider">
        </label>
        <label>
            Distorção: ${distortionAmount.toFixed(0)}
            <input type="range" min="0" max="100" value="${distortionAmount}" step="1" id="distortion-slider">
        </label>
        <label>
            Compressão: ${compressorRatio.toFixed(0)}
            <input type="range" min="1" max="20" value="${compressorRatio}" step="1" id="compressor-slider">
        </label>
    `;

    document.getElementById('start-time-input').addEventListener('input', (event) => {
        const newStartTime = event.target.value;
        item.dataset.startTime = newStartTime;
        updateTotalEndTime();
        const newEndTime = (parseFloat(newStartTime) + parseFloat(duration)).toFixed(2);
        soundControlsPanel.querySelector('p').textContent = `Término: ${newEndTime}s`;
    });

    document.getElementById('trim-start-slider').addEventListener('input', (event) => {
        item.dataset.trimStart = event.target.value;
    });

    document.getElementById('trim-end-slider').addEventListener('input', (event) => {
        item.dataset.trimEnd = event.target.value;
    });

    document.getElementById('volume-slider').addEventListener('input', (event) => {
        item.dataset.volume = event.target.value;
    });

    document.getElementById('pan-slider').addEventListener('input', (event) => {
        item.dataset.pan = event.target.value;
    });

    const lowpassSlider = document.getElementById('lowpass-slider');
    lowpassSlider.addEventListener('input', (event) => {
        item.dataset.lowpassFreq = event.target.value;
        lowpassSlider.parentNode.firstChild.textContent = `Filtro (Lowpass): ${parseFloat(event.target.value).toFixed(0)} Hz`;
    });
    
    const bandpassSlider = document.getElementById('bandpass-slider');
    bandpassSlider.addEventListener('input', (event) => {
        item.dataset.bandpassFreq = event.target.value;
        bandpassSlider.parentNode.firstChild.textContent = `Filtro (Bandpass): ${parseFloat(event.target.value).toFixed(0)} Hz`;
    });

    const distortionSlider = document.getElementById('distortion-slider');
    distortionSlider.addEventListener('input', (event) => {
        item.dataset.distortionAmount = event.target.value;
        distortionSlider.parentNode.firstChild.textContent = `Distorção: ${parseFloat(event.target.value).toFixed(0)}`;
    });
    
    const compressorSlider = document.getElementById('compressor-slider');
    compressorSlider.addEventListener('input', (event) => {
        item.dataset.compressorRatio = event.target.value;
        compressorSlider.parentNode.firstChild.textContent = `Compressão: ${parseFloat(event.target.value).toFixed(0)}`;
    });
}

// 9. Função para calcular e exibir o tempo de término total.
function updateTotalEndTime() {
    const timelineItems = timelineContainer.querySelectorAll('.timeline-item');
    let maxEndTime = 0;

    timelineItems.forEach(item => {
        const startTime = parseFloat(item.dataset.startTime) || 0;
        const duration = parseFloat(item.dataset.duration) || 0;
        const endTime = startTime + duration;
        if (endTime > maxEndTime) {
            maxEndTime = endTime;
        }
    });

    totalEndTimeDisplay.textContent = `Tempo Total: ${maxEndTime.toFixed(2)}s`;
}

// 10. Funções para Tocar e Parar.
playAllButton.onclick = () => {
    const timelineItems = timelineContainer.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) {
        alert("Adicione sons à linha do tempo para tocar.");
        return;
    }
    stopAllButton.click();

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const startTime = audioContext.currentTime;
    timelineItems.forEach(item => {
        const soundName = item.dataset.soundName;
        const audioBuffer = audioBuffers[soundName];
        
        if (audioBuffer) {
            const itemStartTime = parseFloat(item.dataset.startTime) || 0;
            const volumeValue = parseFloat(item.dataset.volume);
            const panValue = parseFloat(item.dataset.pan);
            const lowpassFreq = parseFloat(item.dataset.lowpassFreq);
            const distortionAmount = parseFloat(item.dataset.distortionAmount);
            const compressorRatio = parseFloat(item.dataset.compressorRatio);
            const bandpassFreq = parseFloat(item.dataset.bandpassFreq);
            const trimStart = parseFloat(item.dataset.trimStart);
            const trimEnd = parseFloat(item.dataset.trimEnd);
            const duration = trimEnd - trimStart;

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;

            let lastNode = source;

            const lowpassFilter = audioContext.createBiquadFilter();
            lowpassFilter.type = 'lowpass';
            lowpassFilter.frequency.value = lowpassFreq;
            lastNode.connect(lowpassFilter);
            lastNode = lowpassFilter;

            const bandpassFilter = audioContext.createBiquadFilter();
            bandpassFilter.type = 'bandpass';
            bandpassFilter.frequency.value = bandpassFreq;
            lastNode.connect(bandpassFilter);
            lastNode = bandpassFilter;

            if (distortionAmount > 0) {
                const distortionNode = audioContext.createWaveShaper();
                distortionNode.curve = makeDistortionCurve(distortionAmount);
                lastNode.connect(distortionNode);
                lastNode = distortionNode;
            }

            const compressorNode = audioContext.createDynamicsCompressor();
            compressorNode.ratio.value = compressorRatio;
            lastNode.connect(compressorNode);
            lastNode = compressorNode;
            
            const pannerNode = audioContext.createStereoPanner();
            pannerNode.pan.value = panValue;
            lastNode.connect(pannerNode);
            lastNode = pannerNode;

            const gainNode = audioContext.createGain();
            gainNode.gain.value = volumeValue;
            lastNode.connect(gainNode);
            lastNode = gainNode;

            lastNode.connect(audioContext.destination);

            source.start(startTime + itemStartTime, trimStart, duration);
            playingSources.push(source);
        }
    });
};

stopAllButton.onclick = () => {
    playingSources.forEach(source => {
        try {
            source.stop();
        } catch (e) {
            console.error("Erro ao parar a fonte de áudio:", e);
        }
    });
    playingSources = [];
};

// 11. Executa a função inicial.
loadSounds();