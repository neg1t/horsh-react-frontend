import { type FC } from 'react'

import { useUnit } from 'effector-react'

import { Button } from 'shared/components/ui/button'
import { Field, FieldGroup, FieldLabel } from 'shared/components/ui/field'
import { Input } from 'shared/components/ui/input'

import { createOrderModel } from '../model/createOrderModel'
import type { CreateOrderDto } from '../model/types'

export const CreateOrder: FC = () => {
  const [form, setForm] = useUnit([
    createOrderModel.stores.$form,
    createOrderModel.events.updateFormField,
  ])

  const handleSubmit = useUnit(createOrderModel.events.submitForm)

  const handleChange =
    (field: keyof CreateOrderDto) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ field, value: event.target.value })
    }

  return (
    <div className='flex flex-col p-4 overflow-auto'>
      <h1 className='text-2xl font-bold text-center mb-8'>Create Order Page</h1>

      <FieldGroup>
        <Field>
          <FieldLabel>ID</FieldLabel>
          <Input type='number' value={form.id} onChange={handleChange('id')} />
        </Field>

        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input value={form.name} onChange={handleChange('name')} />
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            value={form.description}
            onChange={handleChange('description')}
          />
        </Field>

        <Field>
          <Button onClick={handleSubmit}>Submit</Button>
        </Field>
      </FieldGroup>
    </div>
  )
}
