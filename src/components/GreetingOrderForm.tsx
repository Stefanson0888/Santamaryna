'use client'

import { useState } from 'react'
import { useLang } from '@/lib/lang'

type Person = {
  relationship: string
  name: string
  photo: File | null
}

export default function GreetingOrderForm({
  greeting,
}: {
  greeting: any
}) {
  const { lang } = useLang()

  const [values, setValues] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [people, setPeople] = useState<Person[]>([])
  const [customerEmail, setCustomerEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  function updateValue(key: string, value: string) {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  function addPerson() {
    if (people.length >= 4) return

    setPeople(prev => [
      ...prev,
      {
        relationship: '',
        name: '',
        photo: null,
      },
    ])
  }

  function updatePerson(
    index: number,
    key: keyof Person,
    value: string | File | null
  ) {
    setPeople(prev =>
      prev.map((person, i) =>
        i === index ? { ...person, [key]: value } : person
      )
    )
  }

  function removePerson(index: number) {
    setPeople(prev => prev.filter((_, i) => i !== index))
  }

  async function uploadOrderPhoto(
    orderId: string,
    fieldKey: string,
    file: File
  ) {
    const formData = new FormData()

    formData.append('orderId', orderId)
    formData.append('fieldKey', fieldKey)
    formData.append('file', file)

    const response = await fetch('/api/greeting-media', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Could not upload image.')
    }

    return result.path
  }

  async function createOrder() {
    setErrorMessage('')
    setOrderId(null)

    const missingRequiredField = greeting.fields?.find((field: any) => {
      if (!field.required) return false

      if (field.type === 'photo') {
        return !files[field.fieldKey]
      }

      if (field.type === 'people') {
        return people.length === 0
      }

      return !values[field.fieldKey]?.trim()
    })

    if (missingRequiredField) {
      const missingLabel =
        lang === 'en'
          ? missingRequiredField.labelEn
          : missingRequiredField.labelUa || missingRequiredField.labelEn

      setErrorMessage(
        lang === 'en'
          ? `Please complete: ${missingLabel}`
          : `Будь ласка, заповніть: ${missingLabel}`
      )
      return
    }

    if (!customerEmail.trim()) {
      setErrorMessage(
        lang === 'en'
          ? 'Please enter your email.'
          : 'Будь ласка, введіть email.'
      )
      return
    }

    if (!consent) {
      setErrorMessage(
        lang === 'en'
          ? 'Please confirm permission to use the uploaded photos.'
          : 'Підтвердьте дозвіл на використання завантажених фото.'
      )
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/greeting-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productSlug: greeting.slug?.current,
          customerEmail: customerEmail.trim(),
          personalization: {
            ...values,
            importantPeople: people.map((person, index) => ({
              relationship: person.relationship,
              name: person.name,
              mediaKey: person.photo ? `importantPerson-${index + 1}` : null,
            })),
          },
          consent,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Could not create order.')
      }

      for (const [fieldKey, file] of Object.entries(files)) {
        if (file) {
          await uploadOrderPhoto(result.orderId, fieldKey, file)
        }
      }

      for (let index = 0; index < people.length; index++) {
        const person = people[index]

        if (person.photo) {
          await uploadOrderPhoto(
            result.orderId,
            `importantPerson-${index + 1}`,
            person.photo
          )
        }
      }

      setOrderId(result.orderId)
    } catch {
      setErrorMessage(
        lang === 'en'
          ? 'Could not create the order. Please try again.'
          : 'Не вдалося створити замовлення. Спробуйте ще раз.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="border border-black/[0.08] bg-white p-5 sm:p-8 lg:p-10">
      <div className="mb-8">
        <div className="section-label">
          {lang === 'en' ? 'Personalize' : 'Персоналізація'}
        </div>

        <h2
          className="text-[2rem] font-light text-[#1A1814] sm:text-[2.4rem]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {lang === 'en'
            ? "Tell Santa about your child"
            : 'Розкажіть Санті про дитину'}
        </h2>
      </div>

      <div className="flex flex-col gap-7">
        {greeting.fields?.map((field: any) => {
          const label =
            lang === 'en'
              ? field.labelEn
              : field.labelUa || field.labelEn

          if (field.type === 'people') {
            return (
              <div key={field.fieldKey}>
                <div className="mb-2 text-[0.7rem] tracking-[0.12em] uppercase text-[#6B6560]">
                  {label}
                </div>

                <p className="mb-4 text-[0.78rem] leading-[1.6] text-[#8A837D]">
                  {lang === 'en'
                    ? 'Add up to 4 people Santa may mention in the video.'
                    : 'Додайте до 4 близьких людей, яких Санта може згадати у відео.'}
                </p>

                <div className="flex flex-col gap-4">
                  {people.map((person, index) => (
                    <div
                      key={index}
                      className="border border-black/[0.08] bg-[#FDFCFA] p-4 sm:p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-[0.68rem] tracking-[0.14em] uppercase text-[#B8976A]">
                          {lang === 'en'
                            ? `Person ${index + 1}`
                            : `Людина ${index + 1}`}
                        </span>

                        <button
                          type="button"
                          onClick={() => removePerson(index)}
                          className="text-[0.65rem] uppercase tracking-[0.1em] text-[#8A837D]"
                        >
                          {lang === 'en' ? 'Remove' : 'Видалити'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-[0.65rem] tracking-[0.12em] uppercase text-[#6B6560]">
                            {lang === 'en' ? 'Relationship' : 'Хто це'}
                          </label>

                          <select
                            value={person.relationship}
                            onChange={e =>
                              updatePerson(
                                index,
                                'relationship',
                                e.target.value
                              )
                            }
                            className="w-full border-b border-black/10 bg-transparent py-2 outline-none"
                          >
                            <option value="">
                              {lang === 'en' ? 'Select' : 'Оберіть'}
                            </option>
                            <option value="mom">
                              {lang === 'en' ? 'Mom' : 'Мама'}
                            </option>
                            <option value="dad">
                              {lang === 'en' ? 'Dad' : 'Тато'}
                            </option>
                            <option value="grandma">
                              {lang === 'en' ? 'Grandma' : 'Бабуся'}
                            </option>
                            <option value="grandpa">
                              {lang === 'en' ? 'Grandpa' : 'Дідусь'}
                            </option>
                            <option value="other">
                              {lang === 'en' ? 'Other' : 'Інше'}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-[0.65rem] tracking-[0.12em] uppercase text-[#6B6560]">
                            {lang === 'en' ? 'Name' : "Ім'я"}
                          </label>

                          <input
                            type="text"
                            value={person.name}
                            onChange={e =>
                              updatePerson(index, 'name', e.target.value)
                            }
                            className="w-full border-b border-black/10 bg-transparent py-2 outline-none"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="mb-2 block text-[0.65rem] tracking-[0.12em] uppercase text-[#6B6560]">
                          {lang === 'en' ? 'Photo' : 'Фото'}
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={e =>
                            updatePerson(
                              index,
                              'photo',
                              e.target.files?.[0] || null
                            )
                          }
                          className="block w-full text-[0.78rem] text-[#6B6560]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {people.length < 4 && (
                  <button
                    type="button"
                    onClick={addPerson}
                    className="mt-4 border border-black/10 px-5 py-3 text-[0.68rem] tracking-[0.14em] uppercase text-[#1A1814]"
                  >
                    + {lang === 'en' ? 'Add person' : 'Додати людину'}
                  </button>
                )}
              </div>
            )
          }

          if (field.type === 'photo') {
            return (
              <div key={field.fieldKey}>
                <label className="mb-2 block text-[0.7rem] tracking-[0.12em] uppercase text-[#6B6560]">
                  {label}
                  {field.required && ' *'}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  required={field.required}
                  onChange={e =>
                    setFiles(prev => ({
                      ...prev,
                      [field.fieldKey]: e.target.files?.[0] || null,
                    }))
                  }
                  className="block w-full border border-black/[0.08] bg-[#FDFCFA] p-4 text-[0.8rem] text-[#6B6560]"
                />
              </div>
            )
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.fieldKey}>
                <label className="mb-2 block text-[0.7rem] tracking-[0.12em] uppercase text-[#6B6560]">
                  {label}
                  {field.required && ' *'}
                </label>

                <textarea
                  rows={4}
                  required={field.required}
                  value={values[field.fieldKey] || ''}
                  onChange={e =>
                    updateValue(field.fieldKey, e.target.value)
                  }
                  className="w-full resize-none border border-black/[0.08] bg-[#FDFCFA] p-4 text-[0.9rem] outline-none focus:border-[#B8976A]"
                />
              </div>
            )
          }

          return (
            <div key={field.fieldKey}>
              <label className="mb-2 block text-[0.7rem] tracking-[0.12em] uppercase text-[#6B6560]">
                {label}
                {field.required && ' *'}
              </label>

              <input
                type={field.type === 'number' ? 'number' : 'text'}
                required={field.required}
                value={values[field.fieldKey] || ''}
                onChange={e =>
                  updateValue(field.fieldKey, e.target.value)
                }
                className="w-full border border-black/[0.08] bg-[#FDFCFA] p-4 text-[0.9rem] outline-none focus:border-[#B8976A]"
              />
            </div>
          )
        })}

        <div className="border-t border-black/[0.08] pt-6">
          <label className="mb-2 block text-[0.7rem] tracking-[0.12em] uppercase text-[#6B6560]">
            {lang === 'en' ? 'Your email' : 'Ваш email'} *
          </label>

          <input
            type="email"
            required
            value={customerEmail}
            onChange={e => setCustomerEmail(e.target.value)}
            placeholder={lang === 'en' ? 'you@example.com' : 'you@example.com'}
            className="w-full border border-black/[0.08] bg-[#FDFCFA] p-4 text-[0.9rem] outline-none focus:border-[#B8976A]"
          />

          <p className="mt-2 text-[0.72rem] leading-[1.5] text-[#8A837D]">
            {lang === 'en'
              ? 'We will send the finished video to this email.'
              : 'На цю адресу ми надішлемо готове відео.'}
          </p>
        </div>

        <label className="flex items-start gap-3 border-t border-black/[0.08] pt-6">
          <input
            type="checkbox"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            className="mt-1"
          />

          <span className="text-[0.75rem] leading-[1.6] text-[#6B6560]">
            {lang === 'en'
              ? 'I am the parent or legal guardian, or I have permission to upload these photos and use them to create this personalized video.'
              : 'Я є одним із батьків або законним представником, або маю дозвіл завантажувати ці фото та використовувати їх для створення персоналізованого відео.'}
          </span>
        </label>

        {errorMessage && (
          <p className="text-[0.78rem] text-red-700">
            {errorMessage}
          </p>
        )}

        {orderId && (
          <div className="border border-[#B8976A]/30 bg-[#FDFCFA] p-4">
            <p className="text-[0.78rem] text-[#1A1814]">
              {lang === 'en'
                ? 'Order created successfully.'
                : 'Замовлення успішно створено.'}
            </p>
            <p className="mt-1 text-[0.68rem] text-[#8A837D]">
              ID: {orderId}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-black/[0.08] pt-6">
          <div
            className="text-[1.8rem] text-[#1A1814]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {greeting.currency || '$'}
            {greeting.price}
          </div>

          <button
            type="button"
            onClick={createOrder}
            disabled={!consent || submitting || !!orderId}
            className="bg-[#1A1814] px-6 py-3.5 text-[0.7rem] tracking-[0.16em] uppercase text-[#FDFCFA] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {orderId
              ? (lang === 'en' ? 'Payment coming soon' : 'Оплата скоро буде доступна')
              : submitting
                ? (lang === 'en' ? 'Creating...' : 'Створення...')
                : (lang === 'en' ? 'Continue →' : 'Продовжити →')}
          </button>
        </div>
      </div>
    </div>
  )
}
