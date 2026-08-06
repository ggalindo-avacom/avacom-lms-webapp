import { useState } from 'react'
import { Megaphone, Plus } from '@phosphor-icons/react'

import NotificationComposer from '../../molecules/NotificationComposer/NotificationComposer'
import NotificationItem from '../../molecules/NotificationItem/NotificationItem'
import './InstitutionalNotices.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

/* Organismo: notificaciones institucionales (violeta). canPublish habilita el
   botón del administrador para publicar una nueva. */
function InstitutionalNotices({ canPublish = false, language = 'es', notices, onPublish }) {
  const [isComposing, setIsComposing] = useState(false)

  const handleSubmit = (values) => {
    onPublish(values)
    setIsComposing(false)
  }

  return (
    <section className="notices-board notices-board--institutional" aria-label={localize(language, 'Notificaciones institucionales', 'Institutional notifications')}>
      <header className="notices-board__header">
        <h2>{localize(language, 'Notificaciones institucionales', 'Institutional notifications')}</h2>
        {canPublish && !isComposing && (
          <button className="notices-board__action notices-board__action--violet" type="button" onClick={() => setIsComposing(true)}>
            <Plus aria-hidden="true" weight="bold" /> {localize(language, 'Notificación institucional', 'Institutional notification')}
          </button>
        )}
      </header>

      {isComposing && (
        <NotificationComposer
          language={language}
          onCancel={() => setIsComposing(false)}
          onSubmit={handleSubmit}
        />
      )}

      <div className="notices-board__list">
        {notices.map((notice) => (
          <NotificationItem
            key={notice.id}
            color="violet"
            date={notice.date}
            description={notice.body}
            icon={<Megaphone weight="duotone" />}
            isNew={notice.isNew}
            language={language}
            meta={notice.sender}
            title={notice.title}
          />
        ))}
      </div>
    </section>
  )
}

export default InstitutionalNotices
