import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function AuthForm({
  title,
  description,
  fields,
  submitLabel,
  helperText,
  altActionLabel,
  altActionTo,
  altActionText,
  auxiliaryAction,
  onSubmit,
}) {
  const initialValues = useMemo(
    () =>
      fields.reduce((accumulator, field) => {
        accumulator[field.name] = ''
        return accumulator
      }, {}),
    [fields],
  )

  const initialVisibility = useMemo(
    () =>
      fields.reduce((accumulator, field) => {
        if (field.type === 'password') {
          accumulator[field.name] = false
        }
        return accumulator
      }, {}),
    [fields],
  )

  const [formValues, setFormValues] = useState(initialValues)
  const [visiblePasswords, setVisiblePasswords] = useState(initialVisibility)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((current) => ({ ...current, [name]: value }))
  }

  const togglePassword = (fieldName) => {
    setVisiblePasswords((current) => ({
      ...current,
      [fieldName]: !current[fieldName],
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ ...formValues, rememberMe })
  }

  return (
    <>
      <div className="form-intro">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        {fields.map((field) => {
          const isPassword = field.type === 'password'
          const inputType =
            isPassword && visiblePasswords[field.name] ? 'text' : field.type

          return (
            <div className="form-row" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              <div className="input-shell">
                <input
                  id={field.name}
                  name={field.name}
                  type={inputType}
                  placeholder={field.placeholder}
                  value={formValues[field.name]}
                  onChange={handleChange}
                  required={field.required}
                />
                {isPassword ? (
                  <button
                    className="password-action"
                    type="button"
                    onClick={() => togglePassword(field.name)}
                  >
                    {visiblePasswords[field.name] ? 'Hide' : 'Show'}
                  </button>
                ) : null}
              </div>
              {field.hint ? <span className="field-hint">{field.hint}</span> : null}
            </div>
          )
        })}

        <div className="checkbox-row">
          <label htmlFor="rememberMe">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((current) => !current)}
            />
            Keep me signed in
          </label>
          {auxiliaryAction ? (
            <Link className="text-link" to={auxiliaryAction.to}>
              {auxiliaryAction.label}
            </Link>
          ) : null}
        </div>

        <button className="primary-button" type="submit">
          {submitLabel}
        </button>
      </form>

      <p className="auth-switch">
        {altActionText}{' '}
        <Link to={altActionTo}>
          {altActionLabel}
        </Link>
      </p>

      {helperText ? <p className="form-footer">{helperText}</p> : null}
    </>
  )
}

export default AuthForm
