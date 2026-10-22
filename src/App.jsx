export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🚀 Hello Pages</h1>
        <p className="subtitle">React SPA на GitHub Pages</p>
      </header>
      <main>
        <section className="card">
          <h2>О проекте</h2>
          <p>Этот сайт автоматически деплоится на <strong>GitHub Pages</strong> при push в <code>main</code>.</p>
        </section>
        <section className="card">
          <h2>Проекты серии</h2>
          <ul>
            <li><strong>Go CLI</strong> — бинарники в Releases</li>
            <li><strong>Go GUI</strong> — Fyne + 3 платформы</li>
            <li><strong>Hello Pages</strong> — React на Pages</li>
          </ul>
        </section>
      </main>
      <footer className="footer">
        <p>Deployed with ❤️ to GitHub Pages</p>
      </footer>
    </div>
  )
}
