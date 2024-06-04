const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Attention',
            singer: 'Charlie Puth',
            path: 'asset/music/Attention.mp3',
            image: 'asset/img/Attention.jpg'
        },
        {
            name: 'Shape of You',
            singer: 'Ed Sheeran',
            path: 'asset/music/Ed Sheeran - Shape of You.mp3',
            image: 'asset/img/Ed Sheeran - Shape of You.jpg'
        },
        {
            name: 'Way Back Home',
            singer: 'SHAUN',
            path: 'asset/music/Way-Back-Home-Shaun.mp3',
            image: 'asset/img/Way-Back-Home-Shaun.jpg'
        },
        {
            name: 'Reality',
            singer: 'Lost Frequencies',
            path: 'asset/music/Are You With Me - Reality.mp3',
            image: 'asset/img/Are You With Me - Reality.jpg'
        },
        {
            name: 'Save Me',
            singer: 'DEAMN',
            path: 'asset/music/DEAMN - Save - Me.mp3',
            image: 'asset/img/DEAMN - Save - Me.jpg'
        },
        {
            name: 'Suýt nữa thì',
            singer: 'Andiez',
            path: 'asset/music/SuytNuaThi.mp3',
            image: 'asset/img/suyt-nua-thi.jpg'
        },
        {
            name: 'Ngày đầu tiên',
            singer: 'Đức Phúc',
            path: 'asset/music/NgayDauTien.mp3',
            image: 'asset/img/ngay-dau-tien.jpg'
        },
        {
            name: 'Em Ơi! Em Đừng Khóc',
            singer: 'Cao Nam Thành',
            path: 'asset/music/Em Ơi! Em Đừng Khóc.mp3',
            image: 'asset/img/Em Ơi! Em Đừng Khóc.jpg'
        },
        {
            name: 'Sự Thật Sau Một Lời Hứa',
            singer: 'Chi Dân',
            path: 'asset/music/SuThatSauMotLoiHua-ChiDan.mp3',
            image: 'asset/img/SuThatSauMotLoiHua-ChiDan.jpg'
        },
        {
            name: 'Yêu Đơn Phương Là Gì',
            singer: 'h0n',
            path: 'asset/music/yêu đơn phương là gì.mp3',
            image: 'asset/img/yêu đơn phương là gì.jpg'
        }
    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xử lý CD quay / dùng 
        const cdThumbAnime = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnime.pause()

        //Sử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop


            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lý khi click play
        playBtn.onclick = function () {
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }

        console.log(cdThumbAnime)
        
        //Khi song được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnime.play()
        }

        //Khi song được pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnime.pause()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //Xử lý khi tua song
        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //Khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Xử lý bật / tắt random song
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xử lý lặp lại một song
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Xử lý next song khi audio ended
        audio.onended = function(){
            if (_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e){
            const songNode = e.target.closest('.song:not(.active)')

            if(songNode || e.target.closest('.option')){
                //Xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active')[0].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 300);
    },    
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        //Định nghĩa các thuộc tính trong object
        this.defineProperties()

        //Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        //Tải thông tin bài hát bắt đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render playlist
        this.render()

        //Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()