import { useParams, useNavigate, useSearchParams } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import CategoryButton from '@/components/common/category-button';
import ProductCard from '@/components/common/product-card';
import CategoryAddonItem from '@/components/common/category-addon-item';
import CategoryAddonSheet from '@/components/common/category-addon-sheet';
import TotalPriceButton from '@/components/common/total-price-button';
import { SectionTitle } from '@/components/common/additional-info';
import TaskInfoDialog from '@/components/common/task-info-dialog';
import WhatIncludeDialog from '@/components/common/what-include-dialog';
import InfoDialog from '@/components/common/info-dialog';
import Assets from '@/assets';
import useCategoryQuery from '@/hooks/use-category-query';
import useCategoryProductsQuery from '@/hooks/use-category-products-query';
import useCategoryAddonsQuery from '@/hooks/use-category-addons-query';
import useCategoryAddonItemsQuery from '@/hooks/use-category-addon-items-query';
import { useTranslation } from 'react-i18next';

import type {
  CategoryAddon,
  CategoryAddonItem as CategoryAddonItemType,
  CategoryProduct
} from '@/types/api';
import useOrderState, { type ServiceAddon } from '@/hooks/store/use-order-state';
import Icon from '@/assets/icons/icon-asset';
import useNavigationTitle from '@/hooks/use-navigation-title';

export function Service() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const productIdFromUrl = searchParams.get('productId');

  // Set navigation bar title
  useNavigationTitle(t('common.service'));

  const { setAddon, setServiceSelections, serviceSelections } = useOrderState();

  const { data: categories } = useCategoryQuery();

  const navigate = useNavigate();

  // Use global state for persistence — selectedServiceId holds the selected categoryId
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    serviceSelections.selectedServiceId ?? id ?? null
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    serviceSelections.selectedProductId
  );
  const [productQuantity, setProductQuantity] = useState<number>(serviceSelections.productQuantity);
  // itemId -> qty, flat across all addon groups
  const [selectedAddonItems, setSelectedAddonItems] = useState<Map<string, number>>(
    serviceSelections.selectedAddonItems
  );
  // local cache of fetched addon items, keyed by item id, used to derive group totals/pricing
  const [itemsCache, setItemsCache] = useState<Map<string, CategoryAddonItemType>>(new Map());

  const { data: productData } = useCategoryProductsQuery(selectedCategoryId ?? undefined);
  const [activeAddonId, setActiveAddonId] = useState<string | null>(null);
  const [pendingSingleToggleAddonId, setPendingSingleToggleAddonId] = useState<string | null>(
    null
  );
  const { data: categoryAddons } = useCategoryAddonsQuery(selectedCategoryId ?? undefined);

  const [openSheet, setOpenSheet] = useState(false);
  const { data: activeAddonItems } = useCategoryAddonItemsQuery(activeAddonId);

  const [viewMore, setViewMore] = useState(false);
  const selectedCategoryTabRef = useRef<HTMLDivElement | null>(null);

  const hasQty = true;
  const hasCategoryAddons = (categoryAddons?.length ?? 0) > 0;
  const shouldShowAddonSection = Boolean(selectedProductId && hasCategoryAddons);

  // Update global state whenever local state changes
  useEffect(() => {
    setServiceSelections({
      selectedServiceId: selectedCategoryId,
      selectedProductId,
      productQuantity,
      selectedAddonItems
    });
  }, [
    selectedCategoryId,
    selectedProductId,
    productQuantity,
    selectedAddonItems,
    setServiceSelections
  ]);

  // Cache fetched addon items so group totals/pricing survive after the sheet closes
  useEffect(() => {
    if (!activeAddonItems) return;
    setItemsCache((prev) => {
      const next = new Map(prev);
      activeAddonItems.forEach((item) => next.set(item.id, item));
      return next;
    });
  }, [activeAddonItems]);

  // For SINGLE-selection addons, toggle the (only) item directly once its data loads
  useEffect(() => {
    if (!pendingSingleToggleAddonId) return;
    if (activeAddonId !== pendingSingleToggleAddonId) return;
    if (!activeAddonItems) return;

    const firstItem = activeAddonItems[0];
    setPendingSingleToggleAddonId(null);
    if (!firstItem) return;

    setSelectedAddonItems((prev) => {
      const next = new Map(prev);
      if (next.has(firstItem.id)) {
        next.delete(firstItem.id);
      } else {
        next.set(firstItem.id, 1);
      }
      return next;
    });
  }, [activeAddonItems, pendingSingleToggleAddonId, activeAddonId]);

  // Product quantity management functions
  const incrementProductQuantity = () => {
    setProductQuantity((prev) => prev + 1);
  };

  const decrementProductQuantity = () => {
    setProductQuantity((prev) => Math.max(0, prev - 1));
  };

  const handleProductClick = (productId: string) => {
    if (selectedProductId === productId) {
      if (productQuantity === 0) {
        setProductQuantity(1);
      } else if (!hasQty) {
        setProductQuantity(1);
      } else {
        setProductQuantity((prev) => prev + 1);
      }
    } else {
      setSelectedProductId(productId);
      setProductQuantity(1);
    }
  };

  const getAddonGroupQuantity = (addonId: string): number => {
    let total = 0;
    selectedAddonItems.forEach((qty, itemId) => {
      if (itemsCache.get(itemId)?.addonId === addonId) total += qty;
    });
    return total;
  };

  const handleAddonClick = (addon: CategoryAddon) => {
    if (addon.selectionType === 'MULTIPLE') {
      setActiveAddonId(addon.id);
      setOpenSheet(true);
    } else {
      setActiveAddonId(addon.id);
      setPendingSingleToggleAddonId(addon.id);
    }
  };

  const handleSheetConfirm = (selections: { itemId: string; qty: number }[]) => {
    setSelectedAddonItems((prev) => {
      const next = new Map(prev);
      // Remove any existing selections for the addon group currently being edited
      for (const itemId of Array.from(next.keys())) {
        if (itemsCache.get(itemId)?.addonId === activeAddonId) {
          next.delete(itemId);
        }
      }
      selections.forEach(({ itemId, qty }) => {
        if (qty > 0) next.set(itemId, qty);
      });
      return next;
    });
    setOpenSheet(false);
  };

  // Dialogs
  const [openTaskInfoDialog, setOpenTaskInfoDialog] = useState(false);
  const [openWhatsIncludedDialog, setOpenWhatsIncludedDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [selectedProductForInfo, setSelectedProductForInfo] = useState<CategoryProduct | null>(
    null
  );

  const handleNextClick = () => {
    if (!selectedProduct || !selectedCategoryId || productQuantity === 0) return;

    const addonPayload: ServiceAddon[] = Array.from(selectedAddonItems).map(([itemId, qty]) => ({
      id: itemId,
      qty
    }));

    setAddon(addonPayload);

    navigate(`/checkout/${selectedProductId}/${selectedCategoryId}`);
  };

  const handleProductInfoClick = (product: CategoryProduct) => {
    setSelectedProductForInfo(product);
    setOpenInfoDialog(true);
  };

  // Find selected product
  const selectedProduct = productData?.find((product) => product.id === selectedProductId);

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const calculateServiceTotal = () => {
    if (!selectedProduct) return 0;

    let total = selectedProduct.amount;

    selectedAddonItems.forEach((qty, itemId) => {
      const item = itemsCache.get(itemId);
      if (item) total += item.amount * qty;
    });

    return total;
  };

  // Initialize / reset selected category from route param or productId query param
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const currentCategoryIds = categories.map((c) => c.id);
    const isCurrentSelectionValid =
      selectedCategoryId && currentCategoryIds.includes(selectedCategoryId);

    if (!isCurrentSelectionValid) {
      const fallback = (id && currentCategoryIds.includes(id) ? id : categories[0].id) ?? null;
      setSelectedCategoryId(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, id]);

  // Reset product selection when switching category, or select product matching productId param
  useEffect(() => {
    if (!selectedCategoryId || !productData) return;

    const isSelectedProductInList = productData.some((p) => p.id === selectedProductId);
    if (!isSelectedProductInList) {
      if (productIdFromUrl) {
        const matched = productData.find(
          (p) => p.id === productIdFromUrl || p.productId === productIdFromUrl
        );
        if (matched) {
          setSelectedProductId(matched.id);
          setProductQuantity(1);
          return;
        }
      }

      if (productData.length > 0) {
        setSelectedProductId(productData[0].id);
        setProductQuantity(1);
      } else {
        setSelectedProductId(null);
        setProductQuantity(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, productData]);

  useEffect(() => {
    if (!selectedCategoryTabRef.current) return;
    selectedCategoryTabRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }, [selectedCategoryId, categories]);

  useEffect(() => {
    if (!shouldShowAddonSection) {
      setOpenSheet(false);
      setActiveAddonId(null);
    }
  }, [shouldShowAddonSection]);

  if (!categories) return null;

  return (
    <>
      <div className="bg-muted min-h-screen space-y-4 pb-50">
        {/* Category Selection */}
        <div className="bg-white shadow-sm flex items-start py-6 px-4 overflow-x-auto scroll-smooth space-x-4">
          {categories.map((category) => {
            return (
              <div
                key={category.id}
                ref={selectedCategoryId === category.id ? selectedCategoryTabRef : null}>
                <CategoryButton
                  category={category}
                  isActive={selectedCategoryId === category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                />
              </div>
            );
          })}
        </div>

        {/* Products */}
        <div className="bg-white p-4">
          <p className="font-bold pb-6 text-[16px]">{t('service.serviceType')}</p>
          <div className="space-y-5 items-center justify-center">
            {productData?.slice(0, viewMore ? undefined : 5).map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isActive={selectedProductId === product.id}
                  onClick={() => handleProductClick(product.id)}
                  onInfoClick={() => handleProductInfoClick(product)}
                  quantity={hasQty && selectedProductId === product.id ? productQuantity : 0}
                />
              );
            })}
            {productData && productData.length > 5 && (
              <div className="flex items-center justify-center">
                <button
                  className="bg-[#e4eaf7] border rounded-full px-4 py-2 cursor-pointer flex items-center gap-2"
                  onClick={() => setViewMore((prev) => !prev)}>
                  <p className="bg-gradient-to-r from-[#102C90] to-[#1B4CFA] bg-clip-text text-transparent font-semibold text-[14px]">
                    {viewMore ? t('common.viewLess') : t('common.viewMore')}
                  </p>
                  <span className={`transition-transform ${viewMore ? 'rotate-180' : ''}`}>
                    <Icon name="dropdownIcon" />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {shouldShowAddonSection && (
          <div className="bg-white pb-4">
            <div className="flex items-center justify-between px-4 py-4">
              <p className="font-bold text-[16px]">{t('service.serviceAddon')}</p>
              <div className="bg-gray-100 rounded-lg px-2 py-1">
                <p className="font-semibold text-sm text-[#707070]">{t('common.optional')}</p>
              </div>
            </div>

            <div className="mb-4 flex flex-nowrap gap-[24px] overflow-x-auto overflow-y-hidden px-4 pb-2 scrollbar-hide sm:flex-wrap sm:overflow-visible">
              {categoryAddons?.map((addon) => {
                const quantity = getAddonGroupQuantity(addon.id);
                const isSelected = quantity > 0;

                return (
                  <CategoryAddonItem
                    key={addon.id}
                    data={addon}
                    isSelected={isSelected}
                    quantity={quantity}
                    onClick={() => handleAddonClick(addon)}
                  />
                );
              })}

              <CategoryAddonSheet
                data={activeAddonItems}
                open={openSheet}
                onOpenChange={setOpenSheet}
                addonId={activeAddonId}
                initialQuantities={Object.fromEntries(selectedAddonItems)}
                onConfirm={handleSheetConfirm}
              />
            </div>
          </div>
        )}

        {/* Info Sections */}
        <SectionTitle
          src={Assets.taskIcon}
          title={t('service.taskInformation')}
          showInfoIcon={true}
          onInfoClick={() => setOpenTaskInfoDialog(true)}
        />
        <SectionTitle
          src={Assets.whatIncludIcon}
          title={t('service.whatsIncluded')}
          showInfoIcon={true}
          onInfoClick={() => setOpenWhatsIncludedDialog(true)}
        />

        {/* Footer Total */}
        <TotalPriceButton
          totalPrice={
            selectedProduct && productQuantity > 0
              ? formatCurrency(calculateServiceTotal() * productQuantity)
              : undefined
          }
          buttonText={t('common.next')}
          disabled={!selectedProduct || productQuantity === 0}
          showPriceSection={!!selectedProduct && productQuantity > 0}
          showQuantityControls={!!selectedProduct && productQuantity > 0 && hasQty}
          quantity={productQuantity}
          onIncrement={incrementProductQuantity}
          onDecrement={decrementProductQuantity}
          onClick={handleNextClick}
        />
      </div>

      {/* Dialogs */}
      <TaskInfoDialog
        open={openTaskInfoDialog}
        onOpenChange={setOpenTaskInfoDialog}
        categoryId={selectedCategoryId || undefined}
        productId={selectedProduct?.productId}
      />

      <WhatIncludeDialog
        open={openWhatsIncludedDialog}
        onOpenChange={setOpenWhatsIncludedDialog}
        categoryId={selectedCategoryId || undefined}
      />

      <InfoDialog
        open={openInfoDialog}
        onOpenChange={setOpenInfoDialog}
        product={selectedProductForInfo || undefined}
      />
    </>
  );
}

export default Service;
