import { useParams, useNavigate, useSearchParams } from 'react-router';
import { useState, useEffect, useMemo, useRef } from 'react';
import ServiceButton from '@/components/common/service-button';
import ServiceType from '@/components/common/service-type';
import ServiceAddonItem from '@/components/common/service-addon';
import ServiceAddonSheet from '@/components/common/service-addon-sheet';
import TotalPriceButton from '@/components/common/total-price-button';
// import Alert from '@/components/common/alert';
import { SectionTitle } from '@/components/common/additional-info';
import TaskInfoDialog from '@/components/common/task-info-dialog';
import WhatIncludeDialog from '@/components/common/what-include-dialog';
import InfoDialog from '@/components/common/info-dialog';
import Assets from '@/assets';
import useServiceDetailQuery from '@/hooks/use-service-query';
import useProductDetailQuery from '@/hooks/use-product-detail-query';
import useServiceAddonQuery from '@/hooks/use-service-addon';
import useProductAddonQuery from '@/hooks/use-product-addon-query';
import { useTranslation } from 'node_modules/react-i18next';

import type { ProductAttributes, ServiceCategory } from '@/types/api';
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

  const { data: serviceCategories } = useServiceDetailQuery(id);

  const navigate = useNavigate();

  // Use global state for persistence
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    serviceSelections.selectedServiceId
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    serviceSelections.selectedProductId
  );
  const [productQuantity, setProductQuantity] = useState<number>(serviceSelections.productQuantity);
  const [selectedAddonItems, setSelectedAddonItems] = useState<Map<number, number>>(
    serviceSelections.selectedAddonItems
  );

  const { data: productData } = useProductDetailQuery(selectedServiceId ?? '');
  const [selectedAddonId, setSelectedAddonId] = useState<string | null>(null);
  const { data: productAddon } = useServiceAddonQuery(id);

  const [openSheet, setOpenSheet] = useState(false);
  const { data: selectedAddonData } = useProductAddonQuery(selectedAddonId ?? '');

  const [viewMore, setViewMore] = useState(false);
  const selectedServiceTabRef = useRef<HTMLDivElement | null>(null);

  const selectedServiceData = useMemo(
    () => serviceCategories?.find((service) => service.id.toString() === selectedServiceId),
    [serviceCategories, selectedServiceId]
  );

  const hasQty = selectedServiceData?.hasQty ?? true;
  const hasServiceAddons = (productAddon?.length ?? 0) > 0;
  const shouldShowAddonSection = Boolean(selectedProductId && hasServiceAddons);

  // Update global state whenever local state changes
  useEffect(() => {
    setServiceSelections({
      selectedServiceId,
      selectedProductId,
      productQuantity,
      selectedAddonItems
    });
  }, [
    selectedServiceId,
    selectedProductId,
    productQuantity,
    selectedAddonItems,
    setServiceSelections
  ]);

  useEffect(() => {
    if (id && serviceSelections.selectedServiceId) {
      const currentCategoryServices =
        serviceCategories?.map((service) => service.id.toString()) || [];
      if (!currentCategoryServices.includes(serviceSelections.selectedServiceId)) {
        // Clear selections if persisted service doesn't belong to current category
        setSelectedServiceId(null);
        setSelectedProductId(null);
        setProductQuantity(0);
        setSelectedAddonItems(new Map());
      }
    }
  }, [id, serviceCategories, serviceSelections.selectedServiceId]);

  // Product quantity management functions
  const incrementProductQuantity = () => {
    setProductQuantity((prev) => prev + 1);
  };

  const decrementProductQuantity = () => {
    setProductQuantity((prev) => Math.max(0, prev - 1));
  };

  const handleProductClick = (productId: string) => {
    if (selectedProductId === productId) {
      // If clicking the same product
      if (productQuantity === 0) {
        setProductQuantity(1);
      } else if (!hasQty) {
        // If hasQty is false, do not increment, always set to 1
        setProductQuantity(1);
      } else {
        // If hasQty is true, allow increment (if needed)
        setProductQuantity((prev) => prev + 1);
      }
    } else {
      // If clicking a different product, select it and set quantity to 1
      setSelectedProductId(productId);
      setProductQuantity(1);
    }
  };

  // Helper functions for quantity management
  const getAddonQuantity = (addonId: number): number => {
    return selectedAddonItems.get(addonId) || 0;
  };

  const updateAddonQuantity = (addonId: number, quantity: number) => {
    setSelectedAddonItems((prev) => {
      const newMap = new Map(prev);
      if (quantity <= 0) {
        newMap.delete(addonId);
      } else {
        newMap.set(addonId, quantity);
      }
      return newMap;
    });
  };

  const incrementAddon = (addonId: number) => {
    const currentQty = getAddonQuantity(addonId);
    updateAddonQuantity(addonId, currentQty + 1);
  };

  const decrementAddon = (addonId: number) => {
    const currentQty = getAddonQuantity(addonId);
    if (currentQty > 0) {
      updateAddonQuantity(addonId, currentQty - 1);
    }
  };

  const toggleAddonSelection = (addonId: number) => {
    const currentQty = getAddonQuantity(addonId);
    if (currentQty === 0) {
      updateAddonQuantity(addonId, 1);
    } else {
      updateAddonQuantity(addonId, 0);
    }
  };

  // Dialogs
  const [openTaskInfoDialog, setOpenTaskInfoDialog] = useState(false);
  const [openWhatsIncludedDialog, setOpenWhatsIncludedDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [selectedProductForInfo, setSelectedProductForInfo] = useState<ProductAttributes | null>(
    null
  );

  const handleNextClick = () => {
    if (!selectedProduct || !selectedServiceData || productQuantity === 0) return;

    const ServiceAddonPayload: ServiceAddon[] = Array.from(selectedAddonItems).map(([id, qty]) => ({
      id: id.toString(),
      qty
    }));

    setAddon(ServiceAddonPayload);

    console.log('Payload going to checkout:', {
      productId: selectedProductId,
      serviceId: selectedServiceId,
      productQuantity: productQuantity, // Send actual quantity for both cases
      addons: ServiceAddonPayload,
      hasQty: hasQty
    });

    navigate(`/checkout/${selectedProductId}/${selectedServiceId}`);
  };

  const handleProductInfoClick = (product: ProductAttributes) => {
    setSelectedProductForInfo(product);
    setOpenInfoDialog(true);
  };

  // Find selected product + service
  const selectedProduct = productData?.find(
    (product) => product.id.toString() === selectedProductId
  );

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const calculateServiceTotal = () => {
    if (!selectedProduct) return 0;

    // Base service price
    let total = selectedProduct.amount;

    // Add selected addon prices with quantities
    if (productAddon) {
      productAddon.forEach((addon) => {
        const quantity = getAddonQuantity(addon.id);
        if (quantity > 0) {
          total += addon.amount * quantity;
        }
      });
    }

    return total;
  };

  useEffect(() => {
    if (!serviceCategories || !id || serviceCategories.length === 0) return;

    const currentServiceIds = serviceCategories.map((s) => s.id.toString());
    const isCurrentSelectionValid =
      selectedServiceId && currentServiceIds.includes(selectedServiceId);

    if (productIdFromUrl && !serviceSelections.selectedServiceId) {
      // First, check if productId matches a service
      const matchedService = serviceCategories.find(
        (service) => service.id.toString() === productIdFromUrl
      );
      if (matchedService) {
        setSelectedServiceId(matchedService.id.toString());
        return;
      }
      // Second, productId might be a product - we need productData to check
      return;
    }

    // No productId in URL: reset to first service when switching categories or no selection
    if (!isCurrentSelectionValid) {
      setSelectedServiceId(serviceCategories[0].id.toString());
    }
  }, [serviceCategories, id, productIdFromUrl, selectedServiceId]);

  useEffect(() => {
    if (!selectedServiceId || !productData) return;

    const isSelectedProductInList = productData.some((p) => p.id.toString() === selectedProductId);
    if (!isSelectedProductInList) {
      if (productData.length > 0) {
        setSelectedProductId(productData[0].id.toString());
        // Only set quantity to 1 if we're actively resetting it due to invalidity
        setProductQuantity(1);
      } else {
        setSelectedProductId(null);
        setProductQuantity(0);
      }
    }
  }, [selectedServiceId, productData, selectedProductId]);

  useEffect(() => {
    if (!selectedServiceTabRef.current) return;
    selectedServiceTabRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }, [selectedServiceId, serviceCategories]);

  useEffect(() => {
    if (!shouldShowAddonSection) {
      setOpenSheet(false);
      setSelectedAddonId(null);
    }
  }, [shouldShowAddonSection]);

  if (!serviceCategories) return null;

  return (
    <>
      <div className="bg-muted min-h-screen space-y-4 pb-50">
        {/* Service Selection */}
        <div className="bg-white shadow-sm flex items-start py-6 px-4 overflow-x-auto scroll-smooth space-x-4">
          {/* <p className="font-bold pb-2 text-[16px]">Service</p> */}
          {/* <div className="flex items-start py-4"> */}
          {serviceCategories.map((service: ServiceCategory) => {
            if (!service.nameEn) return null;
            return (
              <div
                key={service.id}
                ref={selectedServiceId === service.id.toString() ? selectedServiceTabRef : null}>
                <ServiceButton
                  service={service}
                  isActive={selectedServiceId === service.id.toString()}
                  onClick={() => {
                    // DEBUG: Log service name and ID
                    console.log('Selected Service:', service.nameEn, 'ID:', service.id.toString());
                    setSelectedServiceId(service.id.toString());
                  }}
                />
              </div>
            );
          })}
          {/* </div> */}
        </div>

        {/* Service Types */}
        <div className="bg-white p-4">
          <p className="font-bold pb-6 text-[16px]">{t('service.serviceType')}</p>
          <div className="space-y-5 items-center justify-center">
            {productData?.slice(0, viewMore ? undefined : 5).map((product) => {
              // // Debug logging
              // console.log(
              //   'Service:',
              //   selectedServiceData?.nameEn,
              //   'hasQty:',
              //   hasQty,
              //   'Product:',
              //   product.nameEn
              // );

              return (
                <ServiceType
                  key={product.id}
                  service={product}
                  isActive={selectedProductId === product.id.toString()}
                  onClick={() => handleProductClick(product.id.toString())}
                  onInfoClick={() => handleProductInfoClick(product)}
                  quantity={
                    hasQty && selectedProductId === product.id.toString() ? productQuantity : 0
                  }
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
              {productAddon?.map((addon) => {
                const quantity = getAddonQuantity(addon.id);
                const isSelected = quantity > 0;

                return (
                  <ServiceAddonItem
                    key={addon.id}
                    data={addon}
                    isSelected={isSelected}
                    quantity={quantity}
                    onIncrement={() => incrementAddon(addon.id)}
                    onDecrement={() => decrementAddon(addon.id)}
                    onClick={() => {
                      if (addon.type === 'MULTIPLE') {
                        console.log('Selected Addon:', addon.nameEn, 'ID:', addon.id.toString());
                        setSelectedAddonId(addon.id.toString());
                        setOpenSheet(true);
                      } else {
                        console.log('Toggling Addon:', addon.nameEn, 'ID:', addon.id);
                        toggleAddonSelection(addon.id);
                      }
                    }}
                  />
                );
              })}

              <ServiceAddonSheet
                data={selectedAddonData ?? []}
                open={openSheet}
                onOpenChange={setOpenSheet}
                addonId={selectedAddonId}
                onConfirm={(id) => {
                  setSelectedAddonId(id);
                  setOpenSheet(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Alerts */}
        {/* {selectedProductId && <Alert />} */}

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
        productId={selectedServiceId || undefined}
      />

      <WhatIncludeDialog
        open={openWhatsIncludedDialog}
        onOpenChange={setOpenWhatsIncludedDialog}
        categoryId={id || undefined}
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
