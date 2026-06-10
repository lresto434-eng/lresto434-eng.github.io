import { useEffect, useContext } from 'react'
import './index.css'
import {ThemeContext} from './ThemeContext.jsx'
export default function App() {
  const {theme, dispatch} = useContext(ThemeContext)
  useEffect(() => {
    document.body.classList.add('js-loaded')

    // ── Typewriter effect ──────────────────────────────────────────────────────
    function typewriterEffect() {
      const h1 = document.querySelector('#hero h1')
      const parts = [
        { type: 'text', content: 'Building Ideas' },
        { type: 'br' },
        { type: 'text', content: 'Into ' },
        { type: 'em', content: 'Reality' }
      ]
      h1.innerHTML = '<span class="typewriter-cursor">|</span>'
      const cursor = h1.querySelector('.typewriter-cursor')
      const speed = 80
      let partIndex = 0
      let charIndex = 0
      let emEl = null

      function typeNext() {
        if (partIndex >= parts.length) {
          setTimeout(function () {
            cursor.style.animation = 'none'
            cursor.style.transition = 'opacity 0.8s'
            cursor.style.opacity = '0'
          }, 1200)
          return
        }
        const part = parts[partIndex]
        if (part.type === 'br') {
          h1.insertBefore(document.createElement('br'), cursor)
          partIndex++
          setTimeout(typeNext, speed)
          return
        }
        if (part.type === 'em' && charIndex === 0) {
          emEl = document.createElement('em')
          h1.insertBefore(emEl, cursor)
          emEl.appendChild(cursor)
        }
        const target = part.type === 'em' ? emEl : h1
        if (charIndex < part.content.length) {
          target.insertBefore(document.createTextNode(part.content[charIndex]), cursor)
          charIndex++
          setTimeout(typeNext, speed)
        } else {
          if (part.type === 'em') {
            h1.appendChild(cursor)
            emEl = null
          }
          partIndex++
          charIndex = 0
          setTimeout(typeNext, speed)
        }
      }
      setTimeout(typeNext, 500)
    }
    typewriterEffect()

    // ── Hamburger menu ─────────────────────────────────────────────────────────
    const hamburger = document.querySelector('.hamburger')
    const nav = document.querySelector('nav')
    hamburger.addEventListener('click', function () {
      nav.classList.toggle('nav-open')
    })
    document.querySelectorAll('nav ul a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav-open')
      })
    })

    // ── Active nav link on scroll ──────────────────────────────────────────────
    const sections = document.querySelectorAll('#hero, #about, #skills, #projects, #music, #contact')
    const navLinks = document.querySelectorAll('nav ul a')
    const activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) { link.classList.remove('active') })
          const matchingLink = document.querySelector('nav ul a[href="#' + entry.target.id + '"]')
          if (matchingLink) matchingLink.classList.add('active')
        }
      })
    }, { threshold: 0.4 })
    sections.forEach(function (section) { activeObserver.observe(section) })

    // ── Scroll fade-in ─────────────────────────────────────────────────────────
    const fadeElements = document.querySelectorAll('.fade-in')
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          fadeObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })
    fadeElements.forEach(function (el) { fadeObserver.observe(el) })

    // ── YouTube player + featured tracks ──────────────────────────────────────
    var featuredTracks = [
      { name: 'King of Kings',      artist: 'Hillsong Worship',     ytId: 'Of5IcFWiEpg' },
      { name: 'One',                artist: 'Metallica',             ytId: 'WM8bTdBs-cw' },
      { name: 'Master of Puppets',  artist: 'Metallica',             ytId: 'E0ozmU9cJDg' },
      { name: 'Around the World',   artist: 'Red Hot Chili Peppers', ytId: 'a9eNQZbjpJk' },
      { name: 'Pride and Joy',      artist: 'Stevie Ray Vaughan',    ytId: 'I3MTGhRC82s' },
      { name: 'Comfortably Numb',   artist: 'Pink Floyd',            ytId: '_FrOQC-zEog' },
      { name: 'Wish You Were Here', artist: 'Pink Floyd',            ytId: 'IXdNnw99-Ic' },
      { name: 'Time',               artist: 'Pink Floyd',            ytId: 'JwYX52BP2Sk' }
    ]

    function initYTPlayer() {
      if (window._ytPlayer) return
      window._ytPlayer = new window.YT.Player('yt-player', {
        width: '100%',
        height: '100%',
        videoId: featuredTracks[0].ytId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
        events: { onReady: function (e) { e.target.playVideo() } }
      })
    }

    window.onYouTubeIframeAPIReady = initYTPlayer
    if (window.YT && window.YT.Player) initYTPlayer()

    function loadMusicSection() {
      var grid = document.querySelector('.music-featured-grid')
      if (!grid) return
      featuredTracks.forEach(function (track, index) {
        var card = document.createElement('div')
        card.classList.add('music-card')
        if (index === 0) card.classList.add('active')
        card.innerHTML =
          '<img src="https://img.youtube.com/vi/' + track.ytId + '/hqdefault.jpg" alt="' + track.name + '" class="music-art" />' +
          '<div class="music-info">' +
            '<p class="music-track">' + track.name + '</p>' +
            '<p class="music-artist">' + track.artist + '</p>' +
          '</div>'
        card.addEventListener('click', function () {
          document.querySelectorAll('.music-featured-grid .music-card').forEach(function (c) { c.classList.remove('active') })
          card.classList.add('active')
          if (window._ytPlayer && window._ytPlayer.loadVideoById) {
            window._ytPlayer.loadVideoById(track.ytId)
            document.getElementById('yt-now-playing').textContent = '♪ ' + track.name + ' — ' + track.artist
            document.querySelector('.yt-player-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        })
        grid.appendChild(card)
      })
    }
    loadMusicSection()

    // ── YouTube search ─────────────────────────────────────────────────────────
    var YT_API_KEY = 'AIzaSyDhCG33EUGLzJpFC9EwoKUKCcijexGbvLE'
    var searchGrid = document.querySelector('.music-search-grid')
    var searchBtn = document.querySelector('#music-search-btn')
    var searchInput = document.querySelector('#music-input')

    searchGrid.addEventListener('click', function (e) {
      var card = e.target.closest('.music-card')
      if (!card || !card.dataset.ytid) return
      document.querySelectorAll('.music-featured-grid .music-card, .music-search-grid .music-card').forEach(function (c) { c.classList.remove('active') })
      card.classList.add('active')
      if (window._ytPlayer && window._ytPlayer.loadVideoById) {
        window._ytPlayer.loadVideoById(card.dataset.ytid)
        document.getElementById('yt-now-playing').textContent = '♪ ' + card.dataset.title
        document.querySelector('.yt-player-wrap').scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    })

    function searchArtist() {
      var term = searchInput.value.trim()
      if (!term) return
      searchBtn.textContent = 'Searching…'
      searchBtn.disabled = true
      searchGrid.innerHTML = '<p style="color:rgb(138,127,112);text-align:center;">Loading…</p>'
      fetch(
        'https://www.googleapis.com/youtube/v3/search' +
        '?part=snippet&type=video&maxResults=9&q=' + encodeURIComponent(term) + '&key=' + YT_API_KEY
      )
        .then(function (r) { return r.json() })
        .then(function (data) {
          searchGrid.innerHTML = ''
          if (data.error) {
            searchGrid.innerHTML = '<p style="color:rgb(138,127,112);text-align:center;">API error: ' + data.error.message + '</p>'
            return
          }
          if (!data.items || data.items.length === 0) {
            searchGrid.innerHTML = '<p style="color:rgb(138,127,112);text-align:center;">No results found.</p>'
            return
          }
          data.items.forEach(function (item) {
            var videoId = item.id.videoId
            var title = item.snippet.title
            var channel = item.snippet.channelTitle
            var thumbnail = item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : item.snippet.thumbnails.default.url
            var card = document.createElement('div')
            card.classList.add('music-card')
            card.dataset.ytid = videoId
            card.dataset.title = title
            card.style.cursor = 'pointer'
            card.innerHTML =
              '<img src="' + thumbnail + '" alt="' + title + '" class="music-art" />' +
              '<div class="music-info"><p class="music-track">' + title + '</p><p class="music-artist">' + channel + '</p></div>'
            searchGrid.appendChild(card)
          })
        })
        .catch(function () {
          searchGrid.innerHTML = '<p style="color:rgb(138,127,112);text-align:center;">Search failed — check your connection.</p>'
        })
        .finally(function () {
          searchBtn.textContent = 'Search'
          searchBtn.disabled = false
        })
    }

    searchBtn.addEventListener('click', searchArtist)
    searchInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') searchArtist() })

    // ── Floating symbols canvas ────────────────────────────────────────────────
    ;(function () {
      var canvas = document.getElementById('float-canvas')
      var ctx = canvas.getContext('2d')
      var mouse = { x: -999, y: -999 }
      var symbols = []
      var codeSet = ['</>', '{}', '()', '=>', '#', '[]', '&&', ';;']
      var musicSet = ['♩', '♪', '♫', '♬']

      function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
      function randomBetween(a, b) { return a + Math.random() * (b - a) }
      function createSymbol(i) {
        var isMusic = i % 5 === 0
        var pool = isMusic ? musicSet : codeSet
        return {
          text: pool[Math.floor(Math.random() * pool.length)],
          x: randomBetween(0, window.innerWidth),
          y: randomBetween(0, window.innerHeight),
          vx: randomBetween(-0.25, 0.25),
          vy: randomBetween(-0.25, 0.25),
          size: randomBetween(16, 34),
          opacity: randomBetween(0.15, 0.32),
          isMusic
        }
      }

      resize()
      for (var i = 0; i < 40; i++) symbols.push(createSymbol(i))

      var animFrameId
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        symbols.forEach(function (s) {
          var dx = mouse.x - s.x, dy = mouse.y - s.y, dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150 && dist > 0) { s.x += (dx / dist) * 0.4; s.y += (dy / dist) * 0.4 }
          s.x += s.vx; s.y += s.vy
          if (s.x < -40)               s.x = canvas.width + 20
          if (s.x > canvas.width + 40) s.x = -20
          if (s.y < -40)               s.y = canvas.height + 20
          if (s.y > canvas.height + 40) s.y = -20
          ctx.save()
          ctx.globalAlpha = s.opacity
          ctx.font = s.size + 'px Georgia, serif'
          ctx.fillStyle = s.isMusic ? 'rgb(231, 203, 40)' : '#c8b8f0'
          ctx.fillText(s.text, s.x, s.y)
          ctx.restore()
        })
        animFrameId = requestAnimationFrame(draw)
      }

      function onMouseMove(e) { mouse.x = e.clientX; mouse.y = e.clientY }
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('resize', resize)
      draw()

      window._canvasCleanup = function () {
        cancelAnimationFrame(animFrameId)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', resize)
      }
    })()

    // ── Contact form ───────────────────────────────────────────────────────────
    const form = document.querySelector('.contact-form')
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      const button = form.querySelector('button')
      button.textContent = 'Sending…'
      button.disabled = true
      fetch('https://formspree.io/f/xjglqgln', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.innerHTML = '<p class="form-success">Thanks for reaching out! I\'ll get back to you soon.</p>'
          } else {
            button.textContent = 'Send Message'
            button.disabled = false
            form.insertAdjacentHTML('afterbegin', '<p class="form-error">Something went wrong — please try again.</p>')
          }
        })
        .catch(function () {
          button.textContent = 'Send Message'
          button.disabled = false
          form.insertAdjacentHTML('afterbegin', '<p class="form-error">Something went wrong — please try again.</p>')
        })
    })

    return () => {
      activeObserver.disconnect()
      fadeObserver.disconnect()
      if (window._canvasCleanup) { window._canvasCleanup(); delete window._canvasCleanup }
      if (window._ytPlayer) { delete window._ytPlayer }
    }
  }, [])

  return (
    <div data-theme={theme}>
      <canvas id="float-canvas"></canvas>

      <nav>
        <a href="#hero" className="logo">&lt;/&gt; Angel Resto</a>
        <button className="hamburger" aria-label="Toggle menu">&#9776;</button>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#music">Music</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="https://www.linkedin.com/in/angel-resto-1301302b9/" target="_blank" rel="noreferrer">LinkedIn</a>
  
          </li>
                    <button
    className="theme-toggle"
    onClick={() => dispatch({ type: 'TOGGLE' })}
  >
    {theme === 'light' ? '🌙' : '☀️ '}
  </button>
        </ul>


      </nav>

      <section id="hero">
        <p className="hero-eyebrow">Full-Stack Developer</p>
        <h1>Building Ideas<br />Into <em>Reality</em></h1>
        <p className="tagline">
          A full-stack developer based in Kalamaria, Thessaloniki.
          I build websites and web apps for real people — local businesses, personal projects, and everything in between.
        </p>
        <a href="#about" className="btn">Learn More ↓</a>
      </section>

      <div className="section-wrap fade-in" id="about">
        <div className="inner">
          <span className="sectionlabel">Movement I</span>
          <h2 className="sectiontitle">About Me</h2>
          <div className="gold-rule"></div>
          <img src="/angel.jpeg" alt="Angel Resto" className="about-avatar" />
          <div className="about-text">
            <p>Hey — I'm <strong>Angel Resto</strong>, a full-stack developer who builds web applications from the ground up.</p>
            <p>I'm driven by the challenge of turning a blank editor into something real — something people can actually use. I care about writing clean, purposeful code that makes both the product and the codebase better.</p>
            <p>Outside of code, music has always been a big part of my life. That same love for structure, creativity, and craft shapes how I approach every project I build.</p>
            <a href="#contact" className="btn btn-solid">Let's Collaborate</a>
          </div>
        </div>
      </div>

      <div className="section-wrap fade-in" id="skills">
        <div className="inner">
          <span className="sectionlabel">Movement II</span>
          <h2 className="sectiontitle">My Toolkit</h2>
          <div className="gold-rule"></div>
          <div className="skills-grid">
            <div className="skills-card"><span className="skills-icon">⚛️</span><span>React</span></div>
            <div className="skills-card"><span className="skills-icon">🟩</span><span>Node.js</span></div>
            <div className="skills-card"><span className="skills-icon">⚙️</span><span>Express.js</span></div>
            <div className="skills-card"><span className="skills-icon">🍃</span><span>MongoDB</span></div>
            <div className="skills-card"><span className="skills-icon">🗄️</span><span>SQL</span></div>
            <div className="skills-card"><span className="skills-icon">🔀</span><span>Git</span></div>
          </div>
        </div>
      </div>

      <div className="section-wrap alt fade-in" id="projects">
        <div className="inner">
          <span className="sectionlabel">Movement III</span>
          <h2 className="sectiontitle">My Compositions</h2>
          <div className="gold-rule"></div>
          <div className="projects-grid">
            <div className="project-card">
              <div className="project-thumb">✂️</div>
              <div className="project-info">
                <h3>Atelier Kalamaria</h3>
                <p>Business website for a local tailoring shop in Thessaloniki — bilingual (GR/EN), real customer reviews, contact form, and Google Maps integration.</p>
                <span className="tag">HTML &amp; CSS</span>
                <span className="tag">JavaScript</span>
                <span className="tag">Local Business</span>
                <a href="https://lresto434-eng.github.io/tailor/" target="_blank" rel="noreferrer" className="card-btn">View Live →</a>
              </div>
            </div>
            <div className="project-card">
              <div className="project-thumb">💈</div>
              <div className="project-info">
                <h3>Old Fashioned Barbershop</h3>
                <p>Website for a classic barbershop in Kalamaria — services, pricing, gallery, online booking via Fresha, and Instagram integration.</p>
                <span className="tag">HTML &amp; CSS</span>
                <span className="tag">JavaScript</span>
                <span className="tag">Local Business</span>
                <a href="https://lresto434-eng.github.io/BarberShop/" target="_blank" rel="noreferrer" className="card-btn">View Live →</a>
              </div>
            </div>
            <div className="project-card">
              <div className="project-thumb">🏋️</div>
              <div className="project-info">
                <h3>Workout Tracker App</h3>
                <p>A progressive web app for tracking gym sessions, logging sets, and monitoring personal records — with phase-based programming and mobile install support.</p>
                <span className="tag">JavaScript</span>
                <span className="tag">PWA</span>
                <span className="tag">Local Storage</span>
                <a href="https://lresto434-eng.github.io/WORKOUT_ROUTINE/" target="_blank" rel="noreferrer" className="card-btn">View Live →</a>
              </div>
            </div>
            <div className="project-card">
              <div className="project-thumb">💻</div>
              <div className="project-info">
                <h3>NorthBridge Tech Support</h3>
                <p>Multi-page business website for a tech support company — separate service pages per audience, tiered pricing, and a consultation booking flow.</p>
                <span className="tag">HTML &amp; CSS</span>
                <span className="tag">Multi-page</span>
                <span className="tag">Business</span>
                <a href="https://lresto434-eng.github.io/NorthBridgeTech/" target="_blank" rel="noreferrer" className="card-btn">View Live →</a>
              </div>
            </div>
            <div className="project-card">
              <div className="project-thumb">🐙</div>
              <div className="project-info">
                <h3>GitHub</h3>
                <p>Browse my repositories and see what I've been building.</p>
                <span className="tag">Open Source</span>
                <span className="tag">All Projects</span>
                <a href="https://github.com/lresto434-eng" target="_blank" rel="noreferrer" className="card-btn">View Repos →</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-wrap fade-in" id="music">
        <div className="inner">
          <span className="sectionlabel">Interlude</span>
          <h2 className="sectiontitle">What I'm Listening To</h2>
          <div className="gold-rule"></div>
          <div className="music-featured-grid"></div>
          <div className="yt-player-wrap">
            <div id="yt-player"></div>
          </div>
          <p className="yt-now-playing" id="yt-now-playing">♪ King of Kings — Hillsong Worship</p>
          <div className="music-search-divider"><span>Discover via YouTube</span></div>
          <div className="music-search">
            <input type="text" id="music-input" placeholder="Search any artist or song…" />
            <button id="music-search-btn">Search</button>
          </div>
          <p className="music-api-note">
            Featured tracks &amp; search via <strong>YouTube Data API v3</strong> &nbsp;·&nbsp; <strong>YouTube IFrame API</strong>
          </p>
          <div className="music-search-grid"></div>
        </div>
      </div>

      <div className="section-wrap alt fade-in" id="contact">
        <div className="inner">
          <span className="sectionlabel">Finale</span>
          <h2 className="sectiontitle">Let's Connect</h2>
          <div className="gold-rule"></div>
          <form className="contact-form">
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>

      <footer>
        <p>
          © 2026 Angel Resto &nbsp;·&nbsp; Built with HTML &amp; CSS &nbsp;·&nbsp;
          <a href="mailto:angelresto25@icloud.com">angelresto25@icloud.com</a> &nbsp;·&nbsp;
          <a href="https://www.linkedin.com/in/angel-resto-1301302b9/" target="_blank" rel="noreferrer">LinkedIn</a>
        </p>
      </footer>
    </div>
  )
}
