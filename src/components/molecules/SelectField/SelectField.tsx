import type { SelectHTMLAttributes } from 'react'
import inputStyles from '@/components/atoms/Input/Input.module.css'
import fieldStyles from '@/components/molecules/FormField/FormField.module.css'

interface SelectOption {
  value: string | number
  label: string
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  icon?: string
  options: SelectOption[]
  placeholder?: string
  error?: string
}

export function SelectField({ label, icon, options, placeholder, error, id, ...rest }: SelectFieldProps) {
  return (
    <div className={fieldStyles.field}>
      <label className={fieldStyles.label} htmlFor={id}>
        {label}
      </label>
      <div className={inputStyles.wrapper}>
        {icon && <i className={`bi ${icon} ${inputStyles.icon}`} />}
        <select id={id} className={inputStyles.input} {...rest}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className={fieldStyles.error}>{error}</span>}
    </div>
  )
}
