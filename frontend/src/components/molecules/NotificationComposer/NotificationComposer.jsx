import { useState } from 'react'
import { PaperPlaneTilt } from '@phosphor-icons/react'

import './NotificationComposer.css'

function localize(language, es, en) {
  return language === 'en' ? en : es
}

/* Molécula: formulario corto para publicar una notificación. recipientLabel
   es opcional (el admin no lo necesita: su audiencia siempre es "todos"). */
function NotificationComposer({ language = 'es', onCancel, onSubmit, recipientLabel, recipientPlaceholder }) {
  const [values, setValues] = useState({ body: '', recipient: '', title: '' })

  const handleChange = ({ target }) => {
    setValues((current) => ({ ...current, [target.name]: target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!values.title.trim() || !values.body.trim()) return
    if (recipientLabel && !values.recipient.trim()) return
    onSubmit({
      body: values.body.trim(),
      recipient: values.recipient.trim(),
      title: values.title.trim(),
    })
  }

  return (
    <form className="notification-composer" onSubmit={handleSubmit} noValidate>
      {recipientLabel && (
        <label className="notification-composer__field">
          <span>{recipientLabel}</span>
          <input name="recipient" value={values.recipient} placeholder={recipientPlaceholder} onChange={handleChange} />
        </label>
      )}
      <label className="notification-composer__field">
        <span>{localize(language, 'Título', 'Title')}</span>
        <input
          name="title"
          value={values.title}
          placeholder={localize(language, 'Ej. Recordatorio de tarea', 'E.g. Homework reminder')}
          onChange={handleChange}
        />
      </label>
      <label className="notification-composer__field">
        <span>{localize(language, 'Mensaje', 'Message')}</span>
        <textarea
          name="body"
          rows="3"
          value={values.body}
          placeholder={localize(language, 'Escribe aquí el mensaje…', 'Write the message here…')}
          onChange={handleChange}
        />
      </label>
      <div className="notification-composer__actions">
        <button type="button" className="notification-composer__cancel" onClick={onCancel}>
          {localize(language, 'Cancelar', 'Cancel')}
        </button>
        <button type="submit" className="notification-composer__send">
          <PaperPlaneTilt aria-hidden="true" weight="bold" /> {localize(language, 'Publicar', 'Publish')}
        </button>
      </div>
    </form>
  )
}

export default NotificationComposer
