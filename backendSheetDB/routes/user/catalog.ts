import { Router } from 'express'
import type { DatabaseAdapter } from 'longcelot-sheet-db'
import { adminCtx } from './context'

function toCategoryDto(r: Record<string, unknown>) {
  return {
    id: r._id,
    nameEn: r.name_en,
    nameKm: r.name_km,
    thumbnailUrl: r.thumbnail_url ?? null,
    sort: r.sort,
  }
}

function toAddonDto(r: Record<string, unknown>) {
  return {
    id: r._id,
    nameEn: r.name_en,
    nameKm: r.name_km,
    badgeEn: r.badge_en ?? null,
    badgeKm: r.badge_km ?? null,
    selectionType: r.selection_type,
    isRequired: r.is_required,
    status: r.status,
  }
}

function toAddonItemDto(r: Record<string, unknown>) {
  return {
    id: r._id,
    addonId: r.addon_id,
    nameEn: r.name_en,
    nameKm: r.name_km,
    type: r.type,
    imgUrl: r.img_url ?? null,
    amount: r.amount,
    duration: r.duration,
    status: r.status,
    sort: r.sort,
  }
}

function toBannerDto(r: Record<string, unknown>) {
  return {
    id: r._id,
    name: r.name,
    titleEn: r.title_en,
    type: r.type,
    imgUrlEn: r.img_url_en ?? null,
    hasDetail: r.has_detail,
    hasTopup: r.has_topup,
    credit: r.credit ?? null,
    amount: r.amount ?? null,
    startDate: r.start_date,
    expiredDate: r.expired_date,
    sort: r.sort,
  }
}

export function createCatalogRouter(adapter: DatabaseAdapter) {
  const router = Router()
  const ctx = () => adminCtx(adapter)

  // GET /category/list — top-level categories (home grid + service tab bar)
  router.get('/category/list', async (_req, res, next) => {
    try {
      const categories = await ctx().table('categories').findMany({
        where: { status: true },
        orderBy: 'sort',
        order: 'asc',
      }) as Record<string, unknown>[]
      res.json({ data: categories.map(toCategoryDto) })
    } catch (err) { next(err) }
  })

  // GET /category/:categoryId/products — bookable priced variants (product x product_option)
  // for this category, flattened into one list of cards.
  router.get('/category/:categoryId/products', async (req, res, next) => {
    try {
      const links = await ctx().table('category_products').findMany({
        where: { category_id: req.params.categoryId },
      }) as Record<string, unknown>[]
      if (links.length === 0) return res.json({ data: [] })

      const linkIds = links.map((l) => l._id)
      const [options, products] = await Promise.all([
        ctx().table('category_product_options').findMany({}) as Promise<Record<string, unknown>[]>,
        ctx().table('products').findMany({ where: { status: true } }) as Promise<Record<string, unknown>[]>,
      ])
      const productById = Object.fromEntries(products.map((p) => [p._id, p]))
      const linkById = Object.fromEntries(links.map((l) => [l._id, l]))

      const variants = options
        .filter((o) => linkIds.includes(o.category_product_id))
        .map((o) => {
          const link = linkById[o.category_product_id as string]
          const product = productById[link?.product_id as string]
          if (!product) return null
          return {
            id: o._id,
            categoryProductId: o.category_product_id,
            productId: product._id,
            productOptionId: o.product_option_id,
            nameEn: product.name_en,
            nameKm: product.name_km,
            thumbnailUrl: product.thumbnail_url ?? null,
            amount: o.price,
            duration: o.duration,
            sort: o.sort,
            status: product.status,
          }
        })
        .filter((v): v is NonNullable<typeof v> => v !== null)
        .sort((a, b) => (a.sort as number) - (b.sort as number))

      res.json({ data: variants })
    } catch (err) { next(err) }
  })

  // GET /category/:categoryId/product/:productId/options — the priced variants for one
  // specific product within a category (used when a category has more than one product).
  router.get('/category/:categoryId/product/:productId/options', async (req, res, next) => {
    try {
      const link = await ctx().table('category_products').findOne({
        where: { category_id: req.params.categoryId, product_id: req.params.productId },
      }) as Record<string, unknown> | null
      if (!link) return res.json({ data: [] })

      const [options, productOptions] = await Promise.all([
        ctx().table('category_product_options').findMany({
          where: { category_product_id: link._id },
          orderBy: 'sort',
          order: 'asc',
        }) as Promise<Record<string, unknown>[]>,
        ctx().table('product_options').findMany({}) as Promise<Record<string, unknown>[]>,
      ])
      const optionById = Object.fromEntries(productOptions.map((o) => [o._id, o]))

      const data = options.map((o) => {
        const productOption = optionById[o.product_option_id as string]
        return {
          id: o._id,
          categoryProductId: o.category_product_id,
          productOptionId: o.product_option_id,
          nameEn: productOption?.name_en ?? null,
          nameKm: productOption?.name_km ?? null,
          amount: o.price,
          duration: o.duration,
          sort: o.sort,
        }
      })
      res.json({ data })
    } catch (err) { next(err) }
  })

  // GET /category/:categoryId/addons — addon groups linked to this category
  router.get('/category/:categoryId/addons', async (req, res, next) => {
    try {
      const links = await ctx().table('category_category_addons').findMany({
        where: { category_id: req.params.categoryId },
        orderBy: 'sort',
        order: 'asc',
      }) as Record<string, unknown>[]
      if (links.length === 0) return res.json({ data: [] })

      const addons = await ctx().table('category_addons').findMany({ where: { status: true } }) as Record<string, unknown>[]
      const addonById = Object.fromEntries(addons.map((a) => [a._id, a]))

      const data = links
        .map((l) => addonById[l.addon_id as string])
        .filter((a): a is Record<string, unknown> => Boolean(a))
        .map(toAddonDto)
      res.json({ data })
    } catch (err) { next(err) }
  })

  // GET /category-addon/:addonId/items — selectable items within one addon group
  router.get('/category-addon/:addonId/items', async (req, res, next) => {
    try {
      const items = await ctx().table('category_addon_items').findMany({
        where: { addon_id: req.params.addonId, status: true },
        orderBy: 'sort',
        order: 'asc',
      }) as Record<string, unknown>[]
      res.json({ data: items.map(toAddonItemDto) })
    } catch (err) { next(err) }
  })

  // GET /category/:categoryId/task-info?productId= — "task information" copy shown in the
  // Service page's info dialog; optionally scoped to a specific product.
  router.get('/category/:categoryId/task-info', async (req, res, next) => {
    try {
      const rows = await ctx().table('task_info').findMany({
        where: { category_id: req.params.categoryId },
        orderBy: 'sort',
        order: 'asc',
      }) as Record<string, unknown>[]
      const productId = req.query.productId as string | undefined
      const filtered = productId ? rows.filter((r) => !r.product_id || r.product_id === productId) : rows
      res.json({
        data: filtered.map((r) => ({
          id: r._id,
          titleEn: r.title_en,
          titleKm: r.title_km,
          descriptionEn: r.description_en,
          descriptionKm: r.description_km,
          sort: r.sort,
        })),
      })
    } catch (err) { next(err) }
  })

  // GET /category/:categoryId/items — "what's included" equipment checklist for a category
  router.get('/category/:categoryId/items', async (req, res, next) => {
    try {
      const rows = await ctx().table('items').findMany({
        where: { category: req.params.categoryId, status: true },
        orderBy: 'sort_order',
        order: 'asc',
      }) as Record<string, unknown>[]
      res.json({ data: rows.map((r) => ({ id: r._id, nameEn: r.name_en, nameKm: r.name_km })) })
    } catch (err) { next(err) }
  })

  // GET /banner/list
  router.get('/banner/list', async (_req, res, next) => {
    try {
      const now = new Date()
      const banners = await ctx().table('banners').findMany({
        where: { status: true },
        orderBy: 'sort',
        order: 'asc',
      }) as Record<string, unknown>[]
      const active = banners.filter((b) => {
        const start = b.start_date ? new Date(b.start_date as string) : null
        const end = b.expired_date ? new Date(b.expired_date as string) : null
        return (!start || start <= now) && (!end || end >= now)
      })
      res.json({ data: active.map(toBannerDto) })
    } catch (err) { next(err) }
  })

  // GET /banner/:id
  router.get('/banner/:id', async (req, res, next) => {
    try {
      const banner = await ctx().table('banners').findOne({ where: { _id: req.params.id } }) as Record<string, unknown> | null
      if (!banner) return res.status(404).json({ message: 'Not found' })
      res.json({ data: toBannerDto(banner) })
    } catch (err) { next(err) }
  })

  // GET /homepage — popular services shown on the home screen
  router.get('/homepage', async (_req, res, next) => {
    try {
      const [popularServices, items, categories, products] = await Promise.all([
        ctx().table('popular_services').findMany({
          where: { status: true },
          orderBy: 'display_order',
          order: 'asc',
        }) as Promise<Record<string, unknown>[]>,
        ctx().table('popular_service_items').findMany({}) as Promise<Record<string, unknown>[]>,
        ctx().table('categories').findMany({}) as Promise<Record<string, unknown>[]>,
        ctx().table('products').findMany({}) as Promise<Record<string, unknown>[]>,
      ])
      const categoryById = Object.fromEntries(categories.map((c) => [c._id, c]))
      const productById = Object.fromEntries(products.map((p) => [p._id, p]))

      const data = popularServices.map((service) => ({
        id: service._id,
        nameEn: service.name_en,
        nameKm: service.name_km,
        imageUrl: service.image_url ?? null,
        items: items
          .filter((i) => i.popular_service_id === service._id)
          .sort((a, b) => (a.priority as number) - (b.priority as number))
          .map((i) => {
            const target = i.type === 'PRODUCT' ? productById[i.product_id as string] : categoryById[i.category_id as string]
            return {
              type: i.type,
              categoryId: i.category_id ?? null,
              productId: i.product_id ?? null,
              nameEn: target?.name_en ?? null,
              nameKm: target?.name_km ?? null,
              iconUrl: (target?.thumbnail_url as string | undefined) ?? null,
            }
          }),
      }))
      res.json({ data })
    } catch (err) { next(err) }
  })

  return router
}
