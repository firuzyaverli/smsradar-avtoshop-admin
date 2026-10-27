import { DetailPage } from '@/components/layout'
import {
  Button,
  Field,
  FormCard,
  ImageGallery,
  Input,
  Select,
  StatusField,
  Tabs,
  Textarea,
  UnsavedChangesDialog,
} from '@/components/ui'
import { newId, productsStore, useCategories, useCompatibilities, useProducts } from '@/data/store'
import { formatYearRange } from '@/lib/format'
import { toast } from '@/lib/toast'
import { useUnsavedChanges } from '@/lib/useUnsavedChanges'
import { NotFoundPage } from '@/pages/notFound/NotFoundPage'
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

const EMPTY = {
  name: '',
  categoryId: '',
  price: '',
  stock: '',
  compatType: '',
  compatibilityId: '',
  active: true,
  description: '',
  images: [],
}

function toForm(product, compatibilities) {
  const compat = compatibilities.find((c) => c.id === product.compatibilityId)
  return {
    name: product.name,
    categoryId: product.categoryId,
    price: product.price.toFixed(2),
    stock: String(product.stock),
    compatType: compat?.type ?? '',
    compatibilityId: compat?.type === 'specific' ? compat.id : '',
    active: product.status === 'active',
    description: product.description,
    images: product.images,
  }
}

function validate(form, universal) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Məhsul adını daxil edin'
  if (!form.categoryId) errors.categoryId = 'Kateqoriya seçin'
  if (form.price === '' || !(Number(form.price) > 0)) errors.price = 'Düzgün qiymət daxil edin'
  if (form.stock === '' || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
    errors.stock = 'Stok sayı tam ədəd olmalıdır'
  if (!form.compatType) errors.compatType = 'Uyğunluq tipini seçin'
  if (form.compatType === 'universal' && !universal)
    errors.compatType = '"Universal" uyğunluq tapılmadı — əvvəlcə Uyğunluqlar bölməsində yaradın'
  if (form.compatType === 'specific' && !form.compatibilityId) errors.compatibilityId = 'Marka / model seçin'
  return errors
}

const sameForm = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export function ProductFormPage() {
  const { id } = useParams()
  const isNew = !id
  const products = useProducts()
  const product = isNew ? null : products.find((p) => p.id === id)
  if (!isNew && !product) return <NotFoundPage title="Məhsul tapılmadı" />
  // key: başqa məhsula keçəndə forma sıfırlansın
  return <ProductForm key={id ?? 'new'} product={product} />
}

function ProductForm({ product }) {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const categories = useCategories()
  const compatibilities = useCompatibilities()
  // initial — yadda saxlanmış vəziyyət ("Görünüş" tabı bunu göstərir), form — redaktə olunan
  const [initial] = useState(() => (product ? toForm(product, compatibilities) : EMPTY))
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const { blocker, allowNavigation } = useUnsavedChanges(!sameForm(form, initial))

  const isNew = !product
  const tabs = isNew
    ? [
        { key: 'general', label: 'Ümumi' },
        { key: 'files', label: 'Fayllar' },
      ]
    : [
        { key: 'view', label: 'Görünüş' },
        { key: 'general', label: 'Ümumi' },
        { key: 'files', label: 'Fayllar' },
      ]
  const requested = params.get('tab')
  const tab = tabs.some((t) => t.key === requested) ? requested : tabs[0].key
  const setTab = (key) => setParams({ tab: key }, { replace: true })
  const readOnly = tab === 'view'
  const shown = readOnly ? initial : form

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const universal = compatibilities.find((c) => c.type === 'universal')
  const specificOptions = compatibilities
    .filter((c) => c.type === 'specific' && (c.status === 'active' || c.id === shown.compatibilityId))
    .map((c) => ({ value: c.id, label: `${c.brand} / ${c.model}` }))
  const selectedCompat = compatibilities.find((c) => c.id === shown.compatibilityId)

  const save = () => {
    const found = validate(form, universal)
    setErrors(found)
    if (Object.keys(found).length) {
      setTab('general')
      return
    }
    const data = {
      name: form.name.trim(),
      categoryId: form.categoryId,
      compatibilityId: form.compatType === 'universal' ? universal.id : form.compatibilityId,
      price: Math.round(Number(form.price) * 100) / 100,
      stock: Number(form.stock),
      status: form.active ? 'active' : 'inactive',
      description: form.description.trim(),
      images: form.images,
    }
    if (product) {
      productsStore.update(product.id, data)
      toast('Məhsul yeniləndi')
    } else {
      productsStore.create({ id: newId('p'), createdAt: new Date().toISOString(), ...data })
      toast('Məhsul əlavə edildi')
    }
    allowNavigation()
    navigate('/products')
  }

  const close = () => navigate('/products')
  const title = isNew ? 'Məhsul əlavə et' : readOnly ? 'Məhsul məlumatı' : 'Məhsulu redaktə et'

  return (
    <DetailPage
      title={title}
      backTo="/products"
      tabs={<Tabs tabs={tabs} active={tab} onChange={setTab} />}
      footer={
        readOnly ? (
          <Button variant="danger" onClick={close}>
            Bağla
          </Button>
        ) : (
          <>
            <Button onClick={save}>Yadda saxla</Button>
            {tab === 'general' && (
              <Button variant="danger" onClick={close}>
                Bağla
              </Button>
            )}
          </>
        )
      }
    >
      {tab === 'files' ? (
        <ImageGallery images={form.images} onChange={(images) => set('images', images)} />
      ) : (
        <FormCard className="min-h-full">
          <div className="grid grid-cols-1 gap-x-3 gap-y-3.5 md:grid-cols-2">
            <Field label="Məhsul adı" error={errors.name}>
              <Input
                value={shown.name}
                onChange={(e) => set('name', e.target.value)}
                disabled={readOnly}
                aria-invalid={!!errors.name}
              />
            </Field>
            <Field label="Kateqoriya" error={errors.categoryId}>
              <Select
                value={shown.categoryId}
                onChange={(e) => set('categoryId', e.target.value)}
                disabled={readOnly}
                required
                aria-invalid={!!errors.categoryId}
                options={categories
                  .filter((c) => c.status === 'active' || c.id === shown.categoryId)
                  .map((c) => ({ value: c.id, label: c.name }))}
              />
            </Field>
            <Field label="Qiymət" error={errors.price}>
              <Input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={shown.price}
                onChange={(e) => set('price', e.target.value)}
                disabled={readOnly}
                aria-invalid={!!errors.price}
              />
            </Field>
            <Field label="Stok sayı" error={errors.stock}>
              <Input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={shown.stock}
                onChange={(e) => set('stock', e.target.value)}
                disabled={readOnly}
                aria-invalid={!!errors.stock}
              />
            </Field>
            <Field label="Uyğunluq tipi" error={errors.compatType}>
              <Select
                value={shown.compatType}
                onChange={(e) => {
                  set('compatType', e.target.value)
                  if (e.target.value === 'universal') set('compatibilityId', '')
                }}
                disabled={readOnly}
                required
                aria-invalid={!!errors.compatType}
                options={[
                  { value: 'universal', label: 'Universal' },
                  { value: 'specific', label: 'Spesifik' },
                ]}
              />
            </Field>
            <Field label="Marka / Model" error={errors.compatibilityId}>
              {shown.compatType === 'specific' ? (
                <Select
                  value={shown.compatibilityId}
                  onChange={(e) => set('compatibilityId', e.target.value)}
                  disabled={readOnly}
                  required
                  aria-invalid={!!errors.compatibilityId}
                  options={specificOptions}
                />
              ) : (
                <Select value="" disabled options={[]} placeholder={shown.compatType ? '—' : 'Seçin'} />
              )}
            </Field>
            <Field label="İl aralığı">
              <Input
                value={selectedCompat ? formatYearRange(selectedCompat.yearFrom, selectedCompat.yearTo) : ''}
                placeholder={shown.compatType === 'universal' ? '—' : 'Marka / model seçildikdə avtomatik dolur'}
                disabled
                readOnly
              />
            </Field>
            <StatusField checked={shown.active} onChange={(v) => set('active', v)} disabled={readOnly} />
          </div>
          <Field label="Təsvir">
            <Textarea
              value={shown.description}
              onChange={(e) => set('description', e.target.value)}
              disabled={readOnly}
            />
          </Field>
        </FormCard>
      )}
      <UnsavedChangesDialog blocker={blocker} />
    </DetailPage>
  )
}
