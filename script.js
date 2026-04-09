let player;

function onYouTubeIframeAPIReady(){
    player = new YT.Player ('player', {
        height: '360',
        width: '640',
        videoId: 'M7lc1UVf-VE',
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event){
    event.target(); /* clica no play manualmente */
    /* event.target.playVideo() o video começa automaticamente */
}

async function startMic(){
    const stream = await navigator.mediaDevices.getUserMedia({audio: true})
    const audioContext = new AudioContext();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    mic.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    function checkVolume(){
        analyser.getByteFrequencyData(data);
        let volume = data.reduce((a,b) => a+b) / data.length;
        let videoVolume = Math.min(volume * 2, 100);
        player.setVolume(videoVolume);
        requestAnimationFrame(checkVolume);
    }
    checkVolume();
}